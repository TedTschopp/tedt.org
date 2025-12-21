/**
 * Erosion Simulation Module
 * Adapted from TedTschopp/Islands repository
 * 
 * This module implements time passage and erosion mechanics including:
 * - Drainage graph computation (water flow direction)
 * - Fluvial erosion and sediment transport
 * - River network generation
 * - Coastline detection
 * - Lake filling
 * 
 * Units:
 * - Horizontal: cell coordinates (pixels on the heightmap)
 * - Vertical: elevations in arbitrary units (scaled to heightmap)
 * - Time: years (for simulation steps)
 */

'use strict';

// ============================================================================
// NOISE UTILITIES (adapted from utilities.js in Islands repo)
// ============================================================================

/**
 * Simple noise implementation for terrain generation
 * Uses a seeded random approach for deterministic noise
 */
class SimplexNoise2D {
    constructor(seed = 0) {
        this.seed = seed;
        this.p = new Uint8Array(512);
        this.perm = new Uint8Array(512);
        
        // Initialize permutation table
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        
        // Shuffle using seeded random
        let n = 256;
        let rand = this._mulberry32(seed);
        while (n > 1) {
            const k = Math.floor(rand() * n);
            n--;
            const temp = p[n];
            p[n] = p[k];
            p[k] = temp;
        }
        
        for (let i = 0; i < 256; i++) {
            this.perm[i] = this.perm[i + 256] = p[i];
        }
    }
    
    _mulberry32(seed) {
        let a = seed >>> 0;
        return function() {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    
    simplex2(x, y) {
        // Simplified 2D noise using gradient interpolation
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        
        const gi0 = this.perm[ii + this.perm[jj]] % 12;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        
        const grad3 = [
            [1,1], [-1,1], [1,-1], [-1,-1],
            [1,0], [-1,0], [0,1], [0,-1],
            [1,1], [-1,1], [1,-1], [-1,-1]
        ];
        
        let n0 = 0, n1 = 0, n2 = 0;
        
        let t0 = 0.5 - x0*x0 - y0*y0;
        if (t0 >= 0) {
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
        }
        
        let t1 = 0.5 - x1*x1 - y1*y1;
        if (t1 >= 0) {
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
        }
        
        let t2 = 0.5 - x2*x2 - y2*y2;
        if (t2 >= 0) {
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
        }
        
        return 70 * (n0 + n1 + n2);
    }
}

/**
 * SNoise wrapper class for multi-octave noise with rotation
 */
class SNoise {
    constructor(wavelength, crossWavelength = -1, angle = 0) {
        this.wavelength_t = wavelength;
        this.wavelength_s = crossWavelength === -1 ? wavelength : crossWavelength;
        this.offset_s = Math.random() * 100;
        this.offset_t = Math.random() * 100;
        this.theta = 2 * Math.PI * angle / 360;
        this.sin_theta = Math.sin(this.theta);
        this.cos_theta = Math.cos(this.theta);
        this.octaves_count = 1;
        this.wavenumber_rolloff = 2;
        this.amplitude_rolloff = 0.5;
        this.rms = 1;
        
        // Use global noise if available, otherwise create local instance
        if (typeof window.Noise !== 'undefined') {
            this._noise = window.Noise;
        } else {
            this._localNoise = new SimplexNoise2D(Math.floor(Math.random() * 10000));
        }
    }
    
    octaves(count, amplitudeRolloff = 0.5, wavenumberRolloff = 2) {
        this.octaves_count = count;
        this.wavenumber_rolloff = wavenumberRolloff;
        this.amplitude_rolloff = amplitudeRolloff;
        let square = 0;
        for (let i = 0; i < count; i++) {
            square += Math.pow(amplitudeRolloff, 2 * i);
        }
        this.rms = Math.sqrt(square);
    }
    
    get(x, y) {
        const unscaled_s = x * this.cos_theta + y * this.sin_theta;
        const unscaled_t = x * this.sin_theta - y * this.cos_theta;
        const t = unscaled_t / this.wavelength_t;
        const s = this.wavelength_s === 0 ? 0 : unscaled_s / this.wavelength_s;
        return this._getBasicNoise(s, t);
    }
    
    _getBasicNoise(s, t) {
        let wavenumber = 1;
        let amplitude = 1;
        let sum = 0;
        
        for (let i = 0; i < this.octaves_count; i++) {
            let signal;
            if (this._noise) {
                signal = this._noise.simplex2(
                    s * wavenumber + (i + 1) * this.offset_s,
                    t * wavenumber + (i + 1) * this.offset_t
                );
            } else {
                signal = this._localNoise.simplex2(
                    s * wavenumber + (i + 1) * this.offset_s,
                    t * wavenumber + (i + 1) * this.offset_t
                );
            }
            sum += signal * amplitude;
            amplitude *= this.amplitude_rolloff;
            wavenumber *= this.wavenumber_rolloff;
        }
        return sum / this.rms;
    }
}

// ============================================================================
// DATA STRUCTURES (adapted from utilities.js)
// ============================================================================

class Stack {
    constructor(n) {
        this.indices = new Uint32Array(n);
        this.pointer = -1;
    }
    
    clear() {
        this.pointer = -1;
    }
    
    is_nonempty() {
        return this.pointer > -1;
    }
    
    push(index) {
        this.pointer++;
        this.indices[this.pointer] = index;
    }
    
    pop() {
        const output = this.indices[this.pointer];
        this.pointer--;
        return output;
    }
}

class RandomQueue {
    constructor(n) {
        this.indices = new Uint32Array(n);
        this.start_pointer = 0;
        this.end_pointer = 0;
    }
    
    clear() {
        this.start_pointer = 0;
        this.end_pointer = 0;
    }
    
    is_nonempty() {
        return this.end_pointer > this.start_pointer;
    }
    
    push(index) {
        this.indices[this.end_pointer] = index;
        this.end_pointer++;
    }
    
    pop() {
        const offset = Math.floor(Math.random() * 0.1 * (this.end_pointer - this.start_pointer));
        let position = this.start_pointer + offset;
        if (position >= this.end_pointer) position = this.start_pointer;
        const output = this.indices[position];
        this.indices[position] = this.indices[this.start_pointer];
        this.start_pointer++;
        return output;
    }
}

class PriorityQueue {
    constructor(n, values) {
        this.heap = new Uint32Array(n);
        this.heap_position = new Int32Array(n);
        this.heap_position.fill(-1);
        this.size = 0;
        this.values = values;
    }
    
    clear() {
        for (let i = 0; i < this.size; i++) {
            this.heap_position[this.heap[i]] = -1;
        }
        this.size = 0;
    }
    
    is_nonempty() {
        return this.size > 0;
    }
    
    push(index) {
        if (this.heap_position[index] >= 0) return;
        this.heap[this.size] = index;
        this.heap_position[index] = this.size;
        this.size++;
        this._bubbleUp(this.size - 1);
    }
    
    pop() {
        if (this.size === 0) return -1;
        const output = this.heap[0];
        this.heap_position[output] = -1;
        this.size--;
        if (this.size > 0) {
            this.heap[0] = this.heap[this.size];
            this.heap_position[this.heap[0]] = 0;
            this._bubbleDown(0);
        }
        return output;
    }
    
    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.values[this.heap[i]] >= this.values[this.heap[parent]]) break;
            this._swap(i, parent);
            i = parent;
        }
    }
    
    _bubbleDown(i) {
        while (true) {
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            let smallest = i;
            
            if (left < this.size && this.values[this.heap[left]] < this.values[this.heap[smallest]]) {
                smallest = left;
            }
            if (right < this.size && this.values[this.heap[right]] < this.values[this.heap[smallest]]) {
                smallest = right;
            }
            
            if (smallest === i) break;
            this._swap(i, smallest);
            i = smallest;
        }
    }
    
    _swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
        this.heap_position[this.heap[i]] = i;
        this.heap_position[this.heap[j]] = j;
    }
}

