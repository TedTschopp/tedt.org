/**
 * Weather System for Tile Map Viewer
 * Provides localized weather effects for individual map tiles
 */

// Weather types and their properties
const weatherTypes = {
    clear: {
        name: 'Clear',
        description: 'Clear skies',
        particleCount: 0,
        overlay: null
    },
    cloudy: {
        name: 'Cloudy',
        description: 'Overcast skies',
        particleCount: 0,
        overlay: {
            color: 'rgba(200, 200, 200, 0.3)',
            animated: false
        }
    },
    rain: {
        name: 'Rain',
        description: 'Rainy weather',
        particleCount: 300,
        particleColor: 'rgba(120, 150, 255, 0.6)',
        particleSize: {min: 1, max: 3},
        particleSpeed: {min: 15, max: 25},
        overlay: {
            color: 'rgba(100, 100, 150, 0.15)',
            animated: true
        }
    },
    storm: {
        name: 'Storm',
        description: 'Thunderstorm',
        particleCount: 400,
        particleColor: 'rgba(120, 160, 255, 0.7)',
        particleSize: {min: 2, max: 4},
        particleSpeed: {min: 20, max: 40},
        lightning: true,
        overlay: {
            color: 'rgba(80, 80, 130, 0.3)',
            animated: true
        }
    },
    snow: {
        name: 'Snow',
        description: 'Snowfall',
        particleCount: 200,
        particleColor: 'rgba(250, 250, 255, 0.8)',
        particleSize: {min: 2, max: 5},
        particleSpeed: {min: 3, max: 8},
        overlay: {
            color: 'rgba(220, 220, 255, 0.1)',
            animated: true
        }
    },
    fog: {
        name: 'Fog',
        description: 'Thick fog',
        particleCount: 0,
        overlay: {
            color: 'rgba(200, 200, 210, 0.5)',
            animated: false
        }
    },
    sandstorm: {
        name: 'Sandstorm',
        description: 'Blowing sand',
        particleCount: 350,
        particleColor: 'rgba(210, 180, 120, 0.6)',
        particleSize: {min: 1, max: 3},
        particleSpeed: {min: 20, max: 35},
        overlay: {
            color: 'rgba(210, 180, 120, 0.3)',
            animated: true
        }
    }
};

