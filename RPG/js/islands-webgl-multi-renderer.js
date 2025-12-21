/**
 * Islands-Style Multi-Mode WebGL Renderer
 * 
 * Extends the base Islands WebGL renderer to support multiple visualization modes:
 * - Temperature: Cold-hot gradient
 * - Rainfall: Dry-wet gradient
 * - Biomes: Discrete Whittaker biome colors
 * - Holdridge Life Zones: Discrete zone colors
 * - Elevation: Terrain with hillshade
 * - Ice/Snow: Ice cap visualization
 * 
 * Also supports multiple map projections:
 * - Square (equirectangular)
 * - Mercator
 * - Mollweide
 * - Sinusoidal
 * 
 * Based on TedTschopp/Islands WebGL architecture.
 */

'use strict';

(function(global) {

/**
 * Color palettes for different visualization modes
 */
const COLOR_PALETTES = {
    // Temperature: Blue (cold) -> Red (hot)
    temperature: {
        type: 'gradient',
        stops: [
            { value: -40, color: [50, 70, 180] },      // Deep cold (dark blue)
            { value: -20, color: [80, 130, 220] },    // Cold (medium blue)
            { value: 0, color: [180, 220, 255] },     // Freezing (light blue)
            { value: 10, color: [200, 255, 200] },    // Cool (light green)
            { value: 20, color: [255, 255, 150] },    // Mild (yellow)
            { value: 30, color: [255, 180, 100] },    // Warm (orange)
            { value: 40, color: [220, 80, 80] },      // Hot (red)
            { value: 50, color: [180, 40, 40] }       // Very hot (dark red)
        ],
        ocean: [65, 105, 170],
        unit: '°C'
    },
    
    // Rainfall: Brown (dry) -> Blue (wet)
    rainfall: {
        type: 'gradient',
        stops: [
            { value: 0, color: [200, 180, 130] },     // Arid (tan)
            { value: 250, color: [220, 210, 160] },   // Very dry (light tan)
            { value: 500, color: [200, 220, 150] },   // Dry (yellow-green)
            { value: 1000, color: [150, 200, 100] }, // Moderate (green)
            { value: 2000, color: [80, 160, 120] },  // Wet (dark green)
            { value: 3000, color: [100, 150, 180] }, // Very wet (blue-green)
            { value: 5000, color: [80, 120, 200] },  // Rainforest (blue)
            { value: 8000, color: [60, 80, 160] }    // Extreme (dark blue)
        ],
        ocean: [65, 105, 170],
        unit: 'mm/year'
    },
    
    // Evaporation: Similar to rainfall but inverted semantically
    evaporation: {
        type: 'gradient',
        stops: [
            { value: 0, color: [100, 180, 220] },     // Low evap (blue)
            { value: 500, color: [150, 200, 180] },   // Low-moderate
            { value: 1000, color: [200, 220, 150] },  // Moderate
            { value: 1500, color: [240, 220, 120] },  // Moderate-high
            { value: 2000, color: [240, 180, 100] },  // High
            { value: 3000, color: [220, 120, 80] },   // Very high
            { value: 4000, color: [180, 60, 60] }     // Extreme
        ],
        ocean: [65, 105, 170],
        unit: 'mm/year'
    },
    
    // Snowfall / Snow coverage
    snowfall: {
        type: 'gradient',
        stops: [
            { value: 0, color: [100, 60, 40] },       // No snow (brown)
            { value: 100, color: [150, 120, 100] },   // Little snow
            { value: 500, color: [180, 200, 220] },   // Some snow (light blue)
            { value: 1000, color: [200, 220, 240] },  // Moderate snow
            { value: 2000, color: [220, 240, 255] },  // Heavy snow
            { value: 5000, color: [250, 250, 255] }   // Permanent snow (white)
        ],
        ocean: [65, 105, 170],
        unit: 'mm/year'
    },
    
    // Elevation terrain (standard terrain colors)
    elevation: {
        type: 'gradient',
        stops: [
            { value: -8000, color: [10, 40, 80] },    // Deep ocean
            { value: -4000, color: [30, 70, 120] },   // Mid ocean
            { value: -200, color: [60, 110, 160] },   // Shallow ocean
            { value: 0, color: [80, 150, 110] },      // Coast (green)
            { value: 200, color: [120, 180, 100] },   // Lowlands
            { value: 500, color: [170, 200, 90] },    // Plains
            { value: 1000, color: [200, 190, 100] },  // Hills
            { value: 2000, color: [180, 150, 100] },  // Highlands
            { value: 3000, color: [150, 120, 100] },  // Mountains
            { value: 4000, color: [130, 110, 100] },  // High mountains
            { value: 5000, color: [200, 200, 210] },  // Alpine
            { value: 6000, color: [255, 255, 255] }   // Snow peaks
        ],
        ocean: null,  // Use gradient for ocean depths too
        unit: 'm'
    },
    
    // Whittaker biomes (discrete)
    biome: {
        type: 'discrete',
        colors: {
            0: [65, 105, 170],    // Ocean
            1: [255, 255, 255],   // Ice/Polar
            2: [210, 210, 210],   // Tundra
            3: [105, 155, 120],   // Boreal
            4: [155, 215, 170],   // Temperate Forest
            5: [170, 195, 200],   // Temperate Rain
            6: [250, 215, 165],   // Grassland
            7: [225, 155, 100],   // Steppe
            8: [185, 150, 160],   // Woodland
            9: [220, 195, 175],   // Desert
            10: [130, 190, 25],   // Tropical Forest
            11: [110, 160, 170]   // Tropical Rain
        }
    },
    
    // Ice cap classification
    icecap: {
        type: 'discrete',
        colors: {
            0: [100, 70, 50],      // No ice (brown land)
            1: [224, 224, 232],    // Perennial snow (light gray)
            2: [136, 184, 240],    // Glacier (blue)
            3: [248, 255, 255],    // Ice cap (white)
            255: [65, 105, 170]    // Ocean
        }
    }
};

// Holdridge colors imported from CellDataModel
const HOLDRIDGE_COLORS = {
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
 * Map projection functions for vertex shader
 * These convert lat/lon to screen coordinates
 */
const PROJECTION_FUNCTIONS = {
    square: `
        // Equirectangular (square) projection - direct passthrough
        // Input: x,y in 0-1 range (normalized pixel coords)
        // Output: x,y in 0-1 range (screen coords)
        vec2 project(float x, float y) {
            return vec2(x, y);
        }
    `,
    
    mercator: `
        // Mercator projection
        // Input: x,y in 0-1 range (normalized pixel coords)
        // Output: x,y in 0-1 range (screen coords)
        vec2 project(float x, float y) {
            // Convert y from 0-1 to latitude in radians (-π/2 to π/2)
            // y=0 is top (north), y=1 is bottom (south)
            float lat = (0.5 - y) * 3.14159; // -π/2 to π/2
            float clampedLat = clamp(lat, -1.4, 1.4); // ~80 degrees to avoid infinity
            
            // Mercator Y transformation
            float mercY = log(tan(0.7854 + clampedLat * 0.5)); // 0.7854 = π/4
            float outY = 0.5 - mercY / 3.14159; // Normalize to 0-1
            
            return vec2(x, outY);
        }
    `,
    
    mollweide: `
        // Mollweide (equal-area elliptical) projection
        // Input: x,y in 0-1 range
        // Output: x,y in 0-1 range
        vec2 project(float x, float y) {
            // Convert to lon/lat: x: 0-1 -> -π to π, y: 0-1 -> π/2 to -π/2
            float lon = (x - 0.5) * 6.28318; // -π to π
            float lat = (0.5 - y) * 3.14159; // -π/2 to π/2
            
            // Newton-Raphson iteration for theta
            float theta = lat;
            for (int i = 0; i < 10; i++) {
                float f = 2.0 * theta + sin(2.0 * theta) - 3.14159 * sin(lat);
                float df = 2.0 + 2.0 * cos(2.0 * theta);
                theta = theta - f / df;
            }
            
            // Mollweide x = (2√2/π) * λ * cos(θ), scaled to 0-1
            // Mollweide y = √2 * sin(θ), scaled to 0-1
            float outX = lon * cos(theta) / 3.14159 * 0.5 + 0.5;
            float outY = 0.5 - sin(theta) * 0.5;
            
            return vec2(outX, outY);
        }
    `,
    
    sinusoidal: `
        // Sinusoidal (equal-area) projection
        // Input: x,y in 0-1 range
        // Output: x,y in 0-1 range
        vec2 project(float x, float y) {
            // Convert to lon/lat
            float lon = (x - 0.5) * 6.28318; // -π to π
            float lat = (0.5 - y) * 3.14159; // -π/2 to π/2
            
            // Sinusoidal: x = λ * cos(φ)
            float outX = lon * cos(lat) / 6.28318 + 0.5;
            float outY = y; // Y stays the same in sinusoidal
            
            return vec2(outX, outY);
        }
    `
};

/**
 * IslandsWebGLMultiRenderer - Multi-mode WebGL renderer
 */
class IslandsWebGLMultiRenderer {
    /**
     * @param {HTMLCanvasElement} canvas - Target canvas
     * @param {CellDataModel} cellData - Cell data model with all layers
     * @param {object} options - Renderer options
     */
    constructor(canvas, cellData, options = {}) {
        this.canvas = canvas;
        this.cellData = cellData;
        this.gl = null;
        this.initialized = false;
        
        // Default options
        this.options = {
            mode: options.mode || 'elevation',  // Visualization mode
            projection: options.projection || 'square',
            showCoastlines: options.showCoastlines !== false,
            showRivers: options.showRivers !== false,
            showHillshade: options.showHillshade !== false,
            meanSeaLevel: options.meanSeaLevel || 2000,
            lakeThreshold: options.lakeThreshold || 5,
            ...options
        };
        
        // Shader programs
        this.terrainShader = null;
        this.lineShader = null;
        
        // Buffers
        this.triangleVertexBuffer = null;
        this.triangleDataBuffer = null;
        this.triangleCells = null;
        this.triangleCount = 0;
        
        // Line overlay buffers
        this.coastlineVertexBuffer = null;
        this.coastlineOpacityBuffer = null;
        this.coastlineVertices = null;
        this.coastlineWritePos = 0;
        
        this.riverVertexBuffer = null;
        this.riverOpacityBuffer = null;
        this.riverVertices = null;
        this.riverOpacity = null;
        this.riverWritePos = 0;
        
        // Shading data
        this.shadeValues = null;
    }
    
    /**
     * Initialize WebGL context and compile shaders
     * @returns {boolean} Success status
     */
    init() {
        const canvas = this.canvas;
        
        // Set canvas size to match cell grid
        canvas.width = this.cellData.cols;
        canvas.height = this.cellData.rows;
        
        // Get WebGL context
        const gl = canvas.getContext('webgl', {
            antialias: false,
            preserveDrawingBuffer: true
        });
        
        if (!gl) {
            console.error('WebGL not supported');
            return false;
        }
        
        this.gl = gl;
        
        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Compile shaders for current mode
        if (!this._compileShaders()) {
            return false;
        }
        
        // Build triangle mesh
        this._buildTriangleMesh();
        
        // Create line buffers for overlays
        this._createLineBuffers();
        
        // Calculate hillshade
        if (this.options.showHillshade) {
            this._calculateShades();
        }
        
        this.initialized = true;
        return true;
    }
    
    /**
     * Compile shaders for the current visualization mode
     */
    _compileShaders() {
        const gl = this.gl;
        const mode = this.options.mode;
        const projection = this.options.projection;
        const palette = COLOR_PALETTES[mode];
        
        // Build fragment shader color code based on mode
        let colorCode;
        if (palette && palette.type === 'gradient') {
            colorCode = this._buildGradientColorCode(palette);
        } else if (mode === 'biome') {
            colorCode = this._buildDiscreteColorCode(palette.colors);
        } else if (mode === 'holdridge') {
            colorCode = this._buildHoldridgeColorCode();
        } else if (mode === 'icecap') {
            colorCode = this._buildDiscreteColorCode(palette.colors);
        } else {
            // Default to elevation gradient
            colorCode = this._buildGradientColorCode(COLOR_PALETTES.elevation);
        }
        
        // Vertex shader with projection support
        const vertexSource = `
            attribute vec2 a_position;
            attribute float a_data;
            attribute float a_shade;
            
            varying float v_data;
            varying float v_shade;
            
            uniform vec2 u_canvas_size;
            
            ${PROJECTION_FUNCTIONS[projection] || PROJECTION_FUNCTIONS.square}
            
            void main() {
                // Normalize position to 0-1 range
                float normX = a_position.x / u_canvas_size.x;
                float normY = a_position.y / u_canvas_size.y;
                
                // Apply projection (input: 0-1, output: 0-1)
                vec2 projected = project(normX, normY);
                
                // Convert to clip space (-1 to 1), with Y flipped
                gl_Position = vec4(
                    projected.x * 2.0 - 1.0,
                    1.0 - projected.y * 2.0,
                    0.0, 1.0
                );
                
                v_data = a_data;
                v_shade = a_shade;
            }
        `;
        
        // Fragment shader with mode-specific coloring
        const fragmentSource = `
            precision mediump float;
            
            varying float v_data;
            varying float v_shade;
            
            uniform float u_show_hillshade;
            
            ${colorCode}
            
            void main() {
                vec3 color = getColor(v_data);
                
                // Apply hillshade if enabled
                if (u_show_hillshade > 0.5) {
                    float shade = v_shade;
                    color = color * (0.6 + 0.4 * shade);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        // Compile terrain shader
        this.terrainShader = this._createShaderProgram(vertexSource, fragmentSource);
        if (!this.terrainShader) return false;
        
        // Get attribute/uniform locations
        this.terrainShader.a_position = gl.getAttribLocation(this.terrainShader, 'a_position');
        this.terrainShader.a_data = gl.getAttribLocation(this.terrainShader, 'a_data');
        this.terrainShader.a_shade = gl.getAttribLocation(this.terrainShader, 'a_shade');
        this.terrainShader.u_canvas_size = gl.getUniformLocation(this.terrainShader, 'u_canvas_size');
        this.terrainShader.u_show_hillshade = gl.getUniformLocation(this.terrainShader, 'u_show_hillshade');
        
        // Compile line shader for overlays
        const lineVertexSource = `
            attribute vec2 a_position;
            attribute float a_opacity;
            varying float v_opacity;
            uniform vec2 u_canvas_size;
            
            void main() {
                vec2 clipSpace = (a_position / u_canvas_size) * 2.0 - 1.0;
                clipSpace.y = -clipSpace.y;
                gl_Position = vec4(clipSpace, 0.0, 1.0);
                v_opacity = a_opacity / 255.0;
            }
        `;
        
        const lineFragmentSource = `
            precision mediump float;
            varying float v_opacity;
            uniform vec3 u_color;
            
            void main() {
                gl_FragColor = vec4(u_color, v_opacity);
            }
        `;
        
        this.lineShader = this._createShaderProgram(lineVertexSource, lineFragmentSource);
        if (!this.lineShader) return false;
        
        this.lineShader.a_position = gl.getAttribLocation(this.lineShader, 'a_position');
        this.lineShader.a_opacity = gl.getAttribLocation(this.lineShader, 'a_opacity');
        this.lineShader.u_canvas_size = gl.getUniformLocation(this.lineShader, 'u_canvas_size');
        this.lineShader.u_color = gl.getUniformLocation(this.lineShader, 'u_color');
        
        return true;
    }
    
    /**
     * Build GLSL gradient color code from palette
     */
    _buildGradientColorCode(palette) {
        const stops = palette.stops;
        let code = 'vec3 getColor(float value) {\n';
        
        // Ocean handling if specified
        if (palette.ocean) {
            code += `    if (value < -9990.0) return vec3(${palette.ocean[0]/255.0}, ${palette.ocean[1]/255.0}, ${palette.ocean[2]/255.0});\n`;
        }
        
        // Build gradient interpolation
        for (let i = 0; i < stops.length - 1; i++) {
            const curr = stops[i];
            const next = stops[i + 1];
            const c1 = `vec3(${curr.color[0]/255.0}, ${curr.color[1]/255.0}, ${curr.color[2]/255.0})`;
            const c2 = `vec3(${next.color[0]/255.0}, ${next.color[1]/255.0}, ${next.color[2]/255.0})`;
            
            if (i === 0) {
                code += `    if (value <= ${curr.value.toFixed(1)}) return ${c1};\n`;
            }
            code += `    if (value <= ${next.value.toFixed(1)}) {\n`;
            code += `        float t = (value - ${curr.value.toFixed(1)}) / ${(next.value - curr.value).toFixed(1)};\n`;
            code += `        return mix(${c1}, ${c2}, t);\n`;
            code += `    }\n`;
        }
        
        // Above max
        const last = stops[stops.length - 1];
        code += `    return vec3(${last.color[0]/255.0}, ${last.color[1]/255.0}, ${last.color[2]/255.0});\n`;
        code += '}\n';
        
        return code;
    }
    
    /**
     * Build GLSL discrete color code from color map
     */
    _buildDiscreteColorCode(colors) {
        let code = 'vec3 getColor(float value) {\n';
        code += '    int idx = int(value + 0.5);\n';
        
        for (const [key, color] of Object.entries(colors)) {
            code += `    if (idx == ${key}) return vec3(${color[0]/255.0}, ${color[1]/255.0}, ${color[2]/255.0});\n`;
        }
        
        // Default fallback
        code += '    return vec3(0.5, 0.5, 0.5);\n';
        code += '}\n';
        
        return code;
    }
    
    /**
     * Build GLSL Holdridge color code using zone index encoding
     */
    _buildHoldridgeColorCode() {
        // Build color lookup from zone names
        // Zone indices are encoded as: thermalBelt * 7 + humidityProvince
        // Plus 100 for ocean
        let code = 'vec3 getColor(float value) {\n';
        code += '    int idx = int(value + 0.5);\n';
        
        // Ocean
        code += `    if (idx == 100) return vec3(${65/255.0}, ${105/255.0}, ${170/255.0});\n`;
        
        // Generate colors for each thermal belt × humidity province combination
        const thermalBelts = ['Polar', 'Subpolar', 'Boreal', 'Cool Temperate', 'Warm Temperate', 'Subtropical', 'Tropical'];
        const humidityZones = [
            ['Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert', 'Polar Desert'],
            ['Wet Tundra', 'Moist Tundra', 'Tundra', 'Dry Tundra', 'Steppe', 'Desert', 'Desert'],
            ['Rain Forest', 'Wet Forest', 'Moist Forest', 'Dry Forest', 'Steppe', 'Desert', 'Desert'],
            ['Rain Forest', 'Wet Forest', 'Moist Forest', 'Dry Forest', 'Steppe', 'Desert', 'Desert'],
            ['Rain Forest', 'Wet Forest', 'Moist Forest', 'Dry Forest', 'Steppe', 'Desert', 'Desert'],
            ['Rain Forest', 'Wet Forest', 'Moist Forest', 'Dry Forest', 'Thorn Woodland', 'Desert', 'Desert'],
            ['Rain Forest', 'Wet Forest', 'Moist Forest', 'Dry Forest', 'Thorn Woodland', 'Desert', 'Desert']
        ];
        
        for (let tb = 0; tb < 7; tb++) {
            for (let hp = 0; hp < 7; hp++) {
                const idx = tb * 7 + hp;
                const zoneSuffix = humidityZones[tb][hp];
                let zoneName;
                
                if (tb === 0) {
                    zoneName = 'Polar Desert';
                } else if (tb === 1) {
                    zoneName = `Subpolar ${zoneSuffix}`;
                } else {
                    zoneName = `${thermalBelts[tb]} ${zoneSuffix}`;
                }
                
                const color = HOLDRIDGE_COLORS[zoneName] || [128, 128, 128];
                code += `    if (idx == ${idx}) return vec3(${color[0]/255.0}, ${color[1]/255.0}, ${color[2]/255.0});\n`;
            }
        }
        
        // Default
        code += '    return vec3(0.5, 0.5, 0.5);\n';
        code += '}\n';
        
        return code;
    }
    
    /**
     * Create shader program from vertex and fragment source
     */
    _createShaderProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
            return null;
        }
        
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
            return null;
        }
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    /**
     * Build triangle mesh from cell grid
     */
    _buildTriangleMesh() {
        const cellData = this.cellData;
        const cols = cellData.cols;
        const rows = cellData.rows;
        
        // Two triangles per cell (except last row/col)
        const maxTriangles = (cols - 1) * (rows - 1) * 2;
        
        // Position array: 3 vertices × 2 coords per triangle
        const positions = new Float32Array(maxTriangles * 6);
        // Data array: 3 values per triangle (one per vertex)
        const dataValues = new Float32Array(maxTriangles * 3);
        // Cell indices for coastline detection
        this.triangleCells = new Uint32Array(maxTriangles * 3);
        
        let triIdx = 0;
        
        for (let row = 0; row < rows - 1; row++) {
            for (let col = 0; col < cols - 1; col++) {
                // Cell indices for this quad
                const tl = row * cols + col;
                const tr = row * cols + col + 1;
                const bl = (row + 1) * cols + col;
                const br = (row + 1) * cols + col + 1;
                
                // Get data values based on mode
                const dataTL = this._getDataValue(tl);
                const dataTR = this._getDataValue(tr);
                const dataBL = this._getDataValue(bl);
                const dataBR = this._getDataValue(br);
                
                // Triangle 1: TL, TR, BL
                const base1 = triIdx * 6;
                positions[base1] = col;
                positions[base1 + 1] = row;
                positions[base1 + 2] = col + 1;
                positions[base1 + 3] = row;
                positions[base1 + 4] = col;
                positions[base1 + 5] = row + 1;
                
                const dataBase1 = triIdx * 3;
                dataValues[dataBase1] = dataTL;
                dataValues[dataBase1 + 1] = dataTR;
                dataValues[dataBase1 + 2] = dataBL;
                
                this.triangleCells[dataBase1] = tl;
                this.triangleCells[dataBase1 + 1] = tr;
                this.triangleCells[dataBase1 + 2] = bl;
                
                triIdx++;
                
                // Triangle 2: TR, BR, BL
                const base2 = triIdx * 6;
                positions[base2] = col + 1;
                positions[base2 + 1] = row;
                positions[base2 + 2] = col + 1;
                positions[base2 + 3] = row + 1;
                positions[base2 + 4] = col;
                positions[base2 + 5] = row + 1;
                
                const dataBase2 = triIdx * 3;
                dataValues[dataBase2] = dataTR;
                dataValues[dataBase2 + 1] = dataBR;
                dataValues[dataBase2 + 2] = dataBL;
                
                this.triangleCells[dataBase2] = tr;
                this.triangleCells[dataBase2 + 1] = br;
                this.triangleCells[dataBase2 + 2] = bl;
                
                triIdx++;
            }
        }
        
        this.triangleCount = triIdx;
        
        // Create GPU buffers
        const gl = this.gl;
        
        this.triangleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        this.triangleDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, dataValues, gl.STATIC_DRAW);
    }
    
    /**
     * Get data value for a cell based on current mode
     */
    _getDataValue(cell) {
        const cellData = this.cellData;
        const mode = this.options.mode;
        const seaLevel = this.options.meanSeaLevel;
        const elevation = cellData.cellElevation[cell];
        const isOcean = elevation < seaLevel;
        
        switch (mode) {
            case 'temperature':
                if (isOcean) return -9999;  // Signal for ocean color
                return cellData.temperature[cell];
                
            case 'rainfall':
                if (isOcean) return -9999;
                return cellData.rainfall[cell];
                
            case 'evaporation':
                if (isOcean) return -9999;
                return cellData.evaporation[cell];
                
            case 'snowfall':
                if (isOcean) return -9999;
                return cellData.snowAccumulation ? cellData.snowAccumulation[cell] : 0;
                
            case 'elevation':
                return elevation - seaLevel;  // Relative to sea level
                
            case 'biome':
                if (isOcean) return 0;  // Ocean biome index
                return cellData.biomeIndex ? cellData.biomeIndex[cell] : 0;
                
            case 'holdridge':
                if (isOcean) return 100;  // Ocean signal
                const holdridgeIdx = cellData.holdridgeIndex ? cellData.holdridgeIndex[cell] : 0;
                // Handle 255 ocean marker from cell data model
                if (holdridgeIdx === 255) return 100;
                return holdridgeIdx;
                
            case 'icecap':
                if (isOcean) return 255;  // Ocean
                if (cellData.isIceCap && cellData.isIceCap[cell]) return 3;
                if (cellData.isGlacier && cellData.isGlacier[cell]) return 2;
                if (cellData.hasPerennialSnow && cellData.hasPerennialSnow[cell]) return 1;
                return 0;  // No ice
                
            default:
                return elevation - seaLevel;
        }
    }
    
    /**
     * Create line buffers for coastline and river overlays
     */
    _createLineBuffers() {
        const gl = this.gl;
        const maxSegments = this.triangleCount * 3;
        
        // Coastline buffers
        this.coastlineVertices = new Float32Array(maxSegments * 4);
        this.coastlineVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.coastlineVertices, gl.DYNAMIC_DRAW);
        
        this.coastlineOpacityBuffer = gl.createBuffer();
        const coastlineOpacity = new Uint8Array(maxSegments * 2);
        coastlineOpacity.fill(200);  // Fixed opacity for coastlines
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineOpacityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, coastlineOpacity, gl.STATIC_DRAW);
        
        // River buffers
        this.riverVertices = new Float32Array(maxSegments * 4);
        this.riverOpacity = new Uint8Array(maxSegments * 2);
        
        this.riverVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.riverVertices, gl.DYNAMIC_DRAW);
        
        this.riverOpacityBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverOpacityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.riverOpacity, gl.DYNAMIC_DRAW);
    }
    
    /**
     * Calculate hillshade values for terrain
     */
    _calculateShades() {
        const cellData = this.cellData;
        const cols = cellData.cols;
        const rows = cellData.rows;
        
        this.shadeValues = new Float32Array(cellData.cellCount);
        
        // Sun direction (normalized)
        const sunDir = { x: -0.5, y: -0.5, z: 0.707 };
        
        for (let row = 1; row < rows - 1; row++) {
            for (let col = 1; col < cols - 1; col++) {
                const cell = row * cols + col;
                
                // Get neighboring elevations
                const left = cellData.cellElevation[cell - 1];
                const right = cellData.cellElevation[cell + 1];
                const up = cellData.cellElevation[cell - cols];
                const down = cellData.cellElevation[cell + cols];
                
                // Calculate surface normal via cross product
                const dx = (right - left) / 2;
                const dy = (down - up) / 2;
                
                // Normal = (-dx, -dy, 1) normalized
                const len = Math.sqrt(dx * dx + dy * dy + 1);
                const nx = -dx / len;
                const ny = -dy / len;
                const nz = 1 / len;
                
                // Dot product with sun direction
                const shade = nx * sunDir.x + ny * sunDir.y + nz * sunDir.z;
                this.shadeValues[cell] = Math.max(0, Math.min(1, (shade + 1) / 2));
            }
        }
    }
    
    /**
     * Update visualization mode (requires shader recompilation)
     * @param {string} mode - New mode ('temperature', 'rainfall', etc.)
     */
    setMode(mode) {
        if (mode === this.options.mode) return;
        
        this.options.mode = mode;
        
        // Recompile shaders for new mode
        if (this.initialized) {
            const gl = this.gl;
            if (this.terrainShader) gl.deleteProgram(this.terrainShader);
            
            this._compileShaders();
            this._buildTriangleMesh();  // Rebuild with new data
        }
    }
    
    /**
     * Update projection (requires shader recompilation)
     * @param {string} projection - New projection ('square', 'mercator', etc.)
     */
    setProjection(projection) {
        if (projection === this.options.projection) return;
        
        this.options.projection = projection;
        
        // Recompile shaders for new projection
        if (this.initialized) {
            const gl = this.gl;
            if (this.terrainShader) gl.deleteProgram(this.terrainShader);
            
            this._compileShaders();
        }
    }
    
    /**
     * Render the visualization
     */
    render() {
        if (!this.initialized) return;
        
        const gl = this.gl;
        
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.1, 0.2, 0.35, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Draw terrain triangles
        gl.useProgram(this.terrainShader);
        gl.uniform2fv(this.terrainShader.u_canvas_size, [this.cellData.cols, this.cellData.rows]);
        gl.uniform1f(this.terrainShader.u_show_hillshade, this.options.showHillshade ? 1.0 : 0.0);
        
        // Bind position buffer
        gl.enableVertexAttribArray(this.terrainShader.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexBuffer);
        gl.vertexAttribPointer(this.terrainShader.a_position, 2, gl.FLOAT, false, 0, 0);
        
        // Bind data buffer
        gl.enableVertexAttribArray(this.terrainShader.a_data);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleDataBuffer);
        gl.vertexAttribPointer(this.terrainShader.a_data, 1, gl.FLOAT, false, 0, 0);
        
        // Bind shade values if available
        if (this.shadeValues && this.terrainShader.a_shade >= 0) {
            // Create shade buffer if not exists
            if (!this.shadeBuffer) {
                this.shadeBuffer = gl.createBuffer();
                
                // Expand shade values to per-vertex (3 per triangle)
                const shadePerVertex = new Float32Array(this.triangleCount * 3);
                for (let tri = 0; tri < this.triangleCount; tri++) {
                    for (let v = 0; v < 3; v++) {
                        const cell = this.triangleCells[tri * 3 + v];
                        shadePerVertex[tri * 3 + v] = this.shadeValues[cell];
                    }
                }
                
                gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, shadePerVertex, gl.STATIC_DRAW);
            }
            
            gl.enableVertexAttribArray(this.terrainShader.a_shade);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shadeBuffer);
            gl.vertexAttribPointer(this.terrainShader.a_shade, 1, gl.FLOAT, false, 0, 0);
        }
        
        gl.drawArrays(gl.TRIANGLES, 0, this.triangleCount * 3);
        
        // Draw overlays
        if (this.options.showCoastlines) {
            this._drawCoastlines();
        }
        
        if (this.options.showRivers) {
            this._drawRivers();
        }
    }
    
    /**
     * Draw coastline overlay
     */
    _drawCoastlines() {
        const gl = this.gl;
        const cellData = this.cellData;
        const lakeThreshold = this.options.lakeThreshold;
        
        this.coastlineWritePos = 0;
        
        // For each triangle, check if it crosses the water threshold
        for (let tri = 0; tri < this.triangleCount; tri++) {
            const a = this.triangleCells[tri * 3];
            const b = this.triangleCells[tri * 3 + 1];
            const c = this.triangleCells[tri * 3 + 2];
            
            const ltA = cellData.lakeThickness[a];
            const ltB = cellData.lakeThickness[b];
            const ltC = cellData.lakeThickness[c];
            
            const wetA = ltA > lakeThreshold;
            const wetB = ltB > lakeThreshold;
            const wetC = ltC > lakeThreshold;
            
            const wetCount = (wetA ? 1 : 0) + (wetB ? 1 : 0) + (wetC ? 1 : 0);
            
            if (wetCount === 0 || wetCount === 3) continue;
            
            // Get pixel positions
            const cols = cellData.cols;
            const ax = a % cols, ay = Math.floor(a / cols);
            const bx = b % cols, by = Math.floor(b / cols);
            const cx = c % cols, cy = Math.floor(c / cols);
            
            if (wetCount === 1) {
                let wetX, wetY, dry1X, dry1Y, dry2X, dry2Y;
                if (wetA) { wetX = ax; wetY = ay; dry1X = bx; dry1Y = by; dry2X = cx; dry2Y = cy; }
                else if (wetB) { wetX = bx; wetY = by; dry1X = ax; dry1Y = ay; dry2X = cx; dry2Y = cy; }
                else { wetX = cx; wetY = cy; dry1X = ax; dry1Y = ay; dry2X = bx; dry2Y = by; }
                
                const mid1X = (wetX + dry1X) / 2;
                const mid1Y = (wetY + dry1Y) / 2;
                const mid2X = (wetX + dry2X) / 2;
                const mid2Y = (wetY + dry2Y) / 2;
                
                this._addCoastlineSegment(mid1X, mid1Y, mid2X, mid2Y);
            } else {
                let dryX, dryY, wet1X, wet1Y, wet2X, wet2Y;
                if (!wetA) { dryX = ax; dryY = ay; wet1X = bx; wet1Y = by; wet2X = cx; wet2Y = cy; }
                else if (!wetB) { dryX = bx; dryY = by; wet1X = ax; wet1Y = ay; wet2X = cx; wet2Y = cy; }
                else { dryX = cx; dryY = cy; wet1X = ax; wet1Y = ay; wet2X = bx; wet2Y = by; }
                
                const mid1X = (dryX + wet1X) / 2;
                const mid1Y = (dryY + wet1Y) / 2;
                const mid2X = (dryX + wet2X) / 2;
                const mid2Y = (dryY + wet2Y) / 2;
                
                this._addCoastlineSegment(mid1X, mid1Y, mid2X, mid2Y);
            }
        }
        
        if (this.coastlineWritePos === 0) return;
        
        gl.useProgram(this.lineShader);
        gl.uniform2fv(this.lineShader.u_canvas_size, [this.canvas.width, this.canvas.height]);
        gl.uniform3fv(this.lineShader.u_color, [0.2, 0.2, 0.2]);
        
        gl.enableVertexAttribArray(this.lineShader.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineVertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.coastlineVertices);
        gl.vertexAttribPointer(this.lineShader.a_position, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(this.lineShader.a_opacity);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coastlineOpacityBuffer);
        gl.vertexAttribPointer(this.lineShader.a_opacity, 1, gl.UNSIGNED_BYTE, false, 0, 0);
        
        gl.lineWidth(1);
        gl.drawArrays(gl.LINES, 0, this.coastlineWritePos / 2);
    }
    
    _addCoastlineSegment(x1, y1, x2, y2) {
        const pos = this.coastlineWritePos;
        this.coastlineVertices[pos] = x1;
        this.coastlineVertices[pos + 1] = y1;
        this.coastlineVertices[pos + 2] = x2;
        this.coastlineVertices[pos + 3] = y2;
        this.coastlineWritePos += 4;
    }
    
    /**
     * Draw river overlay
     */
    _drawRivers() {
        const gl = this.gl;
        const cellData = this.cellData;
        
        // Get discharge data
        let discharge = null;
        const erosionSim = window.erosionSimulation || window.lastErosionSimulation;
        
        if (erosionSim?.discharge) {
            discharge = erosionSim.discharge;
        } else if (cellData.discharge) {
            discharge = cellData.discharge;
        }
        
        if (!discharge) return;
        
        const km3 = 1000 * 1000 * 1000;
        const lowerThreshold = 0.01 * km3;
        const reference = 2 * km3;
        const lakeThreshold = this.options.lakeThreshold;
        
        this.riverWritePos = 0;
        
        for (let cell = 0; cell < cellData.cellCount; cell++) {
            if (cellData.lakeThickness[cell] > 50) continue;
            
            const x = cell % cellData.cols;
            const y = Math.floor(cell / cellData.cols);
            
            const neighbors = cellData._getNeighborIndices(cell);
            
            for (let j = 0; j < neighbors.length; j++) {
                const neighbor = neighbors[j];
                if (neighbor < 0 || neighbor >= cellData.cellCount) continue;
                
                const position = cell * cellData.maxNeighbors + j;
                const d = discharge[position];
                
                if (!d || d < lowerThreshold) continue;
                
                if (cellData.lakeThickness[cell] > lakeThreshold && 
                    cellData.lakeThickness[neighbor] > lakeThreshold) continue;
                
                const otherX = neighbor % cellData.cols;
                const otherY = Math.floor(neighbor / cellData.cols);
                
                const opacity = Math.min(255, 255 * Math.sqrt(d / reference));
                
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
        
        gl.useProgram(this.lineShader);
        gl.uniform2fv(this.lineShader.u_canvas_size, [this.canvas.width, this.canvas.height]);
        gl.uniform3fv(this.lineShader.u_color, [0.2, 0.4, 0.8]);
        
        gl.enableVertexAttribArray(this.lineShader.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverVertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.riverVertices);
        gl.vertexAttribPointer(this.lineShader.a_position, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(this.lineShader.a_opacity);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.riverOpacityBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.riverOpacity);
        gl.vertexAttribPointer(this.lineShader.a_opacity, 1, gl.UNSIGNED_BYTE, false, 0, 0);
        
        gl.lineWidth(1);
        gl.drawArrays(gl.LINES, 0, this.riverWritePos * 2);
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
        if (this.shadeBuffer) gl.deleteBuffer(this.shadeBuffer);
        
        if (this.terrainShader) gl.deleteProgram(this.terrainShader);
        if (this.lineShader) gl.deleteProgram(this.lineShader);
        
        this.initialized = false;
    }
}

// Export
global.IslandsWebGLMultiRenderer = IslandsWebGLMultiRenderer;
global.WEBGL_COLOR_PALETTES = COLOR_PALETTES;

})(typeof window !== 'undefined' ? window : this);
