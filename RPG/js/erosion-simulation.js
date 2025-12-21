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
                this.erodibility[cell] = 0.5 + Math.random() * 0.5;
                
                this.cellX[cell] = col;
                this.cellY[cell] = row;
            }
        }
        
        // Calculate sea level based on percentage
        this.seaLevel = this.meanSeaLevel * 3000 + 1000;
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
                    const nc = col + dc;
                    
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        const neighbor = nr * this.cols + nc;
                        const position = cell * this.maxNeighbors + neighborCount;
                        
                        this.cellNeighbors[position] = neighbor;
                        
                        // Calculate distance (diagonal vs cardinal)
                        const dist = Math.sqrt(dr * dr + dc * dc);
                        this.cellNeighborDistance[position] = dist;
                        
                        neighborCount++;
                    }
                }
                
                this.cellNeighborCount[cell] = neighborCount;
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
        for (let col = 0; col < this.cols; col++) {
            this._markEdgeCell(col); // Top row
            this._markEdgeCell((this.rows - 1) * this.cols + col); // Bottom row
        }
        for (let row = 0; row < this.rows; row++) {
            this._markEdgeCell(row * this.cols); // Left column
            this._markEdgeCell(row * this.cols + (this.cols - 1)); // Right column
        }
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
        this.initializeDrainage();
        this.calculateDrainageGraph();
        this.runDrainage(dt);
        
        // Update cell elevations
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
        useDischargeWidth = true
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
        
        ctx.beginPath();
        ctx.moveTo(segment.x1 * scaleX, segment.y1 * scaleY);
        ctx.lineTo(segment.x2 * scaleX, segment.y2 * scaleY);
        ctx.stroke();
    });
    
    ctx.globalAlpha = 1;
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
        lineWidth = 1
    } = options;
    
    const scaleX = width / mapCols;
    const scaleY = height / mapRows;
    
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    coastlineSegments.forEach(segment => {
        ctx.strokeStyle = segment.isLake ? lakeColor : seaColor;
        
        ctx.beginPath();
        ctx.moveTo(segment.x1 * scaleX, segment.y1 * scaleY);
        ctx.lineTo(segment.x2 * scaleX, segment.y2 * scaleY);
        ctx.stroke();
    });
}

// ============================================================================
// EXPORT
// ============================================================================

// Make classes available globally
window.ErosionSimulation = ErosionSimulation;
window.SNoise = SNoise;
window.SimplexNoise2D = SimplexNoise2D;
window.renderRivers = renderRivers;
window.renderCoastlines = renderCoastlines;