// Class to handle weather effects
class WeatherSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.defaultWeather = 'clear';
        this.weatherMap = []; // Will store weather type for each map tile
        this.particles = []; // Global particles for performance
        this.lastUpdate = 0;
        this.lightningTimer = 0;
        this.lightningDuration = 0;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.tileSize = 32; // Default, will be updated
        this.viewX = 0;
        this.viewY = 0;
        this.isHexGrid = true;
        this.weatherTransitionChance = 0.05; // Chance for weather to spread to adjacent tiles
        this.activeWeatherTypes = new Set(['clear']); // Track which weather types are active
    }
    
    // Initialize weather map for the given terrain map
    initWeatherMap(mapWidth, mapHeight, terrainMap) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.weatherMap = [];
        
        // Create initial weather map based on terrain
        for (let y = 0; y < mapHeight; y++) {
            const row = [];
            for (let x = 0; x < mapWidth; x++) {
                // Get terrain type and determine appropriate weather
                const terrain = terrainMap[y][x];
                let weather = this.getWeatherByTerrain(terrain);
                
                // Add some randomness
                if (Math.random() < 0.7) {
                    weather = 'clear';
                }
                
                row.push(weather);
                this.activeWeatherTypes.add(weather);
            }
            this.weatherMap.push(row);
        }
        
        // Generate weather zones to make more realistic patterns
        this.generateWeatherZones();
        
        // Initialize particles for active weather types
        this.initializeParticles();
    }
    
    // Generate coherent weather zones
    generateWeatherZones() {
        // Create larger weather systems by seeding "weather centers"
        const weatherCenters = [];
        const possibleWeathers = Object.keys(weatherTypes);
        
        // Create 3-5 weather centers with different types
        const numCenters = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numCenters; i++) {
            const weatherType = possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)];
            weatherCenters.push({
                x: Math.floor(Math.random() * this.mapWidth),
                y: Math.floor(Math.random() * this.mapHeight),
                radius: 5 + Math.floor(Math.random() * 10),
                weather: weatherType
            });
        }
        
        // Apply weather centers to map
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                // Find the closest weather center
                let closestDist = Infinity;
                let selectedWeather = null;
                
                for (const center of weatherCenters) {
                    const dist = Math.sqrt(
                        Math.pow(x - center.x, 2) + 
                        Math.pow(y - center.y, 2)
                    );
                    
                    if (dist < center.radius && dist < closestDist) {
                        closestDist = dist;
                        selectedWeather = center.weather;
                    }
                }
                
                // If within range of a weather center, apply that weather
                if (selectedWeather) {
                    this.weatherMap[y][x] = selectedWeather;
                    this.activeWeatherTypes.add(selectedWeather);
                }
            }
        }
    }
    
    // Initialize particles for all active weather types
    initializeParticles() {
        this.particles = {};
        
        // Create particles for each active weather type
        for (const weatherType of this.activeWeatherTypes) {
            const weather = weatherTypes[weatherType];
            if (!weather || !weather.particleCount) continue;
            
            this.particles[weatherType] = [];
            
            // Create fewer particles per type since we have multiple weather types
            const particleCount = Math.min(weather.particleCount, 200);
            
            for (let i = 0; i < particleCount; i++) {
                this.particles[weatherType].push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * (weather.particleSize.max - weather.particleSize.min) + weather.particleSize.min,
                    speed: Math.random() * (weather.particleSpeed.max - weather.particleSpeed.min) + weather.particleSpeed.min
                });
            }
        }
    }
    
    // Get weather type based on terrain type
    getWeatherByTerrain(terrainType) {
        // Map terrain indices to appropriate weather
        switch(terrainType) {
            case 13: return 'sandstorm'; // Desert
            case 6: 
            case 15: return Math.random() < 0.3 ? 'rain' : 'clear'; // Forest/Jungle
            case 0:
            case 1:
            case 2: return Math.random() < 0.3 ? 'fog' : 'clear'; // Water
            case 8: return Math.random() < 0.4 ? 'snow' : 'clear'; // Mountains
            default: return 'clear';
        }
    }
    
    // Set global weather (will affect newly generated weather centers)
    setGlobalWeather(weatherType) {
        if (!weatherTypes[weatherType]) {
            console.warn(`Weather type '${weatherType}' not found. Using 'clear' instead.`);
            weatherType = 'clear';
        }
        
        this.defaultWeather = weatherType;
        
        // Create a new weather center at a random position
        const centerX = Math.floor(Math.random() * this.mapWidth);
        const centerY = Math.floor(Math.random() * this.mapHeight);
        const radius = 8 + Math.floor(Math.random() * 8);
        
        // Apply new weather center
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const dist = Math.sqrt(
                    Math.pow(x - centerX, 2) + 
                    Math.pow(y - centerY, 2)
                );
                
                if (dist < radius) {
                    this.weatherMap[y][x] = weatherType;
                }
            }
        }
        
        // Make sure this weather type has particles
        if (!this.particles[weatherType] && weatherTypes[weatherType].particleCount) {
            this.activeWeatherTypes.add(weatherType);
            this.initializeParticles();
        }
    }
    
    // Update view position
    updateView(viewX, viewY, isHexGrid, tileSize = 32, hexWidth, hexHeight) {
        this.viewX = viewX;
        this.viewY = viewY;
        this.isHexGrid = isHexGrid;
        
        if (isHexGrid) {
            this.hexWidth = hexWidth;
            this.hexHeight = hexHeight;
        } else {
            this.tileSize = tileSize;
        }
    }
    
    // Update weather effects
    update(deltaTime) {
        // Update particles for all active weather types
        for (const weatherType in this.particles) {
            const weather = weatherTypes[weatherType];
            if (!weather) continue;
            
            for (let p of this.particles[weatherType]) {
                p.y += p.speed * deltaTime;
                
                // Wrap around when particle reaches bottom
                if (p.y > this.canvas.height) {
                    p.y = 0;
                    p.x = Math.random() * this.canvas.width;
                }
            }
        }
        
        // Handle lightning for storm areas
        this.updateLightning(deltaTime);
        
        // Occasionally propagate weather to adjacent tiles
        if (Math.random() < 0.01) { // 1% chance per frame
            this.propagateWeather();
        }
    }
    
    // Update lightning effects
    updateLightning(deltaTime) {
        if (this.lightningTimer > 0) {
            this.lightningTimer -= deltaTime;
        } else if (this.hasActiveStorms() && Math.random() < 0.02) {
            // Random chance for lightning in stormy areas
            this.lightningDuration = 0.1;
            this.lightningTimer = this.lightningDuration;
        }
    }
    
    // Check if any visible tiles have storm weather
    hasActiveStorms() {
        // Calculate visible tile range
        const startX = Math.max(0, this.viewX);
        const endX = Math.min(this.mapWidth, this.viewX + (this.canvas.width / this.tileSize) + 1);
        const startY = Math.max(0, this.viewY);
        const endY = Math.min(this.mapHeight, this.viewY + (this.canvas.height / this.tileSize) + 1);
        
        // Check for storms in visible area
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.weatherMap[y] && this.weatherMap[y][x] === 'storm') {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Propagate weather to adjacent tiles (weather movement)
    propagateWeather() {
        // Clone current weather map to avoid affecting propagation
        const originalWeatherMap = JSON.parse(JSON.stringify(this.weatherMap));
        
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                // Skip propagation with low probability
                if (Math.random() > this.weatherTransitionChance) continue;
                
                // Get neighbors
                const neighbors = this.isHexGrid ? 
                    this.getHexNeighbors(x, y) : 
                    this.getSquareNeighbors(x, y);
                
                if (neighbors.length > 0) {
                    // Randomly pick a neighbor's weather
                    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                    const neighborWeather = originalWeatherMap[randomNeighbor.y][randomNeighbor.x];
                    
                    // Update this tile's weather
                    this.weatherMap[y][x] = neighborWeather;
                    
                    // Make sure this weather type has particles
                    if (neighborWeather && !this.particles[neighborWeather] && 
                        weatherTypes[neighborWeather] && weatherTypes[neighborWeather].particleCount) {
                        this.activeWeatherTypes.add(neighborWeather);
                        this.initializeParticles();
                    }
                }
            }
        }
    }
    
    // Get hex neighbors
    getHexNeighbors(x, y) {
        const neighbors = [];
        const isOddRow = y % 2 !== 0;
        
        // Directions for hex neighbors
        const directions = isOddRow ? 
            [[0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1]] : 
            [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 0], [0, -1]];
        
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < this.mapWidth && ny >= 0 && ny < this.mapHeight) {
                neighbors.push({x: nx, y: ny});
            }
        }
        
        return neighbors;
    }
    
    // Get square neighbors
    getSquareNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            [0, -1], [1, -1], [1, 0], [1, 1],
            [0, 1], [-1, 1], [-1, 0], [-1, -1]
        ];
        
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < this.mapWidth && ny >= 0 && ny < this.mapHeight) {
                neighbors.push({x: nx, y: ny});
            }
        }
        
        return neighbors;
    }
    
    // Draw weather effects for visible tiles
    draw() {
        // Calculate visible tile range
        const startX = Math.max(0, this.viewX);
        const endX = Math.min(this.mapWidth, this.viewX + Math.ceil(this.canvas.width / this.tileSize) + 1);
        const startY = Math.max(0, this.viewY);
        const endY = Math.min(this.mapHeight, this.viewY + Math.ceil(this.canvas.height / this.tileSize) + 1);
        
        // Create a canvas overlay for weather effects
        this.ctx.save();
        
        // Draw weather overlays for each visible tile
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (!this.weatherMap[y] || !this.weatherMap[y][x]) continue;
                
                const weatherType = this.weatherMap[y][x];
                const weather = weatherTypes[weatherType];
                
                if (!weather || !weather.overlay) continue;
                
                // Calculate screen position
                let screenX, screenY, width, height;
                
                if (this.isHexGrid) {
                    const offsetX = y % 2 === 0 ? 0 : this.hexWidth / 2;
                    screenX = (x - this.viewX) * this.hexWidth + offsetX;
                    screenY = (y - this.viewY) * this.hexHeight * 0.75;
                    width = this.hexWidth;
                    height = this.hexHeight;
                } else {
                    screenX = (x - this.viewX) * this.tileSize;
                    screenY = (y - this.viewY) * this.tileSize;
                    width = this.tileSize;
                    height = this.tileSize;
                }
                
                // Draw weather overlay for this tile
                this.ctx.fillStyle = weather.overlay.color;
                
                if (this.isHexGrid) {
                    // Draw hexagonal overlay
                    this.ctx.save();
                    this.ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI / 3) + Math.PI / 6; // +30° to make flat-topped
                        const hx = screenX + width/2 + (width/2) * Math.cos(angle);
                        const hy = screenY + height/2 + (height/2) * Math.sin(angle);
                        
                        if (i === 0) {
                            this.ctx.moveTo(hx, hy);
                        } else {
                            this.ctx.lineTo(hx, hy);
                        }
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.restore();
                } else {
                    // Draw square overlay
                    this.ctx.fillRect(screenX, screenY, width, height);
                }
            }
        }
        
        // Draw particles for active weather types
        for (const weatherType in this.particles) {
            const weather = weatherTypes[weatherType];
            if (!weather || !this.isWeatherVisible(weatherType)) continue;
            
            this.ctx.fillStyle = weather.particleColor;
            
            for (let p of this.particles[weatherType]) {
                // Only draw particle if it's in a tile with this weather
                const tileX = Math.floor((p.x + this.viewX * this.tileSize) / this.tileSize);
                const tileY = Math.floor((p.y + this.viewY * this.tileSize) / this.tileSize);
                
                if (this.isTileWeather(tileX, tileY, weatherType)) {
                    this.ctx.beginPath();
                    
                    // Different shapes for different weather types
                    if (weatherType === 'snow') {
                        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    } else if (weatherType === 'sandstorm') {
                        this.ctx.rect(p.x, p.y, p.size, p.size);
                    } else {
                        this.ctx.rect(p.x, p.y, p.size * 0.5, p.size * 2.5);
                    }
                    
                    this.ctx.fill();
                }
            }
        }
        
        // Draw lightning effect if active
        if (this.lightningTimer > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (this.lightningTimer / this.lightningDuration)})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.ctx.restore();
    }
    
    // Check if weather type is visible in current view
    isWeatherVisible(weatherType) {
        // Calculate visible tile range
        const startX = Math.max(0, this.viewX);
        const endX = Math.min(this.mapWidth, this.viewX + Math.ceil(this.canvas.width / this.tileSize) + 1);
        const startY = Math.max(0, this.viewY);
        const endY = Math.min(this.mapHeight, this.viewY + Math.ceil(this.canvas.height / this.tileSize) + 1);
        
        // Check if any visible tile has this weather
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.weatherMap[y] && this.weatherMap[y][x] === weatherType) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Check if a specific tile has a specific weather
    isTileWeather(x, y, weatherType) {
        return this.weatherMap[y] && this.weatherMap[y][x] === weatherType;
    }
    
    // Get recommended weather for a given map type
    static getWeatherForMapType(mapType) {
        switch(mapType) {
            case 'desert': return 'sandstorm';
            case 'forest': return 'rain';
            case 'jungle': return 'rain';
            case 'archipelago': return 'cloudy';
            case 'island': return 'clear';
            case 'continent': return 'cloudy';
            default: return 'clear';
        }
    }
}

// Export the weather system
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        WeatherSystem,
        weatherTypes
    };
} else {
    window.WeatherSystem = WeatherSystem;
    window.weatherTypes = weatherTypes;
}
