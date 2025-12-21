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
        // ICE/SNOW COVERAGE
        // ====================================================================
        
        this.iceThickness = new Float32Array(this.cellCount);          // Ice/snow depth (meters)
        this.isIceCovered = new Uint8Array(this.cellCount);            // Boolean: has ice cap
        
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
        this.terrainColors = new Uint8Array(this.cellCount);           // Terrain-only (no water)
        
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
     * Calculate evaporation for all cells
     * Preserves your existing evaporation formula
     */
    calculateEvaporation() {
        const seaLevel = this.config.seaLevel;
        
        // First calculate water proximity
        this._calculateWaterProximity();
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            const isWater = elevation < seaLevel;
            
            // Temperature factor (equator = high evaporation, poles = low)
            const temperatureFactor = 1 - Math.abs(row / this.rows - 0.5) * 2;
            
            // Water factor
            let waterFactor;
            if (isWater) {
                // Shallower water evaporates more
                waterFactor = 0.8 + 0.2 * (1 - (seaLevel - elevation) / seaLevel);
            } else {
                // Land evaporation depends on water proximity
                waterFactor = this.waterProximity[cell] * 0.7;
            }
            
            // Combine factors
            let evap = temperatureFactor * 0.6 + waterFactor * 0.4;
            evap = Math.max(0, Math.min(1, evap));
            
            // Convert to mm/year equivalent
            this.evaporation[cell] = evap * 2000;
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
     * Calculate all climate data
     */
    calculateClimate() {
        this.calculateTemperature();
        this.calculateRainfall();
        this.calculateEvaporation();
        this.dirty.climate = false;
    }
    
    // ========================================================================
    // ICE COVERAGE
    // ========================================================================
    
    /**
     * Calculate ice coverage based on latitude and elevation
     */
    calculateIceCoverage() {
        const seaLevel = this.config.seaLevel;
        const pctIce = this.config.pctIce / 100;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const row = Math.floor(cell / this.cols);
            const elevation = this.cellElevation[cell];
            
            // Latitude factor: 0 at equator, 1 at poles
            const latFactor = Math.abs(row / this.rows - 0.5) * 2;
            
            // Ice threshold based on pct_ice setting
            // At equator, need very high elevation for ice
            // At poles, even sea level can have ice
            const iceThreshold = (1 - pctIce) * 0.7;
            
            // Elevation factor (higher = colder)
            let elevFactor = 0;
            if (elevation > seaLevel) {
                const maxElev = seaLevel + 2500; // Above this is definitely snowy
                elevFactor = Math.min((elevation - seaLevel) / (maxElev - seaLevel), 1);
            }
            
            // Combined ice probability
            const iceProb = latFactor * 0.7 + elevFactor * 0.3;
            
            if (iceProb > iceThreshold) {
                this.isIceCovered[cell] = 1;
                // Ice thickness based on how far above threshold
                this.iceThickness[cell] = (iceProb - iceThreshold) * 100;
            } else {
                this.isIceCovered[cell] = 0;
                this.iceThickness[cell] = 0;
            }
        }
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
     */
    getCellInfo(cell) {
        const seaLevel = this.config.seaLevel;
        const bedrock = this.bedrockThickness[cell];
        const sediment = this.sedimentThickness[cell];
        const ground = bedrock + sediment;
        const water = this.lakeThickness[cell];
        const surface = ground + water;
        const ice = this.iceThickness[cell];
        
        return {
            cell: cell,
            row: this.getRow(cell),
            col: this.getCol(cell),
            status: this.getCellStatus(cell),
            surface: surface,
            surfaceVsSea: surface - seaLevel,
            ground: ground,
            water: water,
            bedrock: bedrock,
            sediment: sediment,
            ice: ice,
            seaLevel: seaLevel,
            temperature: this.temperature[cell],
            rainfall: this.rainfall[cell],
            evaporation: this.evaporation[cell],
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
