const biomes = [
  "IIITTTTTGGGGGGGGGGDDDDDDDDDDDDDDDDDDDDDDDDDDD",
  "IIITTTTTGGGGGGGGGGGGDDSDDSDDDDDDDDDDDDDDDDDDD",
  "IITTTTTTTTTGGGGGGGGGGGGSSSSSSDDDDDDDDDDDDDDDD",
  "IITTTTTTTTBBBBBGGGGGGGGSSSSSSSSSWWWWWWWDDDDDD",
  "IITTTTTTTTBBBBBGGGGGGGGSSSSSSSSSSWWWWWWWWWWDD",
  "IIITTTTTTTBBBBBBFFGGGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIITTTTTTBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIIITTTTTBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIIITTTTTBBBBBBFFFFFFGGSSSSSSSSSSSWWWWWWWWWW",
  "IIIIIITTTTBBBBBBBFFFFFFGGGSSSSSSSSSWWWWWWWWWW",
  "IIIIIIITTTBBBBBBBFFFFFFFFGGGSSSSSSWWWWWWWWWWW",
  "IIIIIIIITTBBBBBBBFFFFFFFFFFGGSSSSSWWWWWWWWWWW",
  "IIIIIIIIITBBBBBBBRFFFFFFFFFFFSSSSSWWWWWWWWWWW",
  "IIIIIIIIIITBBBBBBRRFFFFFFFFFFFFSSEEEWWWWWWWWW",
  "IIIIIIIIIITBBBBBBRRFFFFFFFFFFFFFFEEEEEEWWWWWW",
  "IIIIIIIIIIIBBBBBBRRRFFFFFFFFFFFFFEEEEEEEEEWWW",
  "IIIIIIIIIIIBBBBBBRRRRFFFFFFFFFFFFEEEEEEEEEEWW",
  "IIIIIIIIIIIIBBBBBRRRRFFFFFFFFFFFFEEEEEEEEEEEE",
  "IIIIIIIIIIIIIBBBBRRRRRFFFFFFFFFFFEEEEEEEEEEEE",
  "IIIIIIIIIIIIIIIBBRRRRRRFFFFFFFFFFEEEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIRRRRRRRFFFFFFFFFEEEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIRRRRRRRRRFFFFFEEEEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRFREEEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRREEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRROEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRROOOOOEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRROOOOOOEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRROOOOOOOEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRROOOOOOOEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRROOOOOOOOEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRROOOOOOOOOE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO",
];
function getHoldridgeBiome(altitude, humidity, latitude) {
  const holdridgeTable = {
    Polar: {
      Alpine: "Polar Desert",
      Subalpine: "Polar Desert",
      Montane: "Polar Desert",
      "Lower Montane": "Polar Desert",
      Premontane: "Polar Desert",
      Lowland: "Polar Desert",
    },
    Subpolar: {
      Alpine: "Ice/Tundra",
      Subalpine: "Tundra",
      Montane: humidity.includes("humid")
        ? "Boreal Moist Forest"
        : "Boreal Dry Scrub",
      "Lower Montane": humidity.includes("humid")
        ? "Boreal Moist Forest"
        : "Boreal Dry Scrub",
      Premontane: humidity.includes("humid")
        ? "Boreal Moist Forest"
        : "Boreal Dry Scrub",
      Lowland: humidity.includes("humid")
        ? "Boreal Wet Forest"
        : "Boreal Dry Forest",
    },
    Boreal: {
      Alpine: "Tundra",
      Subalpine: humidity.includes("humid")
        ? "Boreal Wet Forest"
        : "Boreal Dry Forest",
      Montane: humidity.includes("humid")
        ? "Cool Temperate Moist Forest"
        : "Cool Temperate Dry Forest",
      "Lower Montane": humidity.includes("humid")
        ? "Cool Temperate Wet Forest"
        : "Cool Temperate Dry Forest",
      Premontane: humidity.includes("humid")
        ? "Cool Temperate Wet Forest"
        : "Cool Temperate Steppe",
      Lowland: humidity.includes("humid")
        ? "Cool Temperate Wet Forest"
        : "Cool Temperate Desert",
    },
    "Cool Temperate": {
      Alpine: "Montane Grassland",
      Subalpine: humidity.includes("humid")
        ? "Cool Temperate Wet Forest"
        : "Cool Temperate Steppe",
      Montane: humidity.includes("humid")
        ? "Cool Temperate Moist Forest"
        : "Cool Temperate Desert",
      "Lower Montane": humidity.includes("humid")
        ? "Warm Temperate Moist Forest"
        : "Warm Temperate Desert Scrub",
      Premontane: humidity.includes("humid")
        ? "Warm Temperate Wet Forest"
        : "Warm Temperate Desert",
      Lowland: humidity.includes("humid")
        ? "Warm Temperate Wet Forest"
        : "Warm Temperate Desert",
    },
    "Warm Temperate": {
      Alpine: "Montane Grassland",
      Subalpine: humidity.includes("humid")
        ? "Warm Temperate Wet Forest"
        : "Warm Temperate Scrub",
      Montane: humidity.includes("humid")
        ? "Warm Temperate Moist Forest"
        : "Warm Temperate Dry Forest",
      "Lower Montane": humidity.includes("humid")
        ? "Subtropical Moist Forest"
        : "Subtropical Dry Forest",
      Premontane: humidity.includes("humid")
        ? "Subtropical Wet Forest"
        : "Subtropical Desert Scrub",
      Lowland: humidity.includes("humid")
        ? "Subtropical Wet Forest"
        : "Subtropical Desert",
    },
    Subtropical: {
      Alpine: "Montane Grassland",
      Subalpine: humidity.includes("humid")
        ? "Subtropical Wet Forest"
        : "Subtropical Dry Forest",
      Montane: humidity.includes("humid")
        ? "Subtropical Moist Forest"
        : "Subtropical Thorn Woodland",
      "Lower Montane": humidity.includes("humid")
        ? "Tropical Moist Forest"
        : "Tropical Thorn Woodland",
      Premontane: humidity.includes("humid")
        ? "Tropical Wet Forest"
        : "Tropical Very Dry Forest",
      Lowland: humidity.includes("humid")
        ? "Tropical Wet Forest"
        : "Tropical Desert",
    },
    Tropical: {
      Alpine: "Tropical Alpine Paramo",
      Subalpine: humidity.includes("humid")
        ? "Tropical Wet Forest"
        : "Tropical Dry Forest",
      Montane: humidity.includes("humid")
        ? "Tropical Moist Forest"
        : "Tropical Dry Forest",
      "Lower Montane": humidity.includes("humid")
        ? "Tropical Moist Forest"
        : "Tropical Dry Forest",
      Premontane: humidity.includes("humid")
        ? "Tropical Wet Forest"
        : "Tropical Thorn Woodland",
      Lowland: humidity.includes("humid")
        ? "Tropical Rainforest"
        : "Tropical Desert",
    },
  };

  // Normalize inputs
  altitude = altitude.trim();
  humidity = humidity.trim().toLowerCase();
  latitude = latitude.trim();

  if (!holdridgeTable[latitude]) {
    return "Unknown Latitudinal Region";
  }

  if (!holdridgeTable[latitude][altitude]) {
    return "Unknown Altitudinal Belt";
  }

  return holdridgeTable[latitude][altitude];
}

