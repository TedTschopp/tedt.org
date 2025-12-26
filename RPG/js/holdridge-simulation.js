/**
 * Holdridge Life Zone Simulation Module
 * 
 * Implements the annual update loop for:
 * - Climate classification → zone/template assignment
 * - Hydrology bucket model (runoff, infiltration, ET)
 * - Net Primary Productivity (NPP)
 * - Soil organic matter dynamics
 * - Soil type and color derivation
 * - Vegetation dynamics with succession inertia
 * - Fire disturbance
 * - Fauna guild suitability
 * 
 * Based on the Holdridge Life Zone specification for climate-vegetation modeling.
 */

'use strict';

(function(global) {

/**
 * HoldridgeSimulation class - Manages the annual ecosystem simulation
 */
class HoldridgeSimulation {
    
    /**
     * Configuration constants for the simulation
     */
    static CONFIG = {
        // Vegetation relaxation rates (per year)
        r_veg_cover: 0.08,      // Vegetation cover relaxation rate
        r_canopy: 0.04,         // Canopy relaxation rate (slower - trees take time)
        r_ground_cover: 0.12,   // Ground cover relaxation rate (faster)
        
        // Fuel dynamics
        fuel_accumulation: 0.08, // Fraction of NPP becoming fuel (increased for visibility)
        fuel_decay: 0.10,        // Annual fuel decay rate (reduced for slower decay)
        
        // Soil organic matter
        litter_fraction: 0.02,   // Fraction of NPP becoming litter
        base_decomp: 0.1,        // Base decomposition rate
        
        // Fire parameters
        canopy_loss_fire: 0.4,   // Canopy loss during fire (0-1)
        cover_loss_fire: 0.25,   // Vegetation cover loss during fire
        fuel_consumed_fire: 0.6, // Fuel consumed during fire (reduced for faster recovery)
        fire_recovery_years: 5,  // Years for partial recovery after fire
        
        // Soil color blend parameters
        soil_color_base: [139, 119, 101],    // Base brown
        soil_color_red: [178, 102, 76],      // Leached/tropical red
        soil_color_black: [50, 45, 40],      // High OM black
        soil_color_pale: [235, 225, 200],    // Arid/salty pale
        soil_color_gray: [140, 145, 150],    // Waterlogged gray
        
        // Salinity dynamics
        salt_accumulation: 0.005,  // Salinity increase rate in dry conditions
        salt_leaching: 0.02,      // Salinity decrease from leaching
        
        // PET scaling (Holdridge formula: PET = bioT × 58.93)
        k_pet: 58.93,
        
        // Fauna carrying capacity scaling
        fauna_capacity_base: 0.8,
        fauna_relaxation: 0.15
    };
    
    /**
     * Create a new simulation instance
     * @param {CellDataModel} cellData - The cell data model to simulate
     */
    constructor(cellData) {
        this.cellData = cellData;
        this.config = HoldridgeSimulation.CONFIG;
        this.simulationYear = 0;
        this.initialized = false;
    }
    
    /**
     * Initialize the simulation from current climate data
     * Sets initial soil, vegetation, and fauna states
     */
    initialize() {
        console.log('Initializing Holdridge simulation...');
        
        const cd = this.cellData;
        
        // Ensure elevation is calculated
        if (cd.updateElevation) {
            cd.updateElevation();
        }
        
        const seaLevel = cd.config.seaLevel;
        console.log('Sea level:', seaLevel);
        
        // Calculate slopes for hydrology
        this._calculateSlopes();
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            // Check if cell is underwater using ground elevation
            const groundElev = cd.cellElevation[cell] || 
                              (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            const isWater = groundElev < seaLevel;
            
            if (isWater) {
                // Ocean cells - zero everything
                this._initializeOceanCell(cell);
                continue;
            }
            
            // Get current Holdridge zone
            const zoneName = cd.getHoldridgeZoneName(cell);
            const template = getEcosystemTemplate(zoneName);
            const templateId = getTemplateId(zoneName);
            
            // Initialize soil
            this._initializeSoil(cell, template, zoneName);
            
            // Initialize vegetation at 50% of target (room to grow/adjust)
            this._initializeVegetation(cell, template, templateId);
            
            // Initialize fauna at equilibrium
            this._initializeFauna(cell, template);
            
            // Compute soil classification indices for coloring
            this._stepSoilClassification(cell, template);
        }
        
        // Calculate initial soil colors
        this._calculateAllSoilColors();
        
        // Calculate initial vegetation colors
        this._calculateAllVegetationColors();
        
        // Calculate initial fauna colors
        this._calculateAllFaunaColors();
        
        this.initialized = true;
        console.log('Holdridge simulation initialized');
    }
    
    /**
     * Initialize an ocean cell with zero values
     */
    _initializeOceanCell(cell) {
        const cd = this.cellData;
        
        // Soil
        cd.soilTexture[cell] = 0;
        cd.soilDepth[cell] = 0;
        cd.soilMoist[cell] = 0;
        cd.fieldCapacity[cell] = 0;
        cd.soilOM[cell] = 0;
        cd.soilSalinity[cell] = 1.0; // Ocean is salty
        cd.soilWaterlog[cell] = 1.0;
        cd.soilPermafrost[cell] = 0;
        cd.soilTypeClass[cell] = SOIL_TYPE.RAW;
        
        // Vegetation
        cd.vegCover[cell] = 0;
        cd.vegCanopy[cell] = 0;
        cd.vegGroundCover[cell] = 0;
        cd.vegFuelLoad[cell] = 0;
        cd.vegTemplateId[cell] = 255;
        cd.vegNPP[cell] = 0;
        
        // Fauna
        cd.faunaGrazers[cell] = 0;
        cd.faunaBrowsers[cell] = 0;
        cd.faunaPredators[cell] = 0;
        cd.faunaInsects[cell] = 0;
        cd.faunaAmphibians[cell] = 0;
        cd.faunaReptiles[cell] = 0;
        cd.faunaBirds[cell] = 0;
        cd.faunaTotalBiomass[cell] = 0;
    }
    
    /**
     * Initialize soil properties for a cell
     */
    _initializeSoil(cell, template, zoneName) {
        const cd = this.cellData;
        
        // Soil texture based on climate (simplified)
        // Tropical wet = clay, temperate = loam, arid = sand
        const bioT = cd.biotemperature[cell];
        const rainfall = cd.rainfall[cell];
        
        if (rainfall > 2000 && bioT > 18) {
            cd.soilTexture[cell] = 2; // Clay (tropical weathering)
        } else if (rainfall < 500) {
            cd.soilTexture[cell] = 0; // Sand (arid)
        } else {
            cd.soilTexture[cell] = 1; // Loam (temperate)
        }
        
        // Soil depth based on slope and climate
        const slope = cd.hydroSlope[cell];
        const baseDepth = 1.0 + (1 - slope) * 1.5; // 1-2.5m depending on slope
        cd.soilDepth[cell] = Math.max(0.2, baseDepth * (0.8 + Math.random() * 0.4));
        
        // Field capacity from depth and texture
        // Sandy = lower capacity, clay = higher, OM increases it
        const textureMultiplier = [0.12, 0.25, 0.35][cd.soilTexture[cell]];
        cd.fieldCapacity[cell] = cd.soilDepth[cell] * 1000 * textureMultiplier;
        
        // Initial moisture at 50% field capacity
        cd.soilMoist[cell] = cd.fieldCapacity[cell] * 0.5;
        
        // Initial OM based on expected zone (high for grasslands, moderate for forests)
        if (zoneName.includes('Steppe') || zoneName.includes('Grassland')) {
            cd.soilOM[cell] = 0.04 + Math.random() * 0.02; // 4-6%
        } else if (zoneName.includes('Forest')) {
            cd.soilOM[cell] = 0.02 + Math.random() * 0.02; // 2-4%
        } else if (zoneName.includes('Desert')) {
            cd.soilOM[cell] = 0.005 + Math.random() * 0.005; // 0.5-1%
        } else if (zoneName.includes('Tundra')) {
            cd.soilOM[cell] = 0.06 + Math.random() * 0.04; // 6-10% (peat)
        } else {
            cd.soilOM[cell] = 0.02 + Math.random() * 0.02;
        }
        
        // Initial salinity (low except in deserts)
        const petRatio = cd.petRatio[cell];
        if (petRatio > 4) {
            cd.soilSalinity[cell] = 0.1 + Math.random() * 0.1;
        } else {
            cd.soilSalinity[cell] = Math.random() * 0.02;
        }
        
        // Waterlogging (high in wet tundra, wetlands)
        if (zoneName.includes('Wet Tundra') || zoneName.includes('Rain Forest')) {
            cd.soilWaterlog[cell] = 0.2 + Math.random() * 0.2;
        } else {
            cd.soilWaterlog[cell] = Math.random() * 0.05;
        }
        
        // Permafrost in cold regions
        if (bioT < 3) {
            cd.soilPermafrost[cell] = 1;
        } else {
            cd.soilPermafrost[cell] = 0;
        }
        
        // Soil type class
        cd.soilTypeClass[cell] = template.typical_soil;
    }
    
    /**
     * Initialize vegetation properties for a cell
     */
    _initializeVegetation(cell, template, templateId) {
        const cd = this.cellData;
        
        // Start at 60-80% of target (with some randomness)
        const startFraction = 0.6 + Math.random() * 0.2;
        
        cd.vegCover[cell] = template.target_veg_cover * startFraction;
        cd.vegCanopy[cell] = template.target_canopy * startFraction;
        cd.vegGroundCover[cell] = template.target_ground_cover * startFraction;
        cd.vegGroundCoverMode[cell] = template.ground_cover_mode;
        cd.vegFuelLoad[cell] = 0.2 + Math.random() * 0.2; // Some initial fuel
        cd.vegTemplateId[cell] = templateId;
        cd.vegNPP[cell] = template.NPPmax * 0.5; // Half productivity initially
        cd.vegLitterfall[cell] = template.NPPmax * 0.5 * this.config.litter_fraction;
        
        // Fire tracking
        cd.fireRisk[cell] = template.base_fire_risk;
        cd.yearsSinceFire[cell] = Math.floor(Math.random() * 50); // Random fire history
        cd.fireIntensity[cell] = 0;
    }
    
    /**
     * Initialize fauna properties for a cell
     */
    _initializeFauna(cell, template) {
        const cd = this.cellData;
        const fw = template.fauna_weights;
        const cap = this.config.fauna_capacity_base;
        
        // Start near equilibrium with some randomness
        const randFactor = () => 0.7 + Math.random() * 0.3;
        
        cd.faunaGrazers[cell] = fw.grazers * cap * randFactor();
        cd.faunaBrowsers[cell] = fw.browsers * cap * randFactor();
        cd.faunaPredators[cell] = fw.predators * cap * randFactor();
        cd.faunaInsects[cell] = fw.insects * cap * randFactor();
        cd.faunaAmphibians[cell] = fw.amphibians * cap * randFactor();
        cd.faunaReptiles[cell] = fw.reptiles * cap * randFactor();
        cd.faunaBirds[cell] = fw.birds * cap * randFactor();
        
        // Total biomass (weighted sum)
        cd.faunaTotalBiomass[cell] = (
            cd.faunaGrazers[cell] * 1.0 +
            cd.faunaBrowsers[cell] * 0.8 +
            cd.faunaPredators[cell] * 0.5 +
            cd.faunaInsects[cell] * 0.3 +
            cd.faunaAmphibians[cell] * 0.2 +
            cd.faunaReptiles[cell] * 0.3 +
            cd.faunaBirds[cell] * 0.2
        ) / 3.3; // Normalize to 0-1 range
    }
    
    /**
     * Calculate terrain slopes for all cells
     */
    _calculateSlopes() {
        const cd = this.cellData;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            const row = cd.getRow(cell);
            const col = cd.getCol(cell);
            const elev = cd.cellElevation[cell] || 
                        (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            
            // Get neighbor elevations
            let maxSlope = 0;
            const neighbors = cd._getNeighborIndices(cell);
            
            for (const neighbor of neighbors) {
                const neighborElev = cd.cellElevation[neighbor] || 
                                    (cd.bedrockThickness[neighbor] + cd.sedimentThickness[neighbor]);
                const dist = Math.sqrt(
                    Math.pow(cd.getRow(neighbor) - row, 2) +
                    Math.pow(cd.getCol(neighbor) - col, 2)
                ) * cd.config.pixelLength;
                
                if (dist > 0) {
                    const slope = Math.abs(elev - neighborElev) / dist;
                    maxSlope = Math.max(maxSlope, slope);
                }
            }
            
            // Normalize to 0-1 (0 = flat, 1 = cliff ~45°)
            cd.hydroSlope[cell] = Math.min(1, maxSlope);
        }
    }
    
    // ========================================================================
    // ANNUAL SIMULATION STEP
    // ========================================================================
    
    /**
     * Run one year of simulation
     * Executes steps A-H from the spec in order
     */
    stepYear() {
        if (!this.initialized) {
            this.initialize();
        }
        
        const cd = this.cellData;
        const seaLevel = cd.config.seaLevel;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            const groundElev = cd.cellElevation[cell] || 
                              (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            if (groundElev < seaLevel) continue; // Skip ocean
            
            // Step A: Classify climate & get target template
            const zoneName = cd.getHoldridgeZoneName(cell);
            const template = getEcosystemTemplate(zoneName);
            cd.vegTemplateId[cell] = getTemplateId(zoneName);
            
            // Step B: Compute hydrology
            this._stepHydrology(cell);
            
            // Step C: Compute NPP
            this._stepNPP(cell, template);
            
            // Step D: Update soil OM & salts
            this._stepSoilOM(cell, template);
            
            // Step E: Derive soil type & color
            this._stepSoilClassification(cell, template);
            
            // Step F: Update vegetation (with inertia)
            this._stepVegetation(cell, template);
            
            // Step G: Fire simulation
            this._stepFire(cell, template);
            
            // Step H: Update fauna
            this._stepFauna(cell, template);
        }
        
        // Recalculate colors
        this._calculateAllSoilColors();
        this._calculateAllVegetationColors();
        this._calculateAllFaunaColors();
        
        this.simulationYear++;
    }
    
    /**
     * Run multiple years of simulation
     * @param {number} years - Number of years to simulate
     * @param {function} progressCallback - Optional callback(year, total)
     */
    stepYears(years, progressCallback) {
        for (let i = 0; i < years; i++) {
            this.stepYear();
            if (progressCallback) {
                progressCallback(i + 1, years);
            }
        }
    }
    
    // ========================================================================
    // STEP B: HYDROLOGY BUCKET MODEL
    // ========================================================================
    
    _stepHydrology(cell) {
        const cd = this.cellData;
        const cfg = this.config;
        
        const P = cd.rainfall[cell]; // mm/yr
        const slope = cd.hydroSlope[cell];
        const texture = cd.soilTexture[cell];
        const vegCover = cd.vegCover[cell];
        const fieldCap = cd.fieldCapacity[cell];
        
        // Runoff coefficient increases with slope, decreases with vegetation
        // Sandy soils have higher infiltration (lower runoff)
        const textureCoeff = [0.15, 0.25, 0.40][texture]; // sand, loam, clay
        const slopeCoeff = 0.1 + slope * 0.5; // 0.1 at flat, 0.6 at steep
        const vegReduction = 1 - vegCover * 0.6; // Vegetation reduces runoff
        
        let runoffCoeff = textureCoeff + slopeCoeff * 0.5;
        runoffCoeff *= vegReduction;
        runoffCoeff = Math.max(0.05, Math.min(0.8, runoffCoeff));
        
        // Calculate water budget
        const runoff = P * runoffCoeff;
        const infiltration = P - runoff;
        
        // PET from biotemperature
        const bioT = cd.biotemperature[cell];
        const PET = Math.max(0, bioT) * cfg.k_pet;
        
        // Actual ET limited by soil moisture and vegetation
        const moistRatio = cd.soilMoist[cell] / Math.max(1, fieldCap);
        const moistResponse = Math.sqrt(Math.min(1, moistRatio)); // Saturating curve
        const ETa = PET * vegCover * moistResponse;
        
        // Update soil moisture
        cd.soilMoist[cell] = Math.max(0, Math.min(fieldCap,
            cd.soilMoist[cell] + infiltration - ETa
        ));
        
        // Store for diagnostics
        cd.hydroRunoff[cell] = runoff;
        cd.hydroInfiltration[cell] = infiltration;
        cd.hydroETActual[cell] = ETa;
    }
    
    // ========================================================================
    // STEP C: NET PRIMARY PRODUCTIVITY
    // ========================================================================
    
    _stepNPP(cell, template) {
        const cd = this.cellData;
        
        const bioT = cd.biotemperature[cell];
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        const depth = cd.soilDepth[cell];
        
        // Temperature stress function (peaks around 20°C, falls at extremes)
        let f_T;
        if (bioT < 5) {
            f_T = bioT / 5 * 0.5; // Low at cold
        } else if (bioT > 25) {
            f_T = 1 - (bioT - 25) / 15 * 0.3; // Slight reduction at hot
        } else {
            f_T = 0.5 + (bioT - 5) / 20 * 0.5; // Ramp up in optimal range
        }
        f_T = Math.max(0, Math.min(1, f_T));
        
        // Water stress function (saturating)
        const f_W = Math.sqrt(Math.min(1, moistRatio));
        
        // Soil depth function (saturating at ~1m)
        const f_depth = Math.min(1, depth / 1.0);
        
        // Calculate NPP
        const NPP = template.NPPmax * f_T * f_W * f_depth;
        cd.vegNPP[cell] = NPP;
        
        // Litter input for soil OM
        cd.vegLitterfall[cell] = NPP * this.config.litter_fraction;
    }
    
    // ========================================================================
    // STEP D: SOIL ORGANIC MATTER
    // ========================================================================
    
    _stepSoilOM(cell, template) {
        const cd = this.cellData;
        const cfg = this.config;
        
        const bioT = cd.biotemperature[cell];
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        
        // Litter input
        const litterInput = cd.vegLitterfall[cell] / 10000; // Convert g/m² to fraction
        
        // Decomposition (increases with warmth and moisture)
        const g_T = Math.min(1, bioT / 25); // Temperature factor
        const g_W = Math.min(1, moistRatio); // Moisture factor
        const decomp = cd.soilOM[cell] * template.decomp_rate * g_T * g_W;
        
        // Update OM
        cd.soilOM[cell] = Math.max(0, Math.min(0.3, // Cap at 30%
            cd.soilOM[cell] + litterInput - decomp
        ));
        
        // Update field capacity (OM increases water holding)
        const baseCapacity = cd.soilDepth[cell] * 1000 * [0.12, 0.25, 0.35][cd.soilTexture[cell]];
        const omBonus = cd.soilOM[cell] * 1000; // OM holds water
        cd.fieldCapacity[cell] = baseCapacity + omBonus;
        
        // Salinity dynamics
        const AI = 1 / Math.max(0.01, cd.petRatio[cell]); // Aridity index
        if (AI < 0.5) {
            // Dry climate: salts accumulate
            cd.soilSalinity[cell] += cfg.salt_accumulation * (1 - AI * 2);
        }
        // Leaching removes salts
        const leaching = moistRatio * Math.min(1, AI * 2);
        cd.soilSalinity[cell] -= cfg.salt_leaching * leaching;
        cd.soilSalinity[cell] = Math.max(0, Math.min(1, cd.soilSalinity[cell]));
        
        // Waterlogging
        if (moistRatio > 0.9) {
            cd.soilWaterlog[cell] = Math.min(1, cd.soilWaterlog[cell] + 0.05);
        } else {
            cd.soilWaterlog[cell] = Math.max(0, cd.soilWaterlog[cell] - 0.02);
        }
    }
    
    // ========================================================================
    // STEP E: SOIL TYPE & COLOR
    // ========================================================================
    
    _stepSoilClassification(cell, template) {
        const cd = this.cellData;
        
        const bioT = cd.biotemperature[cell];
        const AI = 1 / Math.max(0.01, cd.petRatio[cell]);
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        
        // Calculate indices
        const warmFactor = Math.min(1, bioT / 24);
        cd.soilLeachIndex[cell] = moistRatio * AI * warmFactor;
        cd.soilBlackness[cell] = Math.max(0, Math.min(1, (cd.soilOM[cell] - 0.02) / 0.06));
        cd.soilPaleness[cell] = Math.max(0, Math.min(1, (cd.soilSalinity[cell] - 0.05) / 0.3));
        cd.soilGrayness[cell] = Math.max(0, Math.min(1, 
            cd.soilWaterlog[cell] * 0.7 + cd.soilPermafrost[cell] * 0.3
        ));
        cd.soilRedness[cell] = Math.max(0, Math.min(1, (cd.soilLeachIndex[cell] - 0.3) / 0.5));
        
        // Classify soil type
        if (cd.soilPermafrost[cell] || bioT < 3) {
            cd.soilTypeClass[cell] = SOIL_TYPE.GELISOL;
        } else if (cd.soilOM[cell] > 0.15) {
            cd.soilTypeClass[cell] = SOIL_TYPE.HISTOSOL;
        } else if (cd.soilBlackness[cell] > 0.5 && cd.vegGroundCoverMode[cell] === GROUND_COVER_MODE.GRASS) {
            cd.soilTypeClass[cell] = SOIL_TYPE.MOLLISOL;
        } else if (cd.soilPaleness[cell] > 0.3 || AI < 0.2) {
            cd.soilTypeClass[cell] = SOIL_TYPE.ARIDISOL;
        } else if (cd.soilRedness[cell] > 0.6 && bioT > 20) {
            cd.soilTypeClass[cell] = SOIL_TYPE.OXISOL;
        } else if (cd.soilRedness[cell] > 0.4 && bioT > 15) {
            cd.soilTypeClass[cell] = SOIL_TYPE.ULTISOL;
        } else if (cd.soilGrayness[cell] > 0.3 && bioT < 12) {
            cd.soilTypeClass[cell] = SOIL_TYPE.SPODOSOL;
        } else if (cd.soilLeachIndex[cell] > 0.3) {
            cd.soilTypeClass[cell] = SOIL_TYPE.ALFISOL;
        } else {
            cd.soilTypeClass[cell] = SOIL_TYPE.INCEPTISOL;
        }
    }
    
    // ========================================================================
    // STEP F: VEGETATION DYNAMICS
    // ========================================================================
    
    _stepVegetation(cell, template) {
        const cd = this.cellData;
        const cfg = this.config;
        
        // Calculate suitability from environmental factors
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        const bioT = cd.biotemperature[cell];
        const salinity = cd.soilSalinity[cell];
        const permafrost = cd.soilPermafrost[cell];
        
        // Suitability factors
        const moistSuit = Math.sqrt(Math.min(1, moistRatio));
        const tempSuit = Math.min(1, bioT / 10); // Low bioT = low suitability
        const saltSuit = 1 - salinity * 2; // Salt stress
        const frostSuit = 1 - permafrost * 0.5; // Permafrost limits growth
        
        const suitability = Math.max(0, moistSuit * tempSuit * saltSuit * frostSuit);
        
        // Relaxation toward targets (with inertia)
        cd.vegCover[cell] += cfg.r_veg_cover * suitability * 
            (template.target_veg_cover - cd.vegCover[cell]);
        cd.vegCanopy[cell] += cfg.r_canopy * suitability * 
            (template.target_canopy - cd.vegCanopy[cell]);
        cd.vegGroundCover[cell] += cfg.r_ground_cover * suitability * 
            (template.target_ground_cover - cd.vegGroundCover[cell]);
        
        // Update ground cover mode
        cd.vegGroundCoverMode[cell] = template.ground_cover_mode;
        
        // Clamp values
        cd.vegCover[cell] = Math.max(0, Math.min(1, cd.vegCover[cell]));
        cd.vegCanopy[cell] = Math.max(0, Math.min(1, cd.vegCanopy[cell]));
        cd.vegGroundCover[cell] = Math.max(0, Math.min(1, cd.vegGroundCover[cell]));
        
        // Fuel dynamics
        cd.vegFuelLoad[cell] += cfg.fuel_accumulation * cd.vegNPP[cell] / 1000;
        cd.vegFuelLoad[cell] -= cfg.fuel_decay * cd.vegFuelLoad[cell];
        cd.vegFuelLoad[cell] = Math.max(0, Math.min(1, cd.vegFuelLoad[cell]));
        
        // Increment years since fire
        cd.yearsSinceFire[cell] = Math.min(65535, cd.yearsSinceFire[cell] + 1);
    }
    
    // ========================================================================
    // STEP G: FIRE SIMULATION
    // ========================================================================
    
    _stepFire(cell, template) {
        const cd = this.cellData;
        const cfg = this.config;
        
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        const dryness = 1 - moistRatio;
        const fuelLoad = cd.vegFuelLoad[cell];
        
        // Seasonality factor (simplified - higher in summer)
        const row = cd.getRow(cell);
        const latFactor = Math.abs(row / cd.rows - 0.5) * 2;
        const seasonality = 0.5 + latFactor * 0.5; // Higher at poles (more seasonal)
        
        // Fire probability
        const p_fire = template.base_fire_risk * fuelLoad * dryness * seasonality;
        cd.fireRisk[cell] = p_fire;
        
        // Stochastic fire occurrence
        if (Math.random() < p_fire) {
            // Fire occurs!
            const intensity = dryness * fuelLoad;
            cd.fireIntensity[cell] = intensity;
            
            // Damage
            cd.vegCanopy[cell] *= (1 - cfg.canopy_loss_fire * intensity);
            cd.vegCover[cell] *= (1 - cfg.cover_loss_fire * intensity);
            cd.vegFuelLoad[cell] *= (1 - cfg.fuel_consumed_fire);
            
            // Reset fire timer
            cd.yearsSinceFire[cell] = 0;
            
            // OM loss from fire
            cd.soilOM[cell] *= 0.95; // Some OM lost to combustion
        }
    }
    
    // ========================================================================
    // STEP H: FAUNA GUILDS
    // ========================================================================
    
    _stepFauna(cell, template) {
        const cd = this.cellData;
        const cfg = this.config;
        const fw = template.fauna_weights;
        const r = cfg.fauna_relaxation;
        const cap = cfg.fauna_capacity_base;
        
        // Calculate habitat suitability modifiers
        const vegCover = cd.vegCover[cell];
        const canopy = cd.vegCanopy[cell];
        const groundCover = cd.vegGroundCover[cell];
        const moistRatio = cd.soilMoist[cell] / Math.max(1, cd.fieldCapacity[cell]);
        const bioT = cd.biotemperature[cell];
        const NPP = cd.vegNPP[cell];
        
        // Temperature suitability for cold/warm adapted
        const warmSuit = Math.min(1, bioT / 20);
        const coldSuit = Math.max(0, 1 - bioT / 30);
        
        // Guild-specific suitability
        const grazerSuit = groundCover * fw.grazers * (NPP / 500);
        const browserSuit = (vegCover - canopy * 0.3) * fw.browsers * (NPP / 800);
        const predatorSuit = (cd.faunaGrazers[cell] + cd.faunaBrowsers[cell]) * 0.3 * fw.predators;
        const insectSuit = warmSuit * NPP / 1000 * fw.insects;
        const amphibianSuit = moistRatio * (1 - warmSuit * 0.3) * canopy * 0.5 * fw.amphibians;
        const reptileSuit = warmSuit * (1 - moistRatio * 0.5) * fw.reptiles;
        const birdSuit = (canopy * 0.5 + vegCover * 0.3 + 0.2) * fw.birds;
        
        // Relaxation toward suitability-based carrying capacity
        cd.faunaGrazers[cell] += r * (grazerSuit * cap - cd.faunaGrazers[cell]);
        cd.faunaBrowsers[cell] += r * (browserSuit * cap - cd.faunaBrowsers[cell]);
        cd.faunaPredators[cell] += r * (predatorSuit * cap - cd.faunaPredators[cell]);
        cd.faunaInsects[cell] += r * (insectSuit * cap - cd.faunaInsects[cell]);
        cd.faunaAmphibians[cell] += r * (amphibianSuit * cap - cd.faunaAmphibians[cell]);
        cd.faunaReptiles[cell] += r * (reptileSuit * cap - cd.faunaReptiles[cell]);
        cd.faunaBirds[cell] += r * (birdSuit * cap - cd.faunaBirds[cell]);
        
        // Clamp values
        cd.faunaGrazers[cell] = Math.max(0, Math.min(1, cd.faunaGrazers[cell]));
        cd.faunaBrowsers[cell] = Math.max(0, Math.min(1, cd.faunaBrowsers[cell]));
        cd.faunaPredators[cell] = Math.max(0, Math.min(1, cd.faunaPredators[cell]));
        cd.faunaInsects[cell] = Math.max(0, Math.min(1, cd.faunaInsects[cell]));
        cd.faunaAmphibians[cell] = Math.max(0, Math.min(1, cd.faunaAmphibians[cell]));
        cd.faunaReptiles[cell] = Math.max(0, Math.min(1, cd.faunaReptiles[cell]));
        cd.faunaBirds[cell] = Math.max(0, Math.min(1, cd.faunaBirds[cell]));
        
        // Total biomass
        cd.faunaTotalBiomass[cell] = (
            cd.faunaGrazers[cell] * 1.0 +
            cd.faunaBrowsers[cell] * 0.8 +
            cd.faunaPredators[cell] * 0.5 +
            cd.faunaInsects[cell] * 0.3 +
            cd.faunaAmphibians[cell] * 0.2 +
            cd.faunaReptiles[cell] * 0.3 +
            cd.faunaBirds[cell] * 0.2
        ) / 3.3;
    }
    
    // ========================================================================
    // COLOR CALCULATIONS
    // ========================================================================
    
    _calculateAllSoilColors() {
        const cd = this.cellData;
        const cfg = this.config;
        const seaLevel = cd.config.seaLevel;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            const groundElev = cd.cellElevation[cell] || 
                              (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            
            if (groundElev < seaLevel) {
                // Ocean - dark blue
                cd.soilColorRGB[cell * 3] = 30;
                cd.soilColorRGB[cell * 3 + 1] = 60;
                cd.soilColorRGB[cell * 3 + 2] = 100;
                continue;
            }
            
            // Blend colors based on indices
            const base = cfg.soil_color_base;
            const red = cfg.soil_color_red;
            const black = cfg.soil_color_black;
            const pale = cfg.soil_color_pale;
            const gray = cfg.soil_color_gray;
            
            const redness = cd.soilRedness[cell];
            const blackness = cd.soilBlackness[cell];
            const paleness = cd.soilPaleness[cell];
            const grayness = cd.soilGrayness[cell];
            
            // Start with base brown
            let r = base[0];
            let g = base[1];
            let b = base[2];
            
            // Blend toward red
            r = r + (red[0] - r) * redness;
            g = g + (red[1] - g) * redness;
            b = b + (red[2] - b) * redness;
            
            // Darken with blackness
            r = r + (black[0] - r) * blackness;
            g = g + (black[1] - g) * blackness;
            b = b + (black[2] - b) * blackness;
            
            // Lighten with paleness
            r = r + (pale[0] - r) * paleness;
            g = g + (pale[1] - g) * paleness;
            b = b + (pale[2] - b) * paleness;
            
            // Shift toward gray
            r = r + (gray[0] - r) * grayness;
            g = g + (gray[1] - g) * grayness;
            b = b + (gray[2] - b) * grayness;
            
            cd.soilColorRGB[cell * 3] = Math.round(Math.max(0, Math.min(255, r)));
            cd.soilColorRGB[cell * 3 + 1] = Math.round(Math.max(0, Math.min(255, g)));
            cd.soilColorRGB[cell * 3 + 2] = Math.round(Math.max(0, Math.min(255, b)));
        }
    }
    
    _calculateAllVegetationColors() {
        const cd = this.cellData;
        const seaLevel = cd.config.seaLevel;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            const groundElev = cd.cellElevation[cell] || 
                              (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            
            if (groundElev < seaLevel) {
                // Ocean - dark blue
                cd.vegColors[cell * 3] = 30;
                cd.vegColors[cell * 3 + 1] = 50;
                cd.vegColors[cell * 3 + 2] = 90;
                continue;
            }
            
            const cover = cd.vegCover[cell];
            const canopy = cd.vegCanopy[cell];
            const ground = cd.vegGroundCover[cell];
            const mode = cd.vegGroundCoverMode[cell];
            
            // Base on ground cover mode
            let baseColor;
            switch (mode) {
                case GROUND_COVER_MODE.LITTER:
                    baseColor = [139, 90, 43]; // Brown litter
                    break;
                case GROUND_COVER_MODE.MOSS:
                    baseColor = [100, 140, 90]; // Mossy green
                    break;
                case GROUND_COVER_MODE.GRASS:
                    baseColor = [180, 200, 80]; // Grass yellow-green
                    break;
                case GROUND_COVER_MODE.CRUST:
                    baseColor = [180, 160, 130]; // Desert crust
                    break;
                default:
                    baseColor = [200, 180, 150]; // Sparse/bare
            }
            
            // Forest green overlay based on canopy
            const forestGreen = [20, 80, 20];
            
            // Blend: more canopy = more dark green
            let r = baseColor[0] + (forestGreen[0] - baseColor[0]) * canopy * 0.8;
            let g = baseColor[1] + (forestGreen[1] - baseColor[1]) * canopy * 0.5 + cover * 30;
            let b = baseColor[2] + (forestGreen[2] - baseColor[2]) * canopy * 0.3;
            
            // Reduce saturation for low cover
            if (cover < 0.3) {
                const gray = (r + g + b) / 3;
                const desat = (0.3 - cover) / 0.3;
                r = r + (gray - r) * desat * 0.5;
                g = g + (gray - g) * desat * 0.5;
                b = b + (gray - b) * desat * 0.5;
            }
            
            cd.vegColors[cell * 3] = Math.round(Math.max(0, Math.min(255, r)));
            cd.vegColors[cell * 3 + 1] = Math.round(Math.max(0, Math.min(255, g)));
            cd.vegColors[cell * 3 + 2] = Math.round(Math.max(0, Math.min(255, b)));
        }
    }
    
    _calculateAllFaunaColors() {
        const cd = this.cellData;
        const seaLevel = cd.config.seaLevel;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            const groundElev = cd.cellElevation[cell] || 
                              (cd.bedrockThickness[cell] + cd.sedimentThickness[cell]);
            
            if (groundElev < seaLevel) {
                // Ocean
                cd.faunaColors[cell * 3] = 30;
                cd.faunaColors[cell * 3 + 1] = 50;
                cd.faunaColors[cell * 3 + 2] = 90;
                continue;
            }
            
            // Encode fauna diversity as RGB channels:
            // R = large mammals (grazers + browsers + predators)
            // G = invertebrates + amphibians
            // B = reptiles + birds
            
            const mammals = (cd.faunaGrazers[cell] + cd.faunaBrowsers[cell] + cd.faunaPredators[cell]) / 3;
            const invertAmphi = (cd.faunaInsects[cell] + cd.faunaAmphibians[cell]) / 2;
            const reptBird = (cd.faunaReptiles[cell] + cd.faunaBirds[cell]) / 2;
            
            // Normalize to ensure more vivid colors
            // Find the dominant guild and boost saturation
            const maxVal = Math.max(mammals, invertAmphi, reptBird, 0.01);
            const total = mammals + invertAmphi + reptBird;
            
            // Scale each channel: base 40, scale by 215 for full range
            // Use power function to increase contrast
            const rNorm = Math.pow(mammals / maxVal, 0.7);
            const gNorm = Math.pow(invertAmphi / maxVal, 0.7);
            const bNorm = Math.pow(reptBird / maxVal, 0.7);
            
            // Brightness based on total fauna (biodiversity)
            const brightness = Math.min(1, total * 1.2);
            
            const r = 40 + rNorm * brightness * 215;
            const g = 40 + gNorm * brightness * 215;
            const b = 40 + bNorm * brightness * 215;
            
            cd.faunaColors[cell * 3] = Math.round(Math.max(0, Math.min(255, r)));
            cd.faunaColors[cell * 3 + 1] = Math.round(Math.max(0, Math.min(255, g)));
            cd.faunaColors[cell * 3 + 2] = Math.round(Math.max(0, Math.min(255, b)));
        }
    }
    
    // ========================================================================
    // STATISTICS & DEBUGGING
    // ========================================================================
    
    /**
     * Get simulation statistics
     */
    getStats() {
        const cd = this.cellData;
        const seaLevel = cd.config.seaLevel;
        
        let landCells = 0;
        let totalVegCover = 0;
        let totalCanopy = 0;
        let totalSoilOM = 0;
        let totalFauna = 0;
        let fireEvents = 0;
        
        for (let cell = 0; cell < cd.cellCount; cell++) {
            if (cd.cellElevation[cell] < seaLevel) continue;
            
            landCells++;
            totalVegCover += cd.vegCover[cell];
            totalCanopy += cd.vegCanopy[cell];
            totalSoilOM += cd.soilOM[cell];
            totalFauna += cd.faunaTotalBiomass[cell];
            if (cd.yearsSinceFire[cell] === 0) fireEvents++;
        }
        
        return {
            simulationYear: this.simulationYear,
            landCells: landCells,
            avgVegCover: totalVegCover / landCells,
            avgCanopy: totalCanopy / landCells,
            avgSoilOM: totalSoilOM / landCells,
            avgFaunaBiomass: totalFauna / landCells,
            fireEventsThisYear: fireEvents
        };
    }
}

// Export to global scope
global.HoldridgeSimulation = HoldridgeSimulation;

})(typeof window !== 'undefined' ? window : global);