// ============================================================================
// EROSION SIMULATION CLASS
// ============================================================================

class ErosionSimulation {
    /**
     * Create an erosion simulation instance
     * @param {number[][]} heightmap - 2D array of elevation values
     * @param {object} options - Configuration options
     */
    constructor(heightmap, options = {}) {
        this.rows = heightmap.length;
        this.cols = heightmap[0].length;
        this.cellCount = this.rows * this.cols;
        
        // Configuration
        this.pixelLength = options.pixelLength || 125; // meters per pixel
        this.meanSeaLevel = options.seaLevel || 0.5; // Normalized sea level
        this.seaLevel = this.meanSeaLevel;
        this.rainfall = options.rainfall || 0.3; // meters/year
        
        // (D) Dynamic sea level parameters (from Islands)
        this.enableDynamicSeaLevel = options.enableDynamicSeaLevel !== false; // Enable by default
        this.seaLevelAmplitude = options.seaLevelAmplitude || 50; // meters
        this.seaLevelPeriod = options.seaLevelPeriod || 500000; // years per cycle
        this.upliftStartTime = options.upliftStartTime || 500000; // years before uplift kicks in
        this.seaLevelStartTime = options.seaLevelStartTime || 2000000; // years before sea level changes
        
        // Erosion parameters
        this.fluvialTransportCoefficient = options.fluvialTransportCoefficient || 60;
        this.sedimentationDistance = options.sedimentationDistance || 25000;
        this.sedimentDensity = options.sedimentDensity || 2200;
        this.landscapeDiffusionCoefficient = options.landscapeDiffusionCoefficient || 2;
        this.lakeThreshold = options.lakeThreshold || 0.01;
        
        // Max neighbors for cell connectivity
        this.maxNeighbors = 8;
        
        // Initialize terrain arrays
        this._initializeArrays(heightmap);
        
        // Build cell neighbor graph
        this._buildNeighborGraph();
        
        // Initialize drainage structures
        this._initializeDrainageStructures();
        
        // Simulation state
        this.time = 0;
    }
    
