/**
 * Ecosystem Templates for Holdridge Life Zone Simulation
 * 
 * This module defines target vegetation states for each Holdridge life zone.
 * Each template contains:
 * - target_canopy: target tree canopy cover (0-1)
 * - target_veg_cover: target total vegetation cover (0-1)
 * - target_ground_cover: target ground layer cover (0-1)
 * - ground_cover_mode: dominant ground cover type (litter/moss/grass/crust/sparse)
 * - NPPmax: maximum net primary productivity (g C/m²/yr)
 * - decomp_rate: organic matter decomposition rate (fraction/yr)
 * - base_fire_risk: baseline annual fire probability (0-1)
 * - root_strength: erosion resistance from root systems (0-1)
 * - fauna_weights: suitability multipliers for each fauna guild
 */

'use strict';

(function(global) {

// Ground cover mode enumeration
const GROUND_COVER_MODE = {
    LITTER: 0,   // Forest floor litter
    MOSS: 1,     // Moss/lichen dominated
    GRASS: 2,    // Grass/herb dominated
    CRUST: 3,    // Biological soil crust (desert)
    SPARSE: 4    // Sparse/bare ground
};

// Soil type classification enumeration
const SOIL_TYPE = {
    RAW: 0,          // Young/undeveloped soil
    OXISOL: 1,       // Highly weathered tropical
    ULTISOL: 2,      // Leached acidic forest
    ALFISOL: 3,      // Moderately leached
    MOLLISOL: 4,     // Grassland dark soils
    SPODOSOL: 5,     // Acidic conifer forest
    ARIDISOL: 6,     // Desert soils
    GELISOL: 7,      // Permafrost soils
    INCEPTISOL: 8,   // Young developing soils
    HISTOSOL: 9      // Organic/peat soils
};

// Fauna guild enumeration
const FAUNA_GUILD = {
    GRAZERS: 0,
    BROWSERS: 1,
    PREDATORS: 2,
    INSECTS: 3,
    AMPHIBIANS: 4,
    REPTILES: 5,
    BIRDS: 6
};

/**
 * Ecosystem template definitions keyed by Holdridge zone name
 */
const ECOSYSTEM_TEMPLATES = {
    // ========================================================================
    // TROPICAL ZONES (bioT > 24°C)
    // ========================================================================
    'Tropical Rain Forest': {
        target_canopy: 0.95,
        target_veg_cover: 0.98,
        target_ground_cover: 0.15,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 2200,
        decomp_rate: 0.65,
        base_fire_risk: 0.01,
        root_strength: 0.95,
        typical_soil: SOIL_TYPE.OXISOL,
        fauna_weights: { grazers: 0.2, browsers: 0.7, predators: 0.6, insects: 1.0, amphibians: 0.9, reptiles: 0.7, birds: 0.95 }
    },
    'Tropical Wet Forest': {
        target_canopy: 0.90,
        target_veg_cover: 0.95,
        target_ground_cover: 0.20,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1800,
        decomp_rate: 0.55,
        base_fire_risk: 0.03,
        root_strength: 0.90,
        typical_soil: SOIL_TYPE.OXISOL,
        fauna_weights: { grazers: 0.3, browsers: 0.7, predators: 0.6, insects: 0.95, amphibians: 0.85, reptiles: 0.7, birds: 0.9 }
    },
    'Tropical Moist Forest': {
        target_canopy: 0.80,
        target_veg_cover: 0.90,
        target_ground_cover: 0.30,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1400,
        decomp_rate: 0.45,
        base_fire_risk: 0.08,
        root_strength: 0.85,
        typical_soil: SOIL_TYPE.ULTISOL,
        fauna_weights: { grazers: 0.4, browsers: 0.65, predators: 0.55, insects: 0.9, amphibians: 0.7, reptiles: 0.75, birds: 0.85 }
    },
    'Tropical Dry Forest': {
        target_canopy: 0.50,
        target_veg_cover: 0.70,
        target_ground_cover: 0.45,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 900,
        decomp_rate: 0.30,
        base_fire_risk: 0.25,
        root_strength: 0.70,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.7, browsers: 0.5, predators: 0.5, insects: 0.7, amphibians: 0.3, reptiles: 0.85, birds: 0.75 }
    },
    'Tropical Thorn Woodland': {
        target_canopy: 0.25,
        target_veg_cover: 0.45,
        target_ground_cover: 0.35,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 500,
        decomp_rate: 0.20,
        base_fire_risk: 0.15,
        root_strength: 0.50,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.5, browsers: 0.4, predators: 0.4, insects: 0.5, amphibians: 0.1, reptiles: 0.9, birds: 0.6 }
    },
    'Tropical Desert': {
        target_canopy: 0.02,
        target_veg_cover: 0.10,
        target_ground_cover: 0.08,
        ground_cover_mode: GROUND_COVER_MODE.CRUST,
        NPPmax: 90,
        decomp_rate: 0.10,
        base_fire_risk: 0.02,
        root_strength: 0.15,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.1, browsers: 0.05, predators: 0.2, insects: 0.3, amphibians: 0.02, reptiles: 0.95, birds: 0.3 }
    },

    // ========================================================================
    // SUBTROPICAL ZONES (bioT 18-24°C)
    // ========================================================================
    'Subtropical Rain Forest': {
        target_canopy: 0.90,
        target_veg_cover: 0.95,
        target_ground_cover: 0.20,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1800,
        decomp_rate: 0.50,
        base_fire_risk: 0.02,
        root_strength: 0.90,
        typical_soil: SOIL_TYPE.ULTISOL,
        fauna_weights: { grazers: 0.25, browsers: 0.7, predators: 0.55, insects: 0.9, amphibians: 0.8, reptiles: 0.65, birds: 0.9 }
    },
    'Subtropical Wet Forest': {
        target_canopy: 0.85,
        target_veg_cover: 0.90,
        target_ground_cover: 0.25,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1500,
        decomp_rate: 0.45,
        base_fire_risk: 0.05,
        root_strength: 0.85,
        typical_soil: SOIL_TYPE.ULTISOL,
        fauna_weights: { grazers: 0.35, browsers: 0.65, predators: 0.5, insects: 0.85, amphibians: 0.7, reptiles: 0.6, birds: 0.85 }
    },
    'Subtropical Moist Forest': {
        target_canopy: 0.75,
        target_veg_cover: 0.85,
        target_ground_cover: 0.35,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1200,
        decomp_rate: 0.35,
        base_fire_risk: 0.10,
        root_strength: 0.80,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.45, browsers: 0.6, predators: 0.5, insects: 0.8, amphibians: 0.6, reptiles: 0.65, birds: 0.8 }
    },
    'Subtropical Dry Forest': {
        target_canopy: 0.45,
        target_veg_cover: 0.65,
        target_ground_cover: 0.45,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 750,
        decomp_rate: 0.25,
        base_fire_risk: 0.20,
        root_strength: 0.65,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.65, browsers: 0.5, predators: 0.45, insects: 0.65, amphibians: 0.25, reptiles: 0.8, birds: 0.7 }
    },
    'Subtropical Thorn Woodland': {
        target_canopy: 0.20,
        target_veg_cover: 0.40,
        target_ground_cover: 0.35,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 400,
        decomp_rate: 0.18,
        base_fire_risk: 0.12,
        root_strength: 0.45,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.45, browsers: 0.35, predators: 0.35, insects: 0.45, amphibians: 0.08, reptiles: 0.85, birds: 0.55 }
    },
    'Subtropical Desert': {
        target_canopy: 0.02,
        target_veg_cover: 0.08,
        target_ground_cover: 0.06,
        ground_cover_mode: GROUND_COVER_MODE.CRUST,
        NPPmax: 70,
        decomp_rate: 0.08,
        base_fire_risk: 0.01,
        root_strength: 0.12,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.08, browsers: 0.04, predators: 0.15, insects: 0.25, amphibians: 0.01, reptiles: 0.9, birds: 0.25 }
    },

    // ========================================================================
    // WARM TEMPERATE ZONES (bioT 12-18°C)
    // ========================================================================
    'Warm Temperate Rain Forest': {
        target_canopy: 0.85,
        target_veg_cover: 0.92,
        target_ground_cover: 0.30,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 1400,
        decomp_rate: 0.35,
        base_fire_risk: 0.03,
        root_strength: 0.85,
        typical_soil: SOIL_TYPE.ULTISOL,
        fauna_weights: { grazers: 0.2, browsers: 0.6, predators: 0.5, insects: 0.8, amphibians: 0.85, reptiles: 0.5, birds: 0.85 }
    },
    'Warm Temperate Wet Forest': {
        target_canopy: 0.80,
        target_veg_cover: 0.88,
        target_ground_cover: 0.35,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1200,
        decomp_rate: 0.30,
        base_fire_risk: 0.06,
        root_strength: 0.80,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.3, browsers: 0.6, predators: 0.5, insects: 0.75, amphibians: 0.7, reptiles: 0.55, birds: 0.8 }
    },
    'Warm Temperate Moist Forest': {
        target_canopy: 0.70,
        target_veg_cover: 0.82,
        target_ground_cover: 0.40,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 1000,
        decomp_rate: 0.25,
        base_fire_risk: 0.10,
        root_strength: 0.75,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.4, browsers: 0.55, predators: 0.45, insects: 0.7, amphibians: 0.55, reptiles: 0.6, birds: 0.75 }
    },
    'Warm Temperate Dry Forest': {
        target_canopy: 0.40,
        target_veg_cover: 0.60,
        target_ground_cover: 0.50,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 650,
        decomp_rate: 0.20,
        base_fire_risk: 0.18,
        root_strength: 0.60,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.6, browsers: 0.45, predators: 0.4, insects: 0.6, amphibians: 0.2, reptiles: 0.7, birds: 0.65 }
    },
    'Warm Temperate Steppe': {
        target_canopy: 0.10,
        target_veg_cover: 0.55,
        target_ground_cover: 0.70,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 450,
        decomp_rate: 0.15,
        base_fire_risk: 0.25,
        root_strength: 0.65,
        typical_soil: SOIL_TYPE.MOLLISOL,
        fauna_weights: { grazers: 0.85, browsers: 0.3, predators: 0.5, insects: 0.7, amphibians: 0.15, reptiles: 0.6, birds: 0.7 }
    },
    'Warm Temperate Desert': {
        target_canopy: 0.03,
        target_veg_cover: 0.12,
        target_ground_cover: 0.10,
        ground_cover_mode: GROUND_COVER_MODE.CRUST,
        NPPmax: 100,
        decomp_rate: 0.10,
        base_fire_risk: 0.02,
        root_strength: 0.18,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.12, browsers: 0.06, predators: 0.2, insects: 0.35, amphibians: 0.03, reptiles: 0.85, birds: 0.35 }
    },

    // ========================================================================
    // COOL TEMPERATE ZONES (bioT 6-12°C)
    // ========================================================================
    'Cool Temperate Rain Forest': {
        target_canopy: 0.80,
        target_veg_cover: 0.90,
        target_ground_cover: 0.45,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 1100,
        decomp_rate: 0.20,
        base_fire_risk: 0.02,
        root_strength: 0.85,
        typical_soil: SOIL_TYPE.SPODOSOL,
        fauna_weights: { grazers: 0.2, browsers: 0.55, predators: 0.45, insects: 0.65, amphibians: 0.8, reptiles: 0.3, birds: 0.8 }
    },
    'Cool Temperate Wet Forest': {
        target_canopy: 0.75,
        target_veg_cover: 0.85,
        target_ground_cover: 0.40,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 900,
        decomp_rate: 0.18,
        base_fire_risk: 0.04,
        root_strength: 0.80,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.3, browsers: 0.55, predators: 0.45, insects: 0.6, amphibians: 0.65, reptiles: 0.35, birds: 0.75 }
    },
    'Cool Temperate Moist Forest': {
        target_canopy: 0.65,
        target_veg_cover: 0.78,
        target_ground_cover: 0.45,
        ground_cover_mode: GROUND_COVER_MODE.LITTER,
        NPPmax: 750,
        decomp_rate: 0.15,
        base_fire_risk: 0.08,
        root_strength: 0.75,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.4, browsers: 0.5, predators: 0.4, insects: 0.55, amphibians: 0.5, reptiles: 0.4, birds: 0.7 }
    },
    'Cool Temperate Dry Forest': {
        target_canopy: 0.35,
        target_veg_cover: 0.55,
        target_ground_cover: 0.50,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 500,
        decomp_rate: 0.12,
        base_fire_risk: 0.15,
        root_strength: 0.60,
        typical_soil: SOIL_TYPE.ALFISOL,
        fauna_weights: { grazers: 0.6, browsers: 0.4, predators: 0.35, insects: 0.5, amphibians: 0.2, reptiles: 0.5, birds: 0.6 }
    },
    'Cool Temperate Steppe': {
        target_canopy: 0.05,
        target_veg_cover: 0.50,
        target_ground_cover: 0.75,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 350,
        decomp_rate: 0.10,
        base_fire_risk: 0.22,
        root_strength: 0.70,
        typical_soil: SOIL_TYPE.MOLLISOL,
        fauna_weights: { grazers: 0.9, browsers: 0.2, predators: 0.45, insects: 0.6, amphibians: 0.1, reptiles: 0.45, birds: 0.65 }
    },
    'Cool Temperate Desert': {
        target_canopy: 0.02,
        target_veg_cover: 0.15,
        target_ground_cover: 0.12,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 120,
        decomp_rate: 0.08,
        base_fire_risk: 0.03,
        root_strength: 0.20,
        typical_soil: SOIL_TYPE.ARIDISOL,
        fauna_weights: { grazers: 0.15, browsers: 0.08, predators: 0.2, insects: 0.4, amphibians: 0.05, reptiles: 0.7, birds: 0.4 }
    },

    // ========================================================================
    // BOREAL ZONES (bioT 3-6°C)
    // ========================================================================
    'Boreal Rain Forest': {
        target_canopy: 0.70,
        target_veg_cover: 0.85,
        target_ground_cover: 0.60,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 700,
        decomp_rate: 0.08,
        base_fire_risk: 0.03,
        root_strength: 0.75,
        typical_soil: SOIL_TYPE.SPODOSOL,
        fauna_weights: { grazers: 0.2, browsers: 0.5, predators: 0.4, insects: 0.5, amphibians: 0.6, reptiles: 0.15, birds: 0.7 }
    },
    'Boreal Wet Forest': {
        target_canopy: 0.65,
        target_veg_cover: 0.80,
        target_ground_cover: 0.55,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 600,
        decomp_rate: 0.07,
        base_fire_risk: 0.06,
        root_strength: 0.70,
        typical_soil: SOIL_TYPE.SPODOSOL,
        fauna_weights: { grazers: 0.25, browsers: 0.5, predators: 0.4, insects: 0.45, amphibians: 0.5, reptiles: 0.12, birds: 0.65 }
    },
    'Boreal Moist Forest': {
        target_canopy: 0.55,
        target_veg_cover: 0.72,
        target_ground_cover: 0.50,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 500,
        decomp_rate: 0.06,
        base_fire_risk: 0.12,
        root_strength: 0.65,
        typical_soil: SOIL_TYPE.SPODOSOL,
        fauna_weights: { grazers: 0.3, browsers: 0.45, predators: 0.35, insects: 0.4, amphibians: 0.35, reptiles: 0.1, birds: 0.6 }
    },
    'Boreal Dry Forest': {
        target_canopy: 0.40,
        target_veg_cover: 0.58,
        target_ground_cover: 0.50,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 350,
        decomp_rate: 0.05,
        base_fire_risk: 0.20,
        root_strength: 0.55,
        typical_soil: SOIL_TYPE.SPODOSOL,
        fauna_weights: { grazers: 0.4, browsers: 0.4, predators: 0.3, insects: 0.35, amphibians: 0.2, reptiles: 0.08, birds: 0.55 }
    },
    'Boreal Steppe': {
        target_canopy: 0.03,
        target_veg_cover: 0.40,
        target_ground_cover: 0.65,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 250,
        decomp_rate: 0.05,
        base_fire_risk: 0.18,
        root_strength: 0.55,
        typical_soil: SOIL_TYPE.MOLLISOL,
        fauna_weights: { grazers: 0.7, browsers: 0.2, predators: 0.35, insects: 0.45, amphibians: 0.08, reptiles: 0.05, birds: 0.55 }
    },
    'Boreal Desert': {
        target_canopy: 0.01,
        target_veg_cover: 0.18,
        target_ground_cover: 0.15,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 80,
        decomp_rate: 0.04,
        base_fire_risk: 0.02,
        root_strength: 0.20,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.1, browsers: 0.05, predators: 0.15, insects: 0.25, amphibians: 0.02, reptiles: 0.03, birds: 0.35 }
    },

    // ========================================================================
    // SUBPOLAR ZONES (bioT 1.5-3°C)
    // ========================================================================
    'Subpolar Wet Tundra': {
        target_canopy: 0.02,
        target_veg_cover: 0.60,
        target_ground_cover: 0.75,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 200,
        decomp_rate: 0.02,
        base_fire_risk: 0.01,
        root_strength: 0.45,
        typical_soil: SOIL_TYPE.HISTOSOL,
        fauna_weights: { grazers: 0.4, browsers: 0.2, predators: 0.3, insects: 0.5, amphibians: 0.3, reptiles: 0.02, birds: 0.6 }
    },
    'Subpolar Moist Tundra': {
        target_canopy: 0.01,
        target_veg_cover: 0.50,
        target_ground_cover: 0.70,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 150,
        decomp_rate: 0.02,
        base_fire_risk: 0.02,
        root_strength: 0.40,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.35, browsers: 0.15, predators: 0.25, insects: 0.4, amphibians: 0.15, reptiles: 0.01, birds: 0.55 }
    },
    'Subpolar Tundra': {
        target_canopy: 0.00,
        target_veg_cover: 0.40,
        target_ground_cover: 0.60,
        ground_cover_mode: GROUND_COVER_MODE.MOSS,
        NPPmax: 100,
        decomp_rate: 0.015,
        base_fire_risk: 0.015,
        root_strength: 0.35,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.3, browsers: 0.1, predators: 0.2, insects: 0.3, amphibians: 0.05, reptiles: 0.01, birds: 0.5 }
    },
    'Subpolar Dry Tundra': {
        target_canopy: 0.00,
        target_veg_cover: 0.28,
        target_ground_cover: 0.45,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 60,
        decomp_rate: 0.012,
        base_fire_risk: 0.01,
        root_strength: 0.25,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.2, browsers: 0.05, predators: 0.15, insects: 0.2, amphibians: 0.02, reptiles: 0.01, birds: 0.4 }
    },
    'Subpolar Steppe': {
        target_canopy: 0.00,
        target_veg_cover: 0.25,
        target_ground_cover: 0.40,
        ground_cover_mode: GROUND_COVER_MODE.GRASS,
        NPPmax: 80,
        decomp_rate: 0.015,
        base_fire_risk: 0.08,
        root_strength: 0.35,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.4, browsers: 0.1, predators: 0.2, insects: 0.25, amphibians: 0.02, reptiles: 0.01, birds: 0.45 }
    },
    'Subpolar Desert': {
        target_canopy: 0.00,
        target_veg_cover: 0.10,
        target_ground_cover: 0.12,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 30,
        decomp_rate: 0.01,
        base_fire_risk: 0.005,
        root_strength: 0.15,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.05, browsers: 0.02, predators: 0.1, insects: 0.1, amphibians: 0.01, reptiles: 0.01, birds: 0.25 }
    },

    // ========================================================================
    // POLAR ZONES (bioT < 1.5°C)
    // ========================================================================
    'Polar Desert': {
        target_canopy: 0.00,
        target_veg_cover: 0.05,
        target_ground_cover: 0.05,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 10,
        decomp_rate: 0.005,
        base_fire_risk: 0.001,
        root_strength: 0.05,
        typical_soil: SOIL_TYPE.GELISOL,
        fauna_weights: { grazers: 0.02, browsers: 0.01, predators: 0.05, insects: 0.05, amphibians: 0.0, reptiles: 0.0, birds: 0.15 }
    },

    // ========================================================================
    // SPECIAL ZONES
    // ========================================================================
    'Ocean': {
        target_canopy: 0.00,
        target_veg_cover: 0.00,
        target_ground_cover: 0.00,
        ground_cover_mode: GROUND_COVER_MODE.SPARSE,
        NPPmax: 0,
        decomp_rate: 0.0,
        base_fire_risk: 0.0,
        root_strength: 0.0,
        typical_soil: SOIL_TYPE.RAW,
        fauna_weights: { grazers: 0.0, browsers: 0.0, predators: 0.0, insects: 0.0, amphibians: 0.0, reptiles: 0.0, birds: 0.3 }
    }
};

