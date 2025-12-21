/**
 * Islands-Style WebGL Renderer
 * 
 * This module provides WebGL-based terrain rendering similar to TedTschopp/Islands.
 * It renders the terrain as a triangle mesh with elevation-based coloring and shading.
 * 
 * Unlike the Islands repo (which uses Voronoi cells), this uses a regular grid
 * converted to triangles (each grid cell becomes 2 triangles).
 * 
 * Key features:
 * - GPU-accelerated terrain rendering
 * - Elevation-based color ramps (sea depth, land elevation bands)
 * - Per-triangle shading (hillshade effect)
 * - Optional coastline and river overlays
 */

'use strict';

(function(global) {

/**
 * IslandsWebGLRenderer - WebGL-based terrain renderer
 */
class IslandsWebGLRenderer {
    /**
     * Create a WebGL renderer for Islands-style terrain display
     * @param {HTMLCanvasElement} canvas - Target canvas element
     * @param {CellDataModel} cellData - Cell data model with terrain data
     * @param {object} options - Rendering options
     */
    constructor(canvas, cellData, options = {}) {
        this.canvas = canvas;
        this.cellData = cellData;
        this.options = {
            scale: options.scale || 1.0,
            meanSeaLevel: options.meanSeaLevel || cellData?.config?.meanSeaLevel || 2000,
            lakeThreshold: options.lakeThreshold || cellData?.config?.lakeThreshold || 5,
            showCoastlines: options.showCoastlines !== false,
            showRivers: options.showRivers !== false,
            riverThreshold: options.riverThreshold || 0.01,  // km³ discharge threshold
            ...options
        };
        
        this.gl = null;
        this.initialized = false;
        
        // Shader programs
        this.terrainShader = null;
        this.lineShader = null;
        
        // Buffers
        this.triangleVertexBuffer = null;
        this.triangleDataBuffer = null;
        this.coastlineVertexBuffer = null;
        this.coastlineOpacityBuffer = null;
        this.riverVertexBuffer = null;
        this.riverOpacityBuffer = null;
        
        // Mesh data
        this.triangleCount = 0;
        this.triangleVertices = null;
        this.triangleCells = null;
        this.dataBuffer = null;
        this.triangleShade = null;
        
        // Coastline/river data
        this.coastlineVertices = null;
        this.coastlineOpacity = null;
        this.coastlineWritePos = 0;
        this.riverVertices = null;
        this.riverOpacity = null;
        this.riverWritePos = 0;
    }
    
    /**
     * Initialize WebGL context and compile shaders
     */
    init() {
        if (this.initialized) return true;
        
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl', { alpha: false, antialias: true });
        if (!this.gl) {
            console.error('WebGL not supported');
            return false;
        }
        
        const gl = this.gl;
        
        // Set up GL state
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Build triangle mesh from grid
        this._buildTriangleMesh();
        
        // Compile shaders
        this._compileShaders();
        
        // Create buffers
        this._createBuffers();
        
        this.initialized = true;
        return true;
    }
    
    /**
     * Build triangle mesh from rectangular grid
     * Each cell becomes 2 triangles (like a regular grid to triangle strip)
     */
    _buildTriangleMesh() {
        const rows = this.cellData.rows;
        const cols = this.cellData.cols;
        
        // Calculate triangles: each "quad" (2x2 cells) forms 2 triangles
        // We have (rows-1) x (cols-1) quads, each with 2 triangles
        this.triangleCount = (rows - 1) * (cols - 1) * 2;
        
        // Triangle vertices: 3 vertices per triangle, 2 floats (x,y) per vertex
        this.triangleVertices = new Float32Array(this.triangleCount * 6);
        
        // Triangle cells: which cells form each triangle vertex
        this.triangleCells = new Uint32Array(this.triangleCount * 3);
        
        // Per-vertex data: 4 floats (elevation, waterLevel, unused, shade)
        this.dataBuffer = new Float32Array(this.triangleCount * 3 * 4);
        
        // Per-triangle shade
        this.triangleShade = new Float32Array(this.triangleCount);
        
        let triIdx = 0;
        
        for (let row = 0; row < rows - 1; row++) {
            for (let col = 0; col < cols - 1; col++) {
                // Cell indices for the quad corners
                const tl = row * cols + col;           // top-left
                const tr = row * cols + col + 1;       // top-right
                const bl = (row + 1) * cols + col;     // bottom-left
                const br = (row + 1) * cols + col + 1; // bottom-right
                
                // Pixel coordinates
                const tlX = col, tlY = row;
                const trX = col + 1, trY = row;
                const blX = col, blY = row + 1;
                const brX = col + 1, brY = row + 1;
                
                // Triangle 1: tl, tr, bl
                const t1 = triIdx * 6;
                this.triangleVertices[t1]     = tlX;
                this.triangleVertices[t1 + 1] = tlY;
                this.triangleVertices[t1 + 2] = trX;
                this.triangleVertices[t1 + 3] = trY;
                this.triangleVertices[t1 + 4] = blX;
                this.triangleVertices[t1 + 5] = blY;
                
                const c1 = triIdx * 3;
                this.triangleCells[c1]     = tl;
                this.triangleCells[c1 + 1] = tr;
                this.triangleCells[c1 + 2] = bl;
                
                triIdx++;
                
                // Triangle 2: tr, br, bl
                const t2 = triIdx * 6;
                this.triangleVertices[t2]     = trX;
                this.triangleVertices[t2 + 1] = trY;
                this.triangleVertices[t2 + 2] = brX;
                this.triangleVertices[t2 + 3] = brY;
                this.triangleVertices[t2 + 4] = blX;
                this.triangleVertices[t2 + 5] = blY;
                
                const c2 = triIdx * 3;
                this.triangleCells[c2]     = tr;
                this.triangleCells[c2 + 1] = br;
                this.triangleCells[c2 + 2] = bl;
                
                triIdx++;
            }
        }
        
        // Allocate coastline/river buffers (generous size)
        this.coastlineVertices = new Float32Array(this.triangleCount * 4);
        this.coastlineOpacity = new Uint8Array(this.triangleCount * 2);
        this.riverVertices = new Float32Array(this.cellData.cellCount * 8);
        this.riverOpacity = new Uint8ClampedArray(this.cellData.cellCount * 4);
    }
    
    /**
     * Compile vertex and fragment shaders
     */
    _compileShaders() {
        const gl = this.gl;
        
        // ================================================================
        // TERRAIN SHADER (renders triangles with elevation-based colors)
        // ================================================================
        
        const terrainVertexSrc = `
            attribute vec2 aVertexPosition;
            attribute vec4 in_data;
            uniform vec2 canvas_dimensions;
            varying float elevation;
            varying float water_level;
            varying float triangle_shade;
            
            void main() {
                elevation = in_data.x;
                water_level = in_data.y;
                triangle_shade = in_data.w;
                
                gl_Position = vec4(
                    -1.0 + 2.0 * aVertexPosition.x / canvas_dimensions.x,
                    1.0 - 2.0 * aVertexPosition.y / canvas_dimensions.y,
                    0.0, 1.0
                );
            }
        `;
        
        const terrainFragmentSrc = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            varying float elevation;
            varying float water_level;
            varying float triangle_shade;
            
            void main() {
                // Islands-style color ramp
                vec3 colour_deep = vec3(0.0, 40.0, 80.0) / 255.0;     // Deep water
                vec3 colour_shallow = vec3(60.0, 130.0, 180.0) / 255.0; // Shallow water
                vec3 colour_0m = vec3(0.0, 97.0, 71.0) / 255.0;        // Coastal green
                vec3 colour_50m = vec3(16.0, 122.0, 47.0) / 255.0;     // Lowland green
                vec3 colour_500m = vec3(232.0, 215.0, 125.0) / 255.0;  // Plains/savanna
                vec3 colour_1200m = vec3(161.0, 67.0, 0.0) / 255.0;    // Hills/brown
                vec3 colour_1700m = vec3(158.0, 0.0, 0.0) / 255.0;     // Mountains/red
                vec3 colour_2800m = vec3(160.0, 160.0, 160.0) / 255.0; // High mountains
                vec3 colour_4000m = vec3(240.0, 240.0, 240.0) / 255.0; // Snow peaks
                
                float shade = 1.0 + 1.0 * triangle_shade;
                vec3 tint;
                
                // Apply shading based on elevation
                if (elevation < water_level) {
                    // Underwater
                    float depth = water_level - elevation;
                    if (depth > 200.0) {
                        tint = colour_deep;
                    } else {
                        tint = mix(colour_shallow, colour_deep, depth / 200.0);
                    }
                    // Reduce shading effect for water
                    shade = 0.95 + 0.1 * triangle_shade;
                } else if (elevation < 50.0) {
                    tint = mix(colour_0m, colour_50m, elevation / 50.0);
                } else if (elevation < 500.0) {
                    tint = mix(colour_50m, colour_500m, (elevation - 50.0) / 450.0);
                } else if (elevation < 1200.0) {
                    tint = mix(colour_500m, colour_1200m, (elevation - 500.0) / 700.0);
                } else if (elevation < 1700.0) {
                    tint = mix(colour_1200m, colour_1700m, (elevation - 1200.0) / 500.0);
                } else if (elevation < 2800.0) {
                    tint = mix(colour_1700m, colour_2800m, (elevation - 1700.0) / 1100.0);
                } else if (elevation < 4000.0) {
                    tint = mix(colour_2800m, colour_4000m, (elevation - 2800.0) / 1200.0);
                } else {
                    tint = colour_4000m;
                }
                
                // Desaturate slightly (like Islands)
                tint = mix(tint, vec3(dot(vec3(0.3, 0.55, 0.15), tint)), 0.2);
                
                // Snow on high peaks (add white overlay)
                if (elevation > water_level + 2000.0) {
                    tint = mix(tint, vec3(0.95), 0.3);
                }
                
                gl_FragColor = vec4(shade * tint, 1.0);
            }
        `;
        
        this.terrainShader = this._createShader(terrainVertexSrc, terrainFragmentSrc);
        gl.useProgram(this.terrainShader);
        this.terrainShader.aVertexPosition = gl.getAttribLocation(this.terrainShader, 'aVertexPosition');
        this.terrainShader.in_data = gl.getAttribLocation(this.terrainShader, 'in_data');
        this.terrainShader.canvas_dimensions = gl.getUniformLocation(this.terrainShader, 'canvas_dimensions');
        
        // ================================================================
        // LINE SHADER (for coastlines and rivers)
        // ================================================================
        
        const lineVertexSrc = `
            attribute vec2 in_position;
            attribute float in_opacity;
            uniform vec2 canvas_dimensions;
            varying float opacity;
            
            void main() {
                opacity = in_opacity;
                gl_Position = vec4(
                    -1.0 + 2.0 * in_position.x / canvas_dimensions.x,
                    1.0 - 2.0 * in_position.y / canvas_dimensions.y,
                    0.0, 1.0
                );
            }
        `;
        
        const lineFragmentSrc = `
            #ifdef GL_ES
            precision highp float;
            #endif
            varying float opacity;
            
            void main() {
                gl_FragColor = vec4(vec3(0.0), opacity / 255.0);
            }
        `;
        
        this.lineShader = this._createShader(lineVertexSrc, lineFragmentSrc);
        gl.useProgram(this.lineShader);
        this.lineShader.in_position = gl.getAttribLocation(this.lineShader, 'in_position');
        this.lineShader.in_opacity = gl.getAttribLocation(this.lineShader, 'in_opacity');
        this.lineShader.canvas_dimensions = gl.getUniformLocation(this.lineShader, 'canvas_dimensions');
    }
    
    /**
     * Create and compile a shader program
     */
    _createShader(vertexSrc, fragmentSrc) {
        const gl = this.gl;
        
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexSrc);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compile error:', gl.getShaderInfoLog(vs));
        }
        
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentSrc);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compile error:', gl.getShaderInfoLog(fs));
        }
        
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader program link error:', gl.getProgramInfoLog(program));
        }
        
        return program;
    }
    
    /**
     * Create WebGL buffers
     */
    _createBuffers() {
        const gl = this.gl;
        
        // Terrain vertex buffer
        this.triangleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.triangleVertices, gl.STATIC_DRAW);
        
        // Terrain data buffer
        this.triangleDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.dataBuffer, gl.DYNAMIC_DRAW);
        
        // Coastline buffers
        this.coastlineVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.coastlineVertices, gl.DYNAMIC_DRAW);
        
        this.coastlineOpacityBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineOpacityBuffer);
        // Fill with default opacity
        for (let i = 0; i < this.coastlineOpacity.length; i++) {
            this.coastlineOpacity[i] = 128;
        }
        gl.bufferData(gl.ARRAY_BUFFER, this.coastlineOpacity, gl.STATIC_DRAW);
        
        // River buffers
        this.riverVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.riverVertices, gl.DYNAMIC_DRAW);
        
        this.riverOpacityBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverOpacityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.riverOpacity, gl.DYNAMIC_DRAW);
    }
    
    /**
     * Update cell data reference (call when data changes)
     * @param {CellDataModel} cellData - New cell data model
     */
    updateCellData(cellData) {
        this.cellData = cellData;
        
        // Rebuild mesh if dimensions changed
        if (!this.initialized || 
            cellData.rows !== this.cellData?.rows || 
            cellData.cols !== this.cellData?.cols) {
            this.initialized = false;
            this.init();
        }
    }
    
    /**
     * Calculate per-triangle shading (hillshade effect)
     * Uses cross product of triangle edges to get surface normal
     */
    _calculateShades() {
        const cellData = this.cellData;
        const pixelLength = cellData.config.pixelLength || 125;
        
        for (let tri = 0; tri < this.triangleCount; tri++) {
            const i = this.triangleCells[tri * 3];
            const j = this.triangleCells[tri * 3 + 1];
            const k = this.triangleCells[tri * 3 + 2];
            
            // Get positions
            const ix = i % cellData.cols;
            const iy = Math.floor(i / cellData.cols);
            const jx = j % cellData.cols;
            const jy = Math.floor(j / cellData.cols);
            const kx = k % cellData.cols;
            const ky = Math.floor(k / cellData.cols);
            
            // Get elevations
            const ei = cellData.cellElevation[i];
            const ej = cellData.cellElevation[j];
            const ek = cellData.cellElevation[k];
            
            // Vectors u (i→j) and v (i→k)
            const ux = (jx - ix) * pixelLength;
            const uy = (jy - iy) * pixelLength;
            const uz = ej - ei;
            
            const vx = (kx - ix) * pixelLength;
            const vy = (ky - iy) * pixelLength;
            const vz = ek - ei;
            
            // Cross product
            const cx = uy * vz - uz * vy;
            const cy = uz * vx - ux * vz;
            const cz = ux * vy - uy * vx;
            
            // Simple shading: based on normal direction (light from top-left)
            const shade = cz !== 0 ? -(cx + cy) / cz : 0;
            this.triangleShade[tri] = shade;
        }
    }
    
    /**
     * Render the terrain to the canvas
     */
    render() {
        if (!this.initialized && !this.init()) {
            console.error('Failed to initialize WebGL renderer');
            return;
        }
        
        if (!this.cellData) {
            console.warn('No cell data to render');
            return;
        }
        
        const gl = this.gl;
        const cellData = this.cellData;
        const meanSeaLevel = this.options.meanSeaLevel;
        const lakeThreshold = this.options.lakeThreshold;
        
        // Update canvas size if needed
        if (this.canvas.width !== cellData.cols || this.canvas.height !== cellData.rows) {
            this.canvas.width = cellData.cols;
            this.canvas.height = cellData.rows;
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Calculate shading
        this._calculateShades();
        
        // Update per-vertex data buffer
        for (let tri = 0; tri < this.triangleCount; tri++) {
            const shade = this.triangleShade[tri];
            
            // Get the 3 cells that form this triangle
            const a = this.triangleCells[tri * 3];
            const b = this.triangleCells[tri * 3 + 1];
            const c = this.triangleCells[tri * 3 + 2];
            
            // Calculate water level (minimum surface across triangle)
            const waterLevelA = cellData.cellElevation[a] + cellData.lakeThickness[a];
            const waterLevelB = cellData.cellElevation[b] + cellData.lakeThickness[b];
            const waterLevelC = cellData.cellElevation[c] + cellData.lakeThickness[c];
            const waterLevel = Math.min(waterLevelA, waterLevelB, waterLevelC) - meanSeaLevel - lakeThreshold;
            
            // Fill data for each vertex
            for (let j = 0; j < 3; j++) {
                const idx = tri * 3 + j;
                const cell = this.triangleCells[idx];
                
                // Pack: elevation, water level, unused, shade
                this.dataBuffer[idx * 4] = cellData.cellElevation[cell] - meanSeaLevel;
                this.dataBuffer[idx * 4 + 1] = waterLevel;
                this.dataBuffer[idx * 4 + 2] = 0; // unused
                this.dataBuffer[idx * 4 + 3] = shade;
            }
        }
        
        // Clear and draw terrain
        gl.clearColor(0.2, 0.3, 0.5, 1.0);  // Ocean blue background
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Draw terrain triangles
        gl.useProgram(this.terrainShader);
        gl.uniform2fv(this.terrainShader.canvas_dimensions, [this.canvas.width, this.canvas.height]);
        
        gl.enableVertexAttribArray(this.terrainShader.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexBuffer);
        gl.vertexAttribPointer(this.terrainShader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(this.terrainShader.in_data);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleDataBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dataBuffer);
        gl.vertexAttribPointer(this.terrainShader.in_data, 4, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.triangleCount * 3);
        
        // Draw coastlines
        if (this.options.showCoastlines) {
            this._drawCoastlines();
        }
        
        // Draw rivers
        if (this.options.showRivers && window.erosionSimulation?.discharge) {
            this._drawRivers();
        }
    }
    
    /**
     * Draw coastline overlay (water/land boundaries)
     */
    _drawCoastlines() {
        const gl = this.gl;
        const cellData = this.cellData;
        const lakeThreshold = this.options.lakeThreshold;
        
        this.coastlineWritePos = 0;
        
        // For each triangle, check if it crosses the water threshold
        for (let tri = 0; tri < this.triangleCount; tri++) {
            this._addCoastlineEdges(tri, lakeThreshold);
        }
        
        if (this.coastlineWritePos === 0) return;
        
        // Draw coastline segments
        gl.useProgram(this.lineShader);
        gl.uniform2fv(this.lineShader.canvas_dimensions, [this.canvas.width, this.canvas.height]);
        
        gl.enableVertexAttribArray(this.lineShader.in_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineVertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.coastlineVertices);
        gl.vertexAttribPointer(this.lineShader.in_position, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(this.lineShader.in_opacity);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineOpacityBuffer);
        gl.vertexAttribPointer(this.lineShader.in_opacity, 1, gl.UNSIGNED_BYTE, false, 0, 0);
        
        gl.lineWidth(1);
        gl.drawArrays(gl.LINES, 0, this.coastlineWritePos / 2);
        gl.disableVertexAttribArray(this.lineShader.in_position);
    }
    
    /**
     * Add coastline edges for a triangle (Islands-style contour crossing)
     */
    _addCoastlineEdges(tri, lakeThreshold) {
        const cellData = this.cellData;
        
        let a = this.triangleCells[tri * 3];
        let b = this.triangleCells[tri * 3 + 1];
        let c = this.triangleCells[tri * 3 + 2];
        
        const ltA = cellData.lakeThickness[a];
        const ltB = cellData.lakeThickness[b];
        const ltC = cellData.lakeThickness[c];
        
        // Sort vertices so we know which are wet/dry
        // (simplified from Islands - just check if water crosses threshold)
        const wetA = ltA > lakeThreshold;
        const wetB = ltB > lakeThreshold;
        const wetC = ltC > lakeThreshold;
        
        // Count wet vertices
        const wetCount = (wetA ? 1 : 0) + (wetB ? 1 : 0) + (wetC ? 1 : 0);
        
        // If all wet or all dry, no coastline
        if (wetCount === 0 || wetCount === 3) return;
        
        // Get pixel positions
        const cols = cellData.cols;
        const ax = a % cols, ay = Math.floor(a / cols);
        const bx = b % cols, by = Math.floor(b / cols);
        const cx = c % cols, cy = Math.floor(c / cols);
        
        // Calculate where the coastline crosses each edge
        // This is a simplified version - a proper implementation would
        // interpolate elevation crossings like Islands does
        
        if (wetCount === 1) {
            // One vertex is wet - coastline cuts off corner
            let wet, dry1, dry2, wetX, wetY, dry1X, dry1Y, dry2X, dry2Y;
            if (wetA) {
                wet = a; dry1 = b; dry2 = c;
                wetX = ax; wetY = ay; dry1X = bx; dry1Y = by; dry2X = cx; dry2Y = cy;
            } else if (wetB) {
                wet = b; dry1 = a; dry2 = c;
                wetX = bx; wetY = by; dry1X = ax; dry1Y = ay; dry2X = cx; dry2Y = cy;
            } else {
                wet = c; dry1 = a; dry2 = b;
                wetX = cx; wetY = cy; dry1X = ax; dry1Y = ay; dry2X = bx; dry2Y = by;
            }
            
            // Midpoints of edges from wet to dry vertices
            const mid1X = (wetX + dry1X) / 2;
            const mid1Y = (wetY + dry1Y) / 2;
            const mid2X = (wetX + dry2X) / 2;
            const mid2Y = (wetY + dry2Y) / 2;
            
            this._addCoastlineSegment(mid1X, mid1Y, mid2X, mid2Y);
            
        } else {
            // Two vertices are wet - coastline cuts across
            let dry, wet1, wet2, dryX, dryY, wet1X, wet1Y, wet2X, wet2Y;
            if (!wetA) {
                dry = a; wet1 = b; wet2 = c;
                dryX = ax; dryY = ay; wet1X = bx; wet1Y = by; wet2X = cx; wet2Y = cy;
            } else if (!wetB) {
                dry = b; wet1 = a; wet2 = c;
                dryX = bx; dryY = by; wet1X = ax; wet1Y = ay; wet2X = cx; wet2Y = cy;
            } else {
                dry = c; wet1 = a; wet2 = b;
                dryX = cx; dryY = cy; wet1X = ax; wet1Y = ay; wet2X = bx; wet2Y = by;
            }
            
            // Midpoints of edges from dry to wet vertices
            const mid1X = (dryX + wet1X) / 2;
            const mid1Y = (dryY + wet1Y) / 2;
            const mid2X = (dryX + wet2X) / 2;
            const mid2Y = (dryY + wet2Y) / 2;
            
            this._addCoastlineSegment(mid1X, mid1Y, mid2X, mid2Y);
        }
    }
    
    /**
     * Add a coastline segment to the buffer
     */
    _addCoastlineSegment(x1, y1, x2, y2) {
        const pos = this.coastlineWritePos;
        this.coastlineVertices[pos] = x1;
        this.coastlineVertices[pos + 1] = y1;
        this.coastlineVertices[pos + 2] = x2;
        this.coastlineVertices[pos + 3] = y2;
        this.coastlineWritePos += 4;
    }
    
    /**
     * Draw river overlay (discharge-based river lines)
     */
    _drawRivers() {
        const gl = this.gl;
        const cellData = this.cellData;
        
        // Get discharge from erosion simulation (multiple possible sources)
        let discharge = null;
        let maxNeighbors = 8;
        
        // Try different global names the erosion sim might be stored under
        const erosionSim = window.erosionSimulation || window.lastErosionSimulation;
        
        if (erosionSim?.discharge) {
            discharge = erosionSim.discharge;
            maxNeighbors = erosionSim.maxNeighbors || 8;
        } else if (cellData.discharge) {
            discharge = cellData.discharge;
            maxNeighbors = cellData.maxNeighbors || 8;
        }
        
        if (!discharge) return;
        const km3 = 1000 * 1000 * 1000;
        const lowerThreshold = 0.01 * km3;
        const reference = 2 * km3;
        const lakeThreshold = this.options.lakeThreshold;
        
        this.riverWritePos = 0;
        
        // For each cell, draw river segments to downstream neighbors
        for (let cell = 0; cell < cellData.cellCount; cell++) {
            if (cellData.lakeThickness[cell] > 50) continue; // Skip lake cells
            
            const x = cell % cellData.cols;
            const y = Math.floor(cell / cellData.cols);
            
            // Get neighbors and check discharge
            const neighbors = cellData._getNeighborIndices(cell);
            
            for (let j = 0; j < neighbors.length; j++) {
                const neighbor = neighbors[j];
                if (neighbor < 0 || neighbor >= cellData.cellCount) continue;
                
                const position = cell * cellData.maxNeighbors + j;
                const d = discharge[position];
                
                if (!d || d < lowerThreshold) continue;
                
                // Skip if both cells are underwater
                if (cellData.lakeThickness[cell] > lakeThreshold && 
                    cellData.lakeThickness[neighbor] > lakeThreshold) continue;
                
                const otherX = neighbor % cellData.cols;
                const otherY = Math.floor(neighbor / cellData.cols);
                
                // Calculate opacity based on discharge
                const opacity = Math.min(255, 255 * Math.sqrt(d / reference));
                
                // Add river segment
                const pos = this.riverWritePos * 4;
                this.riverVertices[pos] = x;
                this.riverVertices[pos + 1] = y;
                this.riverVertices[pos + 2] = otherX;
                this.riverVertices[pos + 3] = otherY;
                
                this.riverOpacity[this.riverWritePos * 2] = opacity;
                this.riverOpacity[this.riverWritePos * 2 + 1] = opacity;
                
                this.riverWritePos++;
            }
        }
        
        if (this.riverWritePos === 0) return;
        
        // Draw river segments
        gl.useProgram(this.lineShader);
        gl.uniform2fv(this.lineShader.canvas_dimensions, [this.canvas.width, this.canvas.height]);
        
        gl.enableVertexAttribArray(this.lineShader.in_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverVertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.riverVertices);
        gl.vertexAttribPointer(this.lineShader.in_position, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(this.lineShader.in_opacity);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverOpacityBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.riverOpacity);
        gl.vertexAttribPointer(this.lineShader.in_opacity, 1, gl.UNSIGNED_BYTE, false, 0, 0);
        
        gl.lineWidth(1);
        gl.drawArrays(gl.LINES, 0, this.riverWritePos * 2);
        gl.disableVertexAttribArray(this.lineShader.in_position);
    }
    
    /**
     * Clean up WebGL resources
     */
    dispose() {
        if (!this.gl) return;
        
        const gl = this.gl;
        
        if (this.triangleVertexBuffer) gl.deleteBuffer(this.triangleVertexBuffer);
        if (this.triangleDataBuffer) gl.deleteBuffer(this.triangleDataBuffer);
        if (this.coastlineVertexBuffer) gl.deleteBuffer(this.coastlineVertexBuffer);
        if (this.coastlineOpacityBuffer) gl.deleteBuffer(this.coastlineOpacityBuffer);
        if (this.riverVertexBuffer) gl.deleteBuffer(this.riverVertexBuffer);
        if (this.riverOpacityBuffer) gl.deleteBuffer(this.riverOpacityBuffer);
        
        if (this.terrainShader) gl.deleteProgram(this.terrainShader);
        if (this.lineShader) gl.deleteProgram(this.lineShader);
        
        this.initialized = false;
    }
}

// Export to global scope
global.IslandsWebGLRenderer = IslandsWebGLRenderer;

})(typeof window !== 'undefined' ? window : this);