    _initializeArrays(heightmap) {
        // Main terrain arrays
        this.bedrockThickness = new Float32Array(this.cellCount);
        this.sedimentThickness = new Float32Array(this.cellCount);
        this.lakeThicknessArray = new Float32Array(this.cellCount);
        this.cellElevation = new Float32Array(this.cellCount);
        this.erodibility = new Float32Array(this.cellCount);
        
        // (A) Uplift array - tectonic uplift rate in mm/year
        this.upliftArray = new Float32Array(this.cellCount);
        
        // Cell positions
        this.cellX = new Float32Array(this.cellCount);
        this.cellY = new Float32Array(this.cellCount);
        
        // Neighbor data
        this.cellNeighborCount = new Uint8Array(this.cellCount);
        this.cellNeighbors = new Int32Array(this.cellCount * this.maxNeighbors);
        this.cellNeighborDistance = new Float32Array(this.cellCount * this.maxNeighbors);
        
        // Convert heightmap to cell arrays
        let minHeight = Infinity, maxHeight = -Infinity;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const h = heightmap[row][col];
                if (h < minHeight) minHeight = h;
                if (h > maxHeight) maxHeight = h;
            }
        }
        
        // Normalize and populate
        const heightRange = maxHeight - minHeight || 1;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                const normalizedHeight = (heightmap[row][col] - minHeight) / heightRange;
                
                // Scale to reasonable elevation range (in meters)
                this.bedrockThickness[cell] = normalizedHeight * 3000 + 1000;
                this.sedimentThickness[cell] = Math.random() * 5;
                this.lakeThicknessArray[cell] = 0;
                // (B) Initialize erodibility with spatial variation
                this.erodibility[cell] = 0.5 + Math.random() * 0.5;
                
                // (A) Initialize uplift rate to zero (will be set by setupUplift)
                this.upliftArray[cell] = 0;
                
                this.cellX[cell] = col;
                this.cellY[cell] = row;
            }
        }
        
        // Calculate sea level based on percentage
        this.seaLevel = this.meanSeaLevel * 3000 + 1000;
        
        // Store as meanSeaLevel for dynamic changes
        this.meanSeaLevel = this.seaLevel;
    }
    
    /**
     * (B) Sync erodibility from external CellDataModel
     * @param {CellDataModel} cellDataModel - The cell data model to sync from
     */
    syncErodibilityFrom(cellDataModel) {
        if (!cellDataModel || !cellDataModel.erodibility) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.erodibility[cell] = cellDataModel.erodibility[cell];
        }
    }
    
    /**
     * (B) Sync erodibility to external CellDataModel
     * @param {CellDataModel} cellDataModel - The cell data model to sync to
     */
    syncErodibilityTo(cellDataModel) {
        if (!cellDataModel || !cellDataModel.erodibility) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            cellDataModel.erodibility[cell] = this.erodibility[cell];
        }
    }
    
    /**
     * (A) Sync uplift array from external CellDataModel
     * @param {CellDataModel} cellDataModel - The cell data model to sync from
     */
    syncUpliftFrom(cellDataModel) {
        if (!cellDataModel || !cellDataModel.upliftRate) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            this.upliftArray[cell] = cellDataModel.upliftRate[cell];
        }
    }
    
    /**
     * (A) Sync uplift array to external CellDataModel
     * @param {CellDataModel} cellDataModel - The cell data model to sync to
     */
    syncUpliftTo(cellDataModel) {
        if (!cellDataModel || !cellDataModel.upliftRate) return;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            cellDataModel.upliftRate[cell] = this.upliftArray[cell];
        }
    }
    
    _buildNeighborGraph() {
        // 8-connectivity neighbor offsets
        // For a spherical/cylindrical projection:
        // - Horizontal (left-right) wraps around
        // - Vertical (top-bottom) are the poles and don't wrap
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
                    // For wrapped neighbors, distance is still the same
                    const dist = Math.sqrt(dr * dr + dc * dc);
                    this.cellNeighborDistance[position] = dist;
                    
                    // Track if this is a wrapped edge for rendering
                    const isWrapped = (col + dc < 0 || col + dc >= this.cols);
                    // Store wrapped flag in high bit of neighbor (we'll use this for rendering)
                    // Actually, let's use a separate array for this
                    
                    neighborCount++;
                }
                
                this.cellNeighborCount[cell] = neighborCount;
            }
        }
        
        // Build a lookup for which neighbor connections cross the map edge (for rendering)
        this.neighborWrapped = new Uint8Array(this.cellCount * this.maxNeighbors);
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                const count = this.cellNeighborCount[cell];
                
                for (let i = 0; i < count; i++) {
                    const position = cell * this.maxNeighbors + i;
                    const neighbor = this.cellNeighbors[position];
                    const neighborCol = neighbor % this.cols;
                    
                    // If columns differ by more than 1, it's a wrapped edge
                    const colDiff = Math.abs(col - neighborCol);
                    this.neighborWrapped[position] = (colDiff > 1) ? 1 : 0;
                }
            }
        }
    }
    
    _initializeDrainageStructures() {
        // Drainage state constants
        this.UNTOUCHED = 0;
        this.LOWER_ADJACENT = 1;
        this.UPPER_ADJACENT = 2;
        this.COVERED = 3;
        
        // Cell state array
        this.cellState = new Uint8Array(this.cellCount);
        
        // Priority queues for drainage algorithm
        this.upperAdjacentCells = new PriorityQueue(this.cellCount, this.cellElevation);
        this.lowerAdjacentCells = new RandomQueue(this.cellCount);
        this.readyToDrainCells = new Stack(this.cellCount);
        
        // Drainage graph (up to 2 downstream neighbors per cell)
        this.bestNeighbors = new Int32Array(this.cellCount * 2);
        this.bestPositions = new Int32Array(this.cellCount * 2);
        
        // Per-cell drainage data
        this.inDegree = new Uint8Array(this.cellCount);
        this.lakeIndex = new Int32Array(this.cellCount);
        this.collectedWater = new Float32Array(this.cellCount);
        this.collectedSediment = new Float32Array(this.cellCount);
        this.discharge = new Float32Array(this.cellCount * this.maxNeighbors);
        this.coveredTime = new Int32Array(this.cellCount);
    }
    
    /**
     * Initialize drainage for a new simulation step
     */
    initializeDrainage() {
        this.upperAdjacentCells.clear();
        this.lowerAdjacentCells.clear();
        this.coveredCellCount = 0;
        this.nextLakeIndex = 0;
        
        for (let i = 0; i < this.cellCount; i++) {
            this.cellElevation[i] = this.bedrockThickness[i] + this.sedimentThickness[i];
            this.cellState[i] = this.UNTOUCHED;
            this.lakeThicknessArray[i] = 0;
            this.inDegree[i] = 0;
            this.collectedWater[i] = 0;
            this.collectedSediment[i] = 0;
        }
        
        for (let i = 0; i < this.cellCount * this.maxNeighbors; i++) {
            this.discharge[i] = 0;
        }
        
        for (let i = 0; i < this.cellCount * 2; i++) {
            this.bestNeighbors[i] = -1;
            this.bestPositions[i] = 0;
        }
        
        // Mark edge cells that are below sea level
        // For spherical/cylindrical projection:
        // - Left/right edges wrap around (no drain needed)
        // - Top/bottom edges are poles (mark as ocean drain if below sea level)
        for (let col = 0; col < this.cols; col++) {
            this._markEdgeCell(col); // Top row (north pole)
            this._markEdgeCell((this.rows - 1) * this.cols + col); // Bottom row (south pole)
        }
        // Note: Left and right columns are NOT marked as edges because they wrap horizontally
    }
    
    _markEdgeCell(cell) {
        if (this.cellElevation[cell] > this.seaLevel) return;
        if (this.cellState[cell] === this.UNTOUCHED) {
            this.cellState[cell] = this.LOWER_ADJACENT;
            this.lowerAdjacentCells.push(cell);
        }
    }
    
    /**
     * Build the drainage graph using priority flood algorithm
     */
    calculateDrainageGraph() {
        let coverLevel = this.seaLevel;
        let finished = false;
        
        while (!finished) {
            if (this.lowerAdjacentCells.is_nonempty()) {
                const nextCell = this.lowerAdjacentCells.pop();
                this._coverLake(nextCell, coverLevel);
                this.lakeIndex[nextCell] = this.nextLakeIndex;
            } else if (this.upperAdjacentCells.is_nonempty()) {
                const nextCell = this.upperAdjacentCells.pop();
                this.nextLakeIndex = nextCell;
                coverLevel = this.cellElevation[nextCell];
                this._coverNonLake(nextCell, coverLevel);
                this.lakeIndex[nextCell] = -1;
            } else {
                finished = true;
            }
        }
    }
    
    _coverLake(cell, coverLevel) {
        this.cellState[cell] = this.COVERED;
        this.coveredTime[cell] = this.coveredCellCount;
        this.coveredCellCount++;
        this.lakeThicknessArray[cell] = coverLevel - this.cellElevation[cell];
        
        const count = this.cellNeighborCount[cell];
        let lowestNeighbor = -1;
        let lowestElevation = Infinity;
        let lastCoveredNeighbor = -1;
        let bestCoveredTime = -1;
        
        for (let i = 0; i < count; i++) {
            const position = cell * this.maxNeighbors + i;
            const neighbor = this.cellNeighbors[position];
            
            if (this.cellState[neighbor] === this.UNTOUCHED) {
                if (this.cellElevation[neighbor] <= coverLevel) {
                    this.cellState[neighbor] = this.LOWER_ADJACENT;
                    this.lowerAdjacentCells.push(neighbor);
                } else {
                    this.cellState[neighbor] = this.UPPER_ADJACENT;
                    this.upperAdjacentCells.push(neighbor);
                }
            }
            
            if (this.cellState[neighbor] === this.COVERED) {
                if (this.cellElevation[neighbor] < lowestElevation) {
                    lowestElevation = this.cellElevation[neighbor];
                    lowestNeighbor = neighbor;
                }
                if (this.coveredTime[neighbor] > bestCoveredTime) {
                    bestCoveredTime = this.coveredTime[neighbor];
                    lastCoveredNeighbor = neighbor;
                }
            }
        }
        
        // Set downstream neighbors
        if (lowestNeighbor >= 0) {
            this.bestNeighbors[cell * 2] = lowestNeighbor;
            this.inDegree[lowestNeighbor]++;
            
            for (let i = 0; i < count; i++) {
                const position = cell * this.maxNeighbors + i;
                if (this.cellNeighbors[position] === lowestNeighbor) {
                    this.bestPositions[cell * 2] = position;
                    break;
                }
            }
        }
        
        if (lastCoveredNeighbor >= 0 && lastCoveredNeighbor !== lowestNeighbor) {
            this.bestNeighbors[cell * 2 + 1] = lastCoveredNeighbor;
            this.inDegree[lastCoveredNeighbor]++;
            
            for (let i = 0; i < count; i++) {
                const position = cell * this.maxNeighbors + i;
                if (this.cellNeighbors[position] === lastCoveredNeighbor) {
                    this.bestPositions[cell * 2 + 1] = position;
                    break;
                }
            }
        }
    }
    
    _coverNonLake(cell, coverLevel) {
        this.cellState[cell] = this.COVERED;
        this.coveredTime[cell] = this.coveredCellCount;
        this.coveredCellCount++;
        
        const count = this.cellNeighborCount[cell];
        let lowestNeighbor = -1;
        let lowestLevel = Infinity;
        let secondLowestNeighbor = -1;
        let secondLowestLevel = Infinity;
        
        for (let i = 0; i < count; i++) {
            const position = cell * this.maxNeighbors + i;
            const neighbor = this.cellNeighbors[position];
            
            if (this.cellState[neighbor] === this.UNTOUCHED) {
                if (this.cellElevation[neighbor] <= coverLevel) {
                    this.cellState[neighbor] = this.LOWER_ADJACENT;
                    this.lowerAdjacentCells.push(neighbor);
                } else {
                    this.cellState[neighbor] = this.UPPER_ADJACENT;
                    this.upperAdjacentCells.push(neighbor);
                }
            }
            
            if (this.cellState[neighbor] === this.COVERED) {
                const level = this.cellElevation[neighbor] + this.lakeThicknessArray[neighbor];
                if (level < lowestLevel) {
                    secondLowestLevel = lowestLevel;
                    secondLowestNeighbor = lowestNeighbor;
                    lowestLevel = level;
                    lowestNeighbor = neighbor;
                } else if (level < secondLowestLevel) {
                    secondLowestLevel = level;
                    secondLowestNeighbor = neighbor;
                }
            }
        }
        
        // Set downstream neighbors
        if (lowestNeighbor >= 0) {
            this.bestNeighbors[cell * 2] = lowestNeighbor;
            this.inDegree[lowestNeighbor]++;
            
            for (let i = 0; i < count; i++) {
                const position = cell * this.maxNeighbors + i;
                if (this.cellNeighbors[position] === lowestNeighbor) {
                    this.bestPositions[cell * 2] = position;
                    break;
                }
            }
        }
        
        if (secondLowestNeighbor >= 0) {
            this.bestNeighbors[cell * 2 + 1] = secondLowestNeighbor;
            this.inDegree[secondLowestNeighbor]++;
            
            for (let i = 0; i < count; i++) {
                const position = cell * this.maxNeighbors + i;
                if (this.cellNeighbors[position] === secondLowestNeighbor) {
                    this.bestPositions[cell * 2 + 1] = position;
                    break;
                }
            }
        }
    }
    
    /**
     * Run drainage simulation and apply erosion/deposition
     * @param {number} dt - Time step in years
     */
    runDrainage(dt) {
        const km3 = 1000 * 1000 * 1000;
        
        // Initialize cells with zero in-degree
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.inDegree[cell] === 0) {
                this.readyToDrainCells.push(cell);
            }
        }
        
        while (this.readyToDrainCells.is_nonempty()) {
            const cell = this.readyToDrainCells.pop();
            const bestNeighbor = this.bestNeighbors[cell * 2];
            
            if (bestNeighbor === -1) {
                // At a sink - water exits
                continue;
            }
            
            const bestPosition = this.bestPositions[cell * 2];
            let water = this.collectedWater[cell];
            let sediment = this.collectedSediment[cell];
            
            const isLake = this.lakeThicknessArray[cell] > this.lakeThreshold;
            const elevationHere = this.cellElevation[cell] - this.seaLevel;
            const rainfallHere = Math.max(0.5 + elevationHere / 2000, 0);
            const cellArea = this.pixelLength * this.pixelLength;
            water += rainfallHere * cellArea * this.rainfall;
            
            const bestNeighborLevel = this.cellElevation[bestNeighbor] + this.lakeThicknessArray[bestNeighbor];
            const bestDistance = this.cellNeighborDistance[bestPosition] * this.pixelLength;
            const levelHere = this.cellElevation[cell] + this.lakeThicknessArray[cell];
            let bestGradient = (levelHere - bestNeighborLevel) / bestDistance;
            
            if (bestGradient < 0) bestGradient = 0;
            
            const Q = water;
            const Qm = Math.pow(Q, 0.5) * 1000;
            
            const sedimentTransportCapacity = isLake ? 0 : 
                this.fluvialTransportCoefficient * Q * bestGradient * dt;
            const equilibriumSlope = sediment / (this.fluvialTransportCoefficient * Q * dt + 0.0001);
            
            let equilibriumLevel;
            if (isLake) {
                equilibriumLevel = this.cellElevation[bestNeighbor] + Math.min(equilibriumSlope, 0.5) * bestDistance;
            } else {
                equilibriumLevel = bestNeighborLevel + equilibriumSlope * bestDistance;
            }
            
            // Erosion
            if (sedimentTransportCapacity > sediment && this.cellElevation[cell] > equilibriumLevel) {
                const massToErode = Qm * bestGradient * dt * 
                    (sedimentTransportCapacity - sediment) / (sedimentTransportCapacity + 0.0001) *
                    this.erodibility[cell];
                
                const thicknessToErode = massToErode / (this.sedimentDensity * cellArea);
                const actualThickness = Math.min(
                    thicknessToErode,
                    this.cellElevation[cell] - equilibriumLevel
                );
                
                this.sedimentThickness[cell] -= actualThickness;
                if (this.sedimentThickness[cell] < 0) {
                    this.bedrockThickness[cell] += this.sedimentThickness[cell];
                    this.sedimentThickness[cell] = 0;
                }
                sediment += actualThickness * this.sedimentDensity * cellArea;
            }
            // Deposition
            else if (sedimentTransportCapacity < sediment && this.cellElevation[cell] < equilibriumLevel) {
                const massToDeposit = (sediment - sedimentTransportCapacity) *
                    bestDistance / this.sedimentationDistance;
                
                let thicknessToDeposit = massToDeposit / (this.sedimentDensity * cellArea);
                if (this.cellElevation[cell] + thicknessToDeposit > equilibriumLevel) {
                    thicknessToDeposit = equilibriumLevel - this.cellElevation[cell];
                }
                
                this.sedimentThickness[cell] += thicknessToDeposit;
                sediment -= thicknessToDeposit * this.sedimentDensity * cellArea;
            }
            
            // Update downstream cell
            this.inDegree[bestNeighbor]--;
            if (this.inDegree[bestNeighbor] === 0) {
                this.readyToDrainCells.push(bestNeighbor);
            }
            
            const secondNeighbor = this.bestNeighbors[cell * 2 + 1];
            
            if (secondNeighbor === -1 || secondNeighbor === bestNeighbor) {
                // Only one downstream neighbor
                this.discharge[bestPosition] = water;
                this.collectedWater[bestNeighbor] += water;
                this.collectedSediment[bestNeighbor] += sediment;
            } else {
                // Split flow between two neighbors
                this.inDegree[secondNeighbor]--;
                if (this.inDegree[secondNeighbor] === 0) {
                    this.readyToDrainCells.push(secondNeighbor);
                }
                
                let firstFraction = 1.0;
                let secondFraction = 0.0;
                
                if (!isLake && water >= 4 * km3) {
                    const secondPosition = this.bestPositions[cell * 2 + 1];
                    const secondNeighborLevel = this.cellElevation[secondNeighbor] + 
                        this.lakeThicknessArray[secondNeighbor];
                    const secondDistance = this.cellNeighborDistance[secondPosition] * this.pixelLength;
                    let secondGradient = (levelHere - secondNeighborLevel) / secondDistance;
                    
                    if (secondGradient > bestGradient) {
                        secondGradient = bestGradient;
                    }
                    
                    const normalizedSecond = Math.pow(secondGradient / (bestGradient + 0.0000001), 10);
                    const totalGradient = 1 + normalizedSecond;
                    firstFraction = 1 / totalGradient;
                    secondFraction = normalizedSecond / totalGradient;
                    
                    this.discharge[secondPosition] = water * secondFraction;
                }
                
                this.discharge[bestPosition] = water * firstFraction;
                this.collectedWater[bestNeighbor] += water * firstFraction;
                this.collectedSediment[bestNeighbor] += sediment * firstFraction;
                this.collectedWater[secondNeighbor] += water * secondFraction;
                this.collectedSediment[secondNeighbor] += sediment * secondFraction;
            }
            
            // Landscape diffusion (smoothing)
            if (this.lakeIndex[bestNeighbor] === 0) {
                const k = this.landscapeDiffusionCoefficient * dt / 1000000 * 3;
                let delta = (this.cellElevation[cell] - this.cellElevation[bestNeighbor]) * k;
                if (this.sedimentThickness[cell] < delta) {
                    delta = this.sedimentThickness[cell];
                }
                this.sedimentThickness[cell] -= delta;
                this.sedimentThickness[bestNeighbor] += delta;
            }
        }
    }
    
    /**
     * Run a single simulation step
     * @param {number} dt - Time step in years
     */
    step(dt) {
        this.time += dt;
        
        // (D) Dynamic sea level oscillation (from Islands)
        if (this.enableDynamicSeaLevel && this.time > this.seaLevelStartTime) {
            this.seaLevel = this.meanSeaLevel + 
                this.seaLevelAmplitude * Math.sin(2 * Math.PI * this.time / this.seaLevelPeriod);
        }
        
        // (A) Apply tectonic uplift after initial period
        if (this.time > this.upliftStartTime) {
            this.applyUplift(dt);
        }
        
        this.initializeDrainage();
        this.calculateDrainageGraph();
        this.runDrainage(dt);
        
        // Update cell elevations
        for (let i = 0; i < this.cellCount; i++) {
            this.cellElevation[i] = this.bedrockThickness[i] + this.sedimentThickness[i];
        }
    }
    
    /**
     * (A) Apply tectonic uplift to bedrock
     * Uplift is applied only to cells above a threshold elevation
     * @param {number} dt - Time step in years
     */
    applyUplift(dt) {
        const upliftThreshold = 1500; // Only uplift terrain above this elevation
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.cellElevation[cell] < upliftThreshold) continue;
            
            // upliftArray is in mm/year, convert to meters
            const upliftMeters = this.upliftArray[cell] * 0.001 * dt;
            this.bedrockThickness[cell] += upliftMeters;
        }
    }
    
    /**
     * (A) Setup uplift field using noise patterns (like Islands)
     * Creates realistic tectonic uplift zones
     */
    setupUplift() {
        // Create noise-based uplift pattern
        const bumps = new SNoise(30, 10, 25);
        bumps.octaves(7, 0.6);
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const x = this.cellX[cell];
            const y = this.cellY[cell];
            
            // Noise-based uplift rate (mm/year)
            this.upliftArray[cell] = 0.5 * bumps.get(x, y);
            this.upliftArray[cell] += 0.1 * Math.random();
        }
    }
    
    /**
     * (C) Pre-fill lakes with sediment (from Islands)
     * This helps stabilize the terrain before main simulation
     */
    fillLakes() {
        // Run drainage to identify lake basins
        this.initializeDrainage();
        this.calculateDrainageGraph();
        
        // Fill lake basins with sediment
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.lakeIndex[cell] > 0) {
                // Add sediment equal to lake depth plus small random variation
                this.sedimentThickness[cell] += this.lakeThicknessArray[cell] + Math.random();
            }
        }
        
        // Update elevations after filling
        for (let i = 0; i < this.cellCount; i++) {
            this.cellElevation[i] = this.bedrockThickness[i] + this.sedimentThickness[i];
        }
    }
    
    /**
     * Run multiple simulation steps
     * @param {number} totalYears - Total time to simulate
     * @param {number} stepSize - Size of each step in years
     * @param {function} progressCallback - Optional callback for progress updates
     */
    simulate(totalYears, stepSize = 50000, progressCallback = null) {
        const numSteps = Math.ceil(totalYears / stepSize);
        
        for (let i = 0; i < numSteps; i++) {
            this.step(stepSize);
            
            if (progressCallback) {
                progressCallback(this.time, totalYears, i + 1, numSteps);
            }
        }
    }
    
    /**
     * Get the current elevation map as a 2D array
     * @returns {number[][]} - 2D array of elevations
     */
    getElevationMap() {
        const map = [];
        for (let row = 0; row < this.rows; row++) {
            map[row] = [];
            for (let col = 0; col < this.cols; col++) {
                map[row][col] = this.cellElevation[row * this.cols + col];
            }
        }
        return map;
    }
    
    /**
     * Get the normalized elevation map (0-1 range)
     * @returns {number[][]} - 2D array of normalized elevations
     */
    getNormalizedElevationMap() {
        let minElev = Infinity, maxElev = -Infinity;
        
        for (let i = 0; i < this.cellCount; i++) {
            if (this.cellElevation[i] < minElev) minElev = this.cellElevation[i];
            if (this.cellElevation[i] > maxElev) maxElev = this.cellElevation[i];
        }
        
        const range = maxElev - minElev || 1;
        const map = [];
        
        for (let row = 0; row < this.rows; row++) {
            map[row] = [];
            for (let col = 0; col < this.cols; col++) {
                map[row][col] = (this.cellElevation[row * this.cols + col] - minElev) / range;
            }
        }
        
        return map;
    }
    
    /**
     * Get the normalized sea level relative to the current elevation range
     * @returns {number} - Normalized sea level (0-1)
     */
    getNormalizedSeaLevel() {
        let minElev = Infinity, maxElev = -Infinity;
        
        for (let i = 0; i < this.cellCount; i++) {
            if (this.cellElevation[i] < minElev) minElev = this.cellElevation[i];
            if (this.cellElevation[i] > maxElev) maxElev = this.cellElevation[i];
        }
        
        const range = maxElev - minElev || 1;
        return (this.seaLevel - minElev) / range;
    }
    
    /**
     * Get the lake thickness map as a 2D array
     * Lake thickness indicates depth of water above ground level for inland lakes
     * @returns {number[][]} - 2D array of lake thickness values (0 = no lake)
     */
    getLakeThicknessMap() {
        const map = [];
        for (let row = 0; row < this.rows; row++) {
            map[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const cell = row * this.cols + col;
                map[row][col] = this.lakeThicknessArray[cell];
            }
        }
        return map;
    }
    
    /**
     * Get max lake thickness for normalization
     * @returns {number} - Maximum lake thickness value
     */
    getMaxLakeThickness() {
        let maxThickness = 0;
        for (let i = 0; i < this.cellCount; i++) {
            if (this.lakeThicknessArray[i] > maxThickness) {
                maxThickness = this.lakeThicknessArray[i];
            }
        }
        return maxThickness;
    }
    
    /**
     * Get river segments for rendering
     * @param {number} minDischarge - Minimum discharge to include
     * @returns {object[]} - Array of river segments {x1, y1, x2, y2, discharge}
     */
    getRiverSegments(minDischarge = 0.01) {
        const segments = [];
        
        // Find max discharge without spread operator (avoids stack overflow on large arrays)
        let maxDischarge = 0;
        for (let i = 0; i < this.discharge.length; i++) {
            if (this.discharge[i] > maxDischarge) {
                maxDischarge = this.discharge[i];
            }
        }
        
        if (maxDischarge === 0) {
            return segments; // No discharge data
        }
        
        const threshold = minDischarge * maxDischarge;
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.lakeThicknessArray[cell] > 50) continue;
            
            const x = this.cellX[cell];
            const y = this.cellY[cell];
            const count = this.cellNeighborCount[cell];
            
            for (let j = 0; j < count; j++) {
                const position = cell * this.maxNeighbors + j;
                const otherCell = this.cellNeighbors[position];
                
                // Skip wrapped edges (would draw lines across the entire map)
                if (this.neighborWrapped && this.neighborWrapped[position]) continue;
                
                if (this.discharge[position] < threshold) continue;
                
                // Skip if both cells are lakes
                if (this.lakeThicknessArray[cell] > this.lakeThreshold &&
                    this.lakeThicknessArray[otherCell] > this.lakeThreshold) continue;
                
                let x1 = x, y1 = y;
                let x2 = this.cellX[otherCell];
                let y2 = this.cellY[otherCell];
                
                // Adjust endpoints for lakes
                if (this.lakeThicknessArray[cell] > this.lakeThreshold) {
                    x1 = 0.5 * (x1 + x2);
                    y1 = 0.5 * (y1 + y2);
                }
                if (this.lakeThicknessArray[otherCell] > this.lakeThreshold) {
                    x2 = 0.5 * (x1 + x2);
                    y2 = 0.5 * (y1 + y2);
                }
                
                segments.push({
                    x1, y1, x2, y2,
                    discharge: this.discharge[position],
                    normalizedDischarge: this.discharge[position] / maxDischarge
                });
            }
        }
        
        return segments;
    }
    
    /**
     * Get coastline segments for rendering
     * @returns {object[]} - Array of coastline segments {x1, y1, x2, y2}
     */
    getCoastlineSegments() {
        const segments = [];
        const visited = new Set();
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            const count = this.cellNeighborCount[cell];
            const cellUnderwater = this.cellElevation[cell] < this.seaLevel ||
                this.lakeThicknessArray[cell] > this.lakeThreshold;
            
            for (let j = 0; j < count; j++) {
                const position = cell * this.maxNeighbors + j;
                const neighbor = this.cellNeighbors[position];
                
                // Skip wrapped edges (would draw lines across the entire map)
                if (this.neighborWrapped && this.neighborWrapped[position]) continue;
                
                // Skip if already processed
                const key = Math.min(cell, neighbor) + '_' + Math.max(cell, neighbor);
                if (visited.has(key)) continue;
                visited.add(key);
                
                const neighborUnderwater = this.cellElevation[neighbor] < this.seaLevel ||
                    this.lakeThicknessArray[neighbor] > this.lakeThreshold;
                
                // Only draw if one is underwater and one is not
                if (cellUnderwater === neighborUnderwater) continue;
                
                const x1 = this.cellX[cell];
                const y1 = this.cellY[cell];
                const x2 = this.cellX[neighbor];
                const y2 = this.cellY[neighbor];
                
                // Calculate the coastline point (interpolate based on elevation)
                const totalDiff = Math.abs(
                    (this.cellElevation[cell] + this.lakeThicknessArray[cell]) -
                    (this.cellElevation[neighbor] + this.lakeThicknessArray[neighbor])
                );
                
                let t = 0.5; // Default to midpoint
                if (totalDiff > 0.001) {
                    const waterLevel = this.seaLevel;
                    const elev1 = this.cellElevation[cell] + this.lakeThicknessArray[cell];
                    const elev2 = this.cellElevation[neighbor] + this.lakeThicknessArray[neighbor];
                    t = (waterLevel - elev1) / (elev2 - elev1);
                    t = Math.max(0, Math.min(1, t));
                }
                
                // Get perpendicular direction for coastline
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.sqrt(dx * dx + dy * dy);
                const px = -dy / len * 0.3;
                const py = dx / len * 0.3;
                
                const mx = x1 + t * dx;
                const my = y1 + t * dy;
                
                segments.push({
                    x1: mx - px,
                    y1: my - py,
                    x2: mx + px,
                    y2: my + py,
                    isLake: this.lakeThicknessArray[cellUnderwater ? cell : neighbor] > this.lakeThreshold
                });
            }
        }
        
        return segments;
    }
    
    /**
     * Get lake cells for rendering
     * @returns {object[]} - Array of lake cells {row, col, depth}
     */
    getLakeCells() {
        const lakes = [];
        
        for (let cell = 0; cell < this.cellCount; cell++) {
            if (this.lakeThicknessArray[cell] > this.lakeThreshold) {
                lakes.push({
                    row: Math.floor(cell / this.cols),
                    col: cell % this.cols,
                    depth: this.lakeThicknessArray[cell]
                });
            }
        }
        
        return lakes;
    }
}