/**
 * Default template for unknown zones
 */
const DEFAULT_TEMPLATE = {
    target_canopy: 0.30,
    target_veg_cover: 0.50,
    target_ground_cover: 0.40,
    ground_cover_mode: GROUND_COVER_MODE.GRASS,
    NPPmax: 400,
    decomp_rate: 0.15,
    base_fire_risk: 0.10,
    root_strength: 0.50,
    typical_soil: SOIL_TYPE.INCEPTISOL,
    fauna_weights: { grazers: 0.4, browsers: 0.3, predators: 0.3, insects: 0.5, amphibians: 0.3, reptiles: 0.3, birds: 0.5 }
};

/**
 * Get ecosystem template for a Holdridge zone name
 * @param {string} zoneName - The Holdridge life zone name
 * @returns {object} The ecosystem template
 */
function getEcosystemTemplate(zoneName) {
    return ECOSYSTEM_TEMPLATES[zoneName] || DEFAULT_TEMPLATE;
}

/**
 * Get template ID from zone name
 * @param {string} zoneName - The Holdridge life zone name
 * @returns {number} Template ID (index in template array)
 */
function getTemplateId(zoneName) {
    const zoneNames = Object.keys(ECOSYSTEM_TEMPLATES);
    const idx = zoneNames.indexOf(zoneName);
    return idx >= 0 ? idx : 255; // 255 = default/unknown
}

/**
 * Get zone name from template ID
 * @param {number} templateId - The template ID
 * @returns {string} Zone name
 */
function getZoneNameFromId(templateId) {
    const zoneNames = Object.keys(ECOSYSTEM_TEMPLATES);
    return templateId < zoneNames.length ? zoneNames[templateId] : 'Unknown';
}

// Export to global scope
global.ECOSYSTEM_TEMPLATES = ECOSYSTEM_TEMPLATES;
global.DEFAULT_TEMPLATE = DEFAULT_TEMPLATE;
global.GROUND_COVER_MODE = GROUND_COVER_MODE;
global.SOIL_TYPE = SOIL_TYPE;
global.FAUNA_GUILD = FAUNA_GUILD;
global.getEcosystemTemplate = getEcosystemTemplate;
global.getTemplateId = getTemplateId;
global.getZoneNameFromId = getZoneNameFromId;

})(typeof window !== 'undefined' ? window : global);
