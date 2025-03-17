/**
 * Map Generator Library
 * Contains functions for procedural generation of tile-based maps
 * Updated for hexagonal grid support
 */

// Map generation functions
const mapGenerators = {
    // Island map with water on the edges and land in the middle
    island: function(width, height) {
        const newMap = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const distFromCenter = Math.sqrt(
                    Math.pow(x - width / 2, 2) + 
                    Math.pow(y - height / 2, 2)
                );
                
                let tileIndex;
                if (distFromCenter < 5) {
                    // Center area: water with castle
                    tileIndex = (x === Math.floor(width/2) && y === Math.floor(height/2)) ? 11 : 0;
                } else if (distFromCenter < 10) {
                    // Shallow water and swamp ring
                    tileIndex = Math.random() < 0.7 ? 2 : 3;
                } else if (distFromCenter < 15) {
                    // Grasslands and villages
                    tileIndex = Math.random() < 0.9 ? 4 : 12;
                } else if (distFromCenter < 25) {
                    // Forest and scrubland area
                    tileIndex = Math.random() < 0.6 ? 6 : 5;
                } else if (distFromCenter < 30) {
                    // Hills with towns
                    tileIndex = Math.random() < 0.9 ? 7 : 10;
                } else {
                    // Mountain rim
                    tileIndex = 8;
                    // Add some dungeon entrances
                    if (Math.random() < 0.05) tileIndex = 9;
                }
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    },
    
    // Continent map with a large landmass surrounded by water
    continent: function(width, height) {
        const newMap = [];
        
        // Create noise-based continent
        const simplexNoise = generateSimplexNoise(width, height);
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                // Get noise value (0-1 range)
                let noiseValue = simplexNoise[y * width + x];
                
                // Add falloff toward the edges for continent shape
                const edgeX = Math.min(x, width - x) / (width * 0.5);
                const edgeY = Math.min(y, height - y) / (height * 0.5);
                const edgeFactor = Math.min(edgeX, edgeY);
                noiseValue *= edgeFactor;
                
                let tileIndex;
                
                // Determine terrain based on noise
                if (noiseValue < 0.3) {
                    tileIndex = 0; // Deep water
                } else if (noiseValue < 0.35) {
                    tileIndex = 1; // Medium water
                } else if (noiseValue < 0.4) {
                    tileIndex = 2; // Shallow water
                } else if (noiseValue < 0.45) {
                    tileIndex = 3; // Swamp
                } else if (noiseValue < 0.6) {
                    tileIndex = 4; // Grass
                    // Add occasional villages
                    if (Math.random() < 0.02) tileIndex = 12; 
                } else if (noiseValue < 0.7) {
                    tileIndex = 5; // Scrub
                } else if (noiseValue < 0.8) {
                    tileIndex = 6; // Forest
                } else if (noiseValue < 0.9) {
                    tileIndex = 7; // Hills
                    // Add occasional towns
                    if (Math.random() < 0.03) tileIndex = 10;
                } else {
                    tileIndex = 8; // Mountains
                    // Add occasional dungeons
                    if (Math.random() < 0.04) tileIndex = 9;
                }
                
                // Place castle/keep in the middle
                if (Math.abs(x - width/2) < 2 && Math.abs(y - height/2) < 2) {
                    if (x === Math.floor(width/2) && y === Math.floor(height/2)) {
                        tileIndex = 11; // Castle/keep
                    } else {
                        tileIndex = 4; // Surrounding grassland
                    }
                }
                
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    },
    
    // Archipelago - many small islands
    archipelago: function(width, height) {
        const newMap = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                // Default to deep water
                let tileIndex = 0;
                
                // Create several island centers
                const islandCenters = [];
                for (let i = 0; i < 15; i++) {
                    islandCenters.push({
                        x: Math.floor(Math.random() * width),
                        y: Math.floor(Math.random() * height),
                        size: 3 + Math.random() * 8
                    });
                }
                
                // Check if point is on an island
                for (let island of islandCenters) {
                    const distFromIsland = Math.sqrt(
                        Math.pow(x - island.x, 2) + 
                        Math.pow(y - island.y, 2)
                    );
                    
                    if (distFromIsland < island.size) {
                        const relativeDistance = distFromIsland / island.size;
                        
                        if (relativeDistance < 0.3) {
                            // Island center
                            tileIndex = 4; // Grass
                            
                            // Occasionally place villages or towns
                            if (Math.random() < 0.1) {
                                tileIndex = Math.random() < 0.7 ? 12 : 10;
                            }
                        } else if (relativeDistance < 0.6) {
                            // Mid island
                            tileIndex = Math.random() < 0.6 ? 6 : 5; // Forest or scrub
                        } else if (relativeDistance < 0.8) {
                            // Island edge
                            tileIndex = 3; // Swamp
                        } else {
                            // Island shore
                            tileIndex = 2; // Shallow water
                        }
                        break;
                    }
                }
                
                // Place castle on a specific island
                const mainIsland = islandCenters[0];
                if (Math.abs(x - mainIsland.x) < 1 && Math.abs(y - mainIsland.y) < 1) {
                    tileIndex = 11; // Castle
                }
                
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    },
    
    // Desert wasteland
    desert: function(width, height) {
        const newMap = [];
        const simplexNoise = generateSimplexNoise(width, height);
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = simplexNoise[y * width + x];
                
                let tileIndex;
                if (noiseValue < 0.2) {
                    tileIndex = 0; // Deep water (rare oasis)
                } else if (noiseValue < 0.3) {
                    tileIndex = 3; // Swamp (oasis)
                } else if (noiseValue < 0.6) {
                    tileIndex = 5; // Scrub (desert scrub)
                } else if (noiseValue < 0.85) {
                    tileIndex = 13; // Desert (primary terrain)
                } else if (noiseValue < 0.95) {
                    tileIndex = 14; // Plateau (rocky formations)
                } else {
                    tileIndex = 8; // Mountains
                }
                
                // Add occasional dungeons, towns and villages
                if (Math.random() < 0.01) {
                    const randomFeature = Math.random();
                    if (randomFeature < 0.2) tileIndex = 9;      // Dungeon
                    else if (randomFeature < 0.5) tileIndex = 10; // Town
                    else tileIndex = 12;                        // Village
                }
                
                // Add central castle
                if (x === Math.floor(width/2) && y === Math.floor(height/2)) {
                    tileIndex = 11; // Castle
                }
                
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    },
    
    // Deep forest
    forest: function(width, height) {
        const newMap = [];
        const simplexNoise = generateSimplexNoise(width, height);
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = simplexNoise[y * width + x];
                
                let tileIndex;
                if (noiseValue < 0.25) {
                    tileIndex = 2; // Shallow water (streams)
                } else if (noiseValue < 0.3) {
                    tileIndex = 3; // Swamp (marshland)
                } else if (noiseValue < 0.4) {
                    tileIndex = 4; // Grass (clearings)
                } else if (noiseValue < 0.75) {
                    tileIndex = 6; // Forest (dominant feature)
                } else if (noiseValue < 0.9) {
                    tileIndex = 15; // Jungle (dense areas)
                } else {
                    tileIndex = 7; // Hills (occasional terrain)
                }
                
                // Add occasional settlements and features
                if (Math.random() < 0.01) {
                    const randomFeature = Math.random();
                    if (randomFeature < 0.4 && tileIndex === 4) tileIndex = 12; // Villages in clearings
                    else if (randomFeature < 0.5) tileIndex = 9; // Hidden dungeons
                }
                
                // Add central castle
                if (x === Math.floor(width/2) && y === Math.floor(height/2)) {
                    tileIndex = 11; // Castle
                    
                    // Clear a small area around the castle
                    if (Math.abs(x - width/2) < 3 && Math.abs(y - height/2) < 3) {
                        tileIndex = 4; // Grassland around castle
                    }
                }
                
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    },
    
    // Tropical jungle
    jungle: function(width, height) {
        const newMap = [];
        const simplexNoise = generateSimplexNoise(width, height);
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = simplexNoise[y * width + x];
                
                let tileIndex;
                if (noiseValue < 0.15) {
                    tileIndex = 0; // Deep water (rivers and lakes)
                } else if (noiseValue < 0.25) {
                    tileIndex = 2; // Shallow water
                } else if (noiseValue < 0.35) {
                    tileIndex = 3; // Swamp (marshland)
                } else if (noiseValue < 0.45) {
                    tileIndex = 6; // Forest (lighter jungle)
                } else if (noiseValue < 0.85) {
                    tileIndex = 15; // Jungle (primary terrain)
                } else if (noiseValue < 0.95) {
                    tileIndex = 14; // Plateau (ancient ruins/high ground)
                } else {
                    tileIndex = 8; // Mountains
                }
                
                // Add occasional settlements and ruins
                if (Math.random() < 0.015) {
                    const randomFeature = Math.random();
                    if (randomFeature < 0.3) tileIndex = 9;      // Dungeon/ruins
                    else if (randomFeature < 0.4) tileIndex = 10; // Town
                    else if (randomFeature < 0.9) tileIndex = 12; // Village
                }
                
                // Add central castle/temple
                if (x === Math.floor(width/2) && y === Math.floor(height/2)) {
                    tileIndex = 11; // Castle/temple complex
                    
                    // Clear a small area around the temple
                    if (Math.abs(x - width/2) < 2 && Math.abs(y - height/2) < 2) {
                        tileIndex = 4; // Clearing around temple
                    }
                }
                
                row.push(tileIndex);
            }
            newMap.push(row);
        }
        return newMap;
    }
};

