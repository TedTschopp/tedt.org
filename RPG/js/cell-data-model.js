/**
 * Cell Data Model - Islands-style unified data structure for world generation
 * 
 * This module provides a multi-layer cell model where each cell tracks:
 * - Physical layers: bedrock, sediment, water depth
 * - Climate data: temperature, rainfall, evaporation
 * - Derived properties: elevation, surface height, drainage
 * 
 * Based on TedTschopp/Islands repository architecture, adapted for grid-based maps.
 * 
 * Units:
 * - Horizontal: cell coordinates (pixels on the heightmap)
 * - Vertical: elevations in meters
 * - Temperature: Celsius (derived from planet.c formula)
 * - Rainfall: mm/year
 * - Time: years (for simulation)
 */

'use strict';

// Make CellDataModel available globally
(function(global) {

/**
 * CellDataModel - Unified cell-based world data structure
 */
class CellDataModel {
    /**
     * Create a cell data model from a heightmap
     * @param {number} rows - Number of rows in the grid
     * @param {number} cols - Number of columns in the grid
     * @param {object} options - Configuration options
     */
    constructor(rows, cols, options = {}) {
        this.rows = rows;
        this.cols = cols;
        this.cellCount = rows * cols;
        
        // Configuration options
        this.config = {
            pixelLength: options.pixelLength || 125,          // meters per pixel
            meanSeaLevel: options.meanSeaLevel || 2000,       // meters (baseline)
            seaLevel: options.seaLevel || 2000,               // current sea level (meters)
            pctWater: options.pctWater || 50,                 // percentage of water coverage
            pctIce: options.pctIce || 10,                     // percentage of ice coverage
            rainfall: options.rainfall || 0.3,                 // meters/year baseline
            lakeThreshold: options.lakeThreshold || 5,        // meters: min depth to show as water
            
            // Erosion parameters (from Islands)
            fluvialTransportCoefficient: options.fluvialTransportCoefficient || 60,
            sedimentationDistance: options.sedimentationDistance || 25000,
            sedimentDensity: options.sedimentDensity || 2200,
            landscapeDiffusionCoefficient: options.landscapeDiffusionCoefficient || 2,
            
            // (D) Dynamic sea level parameters (from Islands)
            enableDynamicSeaLevel: options.enableDynamicSeaLevel !== false,
            seaLevelAmplitude: options.seaLevelAmplitude || 50,        // meters
            seaLevelPeriod: options.seaLevelPeriod || 500000,          // years per cycle
            upliftStartTime: options.upliftStartTime || 500000,        // years before uplift
            seaLevelStartTime: options.seaLevelStartTime || 2000000    // years before sea changes
        };
        
        // Max neighbors for cell connectivity (8-directional)
        this.maxNeighbors = 8;
        
        // ====================================================================
        // CORE PHYSICAL LAYERS (Islands-style)
        // ====================================================================
        
        // Terrain structure (vertical layers, in meters)
        this.bedrockThickness = new Float32Array(this.cellCount);      // Solid rock layer
        this.sedimentThickness = new Float32Array(this.cellCount);     // Loose sediment on top
        this.lakeThickness = new Float32Array(this.cellCount);         // Water depth (lakes/ocean)
        
        // Derived: Total elevation = bedrock + sediment
        this.cellElevation = new Float32Array(this.cellCount);
        
        // Surface = elevation + water depth (for rendering)
        // Note: This is computed on demand, not stored
        
        // ====================================================================
        // CLIMATE DATA LAYERS
        // ====================================================================
        
        // Raw physical values (not color indices!)
        this.temperature = new Float32Array(this.cellCount);           // Celsius
        this.rainfall = new Float32Array(this.cellCount);              // mm/year
        this.evaporation = new Float32Array(this.cellCount);           // mm/year equivalent
        this.rainShadow = new Float32Array(this.cellCount);            // Rain shadow factor
        
        // ====================================================================
        // TERRAIN PROPERTIES
        // ====================================================================
        
        this.erodibility = new Float32Array(this.cellCount);           // How easily terrain erodes (0-1)
        this.upliftRate = new Float32Array(this.cellCount);            // Tectonic uplift (mm/year)
        
        // ====================================================================
        // ICE CAP / GLACIER MODEL (mass balance driven)
        // Layer stack from bottom to top: bedrock → sediment → water → ice → snow
        // ====================================================================
        
        // Primary thickness layers (meters)
        this.glacialIceThickness = new Float32Array(this.cellCount);   // Compacted glacial ice (meters)
        this.snowDepth = new Float32Array(this.cellCount);             // Seasonal/perennial snow on top (meters)
        
        // Classification flags
        this.isIceCap = new Uint8Array(this.cellCount);                // True ice cap (large, low relief, thick)
        this.isGlacier = new Uint8Array(this.cellCount);               // Mountain glacier (not ice cap)
        this.hasPerennialSnow = new Uint8Array(this.cellCount);        // Year-round snow cover (any type)
        this.icePatchId = new Int32Array(this.cellCount);              // Contiguous ice patch ID (-1 = none)
        
        // Local terrain analysis
        this.localRelief = new Float32Array(this.cellCount);           // Relief in analysis window (meters)
        
        // Legacy compatibility
        this.iceThickness = this.glacialIceThickness;                  // Alias for backward compatibility
        this.isIceCovered = this.hasPerennialSnow;                     // Alias for backward compatibility
        
        // ====================================================================
        // SNOWFALL / MASS BALANCE (annual rates)
        // ====================================================================
        
        this.snowFraction = new Float32Array(this.cellCount);          // Fraction of precip falling as snow (0-1)
        this.snowAccumulation = new Float32Array(this.cellCount);      // Annual snowfall (mm water equiv)
        this.snowMelt = new Float32Array(this.cellCount);              // Annual melt from PDD (mm)
        this.snowSublimation = new Float32Array(this.cellCount);       // Annual sublimation (mm)
        this.snowAblation = new Float32Array(this.cellCount);          // Total ablation: melt + sublimation (mm)
        this.snowMassBalance = new Float32Array(this.cellCount);       // Net: accumulation - ablation (mm/yr)
        this.warmestMonthTemp = new Float32Array(this.cellCount);      // Estimated warmest month temp (°C)
        
        // Cumulative tracking
        this.cumulativeMassBalance = new Float32Array(this.cellCount); // Total ice equivalent accumulated (mm)
        this.yearsPositiveBalance = new Uint16Array(this.cellCount);   // Consecutive years with b > 0
        
        // ====================================================================
        // DRAINAGE/HYDROLOGY (Islands-style)
        // ====================================================================
        
        this.lakeIndex = new Int32Array(this.cellCount);               // Which lake body (-1 = none)
        this.isCoastal = new Uint8Array(this.cellCount);               // Boolean: coastal cell
        this.waterProximity = new Float32Array(this.cellCount);        // Distance to water (0-1)
        
        // Drainage graph (downstream targets)
        this.bestNeighbors = new Int32Array(this.cellCount * 2);       // Primary and secondary downstream
        this.bestPositions = new Int32Array(this.cellCount * 2);       // Neighbor positions
        this.inDegree = new Uint8Array(this.cellCount);                // # of upstream cells
        
        // Water/sediment flow
        this.collectedWater = new Float32Array(this.cellCount);        // Accumulated rainfall + upstream
        this.collectedSediment = new Float32Array(this.cellCount);     // Sediment being transported
        this.discharge = new Float32Array(this.cellCount * this.maxNeighbors); // Water flow per edge
        
        // ====================================================================
        // CELL GEOMETRY
        // ====================================================================
        
        // Cell positions (for non-uniform grids, but we use regular grid)
        this.cellX = new Float32Array(this.cellCount);
        this.cellY = new Float32Array(this.cellCount);
        
        // Neighbor connectivity
        this.cellNeighborCount = new Uint8Array(this.cellCount);
        this.cellNeighbors = new Int32Array(this.cellCount * this.maxNeighbors);
        this.cellNeighborDistance = new Float32Array(this.cellCount * this.maxNeighbors);
        this.neighborWrapped = new Uint8Array(this.cellCount * this.maxNeighbors); // Crosses map edge
        
        // ====================================================================
        // RENDERING CACHE (color indices for palettes)
        // ====================================================================
        
        this.worldMapColors = new Uint8Array(this.cellCount);          // Main map palette indices
        this.temperatureColors = new Uint8Array(this.cellCount);       // Temperature palette indices
        this.rainfallColors = new Uint8Array(this.cellCount);          // Rainfall palette indices
        this.evaporationColors = new Uint8Array(this.cellCount);       // Evaporation palette indices
        this.snowfallColors = new Uint8Array(this.cellCount);          // Snowfall/perennial snow palette indices
        this.terrainColors = new Uint8Array(this.cellCount);           // Terrain-only (no water)
        this.biomeIndex = new Uint8Array(this.cellCount);              // Whittaker biome type index
        this.biomeColors = new Uint8Array(this.cellCount * 3);         // RGB colors for Whittaker biome map
        this.holdridgeIndex = new Uint8Array(this.cellCount);          // Holdridge life zone index
        this.holdridgeColors = new Uint8Array(this.cellCount * 3);     // RGB colors for Holdridge map
        this.biotemperature = new Float32Array(this.cellCount);        // Holdridge biotemperature (°C)
        this.petRatio = new Float32Array(this.cellCount);              // PET / Precipitation ratio
        
        // ====================================================================
        // SOIL STATE MODEL (Holdridge simulation)
        // Physical and chemical properties of soil per cell
        // ====================================================================
        
        // Soil structure
        this.soilTexture = new Uint8Array(this.cellCount);             // 0=sand, 1=loam, 2=clay
        this.soilDepth = new Float32Array(this.cellCount);             // meters
        this.soilMoist = new Float32Array(this.cellCount);             // current moisture (mm)
        this.fieldCapacity = new Float32Array(this.cellCount);         // max moisture capacity (mm)
        this.soilOM = new Float32Array(this.cellCount);                // organic matter fraction (0-1)
        this.soilSalinity = new Float32Array(this.cellCount);          // salt content (0-1)
        this.soilWaterlog = new Float32Array(this.cellCount);          // waterlogging level (0-1)
        this.soilPermafrost = new Uint8Array(this.cellCount);          // permafrost present (bool)
        this.soilTypeClass = new Uint8Array(this.cellCount);           // soil order classification
        this.soilColorRGB = new Uint8Array(this.cellCount * 3);        // derived soil color
        
        // Derived soil indices (for color calculation)
        this.soilLeachIndex = new Float32Array(this.cellCount);        // leaching intensity
        this.soilBlackness = new Float32Array(this.cellCount);         // darkness from OM
        this.soilPaleness = new Float32Array(this.cellCount);          // paleness from salts
        this.soilGrayness = new Float32Array(this.cellCount);          // grayness from waterlog
        this.soilRedness = new Float32Array(this.cellCount);           // redness from weathering
        
        // ====================================================================
        // VEGETATION STATE MODEL (Holdridge simulation)
        // Vegetation structure and dynamics per cell
        // ====================================================================
        
        this.vegCover = new Float32Array(this.cellCount);              // total vegetation cover (0-1)
        this.vegCanopy = new Float32Array(this.cellCount);             // tree canopy cover (0-1)
        this.vegGroundCover = new Float32Array(this.cellCount);        // ground layer cover (0-1)
        this.vegFuelLoad = new Float32Array(this.cellCount);           // fire fuel accumulation (0-1)
        this.vegTemplateId = new Uint8Array(this.cellCount);           // current ecosystem template ID
        this.vegNPP = new Float32Array(this.cellCount);                // net primary productivity (g C/m²/yr)
        this.vegLitterfall = new Float32Array(this.cellCount);         // annual litter input (g C/m²/yr)
        this.vegGroundCoverMode = new Uint8Array(this.cellCount);      // 0=litter, 1=moss, 2=grass, 3=crust, 4=sparse
        this.vegColors = new Uint8Array(this.cellCount * 3);           // RGB colors for vegetation map
        
        // Fire tracking
        this.fireRisk = new Float32Array(this.cellCount);              // fire probability this year
        this.yearsSinceFire = new Uint16Array(this.cellCount);         // years since last fire
        this.fireIntensity = new Float32Array(this.cellCount);         // last fire intensity (0-1)
        
        // ====================================================================
        // FAUNA GUILD MODEL (Holdridge simulation)
        // Biomass/abundance of ecological guilds per cell
        // ====================================================================
        
        this.faunaGrazers = new Float32Array(this.cellCount);          // grazing mammals (0-1)
        this.faunaBrowsers = new Float32Array(this.cellCount);         // browsing mammals (0-1)
        this.faunaPredators = new Float32Array(this.cellCount);        // predators (0-1)
        this.faunaInsects = new Float32Array(this.cellCount);          // invertebrates (0-1)
        this.faunaAmphibians = new Float32Array(this.cellCount);       // amphibians (0-1)
        this.faunaReptiles = new Float32Array(this.cellCount);         // reptiles (0-1)
        this.faunaBirds = new Float32Array(this.cellCount);            // birds (0-1)
        this.faunaColors = new Uint8Array(this.cellCount * 3);         // RGB colors for fauna map
        this.faunaTotalBiomass = new Float32Array(this.cellCount);     // total fauna biomass index
        
        // ====================================================================
        // HYDROLOGY BUCKET MODEL (annual water budget)
        // ====================================================================
        
        this.hydroRunoff = new Float32Array(this.cellCount);           // annual runoff (mm/yr)
        this.hydroInfiltration = new Float32Array(this.cellCount);     // annual infiltration (mm/yr)
        this.hydroETActual = new Float32Array(this.cellCount);         // actual evapotranspiration (mm/yr)
        this.hydroSlope = new Float32Array(this.cellCount);            // terrain slope (0-1)
        
        // ====================================================================
        // SIMULATION STATE
        // ====================================================================
        
        this.time = 0;                                                  // Simulation time (years)
        this.dirty = {                                                  // Track what needs recalculating
            elevation: true,
            climate: true,
            drainage: true,
            colors: true
        };
        
        // Initialize cell positions
        this._initializeCellPositions();
        
        // Build neighbor graph
        this._buildNeighborGraph();
    }
    
    // ========================================================================
    // INITIALIZATION METHODS
    // ========================================================================
    
    _initializeCellPositions() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                this.cellX[cell] = col;
                this.cellY[cell] = row;
            }
        }
    }
    
    _buildNeighborGraph() {
        // 8-connectivity neighbor offsets
        const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                let neighborCount = 0;
                
                for (const [dr, dc] of offsets) {
                    const nr = row + dr;
                    // Wrap column horizontally (cylindrical/spherical projection)
                    const nc = (col + dc + this.cols) % this.cols;
                    
                    // Rows (latitude) don't wrap - top/bottom are poles
                    if (nr < 0 || nr >= this.rows) continue;
                    
                    const neighbor = nr * this.cols + nc;
                    const position = cell * this.maxNeighbors + neighborCount;
                    
                    this.cellNeighbors[position] = neighbor;
                    
                    // Calculate distance (diagonal vs cardinal)
                    const dist = Math.sqrt(dr * dr + dc * dc);
                    this.cellNeighborDistance[position] = dist;
                    
                    // Track if this crosses the map edge (for river rendering)
                    const isWrapped = (col + dc < 0 || col + dc >= this.cols);
                    this.neighborWrapped[position] = isWrapped ? 1 : 0;
                    
                    neighborCount++;
                }
                
                this.cellNeighborCount[cell] = neighborCount;
            }
        }
    }
    
    /**
     * Get an array of neighbor cell indices for a given cell
     * @param {number} cell - The cell index
     * @returns {number[]} Array of neighbor cell indices
     */
    _getNeighborIndices(cell) {
        const count = this.cellNeighborCount[cell];
        const neighbors = [];
        for (let i = 0; i < count; i++) {
            neighbors.push(this.cellNeighbors[cell * this.maxNeighbors + i]);
        }
        return neighbors;
    }
    
    /**
     * Initialize terrain from a heightmap
     * @param {number[][]} heightmap - 2D array of elevation values
     */
    initializeFromHeightmap(heightmap) {
        // Find min/max for normalization
        let minHeight = Infinity, maxHeight = -Infinity;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const h = heightmap[row][col];
                if (h < minHeight) minHeight = h;
                if (h > maxHeight) maxHeight = h;
            }
        }
        
        const heightRange = maxHeight - minHeight || 1;
        
        // Populate terrain arrays
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                const normalizedHeight = (heightmap[row][col] - minHeight) / heightRange;
                
                // Scale to elevation range (in meters)
                // Islands uses ~600-3100m range
                this.bedrockThickness[cell] = normalizedHeight * 2500 + 600;
                this.sedimentThickness[cell] = Math.random() * 5;
                this.lakeThickness[cell] = 0;
                this.iceThickness[cell] = 0;
                
                this.erodibility[cell] = 0.5 + Math.random() * 0.5;
                this.upliftRate[cell] = 0;
            }
        }
        
        // Calculate sea level based on water percentage
        this._calculateSeaLevel();
        
        // Update derived values
        this.updateElevation();
        this.markDirty('elevation');
    }
    
    /**
     * Calculate sea level to achieve desired water percentage
     */
    _calculateSeaLevel() {
        // Collect all elevations and sort
        const elevations = [];
        for (let cell = 0; cell < this.cellCount; cell++) {
            elevations.push(this.bedrockThickness[cell] + this.sedimentThickness[cell]);
        }
        elevations.sort((a, b) => a - b);
        
        // Find the elevation at the water percentage
        const waterIndex = Math.floor((this.config.pctWater / 100) * this.cellCount);
        this.config.seaLevel = elevations[Math.min(waterIndex, elevations.length - 1)];
    }
    
    // ========================================================================
    // UPDATE METHODS
    // ========================================================================
    
    /**
     * Update cell elevation from bedrock + sediment
     */
    updateElevation() {
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.cellElevation[cell] = this.bedrockThickness[cell] + this.sedimentThickness[cell];
        }
        this.dirty.elevation = false;
    }
    
    /**
     * (A) Setup uplift field using noise patterns (like Islands)
     * Creates realistic tectonic uplift zones
     */
    setupUplift() {
        // Simple noise-based uplift pattern
        // Uses latitude-based variation with random perturbation
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const col = cell % this.cols;
            
            // Normalized coordinates
            const s = (col / this.cols) * 2 - 1;
            const t = (row / this.rows) * 2 - 1;
            
            // Distance from center (creates central mountain range effect)
            const d = Math.sqrt(s * s + t * t);
            
            // Uplift rate in mm/year (higher in center, lower at edges)
            this.upliftRate[cell] = Math.max(0, (1 - d) * 2 + Math.random() * 0.2);
        }
    }
    
    /**
     * (C) Pre-fill lakes with sediment (from Islands)
     * Must be called after drainage calculation
     * @param {ErosionSimulation} erosionSim - The erosion simulation instance
     */
    fillLakes(erosionSim) {
        if (!erosionSim) {
            console.warn('fillLakes requires an ErosionSimulation instance');
            return;
        }
        
        // Use erosion simulation to identify and fill lakes
        erosionSim.fillLakes();
        
        // Sync the filled data back to this model
        this.syncFromErosionSimulation(erosionSim);
    }
    
    /**
     * (B) Sync erodibility and uplift data to ErosionSimulation
     * @param {ErosionSimulation} erosionSim - The erosion simulation instance
     */
    syncToErosionSimulation(erosionSim) {
        if (!erosionSim) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            // Sync erodibility
            if (erosionSim.erodibility) {
                erosionSim.erodibility[cell] = this.erodibility[cell];
            }
            // Sync uplift
            if (erosionSim.upliftArray) {
                erosionSim.upliftArray[cell] = this.upliftRate[cell];
            }
        }
    }
    
    /**
     * (B) Sync terrain data from ErosionSimulation back to this model
     * @param {ErosionSimulation} erosionSim - The erosion simulation instance
     */
    syncFromErosionSimulation(erosionSim) {
        if (!erosionSim) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.bedrockThickness[cell] = erosionSim.bedrockThickness[cell];
            this.sedimentThickness[cell] = erosionSim.sedimentThickness[cell];
            this.lakeThickness[cell] = erosionSim.lakeThicknessArray[cell];
            
            // Sync erodibility back if modified
            if (erosionSim.erodibility) {
                this.erodibility[cell] = erosionSim.erodibility[cell];
            }
        }
        
        // Update derived values
        this.updateElevation();
        
        // Update sea level from erosion sim
        this.config.seaLevel = erosionSim.seaLevel;
        
        this.markDirty('elevation');
    }
    
    /**
     * (D) Update sea level dynamically
     * @param {number} time - Current simulation time in years
     * @param {number} amplitude - Sea level oscillation amplitude in meters (default 50)
     * @param {number} period - Oscillation period in years (default 500000)
     */
    updateDynamicSeaLevel(time, amplitude = 50, period = 500000) {
        const baseSeaLevel = this.config.meanSeaLevel || this.config.seaLevel;
        this.config.seaLevel = baseSeaLevel + amplitude * Math.sin(2 * Math.PI * time / period);
    }
    
    /**
     * Mark a subsystem as needing recalculation
     */
    markDirty(system) {
        this.dirty[system] = true;
        // Track last update time for change detection
        this._lastUpdate = Date.now();
        // Cascade dependencies
        if (system === 'elevation') {
            this.dirty.climate = true;
            this.dirty.drainage = true;
            this.dirty.colors = true;
        } else if (system === 'climate') {
            this.dirty.colors = true;
        } else if (system === 'drainage') {
            this.dirty.colors = true;
        }
    }
    
    /**
     * Get neighbor cell indices for a given cell
     * Returns an array of valid neighbor cell indices
     * @param {number} cell - Cell index
     * @returns {number[]} Array of neighbor cell indices
     */
    _getNeighborIndices(cell) {
        const count = this.cellNeighborCount[cell];
        const neighbors = [];
        for (let i = 0; i < count; i++) {
            const position = cell * this.maxNeighbors + i;
            neighbors.push(this.cellNeighbors[position]);
        }
        return neighbors;
    }
    
    // ========================================================================
    // CLIMATE CALCULATIONS (Your existing formulas)
    // ========================================================================
    
    /**
     * Calculate temperature for all cells using planet.c algorithm
     * Preserves your existing temperature formula
     */
    calculateTemperature() {
        const seaLevel = this.config.seaLevel;
        
        // Find height range for normalization
        let minHeight = Infinity, maxHeight = -Infinity;
        for (let cell = 0; cell < this.cellCount; cell++) {
            const h = this.cellElevation[cell];
            if (h < minHeight) minHeight = h;
            if (h > maxHeight) maxHeight = h;
        }
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            // planet.c: y ranges from 1 (north pole) to -1 (south pole)
            const y = 1 - 2 * (row / (this.rows - 1 || 1));
            
            // planet.c: sun = sqrt(1.0 - y*y) - solar intensity based on latitude
            const sun = Math.sqrt(1.0 - y * y);
            
            // Normalize altitude to planet.c scale (roughly -0.1 to 0.1)
            let alt;
            if (isWater) {
                alt = -0.1 * (seaLevel - elevation) / (seaLevel - minHeight || 1);
            } else {
                alt = 0.1 * (elevation - seaLevel) / (maxHeight - seaLevel || 1);
            }
            
            // planet.c temperature formula
            let temp;
            if (alt < 0) {
                temp = sun / 8.0 + alt * 0.3;  // Deep water is slightly colder
            } else {
                temp = sun / 8.0 - alt * 1.2;  // High land is much colder (lapse rate)
            }
            
            // Convert to approximate Celsius (planet.c scale ~0.0-0.125 → ~-30 to +35°C)
            this.temperature[cell] = temp * 280 - 5;
        }
    }
    
    /**
     * Calculate rain shadow effect based on terrain gradients
     * Preserves your existing rain shadow formula
     */
    calculateRainShadow() {
        const seaLevel = this.config.seaLevel;
        const windDir = 1; // Prevailing wind from west (negative col direction)
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const col = cell % this.cols;
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            if (isWater) {
                this.rainShadow[cell] = 0;
                continue;
            }
            
            // Look upwind for higher terrain that would cast rain shadow
            let shadow = 0;
            const lookDistance = 10;
            
            for (let d = 1; d <= lookDistance; d++) {
                const checkCol = (col - d * windDir + this.cols) % this.cols;
                const checkCell = row * this.cols + checkCol;
                const upwindElev = this.cellElevation[checkCell];
                
                if (upwindElev > elevation && upwindElev > seaLevel) {
                    const elevDiff = (upwindElev - elevation) / (this.rows * 0.1);
                    shadow -= elevDiff / d;
                } else if (elevation > upwindElev && upwindElev > seaLevel) {
                    const elevDiff = (elevation - upwindElev) / (this.rows * 0.1);
                    shadow += elevDiff / d;
                }
            }
            
            this.rainShadow[cell] = Math.max(-2, Math.min(2, shadow));
        }
    }
    
    /**
     * Calculate rainfall for all cells using planet.c algorithm
     * Preserves your existing rainfall formula
     */
    calculateRainfall() {
        const seaLevel = this.config.seaLevel;
        
        // First calculate rain shadow
        this.calculateRainShadow();
        
        // Raw rainfall calculation
        const rawRainfall = new Float32Array(this.cellCount);
        let minRain = Infinity, maxRain = -Infinity;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            // planet.c: y ranges from 1 (north pole) to -1 (south pole)
            const y = 1 - 2 * (row / (this.rows - 1 || 1));
            
            // planet.c: y2 = fabs(y) - 0.5
            // Creates subtropical dry belts around |latitude| = 0.5 (30°)
            const y2 = Math.abs(y) - 0.5;
            
            // Get temperature (normalized to planet.c scale)
            const temp = (this.temperature[cell] + 5) / 280;
            
            // planet.c rainfall formula
            let rain = temp * 0.65 + 0.1 - 0.011 / (y2 * y2 + 0.1);
            
            // Add rain shadow effect
            rain += 0.03 * this.rainShadow[cell];
            
            if (rain < 0) rain = 0;
            
            rawRainfall[cell] = rain;
            
            if (!isWater) {
                if (rain < minRain) minRain = rain;
                if (rain > maxRain) maxRain = rain;
            }
        }
        
        // Smooth with box blur
        const rainRange = maxRain - minRain || 1;
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const col = cell % this.cols;
            
            let sum = 0;
            let count = 0;
            
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const r = row + dr;
                    const c = (col + dc + this.cols) % this.cols;
                    if (r >= 0 && r < this.rows) {
                        sum += rawRainfall[r * this.cols + c];
                        count++;
                    }
                }
            }
            
            // Convert to mm/year (planet.c scale ~0-0.2 → ~0-2000 mm/year)
            this.rainfall[cell] = (sum / count) * 10000;
        }
    }
    
    /**
     * Calculate evaporation for all cells using planet.c-style physics
     * Based on Penman-Monteith simplification:
     * - Temperature drives potential evaporation (Clausius-Clapeyron: ~7% per °C)
     * - Water availability limits actual evaporation on land
     * - Wind/turbulence effects approximated by latitude (trade winds, westerlies)
     * 
     * Must be called AFTER calculateTemperature() and calculateRainfall()
     */
    calculateEvaporation() {
        const seaLevel = this.config.seaLevel;
        
        // First calculate water proximity for land cells
        this._calculateWaterProximity();
        
        // Reference values for normalization
        const T_REF = 20;           // Reference temperature (°C) for base evaporation
        const E_REF = 1500;         // Reference potential evaporation at T_REF (mm/year)
        const LAPSE_FACTOR = 0.07;  // Clausius-Clapeyron: ~7% increase per °C
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            const temp = this.temperature[cell];  // Use actual calculated temperature
            
            // ================================================================
            // Step 1: Calculate potential evaporation (Ep)
            // Based on Clausius-Clapeyron relationship
            // ================================================================
            // Ep increases exponentially with temperature
            // At T_REF (20°C): Ep = E_REF (1500 mm/year)
            // Every 1°C increase → ~7% more evaporation
            const potentialEvap = E_REF * Math.exp(LAPSE_FACTOR * (temp - T_REF));
            
            // ================================================================
            // Step 2: Wind factor based on latitude (planet.c style)
            // ================================================================
            // y ranges from 1 (north pole) to -1 (south pole)
            const y = 1 - 2 * (row / (this.rows - 1 || 1));
            const absY = Math.abs(y);
            
            // Wind patterns: stronger in mid-latitudes (westerlies) and tropics (trades)
            // Calmer near equator (doldrums) and poles
            // Peak around |y| = 0.5 (30°) and |y| = 0.7 (45°)
            let windFactor;
            if (absY < 0.15) {
                // ITCZ / Doldrums - calm
                windFactor = 0.7 + absY * 2;  // 0.7 to 1.0
            } else if (absY < 0.5) {
                // Trade wind belt - moderate to strong
                windFactor = 1.0 + (absY - 0.15) * 0.6;  // 1.0 to 1.2
            } else if (absY < 0.75) {
                // Westerlies belt - strong winds
                windFactor = 1.2 - (absY - 0.5) * 0.4;  // 1.2 to 1.1
            } else {
                // Polar regions - moderate but dry
                windFactor = 1.1 - (absY - 0.75) * 0.8;  // 1.1 to 0.9
            }
            
            // ================================================================
            // Step 3: Water availability factor
            // ================================================================
            let waterAvailability;
            if (isWater) {
                // Open water: unlimited water supply
                // Deeper water is slightly cooler, reducing evaporation
                const depthFactor = Math.min(1, (seaLevel - elevation) / 1000);
                waterAvailability = 1.0 - depthFactor * 0.1;  // 0.9 to 1.0
            } else {
                // Land: water availability depends on rainfall and proximity to water
                // Budyko-style: actual evap limited by min(potential, precipitation)
                const rainfall = this.rainfall[cell];
                const proximity = this.waterProximity[cell];
                
                // Aridity index influence: dry areas can't evaporate what they don't have
                const supplyRatio = Math.min(1, rainfall / (potentialEvap + 1));
                
                // Nearby water sources increase local humidity/availability
                const proximityBonus = proximity * 0.3;
                
                waterAvailability = Math.min(1, supplyRatio + proximityBonus);
            }
            
            // ================================================================
            // Step 4: Combine factors for actual evaporation
            // ================================================================
            let actualEvap = potentialEvap * windFactor * waterAvailability;
            
            // Clamp to reasonable range (0 to 3000 mm/year)
            actualEvap = Math.max(0, Math.min(3000, actualEvap));
            
            this.evaporation[cell] = actualEvap;
        }
    }
    
    _calculateWaterProximity() {
        const seaLevel = this.config.seaLevel;
        const searchRadius = Math.floor(this.rows / 10);
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            
            if (elevation < seaLevel) {
                this.waterProximity[cell] = 1;
                continue;
            }
            
            const row = Math.floor(cell / this.cols);
            const col = cell % this.cols;
            
            let minDistance = searchRadius;
            
            for (let r = Math.max(0, row - searchRadius); r < Math.min(this.rows, row + searchRadius); r++) {
                for (let c = Math.max(0, col - searchRadius); c < Math.min(this.cols, col + searchRadius); c++) {
                    const checkCell = r * this.cols + c;
                    if (this.cellElevation[checkCell] < seaLevel) {
                        const distance = Math.abs(row - r) + Math.abs(col - c);
                        if (distance < minDistance) {
                            minDistance = distance;
                        }
                    }
                }
            }
            
            this.waterProximity[cell] = 1 - minDistance / searchRadius;
        }
    }
    
    /**
     * Calculate biomes using Whittaker diagram (temperature × rainfall)
     * Based on planet.c by Torben Mogensen
     * 
     * The Whittaker diagram maps annual temperature and precipitation
     * to biome types. We normalize our values to match the 45×45 lookup table.
     */
    calculateBiomes() {
        const seaLevel = this.config.seaLevel;
        const biomeTypes = CellDataModel.BIOME_TYPES;
        const diagram = CellDataModel.BIOME_DIAGRAM;
        
        // Find actual temperature and rainfall ranges for normalization
        let tempMin = Infinity, tempMax = -Infinity;
        let rainMin = Infinity, rainMax = -Infinity;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.cellElevation[cell] >= seaLevel) {
                tempMin = Math.min(tempMin, this.temperature[cell]);
                tempMax = Math.max(tempMax, this.temperature[cell]);
                rainMin = Math.min(rainMin, this.rainfall[cell]);
                rainMax = Math.max(rainMax, this.rainfall[cell]);
            }
        }
        
        console.log(`Biome calculation - Temp range: ${tempMin.toFixed(1)}°C to ${tempMax.toFixed(1)}°C`);
        console.log(`Biome calculation - Rainfall range: ${rainMin.toFixed(0)} to ${rainMax.toFixed(0)} mm/yr`);
        
        // planet.c uses normalized 0-1 values scaled by 300 with offsets
        // tt = rain * 300 - 9   (0 = dry, 44 = wet)
        // rr = temp * 300 + 10  (0 = cold, 44 = hot)
        // We need to map our real values to 0-1 ranges first
        
        // Temperature: typically -40°C to +40°C → 0 to 1
        // Rainfall: typically 0 to 4000 mm/yr → 0 to 1
        const tempNormMin = -40;  // °C for norm=0
        const tempNormMax = 40;   // °C for norm=1
        const rainNormMin = 0;    // mm/yr for norm=0
        const rainNormMax = 4000; // mm/yr for norm=1
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            
            // Ocean cells get water biome
            if (elevation < seaLevel) {
                const oceanType = biomeTypes['X'];
                this.biomeIndex[cell] = oceanType.index;
                this.biomeColors[cell * 3] = oceanType.color[0];
                this.biomeColors[cell * 3 + 1] = oceanType.color[1];
                this.biomeColors[cell * 3 + 2] = oceanType.color[2];
                continue;
            }
            
            // Normalize temperature to 0-1 range
            const temp = this.temperature[cell];
            const tempNorm = Math.max(0, Math.min(1, 
                (temp - tempNormMin) / (tempNormMax - tempNormMin)
            ));
            
            // Normalize rainfall to 0-1 range
            const rain = this.rainfall[cell];
            const rainNorm = Math.max(0, Math.min(1,
                (rain - rainNormMin) / (rainNormMax - rainNormMin)
            ));
            
            // Convert to diagram indices (matching planet.c logic)
            // tt = rainfall axis (row in diagram), rr = temperature axis (column)
            const tt = Math.min(44, Math.max(0, Math.floor(rainNorm * 300 - 9)));
            const rr = Math.min(44, Math.max(0, Math.floor(tempNorm * 300 + 10)));
            
            // Look up biome character from Whittaker diagram
            const biomeChar = diagram[tt][rr];
            const biome = biomeTypes[biomeChar] || biomeTypes['G']; // Default to grassland
            
            // Override with ice if there's significant ice coverage
            let finalBiome = biome;
            if (this.glacialIceThickness[cell] > 50 || this.hasPerennialSnow[cell]) {
                finalBiome = biomeTypes['I'];
            }
            
            this.biomeIndex[cell] = finalBiome.index;
            this.biomeColors[cell * 3] = finalBiome.color[0];
            this.biomeColors[cell * 3 + 1] = finalBiome.color[1];
            this.biomeColors[cell * 3 + 2] = finalBiome.color[2];
        }
        
        // Log biome distribution
        const biomeCounts = {};
        for (const [char, info] of Object.entries(biomeTypes)) {
            biomeCounts[info.name] = 0;
        }
        for (let cell = 0; cell < this.cellCount; cell++) {
            const name = this.getBiomeName(cell);
            biomeCounts[name] = (biomeCounts[name] || 0) + 1;
        }
        console.log('Whittaker biome distribution:', biomeCounts);
    }
    
    /**
     * Get Whittaker biome name for a cell
     */
    getBiomeName(cell) {
        const biomeTypes = CellDataModel.BIOME_TYPES;
        const index = this.biomeIndex[cell];
        
        for (const [char, biome] of Object.entries(biomeTypes)) {
            if (biome.index === index) {
                return biome.name;
            }
        }
        return 'Unknown';
    }
    
    /**
     * Calculate Holdridge Life Zones
     * Based on biotemperature and precipitation with PET ratio
     * 
     * Biotemperature: Mean annual temp with values <0°C and >30°C set to 0
     * (plants are dormant outside this range)
     * 
     * PET (Potential Evapotranspiration) = Biotemperature × 58.93 mm
     * PET Ratio = PET / Annual Precipitation
     * 
     * Uses lookup table from user-provided Holdridge classification:
     * Thermal Belts: Polar, Subpolar, Boreal, Cool Temperate, Warm Temperate, Subtropical, Tropical
     * Humidity Provinces: Superhumid, Perhumid, Humid, Subhumid, Semiarid, Arid, Perarid
     */
    calculateHoldridgeLifeZones() {
        const seaLevel = this.config.seaLevel;
        const table = CellDataModel.HOLDRIDGE_TABLE;
        const colors = CellDataModel.HOLDRIDGE_COLORS;
        
        console.log('Calculating Holdridge Life Zones...');
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            
            // Ocean cells
            if (elevation < seaLevel) {
                const oceanColor = colors['Ocean'];
                this.holdridgeIndex[cell] = 255; // Special ocean index
                this.holdridgeColors[cell * 3] = oceanColor[0];
                this.holdridgeColors[cell * 3 + 1] = oceanColor[1];
                this.holdridgeColors[cell * 3 + 2] = oceanColor[2];
                this.biotemperature[cell] = 0;
                this.petRatio[cell] = 0;
                continue;
            }
            
            // Calculate biotemperature
            // Mean annual temp with values <0°C and >30°C treated as 0
            // (approximation: we don't have monthly data, so use annual mean adjusted)
            const meanTemp = this.temperature[cell];
            let bioTemp;
            
            if (meanTemp <= 0) {
                // Cold: biotemperature approaches 0
                bioTemp = Math.max(0, meanTemp + 5) / 5; // Gradual transition
            } else if (meanTemp >= 30) {
                // Hot: biotemperature capped near 30
                bioTemp = 30 - (meanTemp - 30) * 0.5; // Gradual reduction above 30
                bioTemp = Math.max(24, bioTemp);
            } else {
                // Normal range: biotemperature ≈ mean annual temperature
                bioTemp = meanTemp;
            }
            
            this.biotemperature[cell] = bioTemp;
            
            // Calculate PET (Potential Evapotranspiration)
            // Holdridge formula: PET = biotemperature × 58.93 (mm)
            const pet = bioTemp * 58.93;
            
            // Get annual precipitation
            const precipitation = Math.max(1, this.rainfall[cell]); // Avoid division by zero
            
            // Calculate PET ratio
            const petRatio = pet / precipitation;
            this.petRatio[cell] = petRatio;
            
            // Determine thermal belt from biotemperature
            // 0=Polar, 1=Subpolar, 2=Boreal, 3=Cool Temperate, 4=Warm Temperate, 5=Subtropical, 6=Tropical
            let thermalBelt;
            if (bioTemp < 1.5) {
                thermalBelt = 0; // Polar (<1.5°C)
            } else if (bioTemp < 3) {
                thermalBelt = 1; // Subpolar (1.5-3°C)
            } else if (bioTemp < 6) {
                thermalBelt = 2; // Boreal (3-6°C)
            } else if (bioTemp < 12) {
                thermalBelt = 3; // Cool Temperate (6-12°C)
            } else if (bioTemp < 18) {
                thermalBelt = 4; // Warm Temperate (12-18°C)
            } else if (bioTemp < 24) {
                thermalBelt = 5; // Subtropical (18-24°C)
            } else {
                thermalBelt = 6; // Tropical (>24°C)
            }
            
            // Determine humidity province from PET ratio
            // 0=Superhumid, 1=Perhumid, 2=Humid, 3=Subhumid, 4=Semiarid, 5=Arid, 6=Perarid
            let humidityProvince;
            if (petRatio < 0.25) {
                humidityProvince = 0; // Superhumid
            } else if (petRatio < 0.5) {
                humidityProvince = 1; // Perhumid
            } else if (petRatio < 1) {
                humidityProvince = 2; // Humid
            } else if (petRatio < 2) {
                humidityProvince = 3; // Subhumid
            } else if (petRatio < 4) {
                humidityProvince = 4; // Semiarid
            } else if (petRatio < 8) {
                humidityProvince = 5; // Arid
            } else {
                humidityProvince = 6; // Perarid
            }
            
            // Look up zone name from table
            let zoneName = table[thermalBelt][humidityProvince];
            
            // Override with polar desert if significant ice coverage
            if (this.glacialIceThickness[cell] > 50 || this.hasPerennialSnow[cell]) {
                zoneName = 'Polar Desert';
            }
            
            // Store index as encoded thermal belt * 7 + humidity province
            this.holdridgeIndex[cell] = thermalBelt * 7 + humidityProvince;
            
            // Get color for this zone
            const color = colors[zoneName] || colors['Polar Desert'];
            this.holdridgeColors[cell * 3] = color[0];
            this.holdridgeColors[cell * 3 + 1] = color[1];
            this.holdridgeColors[cell * 3 + 2] = color[2];
        }
        
        // Log zone distribution
        const zoneCounts = {};
        for (let cell = 0; cell < this.cellCount; cell++) {
            const zoneName = this.getHoldridgeZoneName(cell);
            zoneCounts[zoneName] = (zoneCounts[zoneName] || 0) + 1;
        }
        console.log('Holdridge Life Zone distribution:', zoneCounts);
    }
    
    /**
     * Get Holdridge Life Zone name for a cell
     */
    getHoldridgeZoneName(cell) {
        const index = this.holdridgeIndex[cell];
        
        // Ocean
        if (index === 255) {
            return 'Ocean';
        }
        
        // Decode thermal belt and humidity province
        const thermalBelt = Math.floor(index / 7);
        const humidityProvince = index % 7;
        
        const table = CellDataModel.HOLDRIDGE_TABLE;
        if (thermalBelt >= 0 && thermalBelt < table.length &&
            humidityProvince >= 0 && humidityProvince < table[thermalBelt].length) {
            return table[thermalBelt][humidityProvince];
        }
        
        return 'Unknown';
    }
    
    /**
     * Calculate snowfall and perennial snow coverage using mass balance model
     * Based on: Perennial snow exists where annual snowfall accumulation >= ablation
     * 
     * Constants (tunable):
     * - T_snow: -2°C (below this, mostly snow)
     * - T_rain: +2°C (above this, mostly rain)
     * - k_m: 4 mm/(°C·day) degree-day melt factor
     * - k_s: 0.35 sublimation scaling factor
     * - α: 1.5 fast-rule threshold for maritime glaciers
     */
    calculateSnowfall() {
        const seaLevel = this.config.seaLevel;
        
        // ================================================================
        // Configurable constants (defaults from the formula)
        // ================================================================
        const T_SNOW = -2;       // °C - below this, mostly snow
        const T_RAIN = 2;        // °C - above this, mostly rain
        const K_MELT = 4;        // mm/(°C·day) - degree-day melt factor for snow
        const K_SUBLIMATION = 0.35;  // Sublimation scaling factor
        const ALPHA = 1.5;       // Fast-rule threshold for maritime glaciers
        const LAPSE_RATE = 6.5;  // °C per 1000m elevation
        
        // Seasonal temperature variation by latitude
        // Equator ~0°C variation, poles ~30°C variation
        const getSeasonalAmplitude = (latFactor) => {
            return 5 + latFactor * 25;  // 5°C at equator, 30°C at poles
        };
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            // Get mean annual temperature
            const meanTemp = this.temperature[cell];
            
            // Latitude factor: 0 at equator, 1 at poles
            const latFactor = Math.abs(row / this.rows - 0.5) * 2;
            
            // ============================================================
            // Step 1: Estimate warmest month temperature (T_max)
            // ============================================================
            // Since we don't have seasonal data, estimate from mean + latitude
            const seasonalAmplitude = getSeasonalAmplitude(latFactor);
            const warmestMonthTemp = meanTemp + seasonalAmplitude / 2;
            this.warmestMonthTemp[cell] = warmestMonthTemp;
            
            // ============================================================
            // Step 2: Calculate snow fraction (f_snow)
            // ============================================================
            // Smooth transition: clamp((T_rain - T_mean) / (T_rain - T_snow), 0, 1)
            let snowFraction;
            if (meanTemp <= T_SNOW) {
                snowFraction = 1.0;
            } else if (meanTemp >= T_RAIN) {
                snowFraction = 0.0;
            } else {
                snowFraction = (T_RAIN - meanTemp) / (T_RAIN - T_SNOW);
            }
            this.snowFraction[cell] = snowFraction;
            
            // ============================================================
            // Step 3: Calculate annual snowfall accumulation (A)
            // ============================================================
            // A = P × f_snow (where P is total precipitation)
            const precipitation = this.rainfall[cell];  // mm/year (already includes all precip)
            const snowAccumulation = precipitation * snowFraction;
            this.snowAccumulation[cell] = snowAccumulation;
            
            // ============================================================
            // Step 4: Calculate ablation (melt + sublimation)
            // ============================================================
            
            // 4a: Melt from Positive Degree Days (PDD)
            // Approximate PDD from warmest month temp
            // crude: PDD ≈ max(0, T_max) × 90 (warm season ~3 months)
            const pdd = Math.max(0, warmestMonthTemp) * 90;
            const melt = K_MELT * pdd;  // mm water equivalent
            this.snowMelt[cell] = melt;
            
            // 4b: Sublimation (dryness-driven)
            // S = k_s × E (evaporation as proxy for sublimation capacity)
            const sublimation = K_SUBLIMATION * this.evaporation[cell];
            this.snowSublimation[cell] = sublimation;
            
            // Total ablation: B = M + S
            const ablation = melt + sublimation;
            this.snowAblation[cell] = ablation;
            
            // ============================================================
            // Step 5: Calculate mass balance
            // ============================================================
            const massBalance = snowAccumulation - ablation;
            this.snowMassBalance[cell] = massBalance;
            
            // ============================================================
            // Step 6: Determine perennial snow coverage
            // ============================================================
            // Method 1 (mass balance): Perennial snow if A - B >= 0
            // Method 2 (fast rule): Perennial snow if:
            //   (a) T_max <= 0 (never melts), OR
            //   (b) T_max <= 2 AND P×f_snow >= α×E (maritime glaciers)
            
            let hasPerennialSnow = false;
            
            if (!isWater) {
                // Fast rule check first (more lenient)
                const neverMelts = warmestMonthTemp <= 0;
                const maritimeGlacier = warmestMonthTemp <= 2 && 
                    snowAccumulation >= ALPHA * this.evaporation[cell];
                
                // Mass balance check
                const positiveBalance = massBalance >= 0;
                
                // Either condition grants perennial snow
                hasPerennialSnow = neverMelts || maritimeGlacier || positiveBalance;
            }
            
            this.hasPerennialSnow[cell] = hasPerennialSnow ? 1 : 0;
        }
    }
    
    /**
     * Calculate all climate data
     */
    calculateClimate() {
        this.calculateTemperature();
        this.calculateRainfall();
        this.calculateEvaporation();
        this.calculateSnowfall();  // Add snowfall after other climate data
        this.dirty.climate = false;
    }
    
    // ========================================================================
    // ICE CAP / GLACIER MODEL (Mass Balance Driven)
    // ========================================================================
    
    /**
     * Ice cap model configuration constants
     */
    static ICE_CAP_CONFIG = {
        // Temperature thresholds (°C)
        T_SNOW: -2,              // Below this, all precip is snow
        T_RAIN: 2,               // Above this, all precip is rain
        
        // Ablation parameters
        K_MELT: 4,               // mm/(°C·day) degree-day melt factor
        D_WARM: 90,              // days in warm season
        K_SUBLIMATION: 0.35,     // Sublimation scaling factor
        
        // Ice cap classification thresholds
        A_CAP: 100,              // Minimum area for ice cap (km²)
        R_CAP: 500,              // Maximum relief for ice cap (meters)
        H_CAP: 150,              // Minimum thickness for ice cap (meters)
        B_CAP: 200,              // Minimum sustained balance for proxy (mm/yr)
        N_YEARS: 100,            // Consecutive years needed for ice cap proxy
        
        // Relief analysis window (cells radius)
        RELIEF_WINDOW: 10,       // ~20km radius at typical resolution
        
        // Snow-to-ice compaction
        SNOW_TO_ICE_RATIO: 0.4,  // 1m snow ≈ 0.4m ice (firn compaction)
        MAX_SNOW_DEPTH: 20,      // Max seasonal snow before compacting (meters)
        
        // Density for thickness calculations
        ICE_DENSITY: 917,        // kg/m³
        WATER_DENSITY: 1000,     // kg/m³
        
        // Equilibrium constraints (realistic ice sheet limits)
        MAX_ICE_THICKNESS: 4000, // Maximum ice thickness (meters) - Antarctic max ~4800m
        ICE_FLOW_FACTOR: 0.001,  // Ice flow/spreading reduces accumulation at edges
        EQUILIBRIUM_TIME: 50000  // Years to reach near-equilibrium
    };
    
    /**
     * Biome types based on Whittaker diagram (planet.c style)
     * Keys are single character codes used in the lookup table
     */
    static BIOME_TYPES = {
        'I': { index: 0,  name: 'Ice/Polar Desert',     color: [255, 255, 255] },
        'T': { index: 1,  name: 'Tundra',               color: [210, 210, 210] },
        'G': { index: 2,  name: 'Grassland',            color: [250, 215, 165] },
        'B': { index: 3,  name: 'Boreal Forest',        color: [105, 155, 120] },
        'D': { index: 4,  name: 'Desert',               color: [220, 195, 175] },
        'S': { index: 5,  name: 'Steppe/Savanna',       color: [225, 155, 100] },
        'F': { index: 6,  name: 'Temperate Forest',     color: [155, 215, 170] },
        'R': { index: 7,  name: 'Temperate Rainforest', color: [170, 195, 200] },
        'W': { index: 8,  name: 'Woodland/Shrubland',   color: [185, 150, 160] },
        'E': { index: 9,  name: 'Tropical Forest',      color: [130, 190, 25]  },
        'O': { index: 10, name: 'Tropical Rainforest',  color: [110, 160, 170] },
        'X': { index: 11, name: 'Ocean',                color: [65, 105, 170]  }  // Water
    };
    
    /**
     * Whittaker biome diagram - 45x45 lookup table
     * Rows = rainfall (0=dry to 44=wet), Columns = temperature (0=cold to 44=hot)
     * From planet.c by Torben Mogensen
     */
    static BIOME_DIAGRAM = [
        "IIITTTTTGGGGGGGGDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        "IIITTTTTGGGGGGGGDDDDGGDSDDSDDDDDDDDDDDDDDDDDD",
        "IITTTTTTTTTBGGGGGGGGGGGSSSSSSDDDDDDDDDDDDDDDD",
        "IITTTTTTTTBBBBBBGGGGGGGSSSSSSSSSWWWWWWWDDDDDD",
        "IITTTTTTTTBBBBBBGGGGGGGSSSSSSSSSSWWWWWWWWWWDD",
        "IIITTTTTTTBBBBBBFGGGGGGSSSSSSSSSSSWWWWWWWWWWW",
        "IIIITTTTTTBBBBBBFFGGGGGSSSSSSSSSSSWWWWWWWWWWW",
        "IIIIITTTTTBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWWW",
        "IIIIITTTTTBBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWW",
        "IIIIIITTTTBBBBBBBFFFFFFGGGSSSSSSSSWWWWWWWWWWW",
        "IIIIIIITTTBBBBBBBFFFFFFFFGGGSSSSSSWWWWWWWWWWW",
        "IIIIIIIITTBBBBBBBFFFFFFFFFFGGSSSSSWWWWWWWWWWW",
        "IIIIIIIIITBBBBBBBFFFFFFFFFFFFFSSSSWWWWWWWWWWW",
        "IIIIIIIIIITBBBBBBFFFFFFFFFFFFFFFSSEEEWWWWWWWW",
        "IIIIIIIIIITBBBBBBFFFFFFFFFFFFFFFFFFEEEEEEWWWW",
        "IIIIIIIIIIIBBBBBBFFFFFFFFFFFFFFFFFFEEEEEEEEWW",
        "IIIIIIIIIIIBBBBBBRFFFFFFFFFFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIBBBBBBRFFFFFFFFFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIBBBBBRRRFFFFFFFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIIIBBBRRRRRFFFFFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIIIIIBRRRRRRRFFFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIIIIIRRRRRRRRRRFFFFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIIIIIIRRRRRRRRRRRRFFFFFEEEEEEEEEE",
        "IIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRFRREEEEEEEEEE",
        "IIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRREEEEEEEE",
        "IIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRROOEEEEEE",
        "IIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRROOOOOEEEE",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRROOOOOOEEE",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRROOOOOOOEE",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRROOOOOOOEE",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRROOOOOOOOE",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRROOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRROOOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIROOOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIROOOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO",
        "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO"
    ];
    
    /**
     * Holdridge Life Zone System
     * Based on biotemperature (mean annual temp with <0°C and >30°C clamped to 0)
     * and annual precipitation on logarithmic scales.
     * 
     * Latitudinal belts (biotemperature ranges):
     *   Polar: 0-1.5°C, Subpolar: 1.5-3°C, Boreal: 3-6°C, 
     *   Cool Temperate: 6-12°C, Warm Temperate: 12-18°C,
     *   Subtropical: 18-24°C, Tropical: >24°C
     * 
     * Thermal Belts (Biotemperature ranges):
     *   Polar: <1.5°C, Subpolar: 1.5-3°C, Boreal: 3-6°C, Cool Temperate: 6-12°C,
     *   Warm Temperate: 12-18°C, Subtropical: 18-24°C, Tropical: >24°C
     * 
     * Humidity Provinces (PET ratio = PET/Precipitation):
     *   Superhumid: <0.25, Perhumid: 0.25-0.5, Humid: 0.5-1, Subhumid: 1-2,
     *   Semiarid: 2-4, Arid: 4-8, Perarid: ≥8
     */
    
    // Holdridge Life Zone lookup table [thermal belt][humidity province]
    // Thermal belts: 0=Polar, 1=Subpolar, 2=Boreal, 3=Cool Temp, 4=Warm Temp, 5=Subtropical, 6=Tropical
    // Humidity: 0=Superhumid, 1=Perhumid, 2=Humid, 3=Subhumid, 4=Semiarid, 5=Arid, 6=Perarid
    static HOLDRIDGE_TABLE = [
        // Polar (<1.5°C) - all humidity provinces = Polar Desert
        ['Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert'],
        // Subpolar (1.5-3°C)
        ['Subpolar Wet Tundra', 'Subpolar Moist Tundra', 'Subpolar Tundra', 'Subpolar Dry Tundra', 'Subpolar Steppe', 'Subpolar Desert', 'Subpolar Desert'],
        // Boreal (3-6°C)
        ['Boreal Rain Forest', 'Boreal Wet Forest', 'Boreal Moist Forest', 'Boreal Dry Forest', 'Boreal Steppe', 'Boreal Desert', 'Boreal Desert'],
        // Cool Temperate (6-12°C)
        ['Cool Temperate Rain Forest', 'Cool Temperate Wet Forest', 'Cool Temperate Moist Forest', 'Cool Temperate Dry Forest', 'Cool Temperate Steppe', 'Cool Temperate Desert', 'Cool Temperate Desert'],
        // Warm Temperate (12-18°C)
        ['Warm Temperate Rain Forest', 'Warm Temperate Wet Forest', 'Warm Temperate Moist Forest', 'Warm Temperate Dry Forest', 'Warm Temperate Steppe', 'Warm Temperate Desert', 'Warm Temperate Desert'],
        // Subtropical (18-24°C)
        ['Subtropical Rain Forest', 'Subtropical Wet Forest', 'Subtropical Moist Forest', 'Subtropical Dry Forest', 'Subtropical Thorn Woodland', 'Subtropical Desert', 'Subtropical Desert'],
        // Tropical (>24°C)
        ['Tropical Rain Forest', 'Tropical Wet Forest', 'Tropical Moist Forest', 'Tropical Dry Forest', 'Tropical Thorn Woodland', 'Tropical Desert', 'Tropical Desert']
    ];
    
    // Color palette for each unique zone name
    static HOLDRIDGE_COLORS = {
        // Tropical
        'Tropical Rain Forest':            [0, 102, 51],
        'Tropical Wet Forest':             [0, 128, 64],
        'Tropical Moist Forest':           [34, 153, 84],
        'Tropical Dry Forest':             [102, 170, 85],
        'Tropical Thorn Woodland':         [170, 170, 85],
        'Tropical Desert':                 [230, 220, 170],
        // Subtropical
        'Subtropical Rain Forest':         [0, 110, 70],
        'Subtropical Wet Forest':          [34, 139, 87],
        'Subtropical Moist Forest':        [85, 170, 110],
        'Subtropical Dry Forest':          [153, 187, 102],
        'Subtropical Thorn Woodland':      [190, 180, 120],
        'Subtropical Desert':              [235, 225, 180],
        // Warm Temperate
        'Warm Temperate Rain Forest':      [34, 102, 68],
        'Warm Temperate Wet Forest':       [60, 130, 90],
        'Warm Temperate Moist Forest':     [102, 160, 120],
        'Warm Temperate Dry Forest':       [170, 190, 130],
        'Warm Temperate Steppe':           [200, 200, 150],
        'Warm Temperate Desert':           [235, 230, 190],
        // Cool Temperate
        'Cool Temperate Rain Forest':      [40, 90, 80],
        'Cool Temperate Wet Forest':       [70, 120, 110],
        'Cool Temperate Moist Forest':     [110, 150, 140],
        'Cool Temperate Dry Forest':       [170, 190, 170],
        'Cool Temperate Steppe':           [210, 210, 190],
        'Cool Temperate Desert':           [235, 235, 215],
        // Boreal
        'Boreal Rain Forest':              [45, 80, 90],
        'Boreal Wet Forest':               [70, 110, 130],
        'Boreal Moist Forest':             [110, 140, 160],
        'Boreal Dry Forest':               [160, 180, 190],
        'Boreal Steppe':                   [200, 210, 210],
        'Boreal Desert':                   [230, 235, 235],
        // Subpolar
        'Subpolar Wet Tundra':             [160, 190, 200],
        'Subpolar Moist Tundra':           [190, 210, 220],
        'Subpolar Tundra':                 [210, 225, 235],
        'Subpolar Dry Tundra':             [225, 235, 240],
        'Subpolar Steppe':                 [230, 240, 245],
        'Subpolar Desert':                 [240, 245, 248],
        // Polar
        'Polar Desert':                    [245, 245, 245],
        // Ocean
        'Ocean':                           [65, 105, 170]
    };
    
    /**
     * Main ice coverage calculation using mass balance model
     * Call this after calculateSnowfall() to build ice caps over time
     * 
     * @param {number} yearsElapsed - Simulation time step in years
     */
    calculateIceCoverage(yearsElapsed = 1000) {
        const config = CellDataModel.ICE_CAP_CONFIG;
        const seaLevel = this.config.seaLevel;
        
        console.log(`Calculating ice coverage for ${yearsElapsed} years...`);
        
        // Step 1: Calculate local relief for each cell
        this._calculateLocalRelief(config.RELIEF_WINDOW);
        
        // Step 2: Update ice/snow thickness based on mass balance
        this._updateIceThickness(yearsElapsed, config);
        
        // Step 3: Identify contiguous ice patches
        this._identifyIcePatches();
        
        // Step 4: Classify ice caps vs glaciers
        this._classifyIceBodies(config);
        
        console.log('Ice coverage calculation complete');
    }
    
    /**
     * Calculate local relief (elevation range) in a window around each cell
     * Ice caps prefer low-relief plateaus
     */
    _calculateLocalRelief(windowRadius) {
        const seaLevel = this.config.seaLevel;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = this.getRow(cell);
            const col = this.getCol(cell);
            const centerElev = this.cellElevation[cell];
            
            // Skip water cells
            if (centerElev < seaLevel) {
                this.localRelief[cell] = 0;
                continue;
            }
            
            let minElev = centerElev;
            let maxElev = centerElev;
            
            // Search in window
            for (let dr = -windowRadius; dr <= windowRadius; dr++) {
                for (let dc = -windowRadius; dc <= windowRadius; dc++) {
                    const r = row + dr;
                    const c = (col + dc + this.cols) % this.cols; // Wrap horizontally
                    
                    if (r >= 0 && r < this.rows) {
                        const checkCell = r * this.cols + c;
                        const elev = this.cellElevation[checkCell];
                        
                        // Only consider land cells for relief
                        if (elev >= seaLevel) {
                            if (elev < minElev) minElev = elev;
                            if (elev > maxElev) maxElev = elev;
                        }
                    }
                }
            }
            
            this.localRelief[cell] = maxElev - minElev;
        }
    }
    
    /**
     * Update ice and snow thickness based on mass balance over time
     * Uses equilibrium model: ice thickness approaches a steady-state value
     * determined by mass balance, not by cumulative accumulation.
     * 
     * Real ice sheets reach equilibrium where accumulation = ablation + ice flow.
     * Equilibrium thickness scales roughly with sqrt(accumulation rate).
     * We model this by calculating equilibrium thickness and interpolating toward it.
     */
    _updateIceThickness(yearsElapsed, config) {
        const seaLevel = this.config.seaLevel;
        // Time constant for approaching equilibrium (years)
        // Larger = slower approach to equilibrium
        const TAU = config.EQUILIBRIUM_TIME || 50000;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            if (isWater) {
                // Ocean cells: may have sea ice but not ice caps
                this.glacialIceThickness[cell] = 0;
                this.snowDepth[cell] = 0;
                this.cumulativeMassBalance[cell] = 0;
                this.yearsPositiveBalance[cell] = 0;
                continue;
            }
            
            // Get annual mass balance (mm water equivalent per year)
            const annualBalance = this.snowMassBalance[cell];
            
            // Track cumulative balance (for stats/classification)
            this.cumulativeMassBalance[cell] += annualBalance * yearsElapsed;
            
            // Track consecutive years with positive balance
            if (annualBalance > 0) {
                this.yearsPositiveBalance[cell] = Math.min(
                    this.yearsPositiveBalance[cell] + yearsElapsed,
                    65535 // Uint16 max
                );
            } else {
                this.yearsPositiveBalance[cell] = 0;
            }
            
            // Current total ice thickness
            const currentIce = this.glacialIceThickness[cell] + 
                              this.snowDepth[cell] * config.SNOW_TO_ICE_RATIO;
            
            if (annualBalance > 0) {
                // ACCUMULATION zone - calculate equilibrium thickness
                // Ice sheet thickness scales as sqrt(accumulation) in simple models
                // h_eq = k * sqrt(balance) where k is tuned for realistic values
                // With k=30: 100mm/yr → 300m, 500mm/yr → 670m, 2000mm/yr → 1340m
                // Higher elevations and colder temps can support thicker ice
                const tempFactor = Math.max(0.5, 1 - this.temperature[cell] / 20);
                const k = 30 * tempFactor; // Scale factor for equilibrium thickness
                
                const equilibriumThickness = Math.min(
                    config.MAX_ICE_THICKNESS,
                    k * Math.sqrt(annualBalance)
                );
                
                // Approach equilibrium exponentially: h(t) = h_eq * (1 - e^(-t/τ))
                // For numerical stability with large yearsElapsed:
                const approachFactor = 1 - Math.exp(-yearsElapsed / TAU);
                
                // New thickness interpolates from current toward equilibrium
                const newIce = currentIce + (equilibriumThickness - currentIce) * approachFactor;
                
                // Split between glacial ice and snow (most as ice, some as surface snow)
                this.glacialIceThickness[cell] = Math.max(0, newIce - config.MAX_SNOW_DEPTH);
                this.snowDepth[cell] = Math.min(newIce, config.MAX_SNOW_DEPTH);
                
            } else {
                // ABLATION zone - melt based on negative balance
                // Convert ablation to meters per simulation period
                const meltAmount = -annualBalance * yearsElapsed * 
                    (config.WATER_DENSITY / config.ICE_DENSITY) / 1000;
                let meltRemaining = meltAmount;
                
                // Melt snow first
                if (this.snowDepth[cell] > 0) {
                    const snowMelt = Math.min(this.snowDepth[cell], meltRemaining);
                    this.snowDepth[cell] -= snowMelt;
                    meltRemaining -= snowMelt;
                }
                
                // Then melt ice
                if (meltRemaining > 0 && this.glacialIceThickness[cell] > 0) {
                    this.glacialIceThickness[cell] = Math.max(
                        0,
                        this.glacialIceThickness[cell] - meltRemaining
                    );
                }
            }
            
            // Set perennial snow flag
            this.hasPerennialSnow[cell] = (
                this.glacialIceThickness[cell] > 0 || 
                this.snowDepth[cell] > 1
            ) ? 1 : 0;
        }
    }
    
    /**
     * Identify contiguous patches of ice/snow using flood fill
     * Returns array of patch info: {id, cells, area}
     */
    _identifyIcePatches() {
        // Reset patch IDs
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.icePatchId[cell] = -1;
        }
        
        let patchId = 0;
        const patches = [];
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            // Skip if already assigned or no ice/snow
            if (this.icePatchId[cell] >= 0) continue;
            if (this.hasPerennialSnow[cell] === 0) continue;
            
            // Flood fill from this cell
            const patchCells = this._floodFillIcePatch(cell, patchId);
            
            if (patchCells.length > 0) {
                patches.push({
                    id: patchId,
                    cells: patchCells,
                    cellCount: patchCells.length
                });
                patchId++;
            }
        }
        
        // Store patches for later use
        this._icePatches = patches;
        return patches;
    }
    
    /**
     * Flood fill to find all cells in a contiguous ice patch
     */
    _floodFillIcePatch(startCell, patchId) {
        const cells = [];
        const queue = [startCell];
        
        while (queue.length > 0) {
            const cell = queue.shift();
            
            // Skip if already visited or no ice
            if (this.icePatchId[cell] >= 0) continue;
            if (this.hasPerennialSnow[cell] === 0) continue;
            
            // Mark as part of this patch
            this.icePatchId[cell] = patchId;
            cells.push(cell);
            
            // Add neighbors to queue
            const neighbors = this._getNeighborIndices(cell);
            for (const neighbor of neighbors) {
                if (this.icePatchId[neighbor] < 0 && 
                    this.hasPerennialSnow[neighbor] === 1) {
                    queue.push(neighbor);
                }
            }
        }
        
        return cells;
    }
    
    /**
     * Classify each ice body as ice cap or glacier
     * Ice cap criteria:
     * 1. Large area (A >= A_cap)
     * 2. Low relief (R <= R_cap)
     * 3. Thick ice (H >= H_cap)
     */
    _classifyIceBodies(config) {
        // Estimate cell area in km² (assuming ~1km grid cells, adjust as needed)
        const cellAreaKm2 = (this.config.cellSizeKm || 10) ** 2;
        
        // Reset classification
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.isIceCap[cell] = 0;
            this.isGlacier[cell] = 0;
        }
        
        if (!this._icePatches) return;
        
        for (const patch of this._icePatches) {
            // Calculate patch metrics
            const areaKm2 = patch.cellCount * cellAreaKm2;
            
            // Calculate average relief and thickness for patch
            let totalRelief = 0;
            let totalThickness = 0;
            let maxThickness = 0;
            
            for (const cell of patch.cells) {
                totalRelief += this.localRelief[cell];
                const thickness = this.glacialIceThickness[cell] + this.snowDepth[cell];
                totalThickness += thickness;
                if (thickness > maxThickness) maxThickness = thickness;
            }
            
            const avgRelief = totalRelief / patch.cellCount;
            const avgThickness = totalThickness / patch.cellCount;
            
            // Check ice cap criteria
            const isLargeEnough = areaKm2 >= config.A_CAP;
            const isLowRelief = avgRelief <= config.R_CAP;
            const isThickEnough = maxThickness >= config.H_CAP;
            
            // Classify cells in this patch
            const isIceCap = isLargeEnough && isLowRelief && isThickEnough;
            
            for (const cell of patch.cells) {
                if (isIceCap) {
                    this.isIceCap[cell] = 1;
                    this.isGlacier[cell] = 0;
                } else if (this.glacialIceThickness[cell] > 10) {
                    // Glacier: has significant ice but doesn't meet ice cap criteria
                    this.isIceCap[cell] = 0;
                    this.isGlacier[cell] = 1;
                } else {
                    // Perennial snowfield: thin coverage, neither cap nor glacier
                    this.isIceCap[cell] = 0;
                    this.isGlacier[cell] = 0;
                }
            }
            
            // Debug log for large patches
            if (patch.cellCount > 100) {
                console.log(`Patch ${patch.id}: ${patch.cellCount} cells, ` +
                    `${areaKm2.toFixed(0)} km², relief=${avgRelief.toFixed(0)}m, ` +
                    `thickness=${avgThickness.toFixed(1)}m, ` +
                    `isIceCap=${isIceCap}`);
            }
        }
    }
    
    /**
     * Get total ice/snow stats for debugging
     */
    getIceStats() {
        let totalIceCells = 0;
        let totalIceCapCells = 0;
        let totalGlacierCells = 0;
        let totalSnowCells = 0;
        let maxIceThickness = 0;
        let maxSnowDepth = 0;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.hasPerennialSnow[cell] === 1) totalSnowCells++;
            if (this.glacialIceThickness[cell] > 0) totalIceCells++;
            if (this.isIceCap[cell] === 1) totalIceCapCells++;
            if (this.isGlacier[cell] === 1) totalGlacierCells++;
            if (this.glacialIceThickness[cell] > maxIceThickness) {
                maxIceThickness = this.glacialIceThickness[cell];
            }
            if (this.snowDepth[cell] > maxSnowDepth) {
                maxSnowDepth = this.snowDepth[cell];
            }
        }
        
        return {
            totalSnowCells,
            totalIceCells,
            totalIceCapCells,
            totalGlacierCells,
            maxIceThickness,
            maxSnowDepth,
            patchCount: this._icePatches ? this._icePatches.length : 0
        };
    }
    
    // ========================================================================
    // COASTAL/LAKE DETECTION
    // ========================================================================
    
    /**
     * Identify coastal cells and calculate lake bodies
     */
    calculateCoastalAndLakes() {
        const seaLevel = this.config.seaLevel;
        
        // Reset
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.isCoastal[cell] = 0;
            this.lakeIndex[cell] = -1;
        }
        
        // Identify coastal cells
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            // Check if any neighbor is different (land vs water)
            const count = this.cellNeighborCount[cell];
            for (let i = 0; i < count; i++) {
                const position = cell * this.maxNeighbors + i;
                const neighbor = this.cellNeighbors[position];
                const neighborWater = this.cellElevation[neighbor] < seaLevel;
                
                if (isWater !== neighborWater) {
                    this.isCoastal[cell] = 1;
                    break;
                }
            }
        }
        
        // Lake detection using flood fill
        // (For simplicity, we mark inland water bodies as lakes vs ocean)
        // A more sophisticated approach would trace connectivity to map edges
        const visited = new Uint8Array(this.cellCount);
        let currentLakeId = 0;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (visited[cell] || this.cellElevation[cell] >= seaLevel) continue;
            
            // Start flood fill from this water cell
            const stack = [cell];
            const lakeCell = [];
            let touchesEdge = false;
            
            while (stack.length > 0) {
                const c = stack.pop();
                if (visited[c]) continue;
                visited[c] = 1;
                
                if (this.cellElevation[c] >= seaLevel) continue;
                
                lakeCell.push(c);
                
                // Check if at edge
                const row = Math.floor(c / this.cols);
                if (row === 0 || row === this.rows - 1) {
                    touchesEdge = true;
                }
                
                // Add neighbors
                const count = this.cellNeighborCount[c];
                for (let i = 0; i < count; i++) {
                    const position = c * this.maxNeighbors + i;
                    const neighbor = this.cellNeighbors[position];
                    if (!visited[neighbor] && this.cellElevation[neighbor] < seaLevel) {
                        stack.push(neighbor);
                    }
                }
            }
            
            // Mark lake cells (only if not touching edge = inland lake)
            if (!touchesEdge && lakeCell.length < this.cellCount * 0.01) {
                currentLakeId++;
                for (const c of lakeCell) {
                    this.lakeIndex[c] = currentLakeId;
                }
            }
        }
    }
    
    // ========================================================================
    // ACCESSORS (Islands-style computed properties)
    // ========================================================================
    
    /**
     * Get ground elevation for a cell
     */
    getGround(cell) {
        return this.bedrockThickness[cell] + this.sedimentThickness[cell];
    }
    
    /**
     * Get surface elevation (ground + water) for a cell
     */
    getSurface(cell) {
        return this.cellElevation[cell] + this.lakeThickness[cell];
    }
    
    /**
     * Get surface relative to sea level
     */
    getSurfaceVsSeaLevel(cell) {
        return this.getSurface(cell) - this.config.seaLevel;
    }
    
    /**
     * Check if cell is underwater
     */
    isWater(cell) {
        return this.cellElevation[cell] < this.config.seaLevel;
    }
    
    /**
     * Check if cell is a lake (inland water body)
     */
    isLake(cell) {
        return this.lakeIndex[cell] > 0;
    }
    
    /**
     * Get cell status string (Land/Lake/Ocean)
     */
    getCellStatus(cell) {
        if (this.lakeThickness[cell] > this.config.lakeThreshold) {
            return 'Lake';
        } else if (this.cellElevation[cell] >= this.config.seaLevel) {
            return 'Land';
        } else {
            return 'Ocean';
        }
    }
    
    /**
     * Get row from cell index
     */
    getRow(cell) {
        return Math.floor(cell / this.cols);
    }
    
    /**
     * Get column from cell index
     */
    getCol(cell) {
        return cell % this.cols;
    }
    
    /**
     * Get cell index from row, col
     */
    getCell(row, col) {
        // Wrap column (cylindrical projection)
        col = (col + this.cols) % this.cols;
        // Clamp row
        row = Math.max(0, Math.min(this.rows - 1, row));
        return row * this.cols + col;
    }
    
    /**
     * Get cell info for tooltip/debug (Islands-style)
     * 
     * Layer model (from bottom to top):
     * - bedrockThickness: Elevation of bedrock surface from datum (meters)
     * - sedimentThickness: Thickness of sediment layer on bedrock (meters)
     * - lakeThickness: Depth of water above ground (lakes only, meters)
     * - glacialIceThickness: Thickness of glacial ice (meters)
     * - snowDepth: Depth of snow on top (meters)
     */
    getCellInfo(cell) {
        const seaLevel = this.config.seaLevel;
        
        // Base terrain
        const bedrockSurface = this.bedrockThickness[cell];    // Elevation of bedrock top
        const sedimentDepth = this.sedimentThickness[cell];    // Sediment thickness
        const groundElevation = bedrockSurface + sedimentDepth; // = cellElevation
        
        // Water layer (only for lakes, not ocean)
        const waterDepth = this.lakeThickness[cell];           // Lake water depth
        const waterSurface = groundElevation + waterDepth;     // Top of water
        
        // Ice and snow (sits on ground, not on water for glaciers)
        // For glaciers/ice caps, ice replaces any water
        const iceThickness = this.glacialIceThickness[cell];   // Glacial ice thickness
        const snowDepth = this.snowDepth[cell];                // Snow depth
        
        // Calculate surface elevations for each layer
        // Ice sits on ground (displaces water conceptually)
        const iceBaseSurface = groundElevation;                // Ice base = ground
        const iceSurface = iceBaseSurface + iceThickness;      // Top of ice
        const snowSurface = iceSurface + snowDepth;            // Top of snow
        
        // Overall surface elevation (highest point)
        const surfaceElevation = Math.max(waterSurface, snowSurface);
        
        // Determine water type
        let waterType = '';
        if (waterDepth > 0.01) {
            if (waterDepth > this.config.lakeThreshold) {
                waterType = 'Lake';
            } else if (groundElevation < seaLevel) {
                waterType = 'Ocean';
            } else {
                waterType = 'River/Wetland';
            }
        }
        
        // Determine ice type
        let iceType = '';
        if (this.isIceCap[cell] === 1) {
            iceType = 'Ice Cap';
        } else if (this.isGlacier[cell] === 1) {
            iceType = 'Glacier';
        } else if (iceThickness > 0.01) {
            iceType = 'Ice';
        }
        
        return {
            cell: cell,
            row: this.getRow(cell),
            col: this.getCol(cell),
            status: this.getCellStatus(cell),
            
            // Layer thicknesses (physical depths)
            bedrockSurface: bedrockSurface,        // Bedrock top elevation
            sedimentThickness: sedimentDepth,       // Sediment layer thickness
            waterThickness: waterDepth,             // Water depth (lakes)
            iceThickness: iceThickness,             // Ice layer thickness
            snowThickness: snowDepth,               // Snow layer thickness
            
            // Layer surface elevations (cumulative heights)
            groundElevation: groundElevation,       // Ground surface (bedrock + sediment)
            waterElevation: waterSurface,           // Water surface elevation
            iceElevation: iceSurface,               // Ice surface elevation  
            snowElevation: snowSurface,             // Snow surface elevation
            
            // Legacy aliases for backward compatibility
            bedrock: bedrockSurface,
            sediment: sedimentDepth,
            ground: groundElevation,
            water: waterDepth,
            ice: iceThickness,
            snow: snowDepth,
            bedrockElevation: bedrockSurface,       // Legacy
            sedimentElevation: groundElevation,     // Legacy (was confusing)
            
            // Type labels
            waterType: waterType,
            iceType: iceType,
            
            // Surface info
            surface: surfaceElevation,
            surfaceVsSea: surfaceElevation - seaLevel,
            seaLevel: seaLevel,
            
            // Ice/snow classification
            isIceCap: this.isIceCap[cell] === 1,
            isGlacier: this.isGlacier[cell] === 1,
            hasPerennialSnow: this.hasPerennialSnow[cell] === 1,
            icePatchId: this.icePatchId[cell],
            localRelief: this.localRelief[cell],
            // Climate data
            temperature: this.temperature[cell],
            warmestMonthTemp: this.warmestMonthTemp[cell],
            rainfall: this.rainfall[cell],
            evaporation: this.evaporation[cell],
            // Mass balance
            snowFraction: this.snowFraction[cell],
            snowAccumulation: this.snowAccumulation[cell],
            snowMelt: this.snowMelt[cell],
            snowSublimation: this.snowSublimation[cell],
            snowAblation: this.snowAblation[cell],
            snowMassBalance: this.snowMassBalance[cell],
            cumulativeMassBalance: this.cumulativeMassBalance[cell],
            yearsPositiveBalance: this.yearsPositiveBalance[cell],
            // Whittaker Biome
            biomeIndex: this.biomeIndex[cell],
            biomeName: this.getBiomeName(cell),
            // Holdridge Life Zone
            holdridgeIndex: this.holdridgeIndex[cell],
            holdridgeZoneName: this.getHoldridgeZoneName(cell),
            biotemperature: this.biotemperature[cell],
            petRatio: this.petRatio[cell],
            // Other
            isCoastal: this.isCoastal[cell] === 1,
            lakeIndex: this.lakeIndex[cell]
        };
    }
    
    // ========================================================================
    // COLOR INDEX CALCULATION (for palette-based rendering)
    // ========================================================================
    
    /**
     * Calculate color indices for all maps
     * @param {object} palettes - Object containing palette definitions
     */
    calculateColorIndices(palettes) {
        const seaLevel = this.config.seaLevel;
        
        // Find temperature range
        let tempMin = Infinity, tempMax = -Infinity;
        let rainMin = Infinity, rainMax = -Infinity;
        let evapMin = Infinity, evapMax = -Infinity;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const isWater = this.cellElevation[cell] < seaLevel;
            
            if (!isWater) {
                if (this.temperature[cell] < tempMin) tempMin = this.temperature[cell];
                if (this.temperature[cell] > tempMax) tempMax = this.temperature[cell];
                if (this.rainfall[cell] < rainMin) rainMin = this.rainfall[cell];
                if (this.rainfall[cell] > rainMax) rainMax = this.rainfall[cell];
                if (this.evaporation[cell] < evapMin) evapMin = this.evaporation[cell];
                if (this.evaporation[cell] > evapMax) evapMax = this.evaporation[cell];
            }
        }
        
        const tempRange = tempMax - tempMin || 1;
        const rainRange = rainMax - rainMin || 1;
        const evapRange = evapMax - evapMin || 1;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            const isIce = this.isIceCovered[cell] === 1;
            
            // Temperature colors
            if (palettes.temperature) {
                const pal = palettes.temperature;
                const tempNorm = Math.max(0, Math.min(1, (this.temperature[cell] - tempMin) / tempRange));
                if (isWater) {
                    this.temperatureColors[cell] = Math.floor(tempNorm * (pal.n_sea - 1)) + pal.sea_idx;
                } else {
                    this.temperatureColors[cell] = Math.floor(tempNorm * (pal.n_land - 1)) + pal.land_idx;
                }
            }
            
            // Rainfall colors
            if (palettes.rainfall) {
                const pal = palettes.rainfall;
                const rainNorm = Math.max(0, Math.min(1, (this.rainfall[cell] - rainMin) / rainRange));
                if (isWater) {
                    this.rainfallColors[cell] = Math.floor(rainNorm * (pal.n_sea - 1)) + pal.sea_idx;
                } else {
                    this.rainfallColors[cell] = Math.floor(rainNorm * (pal.n_land - 1)) + pal.land_idx;
                }
            }
            
            // Evaporation colors
            if (palettes.evaporation) {
                const pal = palettes.evaporation;
                const evapNorm = Math.max(0, Math.min(1, (this.evaporation[cell] - evapMin) / evapRange));
                if (isWater) {
                    this.evaporationColors[cell] = Math.floor(evapNorm * (pal.n_sea - 1)) + pal.sea_idx;
                } else {
                    this.evaporationColors[cell] = Math.floor(evapNorm * (pal.n_land - 1)) + pal.land_idx;
                }
            }
        }
        
        this.dirty.colors = false;
    }
    
    // ========================================================================
    // CONVERSION TO 2D ARRAYS (for compatibility with existing rendering)
    // ========================================================================
    
    /**
     * Convert a cell array to 2D grid format
     * @param {TypedArray} cellArray - Flat cell array
     * @returns {number[][]} - 2D array [row][col]
     */
    toGrid(cellArray) {
        const grid = [];
        for (let row = 0; row < this.rows; row++) {
            grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                grid[row][col] = cellArray[row * this.cols + col];
            }
        }
        return grid;
    }
    
    /**
     * Get elevation as 2D grid (for existing rendering functions)
     */
    getElevationGrid() {
        return this.toGrid(this.cellElevation);
    }
    
    /**
     * Get temperature color indices as 2D grid
     */
    getTemperatureGrid() {
        return this.toGrid(this.temperatureColors);
    }
    
    /**
     * Get rainfall color indices as 2D grid
     */
    getRainfallGrid() {
        return this.toGrid(this.rainfallColors);
    }
    
    /**
     * Get evaporation color indices as 2D grid
     */
    getEvaporationGrid() {
        return this.toGrid(this.evaporationColors);
    }
    
    // ========================================================================
    // SERIALIZATION
    // ========================================================================
    
    /**
     * Export cell data to JSON-serializable object
     */
    toJSON() {
        return {
            rows: this.rows,
            cols: this.cols,
            config: this.config,
            bedrockThickness: Array.from(this.bedrockThickness),
            sedimentThickness: Array.from(this.sedimentThickness),
            lakeThickness: Array.from(this.lakeThickness),
            iceThickness: Array.from(this.iceThickness),
            time: this.time
        };
    }
    
    /**
     * Load cell data from JSON object
     */
    fromJSON(data) {
        if (data.rows !== this.rows || data.cols !== this.cols) {
            throw new Error('Grid dimensions do not match');
        }
        
        this.config = { ...this.config, ...data.config };
        this.bedrockThickness.set(data.bedrockThickness);
        this.sedimentThickness.set(data.sedimentThickness);
        this.lakeThickness.set(data.lakeThickness);
        this.iceThickness.set(data.iceThickness);
        this.time = data.time || 0;
        
        this.updateElevation();
        this.markDirty('elevation');
    }
}

// Export to global scope
global.CellDataModel = CellDataModel;

})(typeof window !== 'undefined' ? window : global);
