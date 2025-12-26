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
    validateInputValue("iter", 1e3, max_iter);
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
      ocean_currents: $("ocean_currents").checked, // Get ocean currents toggle
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

    // Identify polar regions early to protect them throughout all processes
    const polarRegionMap = identifyPolarRegions(config);

    // Apply ocean currents if enabled
    if (config.ocean_currents) {
      // First calculate a rough water level to identify coastal areas
      const roughWaterLevel = calculateRoughWaterLevel(config);

      // Create a copy of the map to work with
      const originalMap = JSON.parse(JSON.stringify(config.map));
      let coastalCellsCount = 0;

      // Create a map to track the continental shelf areas (eroded coastlines)
      const continentalShelfMap = createEmptyMap(config, 0);

      // Scan for coastal cells (land cells near water)
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          // Skip cells that are already underwater or in polar regions (ice caps)
          if (
            originalMap[row][col] < roughWaterLevel ||
            polarRegionMap[row][col]
          ) {
            continue;
          }

          // Check if this is a coastal cell by looking for adjacent water cells
          let isCoastal = false;

          // Check 8 surrounding cells
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue; // Skip self

              // Get the adjacent cell value (with wrapping)
              const adjRow = wrapCoordinate(row + dr, config.rows);
              const adjCol = wrapCoordinate(col + dc, config.cols);

              // If adjacent cell is water, this is a coastal cell
              if (originalMap[adjRow][adjCol] < roughWaterLevel) {
                isCoastal = true;
                break;
              }
            }
            if (isCoastal) break;
          }

          // If this is a coastal cell, apply ocean current erosion
          // and mark it as potential continental shelf
          if (isCoastal) {
            coastalCellsCount++;

            // Calculate elevation difference from water level
            const elevDiff = originalMap[row][col] - roughWaterLevel;

            // Small islands and low elevation areas are more susceptible to ocean currents
            // The closer to water level, the more erosion occurs
            const erosionFactor = Math.max(0, 1 - elevDiff / 5);

            // Check if this cell should be eroded to continental shelf (underwater)
            const erosionAmount = 5 * erosionFactor;
            const newHeight = originalMap[row][col] - erosionAmount;

            // If the erosion would put this cell underwater or close to it,
            // mark it as continental shelf
            if (newHeight <= roughWaterLevel + 0.5) {
              continentalShelfMap[row][col] = 1;

              // Make sure it's slightly below water level to appear as continental shelf
              config.map[row][col] =
                roughWaterLevel - 0.2 - 0.3 * Math.random();
            } else {
              // Normal erosion for areas that remain above water
              config.map[row][col] = Math.max(
                1, // Ensure we don't go below minimum height
                newHeight
              );
            }
          }
        }
      }

      // Apply additional erosion to small islands (but not to ice caps)
      if (coastalCellsCount > 0) {
        identifyAndErodeSmallIslands(
          config,
          roughWaterLevel,
          continentalShelfMap,
          polarRegionMap
        );
      }

      // Extend continental shelf out from the coastline for a more natural look
      extendContinentalShelf(
        config,
        roughWaterLevel,
        continentalShelfMap,
        polarRegionMap
      );
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

          // If this is in a polar region (potential ice cap), preserve original height
          if (polarRegionMap[row][col]) {
            mapRow[mapCol] = config.map[row][col];
          } else {
            // Apply standard erosion
            var mapConfig = config;
            var currentRow = row,
              currentCol = col;
            // Average the surrounding cells (3x3 filter)
            mapConfig =
              getMapValue(mapConfig, currentRow - 1, currentCol - 1) +
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
      }
      config.map = erodedMap;
      config = normalizeMap(config);
    }

    // Store the original heightmap for use in generating climate maps
    const originalHeightMap = JSON.parse(JSON.stringify(config.map));
    const waterLevel = calculateWaterLevel(config);

    // ====================================================================
    // CREATE CELL DATA MODEL (Islands-style unified data structure)
    // ====================================================================
    
    // Initialize the cell data model (if CellDataModel class is available)
    if (typeof CellDataModel !== 'undefined') {
      const cellData = new CellDataModel(config.rows, config.cols, {
        pixelLength: 125, // meters per pixel
        meanSeaLevel: 2000,
        pctWater: config.pct_water,
        pctIce: config.pct_ice,
        rainfall: 0.3
      });
      
      // Initialize terrain from the generated heightmap
      cellData.initializeFromHeightmap(config.map);
      
      // Calculate climate data using your existing formulas
      cellData.calculateClimate();
      
      // Calculate initial ice coverage (mass-balance driven)
      // Use a reasonable initial time for ice cap formation (10,000 years)
      const initialIceYears = 10000;
      cellData.calculateIceCoverage(initialIceYears);
      
      // Calculate biomes using Whittaker diagram (after ice so we can override with ice biome)
      cellData.calculateBiomes();
      
      // Calculate Holdridge Life Zones (alternative classification system)
      cellData.calculateHoldridgeLifeZones();
      
      // Log ice stats
      const iceStats = cellData.getIceStats();
      console.log('Ice coverage stats:', iceStats);
      
      // Calculate coastal areas and lakes
      cellData.calculateCoastalAndLakes();
      
      // Store globally for mouse tracking/tooltip
      window.worldCellData = cellData;
      
      // Mark as updated for WebGL renderer detection
      cellData._lastUpdate = Date.now();
      
      console.log('CellDataModel created with', cellData.cellCount, 'cells');
    } else {
      console.warn('CellDataModel not available - tooltip info will be limited');
      window.worldCellData = null;
    }
    
    // ====================================================================

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
        terrainDistribution[
          Math.floor((config.map[row][col] - minHeight) * heightScale)
        ]++;
      }
    }

    // Calculate water level based on water percentage
    var waterThreshold = Math.floor((config.pct_water / 100) * config.map_len);
    var accumulatedTerrain = 0;
    var calculatedWaterLevel;
    for (row = 0; row < terrainCount; row++) {
      if (
        ((accumulatedTerrain += terrainDistribution[row]),
        accumulatedTerrain > waterThreshold)
      ) {
        calculatedWaterLevel = row;
        break;
      }
    }
    calculatedWaterLevel =
      Math.floor(calculatedWaterLevel / heightScale) + minHeight;

    // Scale sea and land heights to match palette ranges
    var seaScale = palette.n_sea / (calculatedWaterLevel - minHeight + 1);
    var landScale = palette.n_land / (maxHeight - calculatedWaterLevel + 1);

    // Apply terrain types to map cells
    for (row = 0; row < config.rows; row++) {
      for (col = 0; col < config.cols; col++) {
        config.map[row][col] =
          config.map[row][col] < calculatedWaterLevel
            ? Math.floor((config.map[row][col] - minHeight) * seaScale) +
              palette.sea_idx
            : Math.floor(
                (config.map[row][col] - calculatedWaterLevel) * landScale
              ) + palette.land_idx;
      }
    }

    // Apply ice caps based on ice percentage
    var finalMap = (config = applyIce(config));
    timing = markTiming(timing, "create");

    // Set up rendering configuration based on projection
    var imageConfig = {};
    if (
      finalMap.projection == "mercator" ||
      finalMap.projection == "transmerc"
    ) {
      imageConfig.height = finalMap.height;
      imageConfig.width = Math.floor((Math.PI / 2) * finalMap.height);
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
    if (
      finalMap.projection == "mollweide" ||
      finalMap.projection == "sinusoidal"
    ) {
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

    console.log("Drawing map...");
    // Draw the pixels to the canvas
    draw_pixels(mapImage);

    // Generate and render the temperature map
    const temperatureMap = generateAndRenderTemperatureMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel
    );

    // Generate and render the rainfall map with temperatureMap
    generateAndRenderRainfallMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel,
      temperatureMap
    );

    // Generate and render the evaporation map
    generateAndRenderEvaporationMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel
    );

    // Generate and render the snowfall/perennial snow map
    generateAndRenderSnowfallMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel,
      temperatureMap
    );

    // Generate and render the Whittaker biome map
    generateAndRenderBiomeMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel
    );

    // Generate and render the Holdridge Life Zones map
    generateAndRenderHoldridgeMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel
    );

    // Generate and render the lake map
    generateAndRenderLakeMap(
      finalMap,
      imageConfig,
      originalHeightMap,
      waterLevel
    );

    // Run time simulation and generate erosion-based maps if enabled
    if ($("enable_time_simulation") && $("enable_time_simulation").checked) {
      const timeYears = parseFloat($("time_passage").getValue()) * 1000000; // Convert to years
      const showRivers = $("show_rivers").checked;
      const showCoastlines = $("show_coastlines").checked;
      
      generateAndRenderErosionMaps(
        finalMap,
        imageConfig,
        originalHeightMap,
        waterLevel,
        timeYears,
        showRivers,
        showCoastlines
      );
      
      // Update the CellDataModel with erosion results if available
      if (window.worldCellData && window.lastErosionSimulation) {
        const erosion = window.lastErosionSimulation;
        const cellData = window.worldCellData;
        
        // Sync bedrock and sediment from erosion simulation
        for (let cell = 0; cell < cellData.cellCount; cell++) {
          cellData.bedrockThickness[cell] = erosion.bedrockThickness[cell];
          cellData.sedimentThickness[cell] = erosion.sedimentThickness[cell];
          cellData.lakeThickness[cell] = erosion.lakeThicknessArray[cell];
        }
        
        cellData.time = timeYears;
        cellData.updateElevation();
        cellData.calculateClimate(); // Recalculate climate after erosion changes terrain
        
        // Recalculate ice coverage with full simulation time
        cellData.calculateIceCoverage(timeYears);
        
        // Recalculate biomes after ice changes
        cellData.calculateBiomes();
        
        // Recalculate Holdridge Life Zones
        cellData.calculateHoldridgeLifeZones();
        
        const iceStats = cellData.getIceStats();
        console.log('Post-erosion ice stats:', iceStats);
        
        console.log('CellDataModel synced with erosion simulation');
      }
      
      timing = markTiming(timing, "erosion");
    } else {
      // Clear the erosion-related canvases when simulation is disabled
      clearErosionCanvases(imageConfig);
      // Update status to show simulation is disabled
      updateSimulationStatus(0, 0, 'disabled');
    }

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
        terrainDistribution[
          Math.floor((config.map[row][col] - minHeight) * heightScale)
        ]++;
      }
    }

    // Calculate water level based on water percentage
    const waterThreshold = Math.floor(
      (config.pct_water / 100) * config.map_len
    );
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
   * Calculate a rough approximation of the water level based on water percentage
   * This is used for the ocean currents simulation
   * @param {object} config - The map configuration
   * @returns {number} - The rough water level value
   */
  function calculateRoughWaterLevel(config) {
    let minHeight = Number.MAX_VALUE;
    let maxHeight = Number.MIN_VALUE;

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

    // Simple water level calculation based on percentage
    return minHeight + ((maxHeight - minHeight) * config.pct_water) / 100;
  }

  /**
   * Utility function to wrap coordinate to stay within bounds
   * @param {number} value - The coordinate value
   * @param {number} max - The maximum value
   * @returns {number} - The wrapped coordinate
   */
  function wrapCoordinate(value, max) {
    while (value < 0) {
      value += max;
    }

    if (value >= max) {
      value %= max;
    }

    return value;
  }

  /**
   * Generate and render the temperature map
   * @param {object} mapConfig - The map configuration
   * @param {object} imageConfig - The image configuration
   * @param {Array} heightMap - The original height map data
   * @param {number} waterLevel - The water level
   */
  function generateAndRenderTemperatureMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel
  ) {

    console.log("Generating temperature map (planet.c algorithm)...");

    // Create a copy of the map config for temperature
    const temperatureConfig = JSON.parse(JSON.stringify(mapConfig));
    temperatureConfig.palette = applyPalette(palette.temperature);

    // Find height range for normalization to planet.c's altitude scale
    // planet.c uses altitude roughly in range -0.1 to 0.1
    let minHeight = Infinity;
    let maxHeight = -Infinity;
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        if (heightMap[row][col] < minHeight) minHeight = heightMap[row][col];
        if (heightMap[row][col] > maxHeight) maxHeight = heightMap[row][col];
      }
    }
    const heightRange = maxHeight - minHeight || 1;

    // First pass: calculate raw temperature values using planet.c formula
    const rawTempMap = [];
    let tempMin = Infinity;
    let tempMax = -Infinity;

    for (let row = 0; row < mapConfig.rows; row++) {
      rawTempMap[row] = [];

      // planet.c: y ranges from 1 (north pole) to -1 (south pole)
      const y = 1 - 2 * (row / (mapConfig.rows - 1 || 1));
      
      // planet.c: sun = sqrt(1.0 - y*y) - solar intensity based on latitude
      // This gives 1.0 at equator, 0.0 at poles
      const sun = Math.sqrt(1.0 - y * y);

      for (let col = 0; col < mapConfig.cols; col++) {
        const elevation = heightMap[row][col];
        const isWater = elevation < waterLevel;
        
        // Normalize altitude to planet.c scale (roughly -0.1 to 0.1)
        // Sea level is at 0, land goes positive, deep water goes negative
        let alt;
        if (isWater) {
          // Water: negative altitude (depth below sea level)
          alt = -0.1 * (waterLevel - elevation) / (waterLevel - minHeight || 1);
        } else {
          // Land: positive altitude (height above sea level)
          alt = 0.1 * (elevation - waterLevel) / (maxHeight - waterLevel || 1);
        }

        // planet.c temperature formula:
        // if (alt < 0) temp = sun/8.0 + alt*0.3;  // deep water colder
        // else temp = sun/8.0 - alt*1.2;          // high altitudes colder
        let temp;
        if (alt < 0) {
          temp = sun / 8.0 + alt * 0.3;  // Deep water is slightly colder
        } else {
          temp = sun / 8.0 - alt * 1.2;  // High land is much colder (lapse rate)
        }

        rawTempMap[row][col] = temp;
        
        // Track min/max for normalization (only on land per planet.c)
        if (!isWater) {
          if (temp < tempMin) tempMin = temp;
          if (temp > tempMax) tempMax = temp;
        }
      }
    }

    // Include water temps in range if no land
    if (tempMin === Infinity) {
      for (let row = 0; row < mapConfig.rows; row++) {
        for (let col = 0; col < mapConfig.cols; col++) {
          if (rawTempMap[row][col] < tempMin) tempMin = rawTempMap[row][col];
          if (rawTempMap[row][col] > tempMax) tempMax = rawTempMap[row][col];
        }
      }
    }

    const tempRange = tempMax - tempMin || 1;

    // Second pass: normalize and convert to color indices
    const temperatureMap = [];
    for (let row = 0; row < mapConfig.rows; row++) {
      temperatureMap[row] = [];
      for (let col = 0; col < mapConfig.cols; col++) {
        const elevation = heightMap[row][col];
        const isWater = elevation < waterLevel;
        
        // Normalize temperature to 0-1 range
        const tempNorm = (rawTempMap[row][col] - tempMin) / tempRange;
        const tempClamped = Math.max(0, Math.min(1, tempNorm));

        // Map to color indices
        if (isWater) {
          temperatureMap[row][col] =
            Math.floor(tempClamped * (temperatureConfig.palette.n_sea - 1)) +
            temperatureConfig.palette.sea_idx;
        } else {
          temperatureMap[row][col] =
            Math.floor(tempClamped * (temperatureConfig.palette.n_land - 1)) +
            temperatureConfig.palette.land_idx;
        }
      }
    }

    // Set the temperature map
    temperatureConfig.map = temperatureMap;

    // Create the temperature image
    const temperatureImage = new_image(
      "temperature-map",
      imageConfig.width,
      imageConfig.height
    );

    // Render the temperature map with the appropriate projection
    if (mapConfig.projection == "mercator") {
      renderMercatorProjection(
        temperatureImage,
        temperatureConfig,
        imageConfig
      );
    } else if (mapConfig.projection == "transmerc") {
      renderTransverseMercatorProjection(
        temperatureImage,
        temperatureConfig,
        imageConfig
      );
    } else if (mapConfig.projection == "icosahedral") {
      renderIcosahedralProjection(
        temperatureImage,
        temperatureConfig,
        imageConfig
      );
    } else if (mapConfig.projection == "mollweide") {
      renderMollweideProjection(
        temperatureImage,
        temperatureConfig,
        imageConfig
      );
    } else if (mapConfig.projection == "sinusoidal") {
      renderSinusoidalProjection(
        temperatureImage,
        temperatureConfig,
        imageConfig
      );
    } else {
      // Default square projection
      renderSquareProjection(temperatureImage, temperatureConfig, imageConfig);
    }

    console.log("Drawing temperature map...");
    // Draw the pixels to the canvas
    draw_pixels(temperatureImage);

    // Return the raw temperature map for use by rainfall calculation
    return rawTempMap;
  }

  /**
   * Generate and render the rainfall map using planet.c algorithm
   * @param {object} mapConfig - The map configuration
   * @param {object} imageConfig - The image configuration
   * @param {Array} heightMap - The original height map data
   * @param {number} waterLevel - The water level
   * @param {Array} rawTempMap - The raw temperature values from generateAndRenderTemperatureMap
   */
  function generateAndRenderRainfallMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel,
    rawTempMap
  ) {
    console.log("Generating rainfall map (planet.c algorithm)...");

    // Create a copy of the map config for rainfall
    const rainfallConfig = JSON.parse(JSON.stringify(mapConfig));
    rainfallConfig.palette = applyPalette(palette.rainfall);

    // First, calculate the rain shadow map (simplified 2D approximation)
    // planet.c uses 3D terrain normals; we approximate with horizontal gradient
    const rainShadowMap = calculateRainShadow(mapConfig, heightMap, waterLevel);

    // First pass: calculate raw rainfall values using planet.c formula
    const rawRainfallMap = [];
    let minRain = Infinity;
    let maxRain = -Infinity;

    for (let row = 0; row < mapConfig.rows; row++) {
      rawRainfallMap[row] = [];
      
      // planet.c: y ranges from 1 (north pole) to -1 (south pole)
      const y = 1 - 2 * (row / (mapConfig.rows - 1 || 1));
      
      // planet.c: y2 = fabs(y) - 0.5
      // This creates subtropical dry belts around |latitude| = 0.5 (30°)
      const y2 = Math.abs(y) - 0.5;

      for (let col = 0; col < mapConfig.cols; col++) {
        const elevation = heightMap[row][col];
        const isWater = elevation < waterLevel;
        
        // Get temperature from the raw temperature map
        const temp = rawTempMap[row][col];
        
        // planet.c rainfall formula:
        // rain = temp*0.65 + 0.1 - 0.011/(y2*y2+0.1)
        // The last term creates dry subtropical high pressure belts
        let rain = temp * 0.65 + 0.1 - 0.011 / (y2 * y2 + 0.1);
        
        // planet.c: rain += 0.03 * rainShadow
        // Add rain shadow effect (negative in shadow, positive on windward)
        rain += 0.03 * rainShadowMap[row][col];
        
        // planet.c adjusts negative rain values for deserts
        // We keep it simple: clamp to non-negative
        if (rain < 0) rain = 0;
        
        rawRainfallMap[row][col] = rain;
        
        // Track min/max for normalization (land only per planet.c)
        if (!isWater) {
          if (rain < minRain) minRain = rain;
          if (rain > maxRain) maxRain = rain;
        }
      }
    }

    // Include water if no land found
    if (minRain === Infinity) {
      for (let row = 0; row < mapConfig.rows; row++) {
        for (let col = 0; col < mapConfig.cols; col++) {
          if (rawRainfallMap[row][col] < minRain) minRain = rawRainfallMap[row][col];
          if (rawRainfallMap[row][col] > maxRain) maxRain = rawRainfallMap[row][col];
        }
      }
    }

    // Second pass: smooth the raw rainfall values with box blur
    const smoothedRawMap = [];
    for (let row = 0; row < mapConfig.rows; row++) {
      smoothedRawMap[row] = [];
      for (let col = 0; col < mapConfig.cols; col++) {
        let sum = 0;
        let count = 0;
        // 3x3 box blur
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = (col + dc + mapConfig.cols) % mapConfig.cols; // Wrap horizontally
            if (r >= 0 && r < mapConfig.rows) {
              sum += rawRainfallMap[r][c];
              count++;
            }
          }
        }
        smoothedRawMap[row][col] = sum / count;
      }
    }

    // Third pass: normalize and convert to color indices
    const rainfallMap = [];
    const rainRange = maxRain - minRain || 1;
    
    for (let row = 0; row < mapConfig.rows; row++) {
      rainfallMap[row] = [];
      for (let col = 0; col < mapConfig.cols; col++) {
        const elevation = heightMap[row][col];
        const isWater = elevation < waterLevel;
        
        // Normalize rainfall to 0-1 using actual range
        const rainNorm = (smoothedRawMap[row][col] - minRain) / rainRange;
        const rainClamped = Math.max(0, Math.min(1, rainNorm));
        
        // Map to color indices
        if (isWater) {
          rainfallMap[row][col] =
            Math.floor(rainClamped * (rainfallConfig.palette.n_sea - 1)) +
            rainfallConfig.palette.sea_idx;
        } else {
          rainfallMap[row][col] =
            Math.floor(rainClamped * (rainfallConfig.palette.n_land - 1)) +
            rainfallConfig.palette.land_idx;
        }
      }
    }

    // Set the rainfall map
    rainfallConfig.map = rainfallMap;

    // Create the rainfall image
    const rainfallImage = new_image(
      "rainfall-map",
      imageConfig.width,
      imageConfig.height
    );

    // Render the rainfall map with the appropriate projection
    if (mapConfig.projection == "mercator") {
      renderMercatorProjection(rainfallImage, rainfallConfig, imageConfig);
    } else if (mapConfig.projection == "transmerc") {
      renderTransverseMercatorProjection(
        rainfallImage,
        rainfallConfig,
        imageConfig
      );
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

    console.log("Drawing rainfall map...");
    // Draw the pixels to the canvas
    draw_pixels(rainfallImage);
    
    // Return raw rainfall for potential biome calculation
    return rawRainfallMap;
  }

  /**
   * Calculate rain shadow effect based on terrain gradients
   * Approximates planet.c's 3D rain shadow using 2D horizontal gradients
   * @param {object} mapConfig - The map configuration  
   * @param {Array} heightMap - The height map
   * @param {number} waterLevel - The water level
   * @returns {Array} Rain shadow values (negative = shadow, positive = windward)
   */
  function calculateRainShadow(mapConfig, heightMap, waterLevel) {
    const rainShadow = [];
    
    // planet.c uses shade_angle = 150.0 (degrees) for shadow calculation
    // We approximate by looking at terrain slope in prevailing wind direction
    // Assume westerlies (wind from west to east) as dominant pattern
    
    for (let row = 0; row < mapConfig.rows; row++) {
      rainShadow[row] = [];
      
      // Vary wind direction by latitude (trade winds, westerlies, polar easterlies)
      // Simplified: trades (equator to ~30°), westerlies (30° to 60°), polar easterlies
      const y = 1 - 2 * (row / (mapConfig.rows - 1 || 1));
      const absY = Math.abs(y);
      
      // Wind direction: +1 = from west, -1 = from east
      let windDir;
      if (absY < 0.5) {
        // Trade winds: blow from east (toward equator and west)
        windDir = -1;
      } else if (absY < 0.85) {
        // Westerlies: blow from west
        windDir = 1;
      } else {
        // Polar easterlies: blow from east  
        windDir = -1;
      }
      
      for (let col = 0; col < mapConfig.cols; col++) {
        const elevation = heightMap[row][col];
        const isWater = elevation < waterLevel;
        
        if (isWater) {
          // Water doesn't have rain shadow effect
          rainShadow[row][col] = 0;
          continue;
        }
        
        // Look upwind for higher terrain that would cast rain shadow
        let shadow = 0;
        const lookDistance = 10; // pixels to check upwind
        
        for (let d = 1; d <= lookDistance; d++) {
          const checkCol = (col - d * windDir + mapConfig.cols) % mapConfig.cols;
          const upwindElev = heightMap[row][checkCol];
          
          // If upwind terrain is higher, we're in rain shadow
          if (upwindElev > elevation && upwindElev > waterLevel) {
            const elevDiff = (upwindElev - elevation) / (mapConfig.rows * 0.1);
            shadow -= elevDiff / d; // Shadow decreases with distance
          }
          // If we're higher than upwind, we're on windward side
          else if (elevation > upwindElev && upwindElev > waterLevel) {
            const elevDiff = (elevation - upwindElev) / (mapConfig.rows * 0.1);
            shadow += elevDiff / d; // Orographic lift
          }
        }
        
        // Clamp shadow effect
        rainShadow[row][col] = Math.max(-2, Math.min(2, shadow));
      }
    }
    
    return rainShadow;
  }

  /**
   * Render the evaporation map using CellDataModel data
   * Uses physics-based evaporation calculation (Penman-Monteith style)
   * 
   * @param {object} mapConfig - The map configuration (for compatibility)
   * @param {object} imageConfig - The image configuration
   */
  function generateAndRenderEvaporationMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel
  ) {
    console.log("Rendering evaporation map from CellDataModel...");

    const canvas = $('evaporation-map');
    if (!canvas) {
      console.warn('evaporation-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Check if cell data is available
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    // Find evaporation range for normalization
    let minEvap = Infinity, maxEvap = -Infinity;
    for (let cell = 0; cell < cellData.cellCount; cell++) {
      const evap = cellData.evaporation[cell];
      if (evap < minEvap) minEvap = evap;
      if (evap > maxEvap) maxEvap = evap;
    }
    
    // Ensure valid range
    if (!isFinite(minEvap)) minEvap = 0;
    if (!isFinite(maxEvap)) maxEvap = 2000;
    const evapRange = maxEvap - minEvap || 1;
    
    console.log(`Evaporation range: ${minEvap.toFixed(0)} to ${maxEvap.toFixed(0)} mm/yr`);
    
    // Color gradient for evaporation visualization
    // Low evaporation (cold/dry) → cool blues
    // High evaporation (hot/wet) → warm oranges/reds
    const getColorForEvaporation = (evaporation, isWater) => {
      // Normalize to 0-1 range
      const normalized = (evaporation - minEvap) / evapRange;
      
      if (isWater) {
        // Ocean: blue gradient (darker = less evaporation)
        const t = normalized;
        return {
          r: Math.floor(32 + t * 60),    // 32 → 92
          g: Math.floor(48 + t * 100),   // 48 → 148
          b: Math.floor(100 + t * 100)   // 100 → 200
        };
      } else {
        // Land: brown/tan to orange/red gradient
        if (normalized < 0.25) {
          // Very low evaporation: cool gray-blue (cold/arid)
          const t = normalized / 0.25;
          return {
            r: Math.floor(140 + t * 40),   // 140 → 180
            g: Math.floor(140 + t * 30),   // 140 → 170
            b: Math.floor(160 - t * 20)    // 160 → 140
          };
        } else if (normalized < 0.5) {
          // Low-moderate: tan/beige
          const t = (normalized - 0.25) / 0.25;
          return {
            r: Math.floor(180 + t * 40),   // 180 → 220
            g: Math.floor(170 + t * 20),   // 170 → 190
            b: Math.floor(140 - t * 40)    // 140 → 100
          };
        } else if (normalized < 0.75) {
          // Moderate-high: warm yellow/orange
          const t = (normalized - 0.5) / 0.25;
          return {
            r: Math.floor(220 + t * 35),   // 220 → 255
            g: Math.floor(190 - t * 50),   // 190 → 140
            b: Math.floor(100 - t * 50)    // 100 → 50
          };
        } else {
          // Very high evaporation: hot orange/red
          const t = (normalized - 0.75) / 0.25;
          return {
            r: 255,
            g: Math.floor(140 - t * 60),   // 140 → 80
            b: Math.floor(50 - t * 30)     // 50 → 20
          };
        }
      }
    };
    
    // Create image data
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    // Render based on cell data
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        // Map pixel to cell
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        const elevation = cellData.cellElevation[cell];
        const isWater = elevation < seaLevel;
        const evaporation = cellData.evaporation[cell];
        
        const color = getColorForEvaporation(evaporation, isWater);
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Evaporation map complete");
  }

  /**
   * Render the biome map using CellDataModel
   * Based on Whittaker diagram from planet.c (temperature × rainfall)
   *
   * @param {object} mapConfig - The map configuration (used for compatibility)
   * @param {object} imageConfig - The image configuration
   */
  function generateAndRenderBiomeMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel
  ) {
    console.log("Rendering biome map from CellDataModel...");

    const canvas = $('biome-map');
    if (!canvas) {
      console.warn('biome-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Check if cell data is available
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    
    // Ensure biomes are calculated
    if (!cellData.biomeColors || cellData.biomeColors.length === 0) {
      cellData.calculateBiomes();
    }
    
    // Create image data
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    // Render based on cell data
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        // Map pixel to cell
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        // Get pre-calculated biome colors
        data[idx] = cellData.biomeColors[cell * 3];         // R
        data[idx + 1] = cellData.biomeColors[cell * 3 + 1]; // G
        data[idx + 2] = cellData.biomeColors[cell * 3 + 2]; // B
        data[idx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Whittaker Biome Model complete");
  }

  /**
   * Render the Holdridge Life Zones map using CellDataModel
   * Based on biotemperature and precipitation with PET ratio
   *
   * @param {object} mapConfig - The map configuration (used for compatibility)
   * @param {object} imageConfig - The image configuration
   */
  function generateAndRenderHoldridgeMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel
  ) {
    console.log("Rendering Holdridge Life Zones from CellDataModel...");

    const canvas = $('holdridge-map');
    if (!canvas) {
      console.warn('holdridge-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Check if cell data is available
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    
    // Ensure Holdridge zones are calculated
    if (!cellData.holdridgeColors || cellData.holdridgeColors.length === 0) {
      cellData.calculateHoldridgeLifeZones();
    }
    
    // Create image data
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    // Render based on cell data
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        // Map pixel to cell
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        // Get pre-calculated Holdridge colors
        data[idx] = cellData.holdridgeColors[cell * 3];         // R
        data[idx + 1] = cellData.holdridgeColors[cell * 3 + 1]; // G
        data[idx + 2] = cellData.holdridgeColors[cell * 3 + 2]; // B
        data[idx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Holdridge Life Zones complete");
  }

  // ============================================================================
  // ECOSYSTEM SIMULATION MAPS
  // These maps visualize output from the HoldridgeSimulation system
  // ============================================================================

  /**
   * Render the soil map from ecosystem simulation or derived from Holdridge zones
   * Shows soil color based on OM content, leaching, salinity, waterlogging
   */
  function renderSoilMap(imageConfig) {
    console.log("Rendering soil map...");

    const canvas = $('soil-map');
    if (!canvas) {
      console.warn('soil-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    // Check if simulation has run (has soil colors), otherwise derive from Holdridge
    const hasSimulationData = cellData.soilColorRGB && cellData.soilColorRGB.length > 0 &&
                              cellData.soilColorRGB.some(v => v !== 0);
    
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    // Soil color palettes
    const soilColors = {
      base: [139, 119, 101],    // Brown
      red: [178, 102, 76],      // Tropical/leached
      black: [50, 45, 40],      // High OM
      pale: [235, 225, 200],    // Arid
      gray: [140, 145, 150],    // Permafrost
      ocean: [30, 60, 100]
    };
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        const groundElev = cellData.cellElevation[cell] || 
                          (cellData.bedrockThickness[cell] + cellData.sedimentThickness[cell]);
        
        if (groundElev < seaLevel) {
          data[idx] = soilColors.ocean[0];
          data[idx + 1] = soilColors.ocean[1];
          data[idx + 2] = soilColors.ocean[2];
        } else if (hasSimulationData) {
          // Use simulation colors
          data[idx] = cellData.soilColorRGB[cell * 3];
          data[idx + 1] = cellData.soilColorRGB[cell * 3 + 1];
          data[idx + 2] = cellData.soilColorRGB[cell * 3 + 2];
        } else {
          // Derive from Holdridge zone and climate
          const zoneName = cellData.getHoldridgeZoneName ? cellData.getHoldridgeZoneName(cell) : '';
          const bioT = cellData.biotemperature ? cellData.biotemperature[cell] : 15;
          const petRatio = cellData.petRatio ? cellData.petRatio[cell] : 1;
          
          let r = soilColors.base[0], g = soilColors.base[1], b = soilColors.base[2];
          
          // Tropical = red soils
          if (zoneName.includes('Tropical') && bioT > 20) {
            const t = Math.min(1, (bioT - 20) / 8);
            r = r + (soilColors.red[0] - r) * t;
            g = g + (soilColors.red[1] - g) * t;
            b = b + (soilColors.red[2] - b) * t;
          }
          // Grassland/steppe = dark soils
          if (zoneName.includes('Steppe') || zoneName.includes('Grassland') || zoneName.includes('Moist') && !zoneName.includes('Forest')) {
            const t = 0.5;
            r = r + (soilColors.black[0] - r) * t;
            g = g + (soilColors.black[1] - g) * t;
            b = b + (soilColors.black[2] - b) * t;
          }
          // Desert/arid = pale soils
          if (zoneName.includes('Desert') || petRatio > 4) {
            const t = Math.min(1, (petRatio - 2) / 6);
            r = r + (soilColors.pale[0] - r) * t;
            g = g + (soilColors.pale[1] - g) * t;
            b = b + (soilColors.pale[2] - b) * t;
          }
          // Cold = gray soils
          if (zoneName.includes('Tundra') || zoneName.includes('Polar') || bioT < 3) {
            const t = Math.min(1, (5 - bioT) / 5);
            r = r + (soilColors.gray[0] - r) * t;
            g = g + (soilColors.gray[1] - g) * t;
            b = b + (soilColors.gray[2] - b) * t;
          }
          
          data[idx] = Math.round(r);
          data[idx + 1] = Math.round(g);
          data[idx + 2] = Math.round(b);
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Soil map complete");
  }

  /**
   * Render the vegetation map from ecosystem simulation or derived from Holdridge zones
   * Shows vegetation cover, canopy density, and ground cover type
   */
  function renderVegetationMap(imageConfig) {
    console.log("Rendering vegetation map...");

    const canvas = $('vegetation-map');
    if (!canvas) {
      console.warn('vegetation-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    const hasSimulationData = cellData.vegColors && cellData.vegColors.length > 0 &&
                              cellData.vegColors.some(v => v !== 0);
    
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        const groundElev = cellData.cellElevation[cell] || 
                          (cellData.bedrockThickness[cell] + cellData.sedimentThickness[cell]);
        
        if (groundElev < seaLevel) {
          data[idx] = 30;
          data[idx + 1] = 50;
          data[idx + 2] = 90;
        } else if (hasSimulationData) {
          data[idx] = cellData.vegColors[cell * 3];
          data[idx + 1] = cellData.vegColors[cell * 3 + 1];
          data[idx + 2] = cellData.vegColors[cell * 3 + 2];
        } else {
          // Derive from Holdridge zone
          const zoneName = cellData.getHoldridgeZoneName ? cellData.getHoldridgeZoneName(cell) : '';
          
          let r, g, b;
          
          if (zoneName.includes('Rain Forest') || zoneName.includes('Wet Forest')) {
            // Dense forest - dark green
            r = 20; g = 80; b = 20;
          } else if (zoneName.includes('Moist Forest')) {
            r = 40; g = 110; b = 40;
          } else if (zoneName.includes('Dry Forest') || zoneName.includes('Woodland')) {
            r = 80; g = 140; b = 60;
          } else if (zoneName.includes('Thorn')) {
            r = 120; g = 130; b = 70;
          } else if (zoneName.includes('Steppe') || zoneName.includes('Grassland')) {
            // Grassland - yellow-green
            r = 180; g = 200; b = 80;
          } else if (zoneName.includes('Tundra')) {
            // Tundra - moss green
            r = 100; g = 140; b = 90;
          } else if (zoneName.includes('Desert') || zoneName.includes('Polar')) {
            // Desert/polar - sparse
            r = 200; g = 180; b = 150;
          } else if (zoneName.includes('Boreal')) {
            r = 60; g = 100; b = 70;
          } else {
            // Default
            r = 140; g = 160; b = 100;
          }
          
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Vegetation map complete");
  }

  /**
   * Render the fauna map from ecosystem simulation or derived from Holdridge zones
   * Shows fauna guild abundance as RGB channels
   */
  function renderFaunaMap(imageConfig) {
    console.log("Rendering fauna map...");

    const canvas = $('fauna-map');
    if (!canvas) {
      console.warn('fauna-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    const hasSimulationData = cellData.faunaColors && cellData.faunaColors.length > 0 &&
                              cellData.faunaColors.some(v => v !== 0);
    
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    // Fauna weights by zone type (R=mammals, G=invertebrates+amphibians, B=reptiles+birds)
    const faunaByZone = {
      'Rain Forest': [0.6, 0.9, 0.7],      // High invertebrates, good all around
      'Wet Forest': [0.7, 0.8, 0.6],
      'Moist Forest': [0.8, 0.7, 0.6],
      'Dry Forest': [0.7, 0.5, 0.7],
      'Thorn': [0.5, 0.4, 0.8],            // More reptiles
      'Steppe': [0.9, 0.6, 0.5],           // High grazers
      'Grassland': [0.9, 0.7, 0.5],        // High grazers
      'Desert': [0.3, 0.3, 0.7],           // Reptiles dominate
      'Tundra': [0.6, 0.4, 0.5],           // Moderate mammals, birds
      'Polar': [0.2, 0.1, 0.3],            // Low diversity
      'Boreal': [0.7, 0.5, 0.5],
      'default': [0.5, 0.5, 0.5]
    };
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        const groundElev = cellData.cellElevation[cell] || 
                          (cellData.bedrockThickness[cell] + cellData.sedimentThickness[cell]);
        
        if (groundElev < seaLevel) {
          data[idx] = 30;
          data[idx + 1] = 50;
          data[idx + 2] = 90;
        } else if (hasSimulationData) {
          data[idx] = cellData.faunaColors[cell * 3];
          data[idx + 1] = cellData.faunaColors[cell * 3 + 1];
          data[idx + 2] = cellData.faunaColors[cell * 3 + 2];
        } else {
          // Derive from Holdridge zone
          const zoneName = cellData.getHoldridgeZoneName ? cellData.getHoldridgeZoneName(cell) : '';
          
          // Find matching zone weights
          let weights = faunaByZone['default'];
          for (const key in faunaByZone) {
            if (zoneName.includes(key)) {
              weights = faunaByZone[key];
              break;
            }
          }
          
          // Convert to RGB with saturation
          const maxW = Math.max(...weights);
          const brightness = (weights[0] + weights[1] + weights[2]) / 3;
          
          data[idx] = Math.round(40 + (weights[0] / maxW) * brightness * 215);
          data[idx + 1] = Math.round(40 + (weights[1] / maxW) * brightness * 215);
          data[idx + 2] = Math.round(40 + (weights[2] / maxW) * brightness * 215);
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Fauna map complete");
  }

  /**
   * Render the fire risk map from ecosystem simulation or derived from climate
   * Shows annual fire probability as a heat map
   */
  function renderFireRiskMap(imageConfig) {
    console.log("Rendering fire risk map...");

    const canvas = $('fire-risk-map');
    if (!canvas) {
      console.warn('fire-risk-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    const hasSimulationData = cellData.fireRisk && cellData.fireRisk.length > 0 &&
                              cellData.fireRisk.some(v => v !== 0);
    
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        
        const groundElev = cellData.cellElevation[cell] || 
                          (cellData.bedrockThickness[cell] + cellData.sedimentThickness[cell]);
        
        if (groundElev < seaLevel) {
          data[idx] = 30;
          data[idx + 1] = 50;
          data[idx + 2] = 90;
        } else {
          let risk;
          
          if (hasSimulationData) {
            const rawRisk = cellData.fireRisk[cell];
            const fuelLoad = cellData.vegFuelLoad ? cellData.vegFuelLoad[cell] : 0;
            const composite = rawRisk * 0.6 + fuelLoad * 0.4;
            risk = Math.min(1, Math.sqrt(composite * 5));
          } else {
            // Derive from climate: drier + warmer + grassland/savanna = higher risk
            const zoneName = cellData.getHoldridgeZoneName ? cellData.getHoldridgeZoneName(cell) : '';
            const petRatio = cellData.petRatio ? cellData.petRatio[cell] : 1;
            const bioT = cellData.biotemperature ? cellData.biotemperature[cell] : 15;
            
            // Base risk from PET ratio (dryness)
            let baseRisk = 0;
            if (petRatio > 1 && petRatio < 8) {
              baseRisk = (petRatio - 1) / 7 * 0.5; // Peak in semi-arid
            }
            
            // Boost for fire-prone zones
            if (zoneName.includes('Steppe') || zoneName.includes('Grassland') || zoneName.includes('Savanna')) {
              baseRisk += 0.3;
            } else if (zoneName.includes('Thorn') || zoneName.includes('Dry Forest')) {
              baseRisk += 0.2;
            } else if (zoneName.includes('Desert') || zoneName.includes('Rain Forest') || zoneName.includes('Tundra') || zoneName.includes('Polar')) {
              baseRisk *= 0.3; // Very low in deserts (no fuel) and wet/cold zones
            }
            
            // Temperature modifier
            if (bioT > 15) {
              baseRisk *= 1 + (bioT - 15) / 20;
            }
            
            risk = Math.min(1, Math.sqrt(baseRisk * 2));
          }
          
          // Color gradient: green -> yellow -> red
          if (risk < 0.5) {
            const t = risk * 2;
            data[idx] = Math.round(t * 255);
            data[idx + 1] = Math.round(200 + t * 55);
            data[idx + 2] = Math.round((1 - t) * 80);
          } else {
            const t = (risk - 0.5) * 2;
            data[idx] = 255;
            data[idx + 1] = Math.round((1 - t) * 255);
            data[idx + 2] = 0;
          }
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Fire risk map complete");
  }

  /**
   * Render all ecosystem maps
   * Called after ecosystem simulation steps
   */
  function renderAllEcosystemMaps(imageConfig) {
    renderSoilMap(imageConfig);
    renderVegetationMap(imageConfig);
    renderFaunaMap(imageConfig);
    renderFireRiskMap(imageConfig);
  }

  // Expose ecosystem map functions globally
  window.renderSoilMap = renderSoilMap;
  window.renderVegetationMap = renderVegetationMap;
  window.renderFaunaMap = renderFaunaMap;
  window.renderFireRiskMap = renderFireRiskMap;
  window.renderAllEcosystemMaps = renderAllEcosystemMaps;

  /**
   * Render the snowfall/perennial snow map using CellDataModel
   * Uses mass balance data for accurate visualization:
   * - Accumulation (A) = P × f_snow (precipitation × snow fraction)
   * - Ablation (B) = M + S (melt + sublimation)
   * - Mass balance b = A - B
   * - Perennial snow where b ≥ 0 OR fast-rule conditions met
   *
   * @param {object} mapConfig - The map configuration (used for compatibility)
   * @param {object} imageConfig - The image configuration
   */
  function generateAndRenderSnowfallMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel,
    temperatureMap
  ) {
    console.log("Rendering snowfall/perennial snow map from CellDataModel...");

    const canvas = $('snowfall-map');
    if (!canvas) {
      console.warn('snowfall-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Check if cell data is available
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    // Find mass balance range for normalization (land cells only)
    let minBalance = Infinity, maxBalance = -Infinity;
    for (let cell = 0; cell < cellData.cellCount; cell++) {
      if (cellData.cellElevation[cell] >= seaLevel) {
        const mb = cellData.snowMassBalance[cell];
        if (mb < minBalance) minBalance = mb;
        if (mb > maxBalance) maxBalance = mb;
      }
    }
    
    // Ensure we have a valid range
    if (!isFinite(minBalance)) minBalance = -1000;
    if (!isFinite(maxBalance)) maxBalance = 1000;
    const balanceRange = maxBalance - minBalance || 1;
    
    console.log(`Mass balance range: ${minBalance.toFixed(0)} to ${maxBalance.toFixed(0)} mm/yr`);
    
    // Color gradient for mass balance visualization
    // Negative balance (melt zones) → warm browns/yellows
    // Zero balance → gray transition  
    // Positive balance (accumulation zones) → blues/white
    const getColorForMassBalance = (massBalance, hasPerennialSnow) => {
      // Normalize to 0-1 range
      const normalized = (massBalance - minBalance) / balanceRange;
      
      // If perennial snow, ensure it shows in the upper color range
      if (hasPerennialSnow) {
        // Perennial snow: light blue to white
        const t = Math.max(0.6, normalized); // At least 60% up the scale
        const r = Math.floor(200 + t * 55);
        const g = Math.floor(220 + t * 35);
        const b = 255;
        return { r, g, b };
      }
      
      if (normalized < 0.3) {
        // Heavy melt zone: brown to tan
        const t = normalized / 0.3;
        return {
          r: Math.floor(139 + t * 80),  // 139 → 219
          g: Math.floor(69 + t * 110),  // 69 → 179
          b: Math.floor(19 + t * 80)    // 19 → 99
        };
      } else if (normalized < 0.5) {
        // Moderate melt: tan to yellow/beige
        const t = (normalized - 0.3) / 0.2;
        return {
          r: Math.floor(219 + t * 21),  // 219 → 240
          g: Math.floor(179 + t * 46),  // 179 → 225
          b: Math.floor(99 + t * 60)    // 99 → 159
        };
      } else if (normalized < 0.6) {
        // Near-zero: beige to light gray
        const t = (normalized - 0.5) / 0.1;
        return {
          r: Math.floor(240 - t * 8),   // 240 → 232
          g: Math.floor(225 + t * 7),   // 225 → 232
          b: Math.floor(159 + t * 81)   // 159 → 240
        };
      } else {
        // Positive balance: gray to blue to white
        const t = (normalized - 0.6) / 0.4;
        return {
          r: Math.floor(232 - t * 32),  // 232 → 200 → increases again
          g: Math.floor(232 - t * 12),  // 232 → 220
          b: 255                         // Stay blue
        };
      }
    };
    
    // Create image data
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    // Render based on cell data
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        // Map pixel to cell
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        const idx = (y * imageConfig.width + x) * 4;
        const elevation = cellData.cellElevation[cell];
        
        if (elevation < seaLevel) {
          // Ocean - dark blue
          data[idx] = 32;
          data[idx + 1] = 48;
          data[idx + 2] = 80;
        } else {
          // Land - color by mass balance
          const massBalance = cellData.snowMassBalance[cell];
          const hasSnow = cellData.hasPerennialSnow[cell] === 1;
          const color = getColorForMassBalance(massBalance, hasSnow);
          data[idx] = color.r;
          data[idx + 1] = color.g;
          data[idx + 2] = color.b;
        }
        data[idx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log("Snowfall/perennial snow map complete");
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
          for (
            let r = Math.max(0, row - searchRadius);
            r < Math.min(mapConfig.rows, row + searchRadius);
            r++
          ) {
            for (
              let c = Math.max(0, col - searchRadius);
              c < Math.min(mapConfig.cols, col + searchRadius);
              c++
            ) {
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
          proximityMap[row][col] = 1 - minDistance / searchRadius;
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
      columnPositions[row] = Math.floor(
        (row / imageConfig.width) * mapConfig.cols
      );
    }

    // Precalculate row positions with Mercator formula
    for (row = 0; row < imageConfig.height; row++) {
      rowPositions[row] = Math.floor(
        (0.5 -
          Math.atan(Math.sinh((0.5 - row / imageConfig.height) * Math.PI)) /
            Math.PI) *
          mapConfig.rows
      );
    }

    // Map pixels
    for (row = 0; row < imageConfig.width; row++) {
      for (var col = 0; col < imageConfig.height; col++) {
        var pixelValue = getRotatedMapValue(
          mapConfig,
          rowPositions[col],
          columnPositions[row]
        );
        if (pixelValue > 0) {
          set_pixel(image, row, col, colorMap[pixelValue]);
        }
      }
    }
  }

  /**
   * Render the map using Transverse Mercator projection
   */
  function renderTransverseMercatorProjection(
    mapImage,
    mapConfig,
    imageConfig
  ) {
    var image = mapImage;
    var colorMap = mapConfig.palette.cmap;

    for (var row = 0; row < imageConfig.width; row++) {
      for (var col = 0; col < imageConfig.height; col++) {
        var angle = (row / imageConfig.width) * 2 * Math.PI;
        var lat = 4 * (col / imageConfig.height - 0.5);
        var lon = Math.atan(Math.sinh(lat) / Math.cos(angle));
        var halfPi = Math.PI / 2;

        if (angle > halfPi && angle <= 3 * halfPi) {
          lon += Math.PI;
        }

        var pixelValue = getRotatedMapValue(
          mapConfig,
          Math.floor(
            (0.5 - Math.asin(Math.sin(angle) / Math.cosh(lat)) / Math.PI) *
              mapConfig.rows
          ),
          Math.floor((lon / (2 * Math.PI)) * mapConfig.cols)
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
        var rowOffset = Math.floor(
          0.5773502692 * Math.floor(col - rowIndex * imageConfig.row_h)
        );
        let pixelIndex = -1;

        if ((rowIndex + colIndex) % 2 == 0) {
          colOffset = Math.floor(imageConfig.col_w - colOffset);
        }

        // Complex icosahedral mapping logic
        if (rowIndex == 0) {
          if (colIndex < 10 && colOffset < rowOffset) {
            pixelIndex = Math.floor(
              (colOffset / rowOffset) * imageConfig.col_w
            );
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
          pixelIndex = Math.floor((colOffset / rowOffset) * imageConfig.col_w);
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
      sinFactors[row] = Math.sqrt(
        Math.sin((row / imageConfig.height) * Math.PI)
      );
      ellipseWidths[row] = Math.floor(imageConfig.wd2 * sinFactors[row]);

      var theta = Math.asin(
        (2.8284271247 * (0.5 - row / imageConfig.height)) / Math.sqrt(2)
      );
      rowPositions[row] = Math.floor(
        (0.5 -
          Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI) / Math.PI) *
          mapConfig.rows
      );
    }

    // Map pixels
    for (row = 0; row < imageConfig.width; row++) {
      for (var col = 0; col < imageConfig.height; col++) {
        var pixelValue = 0;

        if (
          row > imageConfig.wd2 - ellipseWidths[col] &&
          row < imageConfig.wd2 + ellipseWidths[col]
        ) {
          pixelValue = getRotatedMapValue(
            mapConfig,
            rowPositions[col],
            Math.floor((row - imageConfig.wd2) / sinFactors[col]) +
              mapConfig.cd2
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
      sinFactors[row] = Math.sin((row / imageConfig.height) * Math.PI);
      ellipseWidths[row] = Math.floor(imageConfig.wd2 * sinFactors[row]);
    }

    // Map pixels
    for (row = 0; row < imageConfig.width; row++) {
      for (var col = 0; col < imageConfig.height; col++) {
        var pixelValue = 0;

        if (
          row > imageConfig.wd2 - ellipseWidths[col] &&
          row < imageConfig.wd2 + ellipseWidths[col]
        ) {
          pixelValue = getRotatedMapValue(
            mapConfig,
            col,
            Math.floor((row - imageConfig.wd2) / sinFactors[col]) +
              mapConfig.cd2
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
   * Generate hexagonal map projection coordinates
   * @param {number} width - Width of the map
   * @param {number} height - Height of the map
   * @returns {Array} - Array of hexagonal coordinates
   * 
   * TODO: Does not work, moved in from PlanetJ.java
   */
  function generateHexagonalProjection(width, height) {
    const hexMap = [];
    for (let row = 0; row < height; row++) {
      const latitude = Math.PI * (row / (height - 1));
      const offset = Math.abs((row - height / 2) / 2);
      for (let col = offset; col < width - offset; col++) {
        const longitude =
          Math.PI + (2 * Math.PI * (col - offset)) / (width - 1 - offset * 2);
        const y = -Math.cos(latitude);
        const ySin = Math.sin(latitude);
        const x = Math.sin(longitude) * ySin;
        const z = Math.cos(longitude) * ySin;
        hexMap.push({ x, y, z });
      }
    }
    return hexMap;
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
    return (Date.now() - startTime) / 1e3;
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
    config.rpx = Math.floor((config.rotate / 360) * config.cols);

    // Apply palette settings
    let paletteConfig;
    if ((paletteConfig = palette[config.palette])) {
      config.palette = applyPalette(paletteConfig);
      let paletteSettings;
      if ((paletteSettings = paletteConfig.set)) {
        Object.keys(paletteSettings).forEach((key) => {
          config[key] = paletteSettings[key];
        });
      }
    } else {
      config.palette = applyPalette(palette.mogersen);
    }

    return config;
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
      sinValues[i] = Math.sin((i / cols) * 2 * Math.PI);
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
          var thetaFactor = (random(32767) / 32767) * 0.5 + 0.5;
          var math = Math;
          var mathFloor = math.floor;
          var rowOffset = (1 - thetaFactor) * config.rl1;
          rowOffset *= random(32767) / 32767;
          col = mathFloor.call(math, rowOffset) + 1;
        }

        // Apply the height modification to each column
        for (row = 0; row < config.cols; row++) {
          rowOffset = Math.floor(
            Math.atan(
              sinArray[(colOffset - row + config.cols) % config.cols] * angle
            ) * config.rdp
          );

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
   * @
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
      col: col,
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
      let iceThreshold = Math.floor(
        ((config.pct_ice / 100) * config.map_len) / 2
      );

      // Record ice regions to protect them from future erosion
      const polarRegionMap = identifyPolarRegions(config);
      config.polarRegionMap = polarRegionMap; // Store for later use

      // Apply ice to north pole
      (() => {
        let iceCount = 0,
          row;
        for (row = 0; row < config.rows; row++) {
          let col;
          for (col = 0; col < config.cols; col++) {
            if (config.map[row][col] < palette.ice_idx) {
              iceCount += applyIceAtPoint(
                config,
                row,
                col,
                config.map[row][col],
                0
              );
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
              iceCount += applyIceAtPoint(
                config,
                row,
                col,
                config.map[row][col],
                0
              );
            }
            if (iceCount > iceThreshold) break;
          }
          if (iceCount > iceThreshold) break;
        }
      })();
    } else {
      // Even with no ice, define polar regions to protect them from erosion
      config.polarRegionMap = identifyPolarRegions(config);
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
        setMapValue(
          config,
          row,
          col,
          currentValue - palette.land_idx + palette.ice_idx + 1
        );
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
   * Identify polar regions that should be protected from erosion (potential ice cap areas)
   * @param {object} config - The map configuration
   * @returns {Array} - 2D map with true for polar regions
   */
  function identifyPolarRegions(config) {
    const polarRegionMap = createEmptyMap(config, false);
    // Increase polar threshold to ensure proper protection of ice caps
    const polarThreshold = Math.floor(config.rows * 0.18); // Top and bottom 18% are polar regions

    // Mark polar regions
    for (let row = 0; row < config.rows; row++) {
      const isPolar =
        row < polarThreshold || row >= config.rows - polarThreshold;

      for (let col = 0; col < config.cols; col++) {
        polarRegionMap[row][col] = isPolar;
      }
    }

    return polarRegionMap;
  }

  /**
   * Extend continental shelf areas for a more natural look
   * @param {object} config - The map configuration
   * @param {number} waterLevel - The water level
   * @param {Array} continentalShelfMap - Map of continental shelf areas
   * @param {Array} polarRegionMap - Map of polar regions to protect
   */
  function extendContinentalShelf(
    config,
    waterLevel,
    continentalShelfMap,
    polarRegionMap
  ) {
    // Create a copy of the map to work with
    const originalMap = JSON.parse(JSON.stringify(config.map));

    // Create a new map to track extended shelf areas
    const extendedShelfMap = JSON.parse(JSON.stringify(continentalShelfMap));

    // Distance to extend the shelf into the ocean (adjust as needed)
    const shelfExtendDistance = Math.max(3, Math.floor(config.rows * 0.015));

    // Identify original coastline cells (before erosion)
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        // If this is already marked as shelf and not in polar region, check surrounding water cells
        if (continentalShelfMap[row][col] === 1 && !polarRegionMap[row][col]) {
          // For each shelf cell, extend outward several steps
          for (let distance = 1; distance <= shelfExtendDistance; distance++) {
            // Calculate shelf depth based on distance from original coastline
            // Deeper as we go further from shore
            const depthFactor = distance / shelfExtendDistance; // 0.0 to 1.0

            // Apply a gradual depth gradient (shallow near shore, deeper further out)
            // Scaled to be between 20% and 80% of the way to deep ocean
            // Make sure shelf is definitely underwater by using lower values
            const shelfDepth = waterLevel - 0.8 - depthFactor * 0.6;

            // Check in all 8 directions
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue; // Skip center

                // Get position to check
                const checkRow = wrapCoordinate(
                  row + dr * distance,
                  config.rows
                );
                const checkCol = wrapCoordinate(
                  col + dc * distance,
                  config.cols
                );

                // Only modify if it's water and not already part of the shelf
                if (
                  originalMap[checkRow][checkCol] < waterLevel &&
                  extendedShelfMap[checkRow][checkCol] === 0
                ) {
                  // Mark as extended shelf
                  extendedShelfMap[checkRow][checkCol] = 1;

                  // Set the height to create a sloping shelf
                  // Add small random variation for natural look
                  // Make sure it's well below water level to appear blue
                  config.map[checkRow][checkCol] =
                    shelfDepth - Math.random() * 0.2;
                }
              }
            }
          }
        }
      }
    }

    // Second pass: smooth the transition between shelf and deep ocean
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        // Skip polar regions in smoothing pass too
        if (extendedShelfMap[row][col] === 1 && !polarRegionMap[row][col]) {
          // Check for adjacent deep ocean cells
          let adjacentDeepOcean = false;

          for (let dr = -1; dr <= 1 && !adjacentDeepOcean; dr++) {
            for (let dc = -1; dc <= 1 && !adjacentDeepOcean; dc++) {
              if (dr === 0 && dc === 0) continue;

              const adjRow = wrapCoordinate(row + dr, config.rows);
              const adjCol = wrapCoordinate(col + dc, config.cols);

              // If adjacent to deep ocean (not shelf and underwater)
              if (
                extendedShelfMap[adjRow][adjCol] === 0 &&
                originalMap[adjRow][adjCol] < waterLevel
              ) {
                adjacentDeepOcean = true;
              }
            }
          }

          // If this shelf cell borders deep ocean, make it deeper for a smoother transition
          if (adjacentDeepOcean) {
            config.map[row][col] = Math.min(
              config.map[row][col],
              waterLevel - 1.0 - Math.random() * 0.3
            );
          }
        }
      }
    }
  }

  /**
   * Identify and erode small islands that would be affected by ocean currents
   * @param {object} config - The map configuration
   * @param {number} waterLevel - The water level
   * @param {Array} continentalShelfMap - Map of continental shelf areas
   * @param {Array} polarRegionMap - Map of polar regions (to protect ice caps)
   */
  function identifyAndErodeSmallIslands(
    config,
    waterLevel,
    continentalShelfMap,
    polarRegionMap
  ) {
    // Create a copy of the map to work with
    const originalMap = JSON.parse(JSON.stringify(config.map));

    // Create a map to track islands
    const islandMap = createEmptyMap(config, 0);
    const islandSizes = {};
    let islandId = 1;

    // First pass: identify islands using flood fill
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        // If this is land and not already part of an island and not in a polar region
        if (
          originalMap[row][col] >= waterLevel &&
          islandMap[row][col] === 0 &&
          !polarRegionMap[row][col]
        ) {
          // New island found, flood fill it
          const size = floodFillIsland(
            originalMap,
            islandMap,
            row,
            col,
            islandId,
            waterLevel,
            config.rows,
            config.cols,
            polarRegionMap
          );
          islandSizes[islandId] = size;
          islandId++;
        }
      }
    }

    // Calculate the threshold for small islands (adjust as needed)
    // Islands smaller than this threshold will be more heavily eroded
    const smallIslandThreshold = config.rows * config.cols * 0.005; // 0.5% of map size

    // Second pass: erode small islands
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const island = islandMap[row][col];
        if (island > 0 && islandSizes[island] < smallIslandThreshold) {
          // This is part of a small island, make it more susceptible to erosion

          // Calculate how much to erode based on island size
          // Smaller islands get more erosion
          const erosionFactor =
            1 - Math.min(1, islandSizes[island] / smallIslandThreshold);

          // Check if this is a coastal cell of the island
          let isCoastal = false;

          // Check 8 surrounding cells
          for (let dr = -1; dr <= 1 && !isCoastal; dr++) {
            for (let dc = -1; dc <= 1 && !isCoastal; dc++) {
              if (dr === 0 && dc === 0) continue; // Skip self

              // Get the adjacent cell
              const adjRow = wrapCoordinate(row + dr, config.rows);
              const adjCol = wrapCoordinate(col + dc, config.cols);

              // If adjacent cell is water, this is a coastal cell
              if (islandMap[adjRow][adjCol] === 0) {
                isCoastal = true;
              }
            }
          }

          if (isCoastal) {
            // Coastal cells of small islands get significant erosion
            config.map[row][col] = Math.max(
              waterLevel - 1, // Push it below water level
              originalMap[row][col] - 10 * erosionFactor // Adjust erosion strength
            );
          } else {
            // Interior cells get less erosion
            config.map[row][col] = Math.max(
              1, // Ensure minimum height
              originalMap[row][col] - 3 * erosionFactor // Weaker erosion for interior
            );
          }
        }
      }
    }
  }

  /**
   * Flood fill an island and return its size
   * @param {Array} heightMap - The height map
   * @param {Array} islandMap - The map used to track islands
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {number} islandId - The ID to assign to this island
   * @param {number} waterLevel - The water level
   * @param {number} maxRows - Maximum number of rows
   * @param {number} maxCols - Maximum number of columns
   * @param {Array} polarRegionMap - Map of polar regions (to protect ice caps)
   * @returns {number} - The size of the island
   */
  function floodFillIsland(
    heightMap,
    islandMap,
    startRow,
    startCol,
    islandId,
    waterLevel,
    maxRows,
    maxCols,
    polarRegionMap
  ) {
    // Use a queue for flood fill to avoid stack overflow
    const queue = [{ row: startRow, col: startCol }];
    let size = 0;

    while (queue.length > 0) {
      const { row, col } = queue.shift();

      // Skip if out of bounds
      if (row < 0 || row >= maxRows || col < 0 || col >= maxCols) {
        continue;
      }

      // Skip if water, already processed, or in polar region
      if (
        heightMap[row][col] < waterLevel ||
        islandMap[row][col] !== 0 ||
        (polarRegionMap && polarRegionMap[row][col])
      ) {
        continue;
      }

      // Mark this cell as part of the island
      islandMap[row][col] = islandId;
      size++;

      // Add neighbors to the queue
      queue.push({ row: row - 1, col: col }); // Up
      queue.push({ row: row + 1, col: col }); // Down
      queue.push({ row: row, col: col - 1 }); // Left
      queue.push({ row: row, col: col + 1 }); // Right

      // Add diagonal neighbors (optional but helps with small islands)
      queue.push({ row: row - 1, col: col - 1 }); // Up-left
      queue.push({ row: row - 1, col: col + 1 }); // Up-right
      queue.push({ row: row + 1, col: col - 1 }); // Down-left
      queue.push({ row: row + 1, col: col + 1 }); // Down-right
    }

    return size;
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

  // --- BEGIN: Move these functions back inside the IIFE ---
  function generateAndRenderLakeMap(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel
  ) {
    // Fix: define polarRegionMap from mapConfig
    const polarRegionMap = mapConfig.polarRegionMap || null;
    // If oceanSizeThreshold is not provided, calculate based on map size
    const oceanSizeThreshold = Math.floor(mapConfig.rows * mapConfig.cols * 0.01); // 1% of map size

    // Create maps to track water bodies and visited cells
    const waterBodyMap = createEmptyMap(mapConfig, 0);
    const visitedMap = createEmptyMap(mapConfig, false);
    const lakeMap = createEmptyMap(mapConfig, 0);

    // Data structures to track water bodies
    const waterBodies = {};
    let waterBodyId = 1;

    // First pass: identify all water bodies using flood fill
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        // If this is water and not already visited
        if (heightMap[row][col] < waterLevel && !visitedMap[row][col]) {
          // Track whether this water body touches the map edge
          const waterBodyData = {
            id: waterBodyId,
            size: 0,
            touchesEdge: false,
            cells: [],
          };

          // Perform flood fill to identify all connected water cells
          floodFillWaterBody(
            heightMap,
            visitedMap,
            waterBodyMap,
            row,
            col,
            waterLevel,
            waterBodyId,
            mapConfig.rows,
            mapConfig.cols,
            waterBodyData,
            polarRegionMap
          );

          // Store water body data
          waterBodies[waterBodyId] = waterBodyData;
          waterBodyId++;
        }
      }
    }

    // Second pass: identify lakes (water bodies that don't touch the edge and aren't too large)
    const lakes = {};
    let lakeId = 1;

    Object.values(waterBodies).forEach((waterBody) => {
      const isLake =
        !waterBody.touchesEdge && waterBody.size < oceanSizeThreshold;

      if (isLake) {
        lakes[lakeId] = {
          id: lakeId,
          originalId: waterBody.id,
          size: waterBody.size,
          cells: waterBody.cells,
        };

        // Mark all cells of this lake in the lake map
        waterBody.cells.forEach((cell) => {
          lakeMap[cell.row][cell.col] = lakeId;
        });

        lakeId++;
      }
    });

    // Set the lake map on mapConfig
    mapConfig.map = lakeMap;

    // Create the lake image
    const lakeImage = new_image(
      "lake-map",
      imageConfig.width,
      imageConfig.height
    );

    // Render the lake map with the appropriate projection
    if (mapConfig.projection == "mercator") {
      renderMercatorProjection(lakeImage, mapConfig, imageConfig);
    } else if (mapConfig.projection == "transmerc") {
      renderTransverseMercatorProjection(lakeImage, mapConfig, imageConfig);
    } else if (mapConfig.projection == "icosahedral") {
      renderIcosahedralProjection(lakeImage, mapConfig,imageConfig);
    } else if (mapConfig.projection == "mollweide") {
      renderMollweideProjection(lakeImage, mapConfig, imageConfig);
    } else if (mapConfig.projection == "sinusoidal") {
      renderSinusoidalProjection(lakeImage, mapConfig, imageConfig);
    } else {
      // Default square projection
      renderSquareProjection(lakeImage,mapConfig, imageConfig);
    }

    console.log("Drawing lake map...");
    // Draw the pixels to the canvas
    draw_pixels(lakeImage);
  }

  function identifyLakes(
    mapConfig,
    heightMap,
    waterLevel,
    oceanSizeThreshold = null
  ) {
    // If oceanSizeThreshold is not provided, calculate based on map size
    if (oceanSizeThreshold === null) {
      oceanSizeThreshold = Math.floor(mapConfig.rows * mapConfig.cols * 0.01); // 1% of map size
    }

    // Get polarRegionMap from mapConfig
    const polarRegionMap = mapConfig.polarRegionMap || null;

    // Create maps to track water bodies and visited cells
    const waterBodyMap = createEmptyMap(mapConfig, 0);
    const visitedMap = createEmptyMap(mapConfig, false);
    const lakeMap = createEmptyMap(mapConfig, 0);

    // Data structures to track water bodies
    const waterBodies = {};
    let waterBodyId = 1;

    // First pass: identify all water bodies using flood fill
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        // If this is water and not already visited
        if (heightMap[row][col] < waterLevel && !visitedMap[row][col]) {
          // Track whether this water body touches the map edge
          const waterBodyData = {
            id: waterBodyId,
            size: 0,
            touchesEdge: false,
            cells: [],
          };

          // Perform flood fill to identify all connected water cells
          floodFillWaterBody(
            heightMap,
            visitedMap,
            waterBodyMap,
            row,
            col,
            waterLevel,
            waterBodyId,
            mapConfig.rows,
            mapConfig.cols,
            waterBodyData,
            polarRegionMap
          );

          // Store water body data
          waterBodies[waterBodyId] = waterBodyData;
          waterBodyId++;
        }
      }
    }

    // Second pass: identify lakes (water bodies that don't touch the edge and aren't too large)
    const lakes = {};
    let lakeId = 1;

    Object.values(waterBodies).forEach((waterBody) => {
      const isLake =
        !waterBody.touchesEdge && waterBody.size < oceanSizeThreshold;

      if (isLake) {
        lakes[lakeId] = {
          id: lakeId,
          originalId: waterBody.id,
          size: waterBody.size,
          cells: waterBody.cells,
        };

        // Mark all cells of this lake in the lake map
        waterBody.cells.forEach((cell) => {
          lakeMap[cell.row][cell.col] = lakeId;
        });

        lakeId++;
      }
    });

    return {
      lakeMap,
      lakeData: lakes,
    };
  }

  function floodFillWaterBody(
    heightMap,
    visitedMap,
    waterBodyMap,
    startRow,
    startCol,
    waterLevel,
    waterBodyId,
    maxRows,
    maxCols,
    waterBodyData,
    polarRegionMap = null
  ) {
    // Use a queue for flood fill to avoid stack overflow
    const queue = [{ row: startRow, col: startCol }];

    while (queue.length > 0) {
      const { row, col } = queue.shift();

      // Skip if out of bounds
      if (row < 0 || row >= maxRows || col < 0 || col >= maxCols) {
        continue;
      }

      // Skip if not water, already processed, or in polar region
      if (
        heightMap[row][col] >= waterLevel ||
        visitedMap[row][col] ||
        (polarRegionMap && polarRegionMap[row][col])
      ) {
        // If this water body touches the edge of the map
        if (row === 0 || row === maxRows - 1 || col === 0 || col === maxCols - 1) {
          waterBodyData.touchesEdge = true;
        }
        continue;
      }

      // Mark this cell as visited and part of the water body
      visitedMap[row][col] = true;
      waterBodyMap[row][col] = waterBodyId;
      waterBodyData.size++;
      waterBodyData.cells.push({ row, col });

      // Add neighbors to the queue
      queue.push({ row: row - 1, col: col }); // Up
      queue.push({ row: row + 1, col: col }); // Down
      queue.push({ row: row, col: col - 1 }); // Left
      queue.push({ row: row, col: col + 1 }); // Right

      // Add diagonal neighbors (optional but helps with small islands)
      queue.push({ row: row - 1, col: col - 1 }); // Up-left
      queue.push({ row: row - 1, col: col + 1 }); // Up-right
      queue.push({ row: row + 1, col: col - 1 }); // Down-left
      queue.push({ row: row + 1, col: col + 1 }); // Down-right
    }
  }
  // --- END: Move these functions back inside the IIFE ---

  // Attach to window for global access
  window.generateAndRenderLakeMap = generateAndRenderLakeMap;
  window.identifyLakes = identifyLakes;
  window.floodFillWaterBody = floodFillWaterBody;

  // Configuration for UI elements
  let uiConfig = {
    projection: {
      square: {
        title: "Square",
      },
      mercator: {
        title: "Mercator",
      },
      transmerc: {
        title: "Transverse",
      },
      icosahedral: {
        title: "Icosahedral",
      },
      mollweide: {
        title: "Mollweide",
      },
      sinusoidal: {
        title: "Sinusoidal",
      },
    },
    palette,
  };

  // Define a default blue palette for lakes
  palette.blue = {
    sea: [
      [0, 0, 128], // Dark blue
      [0, 0, 255], // Light blue
    ],
    land: [
      [0, 128, 255], // Sky blue
      [173, 216, 230], // Light sky blue
    ],
  };

  /**
   * Saves the current map as a PNG image
   */
  function saveMapAsPNG() {
    // Get the map canvas element
    const mapCanvas = $("map");

    if (!mapCanvas) {
      console.error("Map canvas element not found");
      return;
    }

    try {
      // Create a link element
      const link = document.createElement("a");

      // Set the download attribute with a filename
      link.download = "world-map-" + $("seed").getValue() + ".png";

      // Convert the canvas content to a data URL
      link.href = mapCanvas.toDataURL("image/png");

      // Append to the document, click it to start the download, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error saving map as PNG:", e);
      alert(
        "Could not save the map as PNG. Your browser may not support this feature."
      );
    }
  }

  // Initialize the UI when the DOM is loaded
  document.observe("dom:loaded", () => {
    // Populate dropdown menus
    Object.keys(uiConfig).forEach((configKey) => {
      Object.keys(uiConfig[configKey]).forEach((optionKey) => {
        let optionTitle = uiConfig[configKey][optionKey].title;
        var selectElement = $(configKey),
          insertMethod = selectElement.insert;
        optionKey = new Element("option", {
          value: optionKey,
        }).update(optionTitle);
        insertMethod.call(selectElement, optionKey);
      });
    });

    // Set default values
    Object.keys(default_query).forEach((configKey) => {
      $(configKey).setValue(default_query[configKey]);
    });

    // Initial map update
    updateMap();

    // Set up event handlers
    $("seed").observe("change", onSeedChange);
    $("new_seed").observe("click", generateNewSeed);

    Object.keys(uiConfig).forEach((configKey) => {
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
    intValue: function (element) {
      return parseInt($(element).getValue(), 10);
    },
    floatValue: function (element) {
      return parseFloat($(element).getValue());
    },
  });

  // Array buffers for projection calculations
  let sinFactors = [],
    ellipseWidths = [],
    rowPositions = [],
    columnPositions = [];

  /**
   * Format simulation time for display (similar to Islands repo)
   */
  function formatSimTime(years) {
    const absYears = Math.abs(years);
    if (absYears < 10000) {
      return `${Math.round(years).toLocaleString()} years`;
    }
    if (absYears < 1000000) {
      return `${(years / 1000).toFixed(1)} thousand years`;
    }
    return `${(years / 1000000).toFixed(2)} million years`;
  }
  
  /**
   * Update the simulation status readout
   */
  function updateSimulationStatus(currentTime, totalTime, phase, extraInfo) {
    const timeReadout = $('sim_time_readout');
    const progressReadout = $('sim_progress_readout');
    
    if (timeReadout) {
      if (phase === 'running') {
        timeReadout.innerHTML = `Simulation Time: ${formatSimTime(currentTime)}`;
      } else if (phase === 'complete') {
        timeReadout.innerHTML = `Simulation Complete: ${formatSimTime(totalTime)}`;
      } else if (phase === 'ready') {
        timeReadout.innerHTML = 'Simulation: Ready';
      } else if (phase === 'disabled') {
        timeReadout.innerHTML = 'Simulation: Disabled';
      }
    }
    
    if (progressReadout) {
      if (phase === 'running') {
        const pct = ((currentTime / totalTime) * 100).toFixed(1);
        progressReadout.innerHTML = `(${pct}% complete)`;
      } else if (phase === 'complete' && extraInfo) {
        progressReadout.innerHTML = extraInfo;
      } else {
        progressReadout.innerHTML = '';
      }
    }
  }

  /**
   * Get elevation value with rotation applied (for erosion maps)
   * @param {object} mapConfig - The map configuration
   * @param {Array} elevationMap - 2D array of elevation values
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {number} - Elevation value at the rotated position
   */
  function getRotatedElevation(mapConfig, elevationMap, row, col) {
    // Apply rotation
    col -= mapConfig.rpx || 0;

    // Clamp row values
    if (row < 0) row = 0;
    if (row >= mapConfig.rows) row = mapConfig.rows - 1;

    // Wrap column values
    while (col < 0) col += mapConfig.cols;
    if (col >= mapConfig.cols) col %= mapConfig.cols;

    return elevationMap[row] ? elevationMap[row][col] : 0;
  }

  /**
   * Render elevation map to canvas context using the selected projection
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {object} mapConfig - Map configuration (includes projection setting)
   * @param {object} imageConfig - Image configuration
   * @param {Array} elevationMap - 2D normalized elevation map (0-1 values)
   * @param {number} waterLevel - Normalized water level (0-1)
   */
  function renderProjectedTerrain(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const projection = mapConfig.projection || 'square';
    
    // Clear canvas first
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
    
    if (projection === 'mollweide') {
      renderMollweideTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'sinusoidal') {
      renderSinusoidalTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'mercator') {
      renderMercatorTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'transmerc') {
      renderTransverseMercatorTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'icosahedral') {
      renderIcosahedralTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else {
      // Default square projection
      renderSquareTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    }
  }
  
  /**
   * Render square projection terrain
   */
  function renderSquareTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const scaleX = imageConfig.width / mapConfig.cols;
    const scaleY = imageConfig.height / mapConfig.rows;
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const elev = getRotatedElevation(mapConfig, elevationMap, col, row);
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render Mollweide projection terrain
   */
  function renderMollweideTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const wd2 = imageConfig.wd2 || Math.floor(imageConfig.width / 2);
    
    // Precalculate ellipse values
    for (let row = 0; row < imageConfig.height; row++) {
      sinFactors[row] = Math.sqrt(Math.sin((row / imageConfig.height) * Math.PI));
      ellipseWidths[row] = Math.floor(wd2 * sinFactors[row]);
      
      const theta = Math.asin((2.8284271247 * (0.5 - row / imageConfig.height)) / Math.sqrt(2));
      rowPositions[row] = Math.floor(
        (0.5 - Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI) / Math.PI) * mapConfig.rows
      );
    }
    
    // Map pixels
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        if (row > wd2 - ellipseWidths[col] && row < wd2 + ellipseWidths[col]) {
          const mapCol = Math.floor((row - wd2) / sinFactors[col]) + (mapConfig.cd2 || Math.floor(mapConfig.cols / 2));
          const elev = getRotatedElevation(mapConfig, elevationMap, rowPositions[col], mapCol);
          const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
          
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(row, col, 1, 1);
        }
      }
    }
  }
  
  /**
   * Render Sinusoidal projection terrain
   */
  function renderSinusoidalTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const wd2 = imageConfig.wd2 || Math.floor(imageConfig.width / 2);
    
    // Precalculate sine values
    for (let row = 0; row < imageConfig.height; row++) {
      sinFactors[row] = Math.sin((row / imageConfig.height) * Math.PI);
      ellipseWidths[row] = Math.floor(wd2 * sinFactors[row]);
    }
    
    // Map pixels
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        if (row > wd2 - ellipseWidths[col] && row < wd2 + ellipseWidths[col]) {
          const mapCol = Math.floor((row - wd2) / sinFactors[col]) + (mapConfig.cd2 || Math.floor(mapConfig.cols / 2));
          const elev = getRotatedElevation(mapConfig, elevationMap, col, mapCol);
          const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
          
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(row, col, 1, 1);
        }
      }
    }
  }
  
  /**
   * Render Mercator projection terrain
   * Matches original renderMercatorProjection exactly
   */
  function renderMercatorTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    // Precalculate column positions (matches original)
    for (let row = 0; row < imageConfig.width; row++) {
      columnPositions[row] = Math.floor((row / imageConfig.width) * mapConfig.cols);
    }
    
    // Precalculate row positions with Mercator formula (matches original)
    for (let row = 0; row < imageConfig.height; row++) {
      rowPositions[row] = Math.floor(
        (0.5 - Math.atan(Math.sinh((0.5 - row / imageConfig.height) * Math.PI)) / Math.PI) * mapConfig.rows
      );
    }
    
    // Map pixels
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const elev = getRotatedElevation(mapConfig, elevationMap, rowPositions[col], columnPositions[row]);
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render Transverse Mercator projection terrain
   * Matches original renderTransverseMercatorProjection exactly
   */
  function renderTransverseMercatorTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const angle = (row / imageConfig.width) * 2 * Math.PI;
        const lat = 4 * (col / imageConfig.height - 0.5);
        let lon = Math.atan(Math.sinh(lat) / Math.cos(angle));
        const halfPi = Math.PI / 2;
        
        if (angle > halfPi && angle <= 3 * halfPi) {
          lon += Math.PI;
        }
        
        const mapRow = Math.floor(
          (0.5 - Math.asin(Math.sin(angle) / Math.cosh(lat)) / Math.PI) * mapConfig.rows
        );
        const mapCol = Math.floor((lon / (2 * Math.PI)) * mapConfig.cols);
        
        const elev = getRotatedElevation(mapConfig, elevationMap, mapRow, mapCol);
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render Icosahedral projection terrain
   * Matches the original renderIcosahedralProjection logic exactly
   */
  function renderIcosahedralTerrainToContext(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const col_w = imageConfig.col_w || Math.floor(imageConfig.width / 11);
    const row_h = imageConfig.row_h || Math.floor(imageConfig.height / 3);
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        let colIndex = Math.floor(row / col_w);
        let rowIndex = Math.floor(col / row_h);
        let colOffset = Math.floor(row - colIndex * col_w);
        let rowOffset = Math.floor(0.5773502692 * Math.floor(col - rowIndex * row_h));
        let pixelIndex = -1;

        if ((rowIndex + colIndex) % 2 == 0) {
          colOffset = Math.floor(col_w - colOffset);
        }

        // Complex icosahedral mapping logic (matches original)
        if (rowIndex == 0) {
          if (colIndex < 10 && colOffset < rowOffset) {
            pixelIndex = Math.floor((colOffset / rowOffset) * col_w);
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
          colOffset = Math.floor(col_w - colOffset);
          rowOffset = Math.floor(col_w - rowOffset);
          pixelIndex = Math.floor((colOffset / rowOffset) * col_w);
          pixelIndex = Math.floor(col_w - pixelIndex);
        }

        if (pixelIndex > -1) {
          if ((rowIndex + colIndex) % 2 == 0) {
            pixelIndex = Math.floor(col_w - pixelIndex);
          }
          pixelIndex += Math.floor(colIndex * col_w);
          
          // Get elevation using the same coordinate transform as original
          const elev = getRotatedElevation(mapConfig, elevationMap, col, pixelIndex);
          const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
          
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(row, col, 1, 1);
        }
        // If pixelIndex is -1, leave that pixel transparent/black (outside the projection)
      }
    }
  }

  /**
   * Generate and render erosion-based maps (river, coastline, terrain)
   * Uses the ErosionSimulation class from erosion-simulation.js
   * @param {object} mapConfig - The map configuration
   * @param {object} imageConfig - The image configuration
   * @param {Array} heightMap - The original height map data
   * @param {number} waterLevel - The water level
   * @param {number} timeYears - Time to simulate in years
   * @param {boolean} showRivers - Whether to show rivers
   * @param {boolean} showCoastlines - Whether to show coastlines
   */
  function generateAndRenderErosionMaps(
    mapConfig,
    imageConfig,
    heightMap,
    waterLevel,
    timeYears,
    showRivers,
    showCoastlines
  ) {
    console.log(`Running erosion simulation for ${timeYears / 1000000} million years...`);
    
    // Update status display
    updateSimulationStatus(0, timeYears, 'running');
    
    // Check if ErosionSimulation is available
    if (typeof window.ErosionSimulation === 'undefined') {
      console.error('ErosionSimulation not found. Make sure erosion-simulation.js is loaded.');
      return;
    }
    
    // Find min/max heights for normalization
    let minHeight = Infinity, maxHeight = -Infinity;
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        if (heightMap[row][col] < minHeight) minHeight = heightMap[row][col];
        if (heightMap[row][col] > maxHeight) maxHeight = heightMap[row][col];
      }
    }
    const heightRange = maxHeight - minHeight || 1;
    const normalizedWaterLevel = (waterLevel - minHeight) / heightRange;
    
    // Create erosion simulation
    const erosion = new window.ErosionSimulation(heightMap, {
      seaLevel: normalizedWaterLevel,
      rainfall: 0.3,
      pixelLength: 125,
      fluvialTransportCoefficient: 60,
      sedimentationDistance: 25000
    });
    
    // Run simulation with progress updates
    const stepSize = 50000; // 50,000 years per step
    const numSteps = Math.ceil(timeYears / stepSize);
    let simulatedTime = 0;
    
    for (let i = 0; i < numSteps; i++) {
      erosion.step(stepSize);
      simulatedTime += stepSize;
      
      // Update status display every 10 steps
      if (i % 10 === 0) {
        console.log(`Erosion step ${i + 1}/${numSteps} (${((i + 1) / numSteps * 100).toFixed(1)}%)`);
        updateSimulationStatus(simulatedTime, timeYears, 'running');
      }
    }
    
    console.log('Erosion simulation complete.');
    
    // Store erosion simulation globally for CellDataModel sync
    window.lastErosionSimulation = erosion;
    
    // Also make it available with the expected name for WebGL renderer
    window.erosionSimulation = erosion;
    
    // Mark cell data as updated for WebGL renderer
    if (window.worldCellData) {
      window.worldCellData._lastUpdate = Date.now();
    }
    
    // Get river segments
    const riverSegments = erosion.getRiverSegments(0.005);
    console.log(`Found ${riverSegments.length} river segments`);
    
    // Get coastline segments
    const coastlineSegments = erosion.getCoastlineSegments();
    console.log(`Found ${coastlineSegments.length} coastline segments`);
    
    // Get lake data
    const lakeThicknessMap = erosion.getLakeThicknessMap();
    const maxLakeThickness = erosion.getMaxLakeThickness();
    const lakeCells = erosion.getLakeCells();
    console.log(`Found ${lakeCells.length} lake cells (max thickness: ${maxLakeThickness.toFixed(3)})`);
    
    // Update status with feature counts
    const statusExtra = `(${riverSegments.length} river segments, ${coastlineSegments.length} coastline segments, ${lakeCells.length} lake cells)`;
    updateSimulationStatus(timeYears, timeYears, 'complete', statusExtra);
    
    // Render river map
    if (showRivers) {
      renderRiverMap(
        mapConfig,
        imageConfig,
        heightMap,
        waterLevel,
        riverSegments
      );
    } else {
      clearCanvas('river-map', imageConfig);
    }
    
    // Render coastline map
    if (showCoastlines) {
      renderCoastlineMap(
        mapConfig,
        imageConfig,
        heightMap,
        waterLevel,
        coastlineSegments
      );
    } else {
      clearCanvas('coastline-map', imageConfig);
    }
    
    // Render water cover map (always show if lakes exist)
    renderLakeMap(
      mapConfig,
      imageConfig,
      heightMap,
      waterLevel,
      lakeThicknessMap,
      maxLakeThickness,
      erosion.lakeThreshold || 0.01
    );
    
    // Render ice cap classification map (mass-balance driven)
    renderIceCapClassificationMap(
      mapConfig,
      imageConfig
    );
    
    // Render terrain map with erosion
    // Use the erosion simulation's normalized sea level for correct water/land coloring
    const erodedSeaLevel = erosion.getNormalizedSeaLevel();
    console.log(`Eroded sea level: ${erodedSeaLevel.toFixed(3)}`);
    
    renderTerrainMap(
      mapConfig,
      imageConfig,
      erosion.getNormalizedElevationMap(),
      erodedSeaLevel
    );
    
    // Render the final combined map (terrain + coastlines + rivers)
    renderFinalMap(
      mapConfig,
      imageConfig,
      erosion.getNormalizedElevationMap(),
      erodedSeaLevel,
      coastlineSegments,
      riverSegments,
      showCoastlines,
      showRivers
    );
  }
  
  /**
   * Render the river map
   * Shows only rivers on a neutral background (no terrain)
   */
  function renderRiverMap(mapConfig, imageConfig, heightMap, waterLevel, riverSegments) {
    console.log('Rendering river map...');
    
    const canvas = $('river-map');
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Fill with neutral background (light gray)
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
    
    // Draw rivers (blue on neutral background)
    if (typeof window.renderRivers === 'function' && riverSegments.length > 0) {
      window.renderRivers(
        ctx,
        riverSegments,
        imageConfig.width,
        imageConfig.height,
        mapConfig.cols,
        mapConfig.rows,
        {
          color: 'rgba(30, 100, 180, 1.0)',
          minWidth: 0.5,
          maxWidth: 3,
          useDischargeWidth: true,
          projection: mapConfig.projection,
          imageConfig: imageConfig,
          mapConfig: mapConfig
        }
      );
    }
  }
  
  /**
   * Render the coastline map
   * Shows only coastlines on a neutral background (no terrain)
   */
  function renderCoastlineMap(mapConfig, imageConfig, heightMap, waterLevel, coastlineSegments) {
    console.log('Rendering coastline map...');
    
    const canvas = $('coastline-map');
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Fill with neutral background (light gray)
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
    
    // Draw coastlines (dark blue for sea, lighter blue for lakes)
    if (typeof window.renderCoastlines === 'function' && coastlineSegments.length > 0) {
      window.renderCoastlines(
        ctx,
        coastlineSegments,
        imageConfig.width,
        imageConfig.height,
        mapConfig.cols,
        mapConfig.rows,
        {
          seaColor: 'rgba(20, 60, 120, 1.0)',
          lakeColor: 'rgba(50, 120, 180, 1.0)',
          lineWidth: 1.5,
          projection: mapConfig.projection,
          imageConfig: imageConfig,
          mapConfig: mapConfig
        }
      );
    }
  }
  
  /**
   * Render the water cover map
   * Shows only lakes on a neutral background (no terrain)
   * Based on lake_thickness from Islands drainage.js
   */
  function renderLakeMap(mapConfig, imageConfig, heightMap, waterLevel, lakeThicknessMap, maxLakeThickness, lakeThreshold) {
    console.log('Rendering water cover map...');
    
    const canvas = $('lake-map');
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Fill with neutral background (light gray)
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
    
    // Render lakes with depth-based coloring on neutral background
    if (typeof window.renderLakes === 'function' && maxLakeThickness > lakeThreshold) {
      window.renderLakes(
        ctx,
        lakeThicknessMap,
        maxLakeThickness,
        lakeThreshold,
        imageConfig.width,
        imageConfig.height,
        mapConfig.cols,
        mapConfig.rows,
        {
          shallowColor: { r: 100, g: 180, b: 255 },  // Light blue
          deepColor: { r: 30, g: 80, b: 150 },       // Dark blue
          projection: mapConfig.projection,
          imageConfig: imageConfig,
          mapConfig: mapConfig
        }
      );
    }
  }
  
  /**
   * Render the ice cap classification map
   * Shows ice caps, glaciers, and perennial snowfields using mass-balance driven classification
   */
  function renderIceCapClassificationMap(mapConfig, imageConfig) {
    console.log('Rendering ice cap classification map...');
    
    const canvas = $('icecap-map');
    if (!canvas) {
      console.warn('icecap-map canvas not found');
      return;
    }
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Check if cell data is available
    if (!window.worldCellData) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Cell data not available', 10, 20);
      return;
    }
    
    const cellData = window.worldCellData;
    const seaLevel = cellData.config.seaLevel;
    
    // Colors for different ice classifications
    const colors = {
      ocean: '#304060',           // Dark blue for ocean
      land: '#B8A090',            // Tan/brown for bare land
      snowfield: '#E0E0E8',       // Light gray for perennial snowfields
      glacier: '#88B8F0',         // Blue for glaciers
      iceCap: '#F0FFFF'           // Near-white for ice caps
    };
    
    // Create image data
    const imageData = ctx.createImageData(imageConfig.width, imageConfig.height);
    const data = imageData.data;
    
    // Render based on projection
    const scaleX = cellData.cols / imageConfig.width;
    const scaleY = cellData.rows / imageConfig.height;
    
    for (let y = 0; y < imageConfig.height; y++) {
      for (let x = 0; x < imageConfig.width; x++) {
        // Map pixel to cell
        const col = Math.floor(x * scaleX);
        const row = Math.floor(y * scaleY);
        const cell = row * cellData.cols + col;
        
        let color;
        const elevation = cellData.cellElevation[cell];
        
        if (elevation < seaLevel) {
          // Ocean
          color = colors.ocean;
        } else if (cellData.isIceCap[cell] === 1) {
          // Ice cap
          color = colors.iceCap;
        } else if (cellData.isGlacier[cell] === 1) {
          // Glacier
          color = colors.glacier;
        } else if (cellData.hasPerennialSnow[cell] === 1) {
          // Perennial snowfield
          color = colors.snowfield;
        } else {
          // Bare land
          color = colors.land;
        }
        
        // Parse color and set pixel
        const idx = (y * imageConfig.width + x) * 4;
        const rgb = hexToRgb(color);
        data[idx] = rgb.r;
        data[idx + 1] = rgb.g;
        data[idx + 2] = rgb.b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log('Ice cap classification map complete');
  }
  
  /**
   * Helper to convert hex color to RGB
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  
  /**
   * Get color from mapConfig palette (same colors as World Map)
   * Uses the same indexed palette that World Map uses
   * @param {number} elevation - Normalized elevation (0-1)
   * @param {number} waterLevel - Normalized water level (0-1)
   * @param {object} palette - The palette object from mapConfig.palette
   * @returns {object} - RGB color {r, g, b}
   */
  function getPaletteColor(elevation, waterLevel, palette) {
    if (!palette || !palette.cmap) {
      // Fallback to Islands palette if no palette available
      return getIslandsPaletteColor(elevation, waterLevel);
    }
    
    let colorIndex;
    
    if (elevation < waterLevel) {
      // Water - map to sea colors
      const seaDepth = (waterLevel - elevation) / waterLevel;
      colorIndex = palette.sea_idx + Math.floor(seaDepth * (palette.n_sea - 1));
      colorIndex = Math.max(palette.sea_idx, Math.min(colorIndex, palette.land_idx - 1));
    } else {
      // Land - map to land colors
      const landHeight = (elevation - waterLevel) / (1 - waterLevel);
      colorIndex = palette.land_idx + Math.floor(landHeight * (palette.n_land - 1));
      colorIndex = Math.max(palette.land_idx, Math.min(colorIndex, palette.ice_idx - 1));
    }
    
    const hexColor = palette.cmap[colorIndex];
    if (!hexColor) {
      return { r: 128, g: 128, b: 128 }; // Gray fallback
    }
    
    // Parse hex color string to RGB
    const hex = hexColor.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }

  /**
   * Get color from Islands-style elevation palette
   * Based on TedTschopp/Islands webgl.js color scheme
   * @param {number} elevation - Normalized elevation (0-1)
   * @param {number} waterLevel - Normalized water level (0-1)
   * @returns {object} - RGB color {r, g, b}
   */
  function getIslandsPaletteColor(elevation, waterLevel) {
    let r, g, b;
    
    if (elevation < waterLevel) {
      // Water - Islands palette: sea_colour to deep_sea_colour
      // sea_colour = rgb(120, 165, 255), deep_sea_colour = rgb(94, 130, 226)
      const depth = (waterLevel - elevation) / waterLevel;
      const depthStep = Math.floor(depth * 1.5); // Step-based like Islands
      const t = Math.min(depthStep / 1.5, 1);
      r = Math.floor(120 - t * 26);  // 120 -> 94
      g = Math.floor(165 - t * 35);  // 165 -> 130
      b = Math.floor(255 - t * 29);  // 255 -> 226
    } else {
      // Land - convert normalized elevation to meters-like scale
      // Islands uses absolute meters with thresholds at 0, 50, 500, 1200, 1700, 2800, 4000m
      // Map our 0-1 land elevation to 0-4000m equivalent
      const landElev = (elevation - waterLevel) / (1 - waterLevel);
      const elevMeters = landElev * 4000;
      
      // Islands palette colors (from webgl.js)
      // colour_0m = rgb(0, 97, 71) - dark green
      // colour_50m = rgb(16, 122, 47) - green  
      // colour_500m = rgb(232, 215, 125) - tan/sandy
      // colour_1200m = rgb(161, 67, 0) - orange-brown
      // colour_1700m = rgb(158, 0, 0) - red-brown
      // colour_2800m = rgb(160, 160, 160) - gray rock
      // colour_4000m = rgb(240, 240, 240) - white snow
      
      if (elevMeters < 50) {
        const t = elevMeters / 50;
        r = Math.floor(0 + t * 16);     // 0 -> 16
        g = Math.floor(97 + t * 25);    // 97 -> 122
        b = Math.floor(71 - t * 24);    // 71 -> 47
      } else if (elevMeters < 500) {
        const t = (elevMeters - 50) / 450;
        r = Math.floor(16 + t * 216);   // 16 -> 232
        g = Math.floor(122 + t * 93);   // 122 -> 215
        b = Math.floor(47 + t * 78);    // 47 -> 125
      } else if (elevMeters < 1200) {
        const t = (elevMeters - 500) / 700;
        r = Math.floor(232 - t * 71);   // 232 -> 161
        g = Math.floor(215 - t * 148);  // 215 -> 67
        b = Math.floor(125 - t * 125);  // 125 -> 0
      } else if (elevMeters < 1700) {
        const t = (elevMeters - 1200) / 500;
        r = Math.floor(161 - t * 3);    // 161 -> 158
        g = Math.floor(67 - t * 67);    // 67 -> 0
        b = Math.floor(0);              // 0 -> 0
      } else if (elevMeters < 2800) {
        const t = (elevMeters - 1700) / 1100;
        r = Math.floor(158 + t * 2);    // 158 -> 160
        g = Math.floor(0 + t * 160);    // 0 -> 160
        b = Math.floor(0 + t * 160);    // 0 -> 160
      } else {
        const t = Math.min((elevMeters - 2800) / 1200, 1);
        r = Math.floor(160 + t * 80);   // 160 -> 240
        g = Math.floor(160 + t * 80);   // 160 -> 240
        b = Math.floor(160 + t * 80);   // 160 -> 240
      }
    }
    
    return { r, g, b };
  }
  
  /**
   * Render the terrain map with erosion effects
   * Shows only land areas (no water coverage)
   */
  function renderTerrainMap(mapConfig, imageConfig, elevationMap, waterLevel) {
    console.log('Rendering terrain map with erosion (land only)...');
    
    const canvas = $('terrain-map');
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Fill with neutral background (light gray) for water areas
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, imageConfig.width, imageConfig.height);
    
    // Render only land terrain with projection (skip water)
    renderProjectedTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
  }
  
  /**
   * Render projected terrain showing only land (water areas are transparent/skipped)
   */
  function renderProjectedTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const projection = mapConfig.projection || 'square';
    
    if (projection === 'mollweide') {
      renderMollweideTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'sinusoidal') {
      renderSinusoidalTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'mercator') {
      renderMercatorTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'transmerc') {
      renderTransMercTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else if (projection === 'icosahedral') {
      renderIcosahedralTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    } else {
      // Default square projection
      renderSquareTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    }
  }
  
  /**
   * Render square projection terrain (land only)
   */
  function renderSquareTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const elev = getRotatedElevation(mapConfig, elevationMap, col, row);
        
        // Skip water areas
        if (elev < waterLevel) continue;
        
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render Mollweide projection terrain (land only)
   */
  function renderMollweideTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const wd2 = imageConfig.wd2 || Math.floor(imageConfig.width / 2);
    
    for (let row = 0; row < imageConfig.height; row++) {
      sinFactors[row] = Math.sqrt(Math.sin((row / imageConfig.height) * Math.PI));
      ellipseWidths[row] = Math.floor(wd2 * sinFactors[row]);
      
      const theta = Math.asin((2.8284271247 * (0.5 - row / imageConfig.height)) / Math.sqrt(2));
      rowPositions[row] = Math.floor(
        (0.5 - Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI) / Math.PI) * mapConfig.rows
      );
    }
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        if (row > wd2 - ellipseWidths[col] && row < wd2 + ellipseWidths[col]) {
          const mapCol = Math.floor((row - wd2) / sinFactors[col]) + (mapConfig.cd2 || Math.floor(mapConfig.cols / 2));
          const elev = getRotatedElevation(mapConfig, elevationMap, rowPositions[col], mapCol);
          
          // Skip water areas
          if (elev < waterLevel) continue;
          
          const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(row, col, 1, 1);
        }
      }
    }
  }
  
  /**
   * Render Sinusoidal projection terrain (land only)
   */
  function renderSinusoidalTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const wd2 = imageConfig.wd2 || Math.floor(imageConfig.width / 2);
    
    for (let row = 0; row < imageConfig.height; row++) {
      sinFactors[row] = Math.sin((row / imageConfig.height) * Math.PI);
      ellipseWidths[row] = Math.floor(wd2 * sinFactors[row]);
    }
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        if (row > wd2 - ellipseWidths[col] && row < wd2 + ellipseWidths[col]) {
          const mapCol = Math.floor((row - wd2) / sinFactors[col]) + (mapConfig.cd2 || Math.floor(mapConfig.cols / 2));
          const elev = getRotatedElevation(mapConfig, elevationMap, col, mapCol);
          
          // Skip water areas
          if (elev < waterLevel) continue;
          
          const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(row, col, 1, 1);
        }
      }
    }
  }
  
  /**
   * Render Mercator projection terrain (land only)
   */
  function renderMercatorTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    for (let row = 0; row < imageConfig.height; row++) {
      rowPositions[row] = Math.floor(
        (0.5 - Math.atan(Math.sinh((0.5 - row / imageConfig.height) * Math.PI)) / Math.PI) * mapConfig.rows
      );
    }
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const mapCol = Math.floor((row / imageConfig.width) * mapConfig.cols);
        const elev = getRotatedElevation(mapConfig, elevationMap, rowPositions[col], mapCol);
        
        // Skip water areas
        if (elev < waterLevel) continue;
        
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render Transverse Mercator projection terrain (land only)
   */
  function renderTransMercTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const hd2 = imageConfig.hd2 || Math.floor(imageConfig.height / 2);
    const wd2 = imageConfig.wd2 || Math.floor(imageConfig.width / 2);
    const scale = 0.5;
    
    for (let screenY = 0; screenY < imageConfig.height; screenY++) {
      for (let screenX = 0; screenX < imageConfig.width; screenX++) {
        const x = (screenX - wd2) / (wd2 * scale);
        const y = (screenY - hd2) / (hd2 * scale);
        
        if (x * x + y * y > 4) continue;
        
        const lon = Math.atan2(Math.sinh(x), Math.cos(y));
        const lat = Math.asin(Math.sin(y) / Math.cosh(x));
        
        const mapCol = Math.floor(((lon / Math.PI + 1) / 2) * mapConfig.cols) % mapConfig.cols;
        const mapRow = Math.floor((0.5 - lat / Math.PI) * mapConfig.rows);
        
        if (mapRow < 0 || mapRow >= mapConfig.rows) continue;
        
        const elev = getRotatedElevation(mapConfig, elevationMap, mapRow, mapCol);
        
        // Skip water areas
        if (elev < waterLevel) continue;
        
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(screenX, screenY, 1, 1);
      }
    }
  }
  
  /**
   * Render Icosahedral projection terrain (land only)
   */
  function renderIcosahedralTerrainLandOnly(ctx, mapConfig, imageConfig, elevationMap, waterLevel) {
    const scaleX = imageConfig.width / mapConfig.cols;
    const scaleY = imageConfig.height / mapConfig.rows;
    
    for (let row = 0; row < imageConfig.width; row++) {
      for (let col = 0; col < imageConfig.height; col++) {
        const elev = getRotatedElevation(mapConfig, elevationMap, col, row);
        
        // Skip water areas
        if (elev < waterLevel) continue;
        
        const color = getPaletteColor(elev, waterLevel, mapConfig.palette);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(row, col, 1, 1);
      }
    }
  }
  
  /**
   * Render the final combined map with terrain, coastlines, and rivers
   * This combines all erosion visualization layers into a single view
   */
  function renderFinalMap(mapConfig, imageConfig, elevationMap, waterLevel, coastlineSegments, riverSegments, showCoastlines, showRivers) {
    console.log('Rendering final combined map...');
    
    const canvas = $('final-map');
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    
    // Layer 1: Render terrain base with projection
    renderProjectedTerrain(ctx, mapConfig, imageConfig, elevationMap, waterLevel);
    
    // Layer 2: Overlay coastlines (Islands uses black with opacity)
    if (showCoastlines && typeof window.renderCoastlines === 'function' && coastlineSegments.length > 0) {
      window.renderCoastlines(
        ctx,
        coastlineSegments,
        imageConfig.width,
        imageConfig.height,
        mapConfig.cols,
        mapConfig.rows,
        {
          seaColor: 'rgba(0, 0, 0, 0.5)',
          lakeColor: 'rgba(0, 0, 0, 0.4)',
          lineWidth: 1,
          projection: mapConfig.projection,
          imageConfig: imageConfig,
          mapConfig: mapConfig
        }
      );
    }
    
    // Layer 3: Overlay rivers (Islands uses black with opacity based on discharge)
    if (showRivers && typeof window.renderRivers === 'function' && riverSegments.length > 0) {
      window.renderRivers(
        ctx,
        riverSegments,
        imageConfig.width,
        imageConfig.height,
        mapConfig.cols,
        mapConfig.rows,
        {
          color: 'rgba(0, 0, 0, 0.7)',
          minWidth: 0.5,
          maxWidth: 3,
          useDischargeWidth: true,
          projection: mapConfig.projection,
          imageConfig: imageConfig,
          mapConfig: mapConfig
        }
      );
    }
    
    console.log('Final combined map rendered.');
  }
  
  /**
   * Render base terrain to a canvas context
   */
  function renderBaseTerrainToContext(ctx, mapConfig, imageConfig, heightMap, waterLevel) {
    // Find min/max heights for normalization
    let minHeight = Infinity, maxHeight = -Infinity;
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        if (heightMap[row][col] < minHeight) minHeight = heightMap[row][col];
        if (heightMap[row][col] > maxHeight) maxHeight = heightMap[row][col];
      }
    }
    const heightRange = maxHeight - minHeight || 1;
    const normalizedWaterLevel = (waterLevel - minHeight) / heightRange;
    
    const scaleX = imageConfig.width / mapConfig.cols;
    const scaleY = imageConfig.height / mapConfig.rows;
    
    // Render base terrain using same palette as World Map
    for (let row = 0; row < mapConfig.rows; row++) {
      for (let col = 0; col < mapConfig.cols; col++) {
        const h = heightMap[row][col];
        const normalizedH = (h - minHeight) / heightRange;
        
        const color = getPaletteColor(normalizedH, normalizedWaterLevel, mapConfig.palette);
        
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(
          Math.floor(col * scaleX),
          Math.floor(row * scaleY),
          Math.ceil(scaleX),
          Math.ceil(scaleY)
        );
      }
    }
  }
  
  /**
   * Clear a canvas element
   */
  function clearCanvas(canvasId, imageConfig) {
    const canvas = $(canvasId);
    if (!canvas) return;
    
    canvas.width = imageConfig.width;
    canvas.height = imageConfig.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#999';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Enable time simulation to view', canvas.width / 2, canvas.height / 2);
  }
  
  /**
   * Clear all erosion-related canvases
   */
  function clearErosionCanvases(imageConfig) {
    clearCanvas('river-map', imageConfig);
    clearCanvas('coastline-map', imageConfig);
    clearCanvas('terrain-map', imageConfig);
    clearCanvas('final-map', imageConfig);
  }

  // Expose the updateMap function for the export
  exports.updateMap = updateMap;
});

// Move applyPalette to the true top-level scope so it is available everywhere
function applyPalette(paletteConfig) {
  var palette = {
    n_sea: 50,
    n_land: 100,
    cmap: [],
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
    var colorIndex = ((i - palette.sea_idx) / palette.n_sea) * seaColorCount;
    let colorFloor = Math.floor(colorIndex);
    palette.cmap[i] = interpolateColor(
      seaColors[colorFloor],
      seaColors[colorFloor + 1],
      colorIndex - colorFloor
    );
  }

  // Interpolate land colors
  var landColors = paletteConfig.land;
  var landColorCount = landColors.length - 1;

  for (
    seaColorCount = palette.land_idx;
    seaColorCount < palette.ice_idx;
    seaColorCount++
  ) {
    i =
      ((seaColorCount - palette.land_idx) / palette.n_land) * landColorCount;
    colorIndex = Math.floor(i);
    palette.cmap[seaColorCount] = interpolateColor(
      landColors[colorIndex],
      landColors[colorIndex + 1],
      i - colorIndex
    );
  }

  // Interpolate ice colors
  var iceColors = palette;
  var iceColorCount = iceColors.ice_idx + iceColors.n_ice;
  var whiteColor = [255, 255, 255];
  var grayColor = [175, 175, 175];

  for (i = iceColors.ice_idx; i < iceColorCount; i++) {
    iceColors.cmap[i] = interpolateColor(
      whiteColor,
      grayColor,
      (i - iceColors.ice_idx) / (iceColors.n_ice - 1)
    );
  }

  return palette;
}

function interpolateColor(color1, color2, factor) {
  return rgb2hex(
    Math.floor(color1[0] + (color2[0] - color1[0]) * factor),
    Math.floor(color1[1] + (color2[1] - color1[1]) * factor),
    Math.floor(color1[2] + (color2[2] - color1[2]) * factor)
  );
}

function rgb2hex(r, g, b) {
  function hex(x) {
    const h = x.toString(16);
    return h.length === 1 ? '0' + h : h;
  }
  return '#' + hex(r) + hex(g) + hex(b);
}

function calculateRainShadow(a, b, e, shadeAngle) {
  // Default shadow values to zero if undefined
  const aShadow = typeof a.shadow === 'number' ? a.shadow : 0;
  const bShadow = typeof b.shadow === 'number' ? b.shadow : 0;
  if (e.h <= 0.0) return 0.0;

  const x1 = 0.5 * (a.x + b.x);
  const y1 = 0.5 * (a.y + b.y);
  const z1 = 0.5 * (a.z + b.z);

  const l1 = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1) || 1.0;
  const tmp = Math.sqrt(1.0 - e.y * e.y) || 0.0001;

  const x2 = e.x * x1 + e.y * y1 + e.z * z1;
  const z2 = (-e.z / tmp) * x1 + (e.x / tmp) * z1;

  if (Math.abs(a.h - b.h) > 0.04) {
    return (
      (aShadow + bShadow - (Math.cos((Math.PI * shadeAngle) / 180.0) * z2) / l1) / 3.0
    );
  } else {
    return (aShadow + bShadow) / 2.0;
  }
}

function calculateRainfallWithShadow(temp, latitude, rainShadow) {
  const y2 = Math.abs(latitude) - 0.5;
  let rain = temp * 0.65 + 0.1 - 0.011 / (y2 * y2 + 0.1);
  rain += 0.03 * rainShadow;
  return Math.max(0.0, rain); // Ensure rainfall is not negative
}