// Simple Simplex Noise implementation for map generation
function generateSimplexNoise(width, height) {
    const noise = new Array(width * height);
    
    // Generate random gradient vectors
    const gradients = [];
    for (let i = 0; i < 256; i++) {
        const angle = Math.random() * Math.PI * 2;
        gradients.push({
            x: Math.cos(angle),
            y: Math.sin(angle)
        });
    }
    
    // Generate permutation table
    const perm = new Array(512);
    for (let i = 0; i < 256; i++) {
        perm[i] = perm[i + 256] = Math.floor(Math.random() * 256);
    }
    
    // Generate noise values
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Normalize coordinates
            const nx = x / width;
            const ny = y / height;
            
            // Multiple octaves for more natural noise
            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            const octaves = 4;
            
            for (let o = 0; o < octaves; o++) {
                const noiseValue = simplex(nx * frequency, ny * frequency);
                value += noiseValue * amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }
            
            // Normalize to 0-1 range
            noise[y * width + x] = (value + 1) * 0.5;
        }
    }
    
    return noise;
    
    // Simple 2D simplex noise function
    function simplex(x, y) {
        // Find unit grid cell containing the point
        const X = Math.floor(x);
        const Y = Math.floor(y);
        
        // Get relative position within the cell
        x = x - X;
        y = y - Y;
        
        // Compute gradient indices
        const gi00 = perm[(X + perm[Y & 255]) & 255] & 255;
        const gi01 = perm[(X + perm[(Y + 1) & 255]) & 255] & 255;
        const gi10 = perm[((X + 1) + perm[Y & 255]) & 255] & 255;
        const gi11 = perm[((X + 1) + perm[(Y + 1) & 255]) & 255] & 255;
        
        // Calculate contribution from each corner
        const n00 = dot(gradients[gi00], x, y);
        const n10 = dot(gradients[gi10], x - 1, y);
        const n01 = dot(gradients[gi01], x, y - 1);
        const n11 = dot(gradients[gi11], x - 1, y - 1);
        
        // Interpolate to get final noise value
        const u = fade(x);
        const v = fade(y);
        
        const nx0 = lerp(n00, n10, u);
        const nx1 = lerp(n01, n11, u);
        
        return lerp(nx0, nx1, v);
    }
    
    // Helper functions for simplex noise
    function dot(grad, x, y) {
        return grad.x * x + grad.y * y;
    }
    
    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    function lerp(a, b, t) {
        return a + t * (b - a);
    }
}

