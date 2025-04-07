// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// world.js // version 1.0.2
//
// written by drow <drow@bin.sh>
// http://creativecommons.org/licenses/by-nc/3.0/

'use strict';

/**
 * Fractal World Generator
 * This script generates procedural maps with various projections and styles.
 * It uses prototype.js for DOM manipulation and event handling.
 */
((window, initFunction) => {
    // Make updateMap globally accessible
    var globalExports = {};
    
    initFunction(window, globalExports);
    
    // Expose the updateMap function to the global scope
    window.updateMap = globalExports.updateMap;
    
})(window, (window, exports) => {
    // Event handler functions for UI elements
    
    /**
     * Generates a new random seed and updates the map
     */
    function generateNewSeed() {
        $("seed").setValue(random(2147483647));
        updateMap();
    }

    /**
     * Updates the map when the seed is changed
     */
    function onSeedChange() {
        updateMap();
    }

    /**
     * Validates and updates the water percentage
     */
    function onWaterPercentageChange() {
        validateInputValue("pct_water", 0, 100);
        updateMap();
    }

    /**
     * Validates and updates the ice percentage
     */
    function onIcePercentageChange() {
        validateInputValue("pct_ice", 0, 100);
        updateMap();
    }

    /**
     * Validates and updates the map height
     */
    function onHeightChange() {
        validateInputValue("height", 100, max_height);
        updateMap();
    }

    /**
     * Validates and updates the iteration count
     */
    function onIterationChange() {
        validateInputValue("iter", 1E3, max_iter);
        updateMap();
    }

    /**
     * Validates and updates the rotation angle
     */
    function onRotationChange() {
        validateInputValue("rotate", 0, 360);
        updateMap();
    }

    /**
     * Validates input values to ensure they're within specified range
     * @param {string} elementId - The ID of the input element to validate
     * @param {number} minValue - The minimum allowed value
     * @param {number} maxValue - The maximum allowed value
     * @returns {number} - The validated value
     */
    function validateInputValue(elementId, minValue, maxValue) {
        let value = $(elementId).intValue();
        if (value < minValue) {
            value = minValue;
        }
        if (maxValue && value > maxValue) {
            value = maxValue;
        }
        $(elementId).setValue(value);
        return value;
    }

    /**
     * Main function to update the map with current settings
     * Handles map generation, terrain distribution, and rendering
     */
    function updateMap() {
        // Create configuration object with current settings
        var config = {
            seed: set_Prng_Seed($("seed").intValue()),
            algorithm: $("algorithm").getValue(), // Get algorithm from dropdown
            iter: $("iter").intValue(),
            hack_theta: $("enable_hack_theta").checked, // Get theta hack toggle
            erode: $("erode").checked, // Get erosion toggle
            pct_water: $("pct_water").intValue(),
            pct_ice: $("pct_ice").intValue(),
            height: $("height").intValue(),
            rotate: $("rotate").intValue() % 360,
            projection: $("projection").getValue(),
            palette: $("palette").getValue(),
            terrain_variation: $("terrain_variation").intValue(), // Get terrain variation from slider
            horizontal_factor: $("horizontal_factor").intValue() / 100, // Get horizontal factor (scaled 0-1)
            vertical_factor: $("vertical_factor").intValue() / 100, // Get vertical factor (scaled 0-1)
            timing: {
                marks: [],
                t0: Date.now(),
                t: Date.now(),
            },
        };
        var timing = config.timing;
        
        // Apply projection settings
        config = applyProjection(config);
        
        // Generate the heightmap using the selected algorithm
        if (config.algorithm == "voss") {
            config = generateVossMap(config);
        } else if (config.algorithm == "voss_x3") {
            config = generateVossXMap(3, "x", config);
        } else if (config.algorithm == "voss_a7") {
            config = generateVossXMap(7, "a", config);
        }
        
        // Apply erosion if enabled
        if (config.erode) {
            var erodedMap = createEmptyMap(config, 0),
                row;
            for (row = 0; row < config.rows; row++) {
                var col;
                for (col = 0; col < config.cols; col++) {
                    var mapRow = erodedMap[row],
                        mapCol = col;
                    var mapConfig = config;
                    var currentRow = row,
                        currentCol = col;
                    // Average the surrounding cells (3x3 filter)
                    mapConfig = getMapValue(mapConfig, currentRow - 1, currentCol - 1) + 
                               getMapValue(mapConfig, currentRow, currentCol - 1) + 
                               getMapValue(mapConfig, currentRow + 1, currentCol - 1) + 
                               getMapValue(mapConfig, currentRow - 1, currentCol) + 
                               getMapValue(mapConfig, currentRow, currentCol) + 
                               getMapValue(mapConfig, currentRow + 1, currentCol) + 
                               getMapValue(mapConfig, currentRow - 1, currentCol + 1) + 
                               getMapValue(mapConfig, currentRow, currentCol + 1) + 
                               getMapValue(mapConfig, currentRow + 1, currentCol + 1);
                    mapRow[mapCol] = mapConfig / 9;
                }
            }
            config.map = erodedMap;
            config = normalizeMap(config);
        }
        
        // Store the original heightmap for use in generating climate maps
        const originalHeightMap = JSON.parse(JSON.stringify(config.map));
        const waterLevel = calculateWaterLevel(config);
        
        // Get the palette configuration
        var palette = config.palette;
        var minHeight = 2147483647;
        var maxHeight = 0;
        
        // Find min and max height values
        for (row = 0; row < config.rows; row++) {
            for (var col = 0; col < config.cols; col++) {
                if (config.map[row][col] < minHeight) {
                    minHeight = config.map[row][col];
                }
                if (config.map[row][col] > maxHeight) {
                    maxHeight = config.map[row][col];
                }
            }
        }
        
        // Calculate terrain distribution
        var terrainCount = palette.n_terrain;
        var heightScale = (terrainCount - 1) / (maxHeight - minHeight);
        var terrainDistribution = [];
        for (row = 0; row < terrainCount; row++) {
            terrainDistribution[row] = 0;
        }
        
        // Count cells at each height level
        for (row = 1; row < config.rows; row++) {
            for (col = 0; col < config.cols; col++) {
                terrainDistribution[Math.floor((config.map[row][col] - minHeight) * heightScale)]++;
            }
        }
        
        // Calculate water level based on water percentage
        var waterThreshold = Math.floor(config.pct_water / 100 * config.map_len);
        var accumulatedTerrain = 0;
        var calculatedWaterLevel;
        for (row = 0; row < terrainCount; row++) {
            if (accumulatedTerrain += terrainDistribution[row], accumulatedTerrain > waterThreshold) {
                calculatedWaterLevel = row;
                break;
            }
        }
        calculatedWaterLevel = Math.floor(calculatedWaterLevel / heightScale) + minHeight;
        
        // Scale sea and land heights to match palette ranges
        var seaScale = palette.n_sea / (calculatedWaterLevel - minHeight + 1);
        var landScale = palette.n_land / (maxHeight - calculatedWaterLevel + 1);
        
        // Apply terrain types to map cells
        for (row = 0; row < config.rows; row++) {
            for (col = 0; col < config.cols; col++) {
                config.map[row][col] = config.map[row][col] < calculatedWaterLevel ? 
                    Math.floor((config.map[row][col] - minHeight) * seaScale) + palette.sea_idx : 
                    Math.floor((config.map[row][col] - calculatedWaterLevel) * landScale) + palette.land_idx;
            }
        }
        
        // Apply ice caps based on ice percentage
        var finalMap = config = applyIce(config);
        timing = markTiming(timing, "create");
        
        // Set up rendering configuration based on projection
        var imageConfig = {};
        if (finalMap.projection == "mercator" || finalMap.projection == "transmerc") {
            imageConfig.height = finalMap.height;
            imageConfig.width = Math.floor(Math.PI / 2 * finalMap.height);
        } else if (finalMap.projection == "icosahedral") {
            imageConfig.height = finalMap.height;
            imageConfig.width = Math.floor(2.116950987 * finalMap.height);
            imageConfig.col_w = imageConfig.width / 11;
            imageConfig.row_h = imageConfig.height / 3;
        } else {
            imageConfig.height = finalMap.rows;
            imageConfig.width = finalMap.cols;
        }
        
        // Additional settings for certain projections
        if (finalMap.projection == "mollweide" || finalMap.projection == "sinusoidal") {
            imageConfig.wd2 = Math.floor(imageConfig.width / 2);
        }
        
        // Create the map image
        var mapImage = new_image("map", imageConfig.width, imageConfig.height);
        cache_pixels(true);
        
        // Render the map with the appropriate projection
        if (finalMap.projection == "mercator") {
            renderMercatorProjection(mapImage, finalMap, imageConfig);
        } else if (finalMap.projection == "transmerc") {
            renderTransverseMercatorProjection(mapImage, finalMap, imageConfig);
        } else if (finalMap.projection == "icosahedral") {
            renderIcosahedralProjection(mapImage, finalMap, imageConfig);
        } else if (finalMap.projection == "mollweide") {
            renderMollweideProjection(mapImage, finalMap, imageConfig);
        } else if (finalMap.projection == "sinusoidal") {
            renderSinusoidalProjection(mapImage, finalMap, imageConfig);
        } else {
            // Default square projection
            renderSquareProjection(mapImage, finalMap, imageConfig);
        }
        
        // Draw the pixels to the canvas
        draw_pixels(mapImage);
        
        // Generate and render the temperature map
        generateAndRenderTemperatureMap(finalMap, imageConfig, originalHeightMap, waterLevel);
        
        // Generate and render the rainfall map
        generateAndRenderRainfallMap(finalMap, imageConfig, originalHeightMap, waterLevel);
        
        // Generate and render the evaporation map
        generateAndRenderEvaporationMap(finalMap, imageConfig, originalHeightMap, waterLevel);
        
        timing = markTiming(timing, "image");
        
        // Update timing information in the UI
        var timingElement = $("dt");
        var updateTimingElement = timingElement.update;
        timing.marks.push("total " + calculateElapsedTime(timing.t0));
        var timingText = timing.marks.join("; ");
        updateTimingElement.call(timingElement, timingText);
    }
    
    /**
     * Calculate water level based on water percentage
     * @param {object} config - The map configuration
     * @returns {number} - The water level value
     */
    function calculateWaterLevel(config) {
        let minHeight = 2147483647;
        let maxHeight = 0;
        
        // Find min and max height values
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                if (config.map[row][col] < minHeight) {
                    minHeight = config.map[row][col];
                }
                if (config.map[row][col] > maxHeight) {
                    maxHeight = config.map[row][col];
                }
            }
        }
        
        // Calculate terrain distribution
        const terrainCount = config.palette.n_terrain;
        const heightScale = (terrainCount - 1) / (maxHeight - minHeight);
        const terrainDistribution = [];
        
        for (let i = 0; i < terrainCount; i++) {
            terrainDistribution[i] = 0;
        }
        
        // Count cells at each height level
        for (let row = 1; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                terrainDistribution[Math.floor((config.map[row][col] - minHeight) * heightScale)]++;
            }
        }
        
        // Calculate water level based on water percentage
        const waterThreshold = Math.floor(config.pct_water / 100 * config.map_len);
        let accumulatedTerrain = 0;
        let waterLevel;
        
        for (let i = 0; i < terrainCount; i++) {
            accumulatedTerrain += terrainDistribution[i];
            if (accumulatedTerrain > waterThreshold) {
                waterLevel = i;
                break;
            }
        }
        
        return Math.floor(waterLevel / heightScale) + minHeight;
    }
    
    /**
     * Generate and render the temperature map
     * @param {object} mapConfig - The map configuration
     * @param {object} imageConfig - The image configuration
     * @param {Array} heightMap - The original height map data
     * @param {number} waterLevel - The water level
     */
    function generateAndRenderTemperatureMap(mapConfig, imageConfig, heightMap, waterLevel) {
        // Create a copy of the map config for temperature
        const temperatureConfig = JSON.parse(JSON.stringify(mapConfig));
        temperatureConfig.palette = applyPalette(palette.temperature);
        
        // Generate temperature map based on latitude and elevation
        const temperatureMap = [];
        for (let row = 0; row < mapConfig.rows; row++) {
            temperatureMap[row] = [];
            
            // Calculate latitude factor (equator = hot, poles = cold)
            const latitudeFactor = 1 - Math.abs(row / mapConfig.rows - 0.5) * 2;
            
            for (let col = 0; col < mapConfig.cols; col++) {
                const elevation = heightMap[row][col];
                const isWater = elevation < waterLevel;
                
                // Higher elevations are colder
                const elevationFactor = isWater ? 
                    0.2 : // Water has less temperature variation with height
                    1 - ((elevation - waterLevel) / (mapConfig.rows * 0.25));
                
                // Combine factors (latitude has more influence than elevation)
                let temperature = latitudeFactor * 0.7 + elevationFactor * 0.3;
                
                // Clamp temperature value between 0 and 1
                temperature = Math.max(0, Math.min(1, temperature));
                
                // Map to temperature color indices
                if (isWater) {
                    // Water areas - use sea palette
                    temperatureMap[row][col] = Math.floor(temperature * temperatureConfig.palette.n_sea) + temperatureConfig.palette.sea_idx;
                } else {
                    // Land areas - use land palette
                    temperatureMap[row][col] = Math.floor(temperature * temperatureConfig.palette.n_land) + temperatureConfig.palette.land_idx;
                }
            }
        }
        
        // Set the temperature map
        temperatureConfig.map = temperatureMap;
        
        // Create the temperature image
        const temperatureImage = new_image("temperature-map", imageConfig.width, imageConfig.height);
        
        // Render the temperature map with the appropriate projection
        if (mapConfig.projection == "mercator") {
            renderMercatorProjection(temperatureImage, temperatureConfig, imageConfig);
        } else if (mapConfig.projection == "transmerc") {
            renderTransverseMercatorProjection(temperatureImage, temperatureConfig, imageConfig);
        } else if (mapConfig.projection == "icosahedral") {
            renderIcosahedralProjection(temperatureImage, temperatureConfig, imageConfig);
        } else if (mapConfig.projection == "mollweide") {
            renderMollweideProjection(temperatureImage, temperatureConfig, imageConfig);
        } else if (mapConfig.projection == "sinusoidal") {
            renderSinusoidalProjection(temperatureImage, temperatureConfig, imageConfig);
        } else {
            // Default square projection
            renderSquareProjection(temperatureImage, temperatureConfig, imageConfig);
        }
        
        // Draw the pixels to the canvas
        draw_pixels(temperatureImage);
    }
    
    /**
     * Generate and render the rainfall map
     * @param {object} mapConfig - The map configuration
     * @param {object} imageConfig - The image configuration
     * @param {Array} heightMap - The original height map data
     * @param {number} waterLevel - The water level
     */
    function generateAndRenderRainfallMap(mapConfig, imageConfig, heightMap, waterLevel) {
        // Create a copy of the map config for rainfall
        const rainfallConfig = JSON.parse(JSON.stringify(mapConfig));
        rainfallConfig.palette = applyPalette(palette.rainfall);
        
        // Generate rainfall map based on latitude, proximity to water, and elevation
        const rainfallMap = [];
        const proximityMap = calculateWaterProximity(mapConfig, heightMap, waterLevel);
        
        for (let row = 0; row < mapConfig.rows; row++) {
            rainfallMap[row] = [];
            
            // Calculate latitude factor (equator and mid-latitudes get more rain)
            const latitudeFactor = 1 - Math.pow(Math.abs(row / mapConfig.rows - 0.5) * 2, 2);
            
            for (let col = 0; col < mapConfig.cols; col++) {
                const elevation = heightMap[row][col];
                const isWater = elevation < waterLevel;
                
                // Wind direction effect (west to east in northern hemisphere, east to west in southern)
                const windCol = row < mapConfig.rows / 2 ? 
                    (col + mapConfig.cols - 10) % mapConfig.cols : // Northern hemisphere
                    (col + 10) % mapConfig.cols; // Southern hemisphere
                
                // Rain shadow effect - mountains block rainfall on leeward side
                const windwardSide = row < mapConfig.rows / 2 ?
                    col > windCol : col < windCol;
                
                // Mountains receive more rainfall on windward side
                const elevationFactor = isWater ? 
                    0.5 : // Water has moderate rainfall
                    windwardSide ? 
                        0.7 + ((elevation - waterLevel) / (mapConfig.rows * 0.5)) * 0.3 : // Windward side
                        0.3 - ((elevation - waterLevel) / (mapConfig.rows * 0.5)) * 0.3;  // Leeward side
                
                // Proximity to water increases rainfall
                const proximityFactor = isWater ? 1 : proximityMap[row][col];
                
                // Combine factors
                let rainfall = latitudeFactor * 0.4 + elevationFactor * 0.3 + proximityFactor * 0.3;
                
                // Clamp rainfall value between 0 and 1
                rainfall = Math.max(0, Math.min(1, rainfall));
                
                // Map to rainfall color indices
                if (isWater) {
                    // Water areas - use sea palette
                    rainfallMap[row][col] = Math.floor(rainfall * rainfallConfig.palette.n_sea) + rainfallConfig.palette.sea_idx;
                } else {
                    // Land areas - use land palette
                    rainfallMap[row][col] = Math.floor(rainfall * rainfallConfig.palette.n_land) + rainfallConfig.palette.land_idx;
                }
            }
        }
        
        // Set the rainfall map
        rainfallConfig.map = rainfallMap;
        
        // Create the rainfall image
        const rainfallImage = new_image("rainfall-map", imageConfig.width, imageConfig.height);
        
        // Render the rainfall map with the appropriate projection
        if (mapConfig.projection == "mercator") {
            renderMercatorProjection(rainfallImage, rainfallConfig, imageConfig);
        } else if (mapConfig.projection == "transmerc") {
            renderTransverseMercatorProjection(rainfallImage, rainfallConfig, imageConfig);
        } else if (mapConfig.projection == "icosahedral") {
            renderIcosahedralProjection(rainfallImage, rainfallConfig, imageConfig);
        } else if (mapConfig.projection == "mollweide") {
            renderMollweideProjection(rainfallImage, rainfallConfig, imageConfig);
        } else if (mapConfig.projection == "sinusoidal") {
            renderSinusoidalProjection(rainfallImage, rainfallConfig, imageConfig);
        } else {
            // Default square projection
            renderSquareProjection(rainfallImage, rainfallConfig, imageConfig);
        }
        
        // Draw the pixels to the canvas
        draw_pixels(rainfallImage);
    }
    
    /**
     * Generate and render the evaporation map
     * @param {object} mapConfig - The map configuration
     * @param {object} imageConfig - The image configuration
     * @param {Array} heightMap - The original height map data
     * @param {number} waterLevel - The water level
     */
    function generateAndRenderEvaporationMap(mapConfig, imageConfig, heightMap, waterLevel) {
        // Create a copy of the map config for evaporation
        const evaporationConfig = JSON.parse(JSON.stringify(mapConfig));
        evaporationConfig.palette = applyPalette(palette.evaporation);
        
        // Generate evaporation map based on temperature and water availability
        const evaporationMap = [];
        const proximityMap = calculateWaterProximity(mapConfig, heightMap, waterLevel);
        
        for (let row = 0; row < mapConfig.rows; row++) {
            evaporationMap[row] = [];
            
            // Temperature factor (equator = high evaporation, poles = low)
            const temperatureFactor = 1 - Math.abs(row / mapConfig.rows - 0.5) * 2;
            
            for (let col = 0; col < mapConfig.cols; col++) {
                const elevation = heightMap[row][col];
                const isWater = elevation < waterLevel;
                
                // Water bodies have high evaporation, land depends on water availability
                const waterFactor = isWater ? 
                    0.8 + 0.2 * (1 - ((waterLevel - elevation) / waterLevel)) : // Shallower water evaporates more
                    proximityMap[row][col] * 0.7; // Land evaporation depends on water proximity
                
                // Combine factors
                let evaporation = temperatureFactor * 0.6 + waterFactor * 0.4;
                
                // Clamp evaporation value between 0 and 1
                evaporation = Math.max(0, Math.min(1, evaporation));
                
                // Map to evaporation color indices
                if (isWater) {
                    // Water areas - use sea palette
                    evaporationMap[row][col] = Math.floor(evaporation * evaporationConfig.palette.n_sea) + evaporationConfig.palette.sea_idx;
                } else {
                    // Land areas - use land palette
                    evaporationMap[row][col] = Math.floor(evaporation * evaporationConfig.palette.n_land) + evaporationConfig.palette.land_idx;
                }
            }
        }
        
        // Set the evaporation map
        evaporationConfig.map = evaporationMap;
        
        // Create the evaporation image
        const evaporationImage = new_image("evaporation-map", imageConfig.width, imageConfig.height);
        
        // Render the evaporation map with the appropriate projection
        if (mapConfig.projection == "mercator") {
            renderMercatorProjection(evaporationImage, evaporationConfig, imageConfig);
        } else if (mapConfig.projection == "transmerc") {
            renderTransverseMercatorProjection(evaporationImage, evaporationConfig, imageConfig);
        } else if (mapConfig.projection == "icosahedral") {
            renderIcosahedralProjection(evaporationImage, evaporationConfig, imageConfig);
        } else if (mapConfig.projection == "mollweide") {
            renderMollweideProjection(evaporationImage, evaporationConfig, imageConfig);
        } else if (mapConfig.projection == "sinusoidal") {
            renderSinusoidalProjection(evaporationImage, evaporationConfig, imageConfig);
        } else {
            // Default square projection
            renderSquareProjection(evaporationImage, evaporationConfig, imageConfig);
        }
        
        // Draw the pixels to the canvas
        draw_pixels(evaporationImage);
    }
    
    /**
     * Calculate proximity to water for each land cell
     * @param {object} mapConfig - The map configuration
     * @param {Array} heightMap - The original height map data
     * @param {number} waterLevel - The water level
     * @returns {Array} - 2D array with water proximity values (0-1)
     */
    function calculateWaterProximity(mapConfig, heightMap, waterLevel) {
        const proximityMap = [];
        const searchRadius = Math.floor(mapConfig.rows / 10);
        
        // Initialize proximity map
        for (let row = 0; row < mapConfig.rows; row++) {
            proximityMap[row] = [];
            for (let col = 0; col < mapConfig.cols; col++) {
                proximityMap[row][col] = heightMap[row][col] < waterLevel ? 1 : 0;
            }
        }
        
        // Calculate proximity for land cells
        for (let row = 0; row < mapConfig.rows; row++) {
            for (let col = 0; col < mapConfig.cols; col++) {
                if (heightMap[row][col] >= waterLevel) {
                    // Land cell, calculate proximity to water
                    let minDistance = searchRadius;
                    
                    // Search in a square around current cell
                    for (let r = Math.max(0, row - searchRadius); r < Math.min(mapConfig.rows, row + searchRadius); r++) {
                        for (let c = Math.max(0, col - searchRadius); c < Math.min(mapConfig.cols, col + searchRadius); c++) {
                            if (heightMap[r][c] < waterLevel) {
                                // Water cell found, calculate Manhattan distance
                                const distance = Math.abs(row - r) + Math.abs(col - c);
                                if (distance < minDistance) {
                                    minDistance = distance;
                                }
                            }
                        }
                    }
                    
                    // Convert distance to proximity value (0-1, with 1 being closest to water)
                    proximityMap[row][col] = 1 - (minDistance / searchRadius);
                }
            }
        }
        
        return proximityMap;
    }

    /**
     * Render the map using Mercator projection
     */
    function renderMercatorProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        // Precalculate column positions
        for (var row = 0; row < imageConfig.width; row++) {
            columnPositions[row] = Math.floor(row / imageConfig.width * mapConfig.cols);
        }
        
        // Precalculate row positions with Mercator formula
        for (row = 0; row < imageConfig.height; row++) {
            rowPositions[row] = Math.floor((0.5 - Math.atan(Math.sinh((0.5 - row / imageConfig.height) * Math.PI)) / Math.PI) * mapConfig.rows);
        }
        
        // Map pixels
        for (row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var pixelValue = getRotatedMapValue(mapConfig, rowPositions[col], columnPositions[row]);
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }
    
    /**
     * Render the map using Transverse Mercator projection
     */
    function renderTransverseMercatorProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        for (var row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var angle = row / imageConfig.width * 2 * Math.PI;
                var lat = 4 * (col / imageConfig.height - 0.5);
                var lon = Math.atan(Math.sinh(lat) / Math.cos(angle));
                var halfPi = Math.PI / 2;
                
                if (angle > halfPi && angle <= 3 * halfPi) {
                    lon += Math.PI;
                }
                
                var pixelValue = getRotatedMapValue(
                    mapConfig, 
                    Math.floor((0.5 - Math.asin(Math.sin(angle) / Math.cosh(lat)) / Math.PI) * mapConfig.rows), 
                    Math.floor(lon / (2 * Math.PI) * mapConfig.cols)
                );
                
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }
    
    /**
     * Render the map using Icosahedral projection
     */
    function renderIcosahedralProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        for (var row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var colIndex = Math.floor(row / imageConfig.col_w);
                var rowIndex = Math.floor(col / imageConfig.row_h);
                var colOffset = Math.floor(row - colIndex * imageConfig.col_w);
                var rowOffset = Math.floor(0.5773502692 * Math.floor(col - rowIndex * imageConfig.row_h));
                let pixelIndex = -1;
                
                if ((rowIndex + colIndex) % 2 == 0) {
                    colOffset = Math.floor(imageConfig.col_w - colOffset);
                }
                
                // Complex icosahedral mapping logic
                if (rowIndex == 0) {
                    if (colIndex < 10 && colOffset < rowOffset) {
                        pixelIndex = Math.floor(colOffset / rowOffset * imageConfig.col_w);
                    }
                } else if (rowIndex == 1) {
                    if (colIndex == 0) {
                        if (colOffset > rowOffset) {
                            pixelIndex = colOffset;
                        }
                    } else if (colIndex < 10) {
                        pixelIndex = colOffset;
                    } else if (colIndex == 10 && colOffset < rowOffset) {
                        pixelIndex = colOffset;
                    }
                } else if (rowIndex == 2 && colIndex > 0 && colOffset > rowOffset) {
                    colOffset = Math.floor(imageConfig.col_w - colOffset);
                    rowOffset = Math.floor(imageConfig.col_w - rowOffset);
                    pixelIndex = Math.floor(colOffset / rowOffset * imageConfig.col_w);
                    pixelIndex = Math.floor(imageConfig.col_w - pixelIndex);
                }
                
                if (pixelIndex > -1) {
                    if ((rowIndex + colIndex) % 2 == 0) {
                        pixelIndex = Math.floor(imageConfig.col_w - pixelIndex);
                    }
                    pixelIndex += Math.floor(colIndex * imageConfig.col_w);
                    var pixelValue = getRotatedMapValue(mapConfig, col, pixelIndex);
                } else {
                    var pixelValue = 0;
                }
                
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }
    
    /**
     * Render the map using Mollweide projection
     */
    function renderMollweideProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        // Precalculate ellipse values
        for (var row = 0; row < imageConfig.height; row++) {
            sinFactors[row] = Math.sqrt(Math.sin(row / imageConfig.height * Math.PI));
            ellipseWidths[row] = Math.floor(imageConfig.wd2 * sinFactors[row]);
            
            var theta = Math.asin(2.8284271247 * (0.5 - row / imageConfig.height) / Math.sqrt(2));
            rowPositions[row] = Math.floor((0.5 - Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI) / Math.PI) * mapConfig.rows);
        }
        
        // Map pixels
        for (row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var pixelValue = 0;
                
                if (row > imageConfig.wd2 - ellipseWidths[col] && row < imageConfig.wd2 + ellipseWidths[col]) {
                    pixelValue = getRotatedMapValue(
                        mapConfig, 
                        rowPositions[col], 
                        Math.floor((row - imageConfig.wd2) / sinFactors[col]) + mapConfig.cd2
                    );
                }
                
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }
    
    /**
     * Render the map using Sinusoidal projection
     */
    function renderSinusoidalProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        // Precalculate sine values
        for (var row = 0; row < imageConfig.height; row++) {
            sinFactors[row] = Math.sin(row / imageConfig.height * Math.PI);
            ellipseWidths[row] = Math.floor(imageConfig.wd2 * sinFactors[row]);
        }
        
        // Map pixels
        for (row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var pixelValue = 0;
                
                if (row > imageConfig.wd2 - ellipseWidths[col] && row < imageConfig.wd2 + ellipseWidths[col]) {
                    pixelValue = getRotatedMapValue(
                        mapConfig, 
                        col, 
                        Math.floor((row - imageConfig.wd2) / sinFactors[col]) + mapConfig.cd2
                    );
                }
                
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }
    
    /**
     * Render the map using default square projection
     */
    function renderSquareProjection(mapImage, mapConfig, imageConfig) {
        var image = mapImage;
        var colorMap = mapConfig.palette.cmap;
        
        for (var row = 0; row < imageConfig.width; row++) {
            for (var col = 0; col < imageConfig.height; col++) {
                var pixelValue = getRotatedMapValue(mapConfig, col, row);
                if (pixelValue > 0) {
                    set_pixel(image, row, col, colorMap[pixelValue]);
                }
            }
        }
    }

    /**
     * Mark timing for a specific stage of map generation
     * @param {object} timing - The timing object
     * @param {string} stage - The stage name
     * @returns {object} - The updated timing object
     */
    function markTiming(timing, stage) {
        timing.marks.push(`${stage} ` + calculateElapsedTime(timing.t));
        timing.t = Date.now();
        return timing;
    }

    /**
     * Calculate elapsed time in seconds
     * @param {number} startTime - Start time in milliseconds
     * @returns {number} - Elapsed time in seconds
     */
    function calculateElapsedTime(startTime) {
        return (Date.now() - startTime) / 1E3;
    }

    /**
     * Apply projection settings to the configuration
     * @param {object} config - The map configuration
     * @returns {object} - The updated configuration
     */
    function applyProjection(config) {
        // Set dimensions based on projection type
        if (config.projection == "mercator" || config.projection == "transmerc") {
            config.rows = 2 * config.height;
            config.cols = 2 * config.rows;
        } else if (config.projection == "icosahedral") {
            config.rows = config.height;
            config.cols = Math.floor(1.9245008973 * config.rows);
        } else {
            config.rows = config.height;
            config.cols = 2 * config.rows;
        }
        
        // Calculate derived values
        config.map_len = config.rows * config.cols;
        config.rl1 = config.rows - 1;
        config.rd2 = Math.floor(config.rows / 2);
        config.rdp = Math.floor(config.rows / Math.PI);
        config.cd2 = Math.floor(config.cols / 2);
        config.cdp = Math.floor(config.cols / Math.PI);
        config.rpx = Math.floor(config.rotate / 360 * config.cols);
        
        // Apply palette settings
        let paletteConfig;
        if (paletteConfig = palette[config.palette]) {
            config.palette = applyPalette(paletteConfig);
            let paletteSettings;
            if (paletteSettings = paletteConfig.set) {
                Object.keys(paletteSettings).forEach(key => {
                    config[key] = paletteSettings[key];
                });
            }
        } else {
            config.palette = applyPalette(palette.mogensen);
        }
        
        return config;
    }

    /**
     * Apply palette settings
     * @param {object} paletteConfig - The palette configuration
     * @returns {object} - The processed palette
     */
    function applyPalette(paletteConfig) {
        var palette = {
            n_sea: 50,
            n_land: 100,
            cmap: []
        };
        
        // Set up palette indices
        palette.n_terrain = palette.n_sea + palette.n_land;
        palette.n_ice = palette.n_land + 1;
        palette.sea_idx = 1;
        palette.land_idx = palette.sea_idx + palette.n_sea;
        palette.ice_idx = palette.land_idx + palette.n_land;
        
        // Interpolate sea colors
        var seaColors = paletteConfig.sea,
            seaColorCount = seaColors.length - 1,
            i;
        
        for (i = palette.sea_idx; i < palette.land_idx; i++) {
            var colorIndex = (i - palette.sea_idx) / palette.n_sea * seaColorCount;
            let colorFloor = Math.floor(colorIndex);
            palette.cmap[i] = interpolateColor(seaColors[colorFloor], seaColors[colorFloor + 1], colorIndex - colorFloor);
        }
        
        // Interpolate land colors
        var landColors = paletteConfig.land;
        var landColorCount = landColors.length - 1;
        
        for (seaColorCount = palette.land_idx; seaColorCount < palette.ice_idx; seaColorCount++) {
            i = (seaColorCount - palette.land_idx) / palette.n_land * landColorCount;
            colorIndex = Math.floor(i);
            palette.cmap[seaColorCount] = interpolateColor(landColors[colorIndex], landColors[colorIndex + 1], i - colorIndex);
        }
        
        // Interpolate ice colors
        var iceColors = palette;
        var iceColorCount = iceColors.ice_idx + iceColors.n_ice;
        var whiteColor = [255, 255, 255];
        var grayColor = [175, 175, 175];
        
        for (i = iceColors.ice_idx; i < iceColorCount; i++) {
            iceColors.cmap[i] = interpolateColor(whiteColor, grayColor, (i - iceColors.ice_idx) / (iceColors.n_ice - 1));
        }
        
        return palette;
    }

    /**
     * Interpolate between two colors
     * @param {Array} color1 - First color [r,g,b]
     * @param {Array} color2 - Second color [r,g,b]
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {string} - Hex color string
     */
    function interpolateColor(color1, color2, factor) {
        return rgb2hex(
            Math.floor(color1[0] + (color2[0] - color1[0]) * factor),
            Math.floor(color1[1] + (color2[1] - color1[1]) * factor),
            Math.floor(color1[2] + (color2[2] - color1[2]) * factor)
        );
    }

    /**
     * Generate a Voss fractal map
     * @param {object} config - The map configuration
     * @returns {object} - The updated configuration with map data
     */
    function generateVossMap(config) {
        // Create empty map
        config.map = createEmptyMap(config, 0);
        
        var cols = config.cols;
        var sinValues = [],
            i;
        
        // Precalculate sine values
        for (i = 0; i < cols; i++) {
            sinValues[i] = Math.sin(i / cols * 2 * Math.PI);
        }
        
        // Generate the height map using the Voss algorithm
        for (i = 0; i < config.iter; i++) {
            var row, col;
            var sinArray = sinValues,
                angle = (random(32767) / 32767 - 0.5) * Math.PI,
                offset = random(32767) / 32767 - 0.5;
                
            let colOffset = Math.floor(config.cd2 - config.cols * offset);
            angle = Math.tan(Math.acos(Math.cos(angle) * Math.cos(offset * Math.PI)));
            
            if (!isNaN(angle)) {
                offset = 50 > random(100) ? 1 : -1;
                
                // Apply theta hack for more interesting terrain
                if (config.hack_theta) {
                    var thetaFactor = random(32767) / 32767 * 0.5 + 0.5;
                    var math = Math;
                    var mathFloor = math.floor;
                    var rowOffset = (1 - thetaFactor) * config.rl1;
                    rowOffset *= random(32767) / 32767;
                    col = mathFloor.call(math, rowOffset) + 1;
                }
                
                // Apply the height modification to each column
                for (row = 0; row < config.cols; row++) {
                    rowOffset = Math.floor(Math.atan(sinArray[(colOffset - row + config.cols) % config.cols] * angle) * config.rdp);
                    
                    if (!isNaN(rowOffset)) {
                        rowOffset += config.rd2;
                        
                        if (config.hack_theta) {
                            rowOffset = Math.floor(rowOffset * thetaFactor) + col;
                        }
                        
                        config.map[rowOffset][row] += offset;
                    }
                }
            }
        }
        
        // Integrate rows to create continuous height changes
        for (i = 1; i < config.rows; i++) {
            for (var j = 0; j < config.cols; j++) {
                config.map[i][j] += config.map[i - 1][j];
            }
        }
        
        return normalizeMap(config);
    }

    /**
     * Create an empty map with a specified initial value
     * @param {object} config - The map configuration
     * @param {number} initialValue - The initial value for all cells
     * @returns {Array} - A 2D array representing the map
     */
    function createEmptyMap(config, initialValue) {
        let map = [],
            row;
            
        for (row = 0; row < config.rows; row++) {
            map[row] = [];
            let col;
            for (col = 0; col < config.cols; col++) {
                map[row][col] = initialValue;
            }
        }
        
        return map;
    }

    /**
     * Normalize map values to start from 1
     * @param {object} config - The map configuration
     * @returns {object} - The updated configuration
     */
    function normalizeMap(config) {
        let minValue = 2147483647,
            row,
            col;
            
        // Find minimum value
        for (row = 0; row < config.rows; row++) {
            for (col = 0; col < config.cols; col++) {
                if (config.map[row][col] < minValue) {
                    minValue = config.map[row][col];
                }
            }
        }
        
        // Normalize values to start from 1
        for (row = 0; row < config.rows; row++) {
            for (col = 0; col < config.cols; col++) {
                config.map[row][col] -= minValue - 1;
            }
        }
        
        return config;
    }

    /**
     * Generate a Voss X map by combining multiple Voss maps
     * @param {number} iterations - Number of Voss maps to combine
     * @param {string} operation - Type of combination ('x' for multiply, 'a' for average)
     * @param {object} config - The map configuration
     * @returns {object} - The updated configuration
     */
    function generateVossXMap(iterations, operation, config) {
        var combinedMap = createEmptyMap(config, 1);
        let originalIterations = config.iter;
        config.iter = Math.floor(originalIterations / iterations);
        
        // Generate and combine multiple Voss maps
        for (let i = 0; i < iterations; i++) {
            config = generateVossMap(config);
            
            if (operation == "x") {
                // Multiply maps
                for (var row = 0; row < config.rows; row++) {
                    for (var col = 0; col < config.cols; col++) {
                        combinedMap[row][col] *= config.map[row][col];
                    }
                }
            } else if (operation == "a") {
                // Average maps
                for (row = 0; row < config.rows; row++) {
                    for (col = 0; col < config.cols; col++) {
                        combinedMap[row][col] += config.map[row][col];
                        combinedMap[row][col] /= 2;
                    }
                }
            }
            
            config.map = false;
        }
        
        // Restore original iteration count
        config.iter = originalIterations;
        config.map = combinedMap;
        
        return config;
    }

    /**
     * Get map value, handling edge wrapping
     * @param {object} config - The map configuration
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {number} - Map value at the position
     */
    function getMapValue(config, row, col) {
        if (0 <= row && row < config.rows && 0 <= col && col < config.cols) {
            return config.map[row][col];
        }
        
        var wrappedCoords = wrapCoordinates(config, row, col);
        return config.map[wrappedCoords.row][wrappedCoords.col];
    }

    /**
     * Set map value, handling edge wrapping
     * @param {object} config - The map configuration
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} value - Value to set
     */
    function setMapValue(config, row, col, value) {
        if (0 <= row && row < config.rows && 0 <= col && col < config.cols) {
            config.map[row][col] = value;
        } else {
            var wrappedCoords = wrapCoordinates(config, row, col);
            config.map[wrappedCoords.row][wrappedCoords.col] = value;
        }
    }

    /**
     * Wrap coordinates to stay within map bounds
     * @param {object} config - The map configuration
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {object} - Wrapped coordinates {row, col}
     */
    function wrapCoordinates(config, row, col) {
        // Handle row wrapping with pole reflection
        while (row < 0) {
            row += 2 * config.rows;
        }
        
        if (row >= 2 * config.rows) {
            row %= 2 * config.rows;
        }
        
        if (row >= config.rows) {
            row = 2 * config.rows - (row + 1);
            col += Math.floor(config.cols / 2);
        }
        
        // Handle column wrapping
        while (col < 0) {
            col += config.cols;
        }
        
        if (col >= config.cols) {
            col %= config.cols;
        }
        
        return {
            row: row,
            col: col
        };
    }

    /**
     * Apply ice to the map based on the percentage of ice
     * @param {object} config - The map configuration
     * @returns {object} - The updated configuration
     */
    function applyIce(config) {
        let palette = config.palette;
        
        if (config.pct_ice > 0) {
            let iceThreshold = Math.floor(config.pct_ice / 100 * config.map_len / 2);
            
            // Apply ice to north pole
            (() => {
                let iceCount = 0,
                    row;
                for (row = 0; row < config.rows; row++) {
                    let col;
                    for (col = 0; col < config.cols; col++) {
                        if (config.map[row][col] < palette.ice_idx) {
                            iceCount += applyIceAtPoint(config, row, col, config.map[row][col], 0);
                        }
                        if (iceCount > iceThreshold) break;
                    }
                    if (iceCount > iceThreshold) break;
                }
            })();
            
            // Apply ice to south pole
            (() => {
                let iceCount = 0,
                    row;
                for (row = config.rl1; row > 0; row--) {
                    let col;
                    for (col = 0; col < config.cols; col++) {
                        if (config.map[row][col] < palette.ice_idx) {
                            iceCount += applyIceAtPoint(config, row, col, config.map[row][col], 0);
                        }
                        if (iceCount > iceThreshold) break;
                    }
                    if (iceCount > iceThreshold) break;
                }
            })();
        }
        
        return config;
    }

    /**
     * Apply ice at a specific point and recursively to neighbors
     * @param {object} config - The map configuration
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} originalValue - Original terrain value
     * @param {number} depth - Recursion depth
     * @returns {number} - Number of cells converted to ice
     */
    function applyIceAtPoint(config, row, col, originalValue, depth) {
        let palette = config.palette,
            currentValue = getMapValue(config, row, col),
            count = 0;
            
        if (currentValue == originalValue) {
            // Convert to ice
            if (currentValue >= palette.land_idx) {
                setMapValue(config, row, col, currentValue - palette.land_idx + palette.ice_idx + 1);
            } else {
                setMapValue(config, row, col, palette.ice_idx);
            }
            
            count++;
            
            // Recursively apply to neighbors with depth limit
            if (depth++ < config.height / 6) {
                count += applyIceAtPoint(config, row, col - 1, originalValue, depth);
                count += applyIceAtPoint(config, row, col + 1, originalValue, depth);
                
                if (row > 1) {
                    count += applyIceAtPoint(config, row - 1, col, originalValue, depth);
                }
                
                if (row < config.rl1) {
                    count += applyIceAtPoint(config, row + 1, col, originalValue, depth);
                }
            }
        }
        
        return count;
    }

    /**
     * Get map value with rotation applied
     * @param {object} config - The map configuration
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {number} - Map value at the rotated position
     */
    function getRotatedMapValue(config, row, col) {
        // Apply rotation
        col -= config.rpx;
        
        // Clamp row values
        if (row < 0) {
            row = 0;
        }
        if (row >= config.rows) {
            row = config.rl1;
        }
        
        // Wrap column values
        while (col < 0) {
            col += config.cols;
        }
        if (col >= config.cols) {
            col %= config.cols;
        }
        
        return config.map[row][col];
    }

    /**
     * Save the current map as a PNG image
     */
    function saveMapAsPNG() {
        let seedValue = $("seed").getValue();
        save_canvas($("map"), `${seedValue}.png`);
    }

    /**
     * Calculate the scaled terrain variation amount using a non-linear curve
     * This creates a very gradual effect at low percentages
     * @param {number} variationAmount - Raw variation amount (0-1)
     * @returns {number} - Scaled variation amount for terrain distortion
     */
    function calculateScaledVariation(variationAmount) {
        // Only apply distortion if variation amount is greater than 0
        if (variationAmount <= 0) {
            return 0;
        }
        
        // Apply an extremely gradual exponential curve at the low end
        // Using power of 4 makes the curve even more extreme at the low end
        const scaledVariation = Math.pow(variationAmount, 4);
        
        // For very small variation (< 5%), apply an additional scaling factor
        const lowEndMultiplier = variationAmount < 0.05 ? variationAmount * 20 : 1.0;
        
        return scaledVariation * lowEndMultiplier;
    }

    // Configuration for UI elements
    let uiConfig = {
        projection: {
            square: {
                title: "Square"
            },
            mercator: {
                title: "Mercator"
            },
            transmerc: {
                title: "Transverse"
            },
            icosahedral: {
                title: "Icosahedral"
            },
            mollweide: {
                title: "Mollweide"
            },
            sinusoidal: {
                title: "Sinusoidal"
            }
        },
        palette
    };
    
    // Initialize the UI when the DOM is loaded
    document.observe("dom:loaded", () => {
        // Populate dropdown menus
        Object.keys(uiConfig).forEach(configKey => {
            Object.keys(uiConfig[configKey]).forEach(optionKey => {
                let optionTitle = uiConfig[configKey][optionKey].title;
                var selectElement = $(configKey),
                    insertMethod = selectElement.insert;
                optionKey = (new Element("option", {
                    value: optionKey
                })).update(optionTitle);
                insertMethod.call(selectElement, optionKey);
            });
        });
        
        // Set default values
        Object.keys(default_query).forEach(configKey => {
            $(configKey).setValue(default_query[configKey]);
        });
        
        // Initial map update
        updateMap();
        
        // Set up event handlers
        $("seed").observe("change", onSeedChange);
        $("new_seed").observe("click", generateNewSeed);
        
        Object.keys(uiConfig).forEach(configKey => {
            $(configKey).observe("change", updateMap);
        });
        
        $("pct_water").observe("change", onWaterPercentageChange);
        $("pct_ice").observe("change", onIcePercentageChange);
        $("height").observe("change", onHeightChange);
        $("iter").observe("change", onIterationChange);
        $("rotate").observe("change", onRotationChange);
        $("save_map").observe("click", saveMapAsPNG);
        $("print_map").observe("click", () => {
            window.print();
        });
    });
    
    // Add utility methods to input elements
    Element.addMethods(["INPUT", "SELECT"], {
        intValue: function(element) {
            return parseInt($(element).getValue(), 10);
        },
        floatValue: function(element) {
            return parseFloat($(element).getValue());
        }
    });
    
    // Array buffers for projection calculations
    let sinFactors = [],
        ellipseWidths = [],
        rowPositions = [],
        columnPositions = [];
    
    // Expose the updateMap function for the export
    exports.updateMap = updateMap;
});