// ============================================================================
// RENDERING UTILITIES
// ============================================================================

/**
 * Render river overlay on a canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {object[]} riverSegments - River segment data
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} mapCols - Map columns
 * @param {number} mapRows - Map rows
 * @param {object} options - Rendering options
 */
function renderRivers(ctx, riverSegments, width, height, mapCols, mapRows, options = {}) {
    const {
        color = 'rgba(50, 100, 200, 0.8)',
        minWidth = 0.5,
        maxWidth = 3,
        useDischargeWidth = true,
        projection = 'square',
        imageConfig = null,
        mapConfig = null
    } = options;
    
    const scaleX = width / mapCols;
    const scaleY = height / mapRows;
    
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    
    riverSegments.forEach(segment => {
        const lineWidth = useDischargeWidth ?
            minWidth + (maxWidth - minWidth) * Math.sqrt(segment.normalizedDischarge) :
            minWidth;
        
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = 0.3 + 0.7 * Math.sqrt(segment.normalizedDischarge);
        
        // Transform coordinates based on projection
        const p1 = projectPoint(segment.x1, segment.y1, mapCols, mapRows, width, height, projection, imageConfig);
        const p2 = projectPoint(segment.x2, segment.y2, mapCols, mapRows, width, height, projection, imageConfig);
        
        // Only draw if both points are valid (inside projection bounds)
        if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    });
    
    ctx.globalAlpha = 1;
}