// Function to create a map based on selected type
function generateMap(mapType, width, height) {
    const generator = mapGenerators[mapType] || mapGenerators.island;
    
    // Generate the base map
    const map = generator(width, height);
    
    // Post-processing for hexagonal grid specifics
    // Since we're using a flat-top hexagonal grid, we need to ensure coherent terrain transitions
    // This helps make terrain look more natural in a hexagonal grid layout
    smoothHexMap(map, width, height);
    
    return map;
}

// Function to smooth terrain transitions for hexagonal grid
function smoothHexMap(map, width, height) {
    // Deep clone the map to avoid modifying during iteration
    const originalMap = JSON.parse(JSON.stringify(map));
    
    // Define terrain compatibility groups
    const waterTypes = [0, 1, 2]; // Deep, medium, shallow water
    const landTypes = [4, 5, 6, 7, 13, 14, 15]; // Various land terrain types
    const specialTypes = [9, 10, 11, 12]; // Dungeons, towns, castles, villages
    
    // Iterate through map and apply smoothing
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            // Skip special features
            if (specialTypes.includes(originalMap[y][x])) continue;
            
            // Get hex neighbors based on odd/even row
            const neighbors = getHexNeighborTiles(originalMap, x, y, width, height);
            
            // Count terrain types in neighborhood
            const waterCount = neighbors.filter(n => waterTypes.includes(n)).length;
            const landCount = neighbors.filter(n => landTypes.includes(n)).length;
            
            // Apply smoothing rules (this is a simple example)
            const currentTile = originalMap[y][x];
            
            // Water surrounded by mostly land should become shallow water or swamp
            if (waterTypes.includes(currentTile) && landCount > 3) {
                map[y][x] = Math.random() < 0.5 ? 2 : 3; // shallow water or swamp
            }
            
            // Land surrounded by mostly water should become shore or swamp
            if (landTypes.includes(currentTile) && waterCount > 3) {
                map[y][x] = Math.random() < 0.7 ? 3 : 5; // swamp or scrub
            }
        }
    }
}

// Helper function to get neighboring tiles in a hexagonal grid
function getHexNeighborTiles(map, x, y, width, height) {
    const neighbors = [];
    
    // Directions for hex neighbors (flat-top orientation)
    // For even rows: NE, E, SE, SW, W, NW
    // For odd rows: NE, E, SE, SW, W, NW (with offset)
    const isOddRow = y % 2 !== 0;
    const directions = isOddRow ? 
        [[0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1]] : 
        [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 0], [0, -1]];
    
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            neighbors.push(map[ny][nx]);
        }
    }
    
    return neighbors;
}

// Export the generateMap function for use in other files
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        generateMap,
        mapGenerators
    };
} else {
    window.MapGenerator = {
        generateMap,
        mapGenerators
    };
}