console.log(getHoldridgeBiome("Montane", "Humid", "Subtropical"));
// Output: "Subtropical Moist Forest"

console.log(getHoldridgeBiome("Lowland", "Arid", "Tropical"));
// Output: "Tropical Desert"

console.log(getHoldridgeBiome("Subalpine", "Superhumid", "Cool Temperate"));
// Output: "Cool Temperate Wet Forest"

function getAltitudeBeltFromPercent(elevationPercent) {
  const elevationMeters = percentageToElevation(elevationPercent);

  if (elevationMeters >= 3500) return "Alpine";
  if (elevationMeters >= 2500) return "Subalpine";
  if (elevationMeters >= 1800) return "Montane";
  if (elevationMeters >= 1200) return "Lower Montane";
  if (elevationMeters >= 800) return "Premontane";
  if (elevationMeters >= 300) return "Alvar";
  return "Lowland";
}



function getLatitudinalRegion(latitudeDegrees) {
  const lat = Math.abs(latitudeDegrees);
  if (lat >= 75) return "Polar";
  if (lat >= 60) return "Subpolar";
  if (lat >= 50) return "Boreal";
  if (lat >= 40) return "Cool Temperate";
  if (lat >= 30) return "Warm Temperate";
  if (lat >= 15) return "Subtropical";
  return "Tropical";
}

// Assumed maximum altitude = 5000m
function percentageToElevation(percent) {
  // Assumes max elevation is 5000 meters
  const maxElevation = 5000; // meters
  return (percent / 100) * maxElevation;
}


function percentageToLatitude(percent) {
  const maxLatitude = 90; // degrees
  return (percent / 100) * maxLatitude;
}



function calculatePET(T, Rn, G = 0, alpha = 1.26, gamma = 0.0665) {
  // T: average daily temperature (°C)
  // Rn: net radiation (MJ/m²/day) - Net radiation is the balance between incoming radiation from the sun and sky, and outgoing radiation emitted by Earth's surface.
  // G: soil heat flux (MJ/m²/day), ≈ 0 daily (this goes up if you are dealing with a planet that radiates heat)
  // alpha: Priestley-Taylor coefficient (≈1.26)
  // gamma: psychrometric constant (≈0.0665 kPa/°C)

  // Calculate saturation vapor pressure (es)
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3));

  // Calculate slope of vapor pressure curve (Delta)
  const Delta = (4098 * es) / Math.pow(T + 237.3, 2);

  // Latent heat of vaporization (λ), ≈2.45 MJ/kg
  const lambda = 2.45;

  // Priestley–Taylor equation for PET (mm/day)
  const PET = alpha * (Delta / (Delta + gamma)) * ((Rn - G) / lambda);

  return PET;
}

//Variables Needed for biome generation
// Potential Evapotranspiration (PET) is a measure of the amount of water that would evaporate and transpire under ideal conditions. It is influenced by temperature, radiation, and other factors.
// Annual precipitation in mm
// average daily temperature in °C
// latitude in degrees
// Altitude in meters