/**
 * Project a point from map coordinates to screen coordinates based on projection
 * This is the INVERSE of the original projection functions in world.js
 * 
 * IMPORTANT: In world.js projections, the loop variable naming is confusing:
 * - outer loop 'row' iterates 0 to width, so it's actually screenX
 * - inner loop 'col' iterates 0 to height, so it's actually screenY
 */
function projectPoint(mapX, mapY, mapCols, mapRows, screenWidth, screenHeight, projection, imageConfig) {
    const mapCol = mapX;  // x is column in map space
    const mapRow = mapY;  // y is row in map space
    
    if (projection === 'square' || !projection) {
        return {
            x: mapCol * screenWidth / mapCols,
            y: mapRow * screenHeight / mapRows
        };
    }
    
    if (projection === 'mollweide') {
        // Original Mollweide mapping (screen -> map):
        // sinFactors[screenY] = sqrt(sin((screenY / height) * PI))
        // theta = asin((2.8284271247 * (0.5 - screenY/height)) / sqrt(2))  
        // mapRow = (0.5 - asin((2*theta + sin(2*theta))/PI) / PI) * mapRows
        // mapCol = floor((screenX - wd2) / sinFactors[screenY]) + cd2
        //
        // For inverse, we need to find screenY given mapRow (complex, use binary search)
        // and screenX given mapCol and screenY
        
        const wd2 = imageConfig?.wd2 || Math.floor(screenWidth / 2);
        const cd2 = mapCols / 2;
        
        // Binary search to find screenY that maps to our mapRow
        // The mapping is monotonic: as screenY increases from 0 to height, mapRow goes from 0 to mapRows
        let low = 0, high = screenHeight - 1;
        let screenY = screenHeight / 2;
        
        for (let i = 0; i < 20; i++) { // 20 iterations gives good precision
            const mid = (low + high) / 2;
            const theta = Math.asin((2.8284271247 * (0.5 - mid / screenHeight)) / Math.sqrt(2));
            const testMapRow = (0.5 - Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI) / Math.PI) * mapRows;
            
            if (testMapRow < mapRow) {
                low = mid;
            } else {
                high = mid;
            }
            screenY = (low + high) / 2;
        }
        
        // Calculate sinFactor at this screenY
        const sinFactor = Math.sqrt(Math.sin((screenY / screenHeight) * Math.PI));
        if (sinFactor < 0.001) return null; // At poles
        
        // Inverse for screenX: mapCol = floor((screenX - wd2) / sinFactor) + cd2
        // So: screenX = (mapCol - cd2) * sinFactor + wd2
        const screenX = (mapCol - cd2) * sinFactor + wd2;
        
        // Check bounds
        const ellipseWidth = wd2 * sinFactor;
        if (screenX < wd2 - ellipseWidth || screenX > wd2 + ellipseWidth) {
            return null;
        }
        
        return { x: screenX, y: screenY };
    }
    
    if (projection === 'sinusoidal') {
        // Original Sinusoidal mapping (screen -> map):
        // sinFactors[screenY] = sin((screenY / height) * PI)
        // mapRow = screenY (direct linear mapping - uses 'col' which is screenY)
        // mapCol = floor((screenX - wd2) / sinFactors[screenY]) + cd2
        
        const wd2 = imageConfig?.wd2 || Math.floor(screenWidth / 2);
        const cd2 = mapCols / 2;
        
        // For sinusoidal, mapRow = col directly, so:
        // screenY = mapRow * height / mapRows
        const screenY = mapRow * screenHeight / mapRows;
        
        // Calculate sinFactor at this screenY
        const sinFactor = Math.sin((screenY / screenHeight) * Math.PI);
        if (sinFactor < 0.001) return null; // At poles
        
        // Inverse for screenX: mapCol = floor((screenX - wd2) / sinFactor) + cd2
        // So: screenX = (mapCol - cd2) * sinFactor + wd2
        const screenX = (mapCol - cd2) * sinFactor + wd2;
        
        // Check bounds
        const ellipseWidth = wd2 * sinFactor;
        if (screenX < wd2 - ellipseWidth || screenX > wd2 + ellipseWidth) {
            return null;
        }
        
        return { x: screenX, y: screenY };
    }
    
    if (projection === 'mercator') {
        // Original Mercator mapping (screen -> map):
        // mapCol = (screenX / width) * mapCols
        // mapRow = (0.5 - atan(sinh((0.5 - screenY/height) * PI)) / PI) * mapRows
        
        // Inverse for screenX (trivial):
        const screenX = mapCol * screenWidth / mapCols;
        
        // Inverse for screenY: solve for screenY given mapRow
        // mapRow/mapRows = 0.5 - atan(sinh((0.5 - screenY/height) * PI)) / PI
        // Let lat = PI * (0.5 - mapRow/mapRows)
        // Then: sinh((0.5 - screenY/height) * PI) = tan(lat)
        // (0.5 - screenY/height) * PI = asinh(tan(lat))
        // screenY = height * (0.5 - asinh(tan(lat)) / PI)
        const lat = Math.PI * (0.5 - mapRow / mapRows);
        
        // Clamp lat to avoid infinity at poles
        if (Math.abs(lat) > Math.PI / 2 - 0.01) return null;
        
        const screenY = screenHeight * (0.5 - Math.asinh(Math.tan(lat)) / Math.PI);
        
        if (screenY < 0 || screenY >= screenHeight) return null;
        return { x: screenX, y: screenY };
    }
    
    if (projection === 'transmerc') {
        // Original Transverse Mercator mapping (screen -> map):
        // angle = (screenX / width) * 2 * PI
        // lat = 4 * (screenY / height - 0.5)  -- ranges from -2 to 2
        // lon = atan(sinh(lat) / cos(angle))
        // if (angle > PI/2 && angle <= 3*PI/2) lon += PI
        // mapRow = (0.5 - asin(sin(angle) / cosh(lat)) / PI) * mapRows
        // mapCol = (lon / (2*PI)) * mapCols
        //
        // Use Newton-Raphson iteration to invert
        
        // Forward function
        function forwardTM(sx, sy) {
            const angle = (sx / screenWidth) * 2 * Math.PI;
            const lat = 4 * (sy / screenHeight - 0.5);
            const coshLat = Math.cosh(lat);
            const sinhLat = Math.sinh(lat);
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            
            let lon = Math.atan2(sinhLat, cosAngle); // Use atan2 for better quadrant handling
            
            // Adjust to [0, 2*PI) range
            if (lon < 0) lon += 2 * Math.PI;
            
            const sinAngleOverCosh = sinAngle / coshLat;
            // Clamp to valid asin range
            const clamped = Math.max(-1, Math.min(1, sinAngleOverCosh));
            const mr = (0.5 - Math.asin(clamped) / Math.PI) * mapRows;
            const mc = (lon / (2 * Math.PI)) * mapCols;
            
            return { mr, mc };
        }
        
        // Start with linear initial guess
        let sx = (mapCol / mapCols) * screenWidth;
        let sy = (mapRow / mapRows) * screenHeight;
        
        // Newton-Raphson iteration with numerical Jacobian
        const eps = 0.5;
        const targetMr = mapRow;
        const targetMc = mapCol;
        
        for (let iter = 0; iter < 15; iter++) {
            const f = forwardTM(sx, sy);
            
            // Handle column wraparound
            let errMc = f.mc - targetMc;
            if (errMc > mapCols / 2) errMc -= mapCols;
            if (errMc < -mapCols / 2) errMc += mapCols;
            
            const errMr = f.mr - targetMr;
            const err = Math.sqrt(errMr * errMr + errMc * errMc);
            
            if (err < 0.5) {
                // Good enough
                if (sx >= 0 && sx < screenWidth && sy >= 0 && sy < screenHeight) {
                    return { x: sx, y: sy };
                }
                break;
            }
            
            // Compute numerical Jacobian
            const fxp = forwardTM(sx + eps, sy);
            const fyp = forwardTM(sx, sy + eps);
            
            // d(mr)/d(sx), d(mr)/d(sy)
            const dMr_dSx = (fxp.mr - f.mr) / eps;
            const dMr_dSy = (fyp.mr - f.mr) / eps;
            
            // d(mc)/d(sx), d(mc)/d(sy) - handle wraparound
            let dMc_dSx = (fxp.mc - f.mc) / eps;
            let dMc_dSy = (fyp.mc - f.mc) / eps;
            if (Math.abs(dMc_dSx) > mapCols / 2) dMc_dSx = dMc_dSx > 0 ? dMc_dSx - mapCols : dMc_dSx + mapCols;
            if (Math.abs(dMc_dSy) > mapCols / 2) dMc_dSy = dMc_dSy > 0 ? dMc_dSy - mapCols : dMc_dSy + mapCols;
            
            // Solve 2x2 system: J * delta = -error
            const det = dMr_dSx * dMc_dSy - dMr_dSy * dMc_dSx;
            if (Math.abs(det) < 1e-10) break; // Singular Jacobian
            
            const dSx = (-errMr * dMc_dSy + errMc * dMr_dSy) / det;
            const dSy = (-errMc * dMr_dSx + errMr * dMc_dSx) / det;
            
            // Limit step size to avoid overshooting
            const maxStep = Math.max(screenWidth, screenHeight) / 4;
            const stepLen = Math.sqrt(dSx * dSx + dSy * dSy);
            const scale = stepLen > maxStep ? maxStep / stepLen : 1;
            
            sx += dSx * scale;
            sy += dSy * scale;
            
            // Keep in bounds
            sx = Math.max(0, Math.min(screenWidth - 1, sx));
            sy = Math.max(0, Math.min(screenHeight - 1, sy));
        }
        
        // Final check
        const finalF = forwardTM(sx, sy);
        let finalErrMc = finalF.mc - targetMc;
        if (finalErrMc > mapCols / 2) finalErrMc -= mapCols;
        if (finalErrMc < -mapCols / 2) finalErrMc += mapCols;
        const finalErr = Math.sqrt(Math.pow(finalF.mr - targetMr, 2) + finalErrMc * finalErrMc);
        
        if (finalErr < 2 && sx >= 0 && sx < screenWidth && sy >= 0 && sy < screenHeight) {
            return { x: sx, y: sy };
        }
        
        return null;
    }
    
    if (projection === 'icosahedral') {
        // Icosahedral projection is complex - the map coordinates need to be
        // transformed into the triangular sections. We use the inverse mapping
        // from the terrain renderer.
        const col_w = imageConfig?.col_w || Math.floor(screenWidth / 11);
        const row_h = imageConfig?.row_h || Math.floor(screenHeight / 3);
        
        // For icosahedral, we need to find which screen position corresponds
        // to our map coordinate. This is complex because the same map coordinate
        // can appear in multiple triangular sections.
        // 
        // We'll use a simplified approach: map the column directly to x position
        // in the middle row (rowIndex=1), which is the main visible band
        const screenX = col * screenWidth / mapCols;
        const screenY = row_h + (row * row_h / mapRows); // Place in middle row
        
        // Check if we're in a valid triangular section
        const colIndex = Math.floor(screenX / col_w);
        const rowIndex = Math.floor(screenY / row_h);
        
        if (rowIndex === 1 && colIndex >= 0 && colIndex <= 10) {
            return { x: screenX, y: screenY };
        }
        
        // For points that fall outside the middle band, skip them
        // (icosahedral projection is too complex for simple line overlay)
        return null;
    }
    
    // Default: simple linear scaling
    return {
        x: col * screenWidth / mapCols,
        y: row * screenHeight / mapRows
    };
}

/**
 * Render coastline overlay on a canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {object[]} coastlineSegments - Coastline segment data
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} mapCols - Map columns
 * @param {number} mapRows - Map rows
 * @param {object} options - Rendering options
 */
function renderCoastlines(ctx, coastlineSegments, width, height, mapCols, mapRows, options = {}) {
    const {
        seaColor = 'rgba(0, 50, 100, 0.6)',
        lakeColor = 'rgba(50, 100, 150, 0.5)',
        lineWidth = 1,
        projection = 'square',
        imageConfig = null,
        mapConfig = null
    } = options;
    
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    coastlineSegments.forEach(segment => {
        ctx.strokeStyle = segment.isLake ? lakeColor : seaColor;
        
        // Transform coordinates based on projection
        const p1 = projectPoint(segment.x1, segment.y1, mapCols, mapRows, width, height, projection, imageConfig);
        const p2 = projectPoint(segment.x2, segment.y2, mapCols, mapRows, width, height, projection, imageConfig);
        
        // Only draw if both points are valid (inside projection bounds)
        if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    });
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Render lakes overlay on a canvas
 * Lakes are displayed as blue-tinted areas where lake_thickness > threshold
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number[][]} lakeThicknessMap - 2D array of lake thickness values
 * @param {number} maxLakeThickness - Maximum lake thickness for normalization
 * @param {number} lakeThreshold - Minimum thickness to consider as lake
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} mapCols - Map columns
 * @param {number} mapRows - Map rows
 * @param {object} options - Rendering options
 */
function renderLakes(ctx, lakeThicknessMap, maxLakeThickness, lakeThreshold, width, height, mapCols, mapRows, options = {}) {
    const {
        shallowColor = { r: 100, g: 180, b: 255 },  // Light blue for shallow lakes
        deepColor = { r: 30, g: 80, b: 150 },       // Dark blue for deep lakes
        projection = 'square',
        imageConfig = null,
        mapConfig = null
    } = options;
    
    // Get imageData for direct pixel manipulation
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const scaleX = width / mapCols;
    const scaleY = height / mapRows;
    
    // Normalize threshold relative to max thickness
    const normalizedThreshold = maxLakeThickness > 0 ? lakeThreshold / maxLakeThickness : 0;
    
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            const thickness = lakeThicknessMap[row][col];
            
            // Skip if not a lake (below threshold)
            if (thickness <= lakeThreshold) continue;
            
            // Normalize lake depth (0 = threshold, 1 = max depth)
            const normalizedDepth = maxLakeThickness > lakeThreshold 
                ? (thickness - lakeThreshold) / (maxLakeThickness - lakeThreshold)
                : 0;
            
            // Interpolate color based on depth
            const t = Math.min(normalizedDepth, 1);
            const r = Math.floor(shallowColor.r + t * (deepColor.r - shallowColor.r));
            const g = Math.floor(shallowColor.g + t * (deepColor.g - shallowColor.g));
            const b = Math.floor(shallowColor.b + t * (deepColor.b - shallowColor.b));
            
            // Project the cell coordinates
            const p = projectPoint(col, row, mapCols, mapRows, width, height, projection, imageConfig);
            if (!p) continue;
            
            // Fill pixels in the projected area
            // For square projection, fill a simple rectangle
            // For other projections, we need to fill the projected cell area
            if (projection === 'square') {
                const startX = Math.floor(col * scaleX);
                const startY = Math.floor(row * scaleY);
                const endX = Math.floor((col + 1) * scaleX);
                const endY = Math.floor((row + 1) * scaleY);
                
                for (let py = startY; py < endY && py < height; py++) {
                    for (let px = startX; px < endX && px < width; px++) {
                        const idx = (py * width + px) * 4;
                        data[idx] = r;
                        data[idx + 1] = g;
                        data[idx + 2] = b;
                        data[idx + 3] = 255;
                    }
                }
            } else {
                // For other projections, just color the projected point area
                const px = Math.floor(p.x);
                const py = Math.floor(p.y);
                
                // Fill a small area around the projected point
                const radius = Math.max(1, Math.floor(Math.min(scaleX, scaleY) / 2));
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const targetX = px + dx;
                        const targetY = py + dy;
                        if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
                            const idx = (targetY * width + targetX) * 4;
                            data[idx] = r;
                            data[idx + 1] = g;
                            data[idx + 2] = b;
                            data[idx + 3] = 255;
                        }
                    }
                }
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Make classes available globally
window.ErosionSimulation = ErosionSimulation;
window.SNoise = SNoise;
window.SimplexNoise2D = SimplexNoise2D;
window.renderRivers = renderRivers;
window.renderCoastlines = renderCoastlines;
window.renderLakes = renderLakes;
