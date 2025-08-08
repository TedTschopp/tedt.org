// planet.js
// Planet generating program converted from C to JavaScript

// Enum for file types
const FileType = {
  BMP: 'bmp',
  PPM: 'ppm',
  XPM: 'xpm',
  HEIGHTFIELD: 'heightfield',
};

// Function to get file extension based on file type
function getFileExtension(fileType) {
  switch (fileType) {
    case FileType.BMP:
      return '.bmp';
    case FileType.PPM:
      return '.ppm';
    case FileType.XPM:
      return '.xpm';
    case FileType.HEIGHTFIELD:
      return '.heightfield';
    default:
      return '';
  }
}

// Function to calculate log base 2
function log2(x) {
  return Math.log(x) / Math.log(2);
}

// Biome types and their descriptions
const biomeDescriptions = {
  T: "Tundra",
  G: "Grasslands",
  B: "Taiga / Boreal Forest",
  D: "Desert",
  S: "Savanna",
  F: "Temperate Forest",
  R: "Temperate Rainforest",
  W: "Xeric Shrubland and Dry Forest",
  E: "Tropical Dry Forest",
  O: "Tropical Rainforest",
  I: "Icecap",
};

// Function to calculate distance squared between two vertices
function dist2(vertexA, vertexB) {
  const dx = vertexA.x - vertexB.x;
  const dy = vertexA.y - vertexB.y;
  const dz = vertexA.z - vertexB.z;
  return dx * dx + dy * dy + dz * dz;
}

// Function to generate a random number based on two seeds
function rand2(p, q) {
  const r = (p + Math.PI) * (q + Math.PI);
  return 2 * (r - Math.floor(r)) - 1;
}

// Function to calculate the minimum of two numbers
function min(x, y) {
  return x < y ? x : y;
}

// Function to calculate the maximum of two numbers
function max(x, y) {
  return x > y ? x : y;
}

// Function to calculate the minimum of two floating-point numbers
function fmin(x, y) {
  return x < y ? x : y;
}

// Function to calculate the maximum of two floating-point numbers
function fmax(x, y) {
  return x > y ? x : y;
}

// Vertex class to represent a point in 3D space
class Vertex {
  constructor(x, y, z, h = 0, s = 0, shadow = 0) {
    this.x = x; // X-coordinate
    this.y = y; // Y-coordinate
    this.z = z; // Z-coordinate
    this.h = h; // Altitude
    this.s = s; // Seed
    this.shadow = shadow; // Rain shadow
  }
}

// Function to initialize vertices of a tetrahedron
function initializeTetrahedron() {
  return [
    new Vertex(-Math.sqrt(3) - 0.20, -Math.sqrt(3) - 0.22, -Math.sqrt(3) - 0.23),
    new Vertex(-Math.sqrt(3) - 0.19, Math.sqrt(3) + 0.18, Math.sqrt(3) + 0.17),
    new Vertex(Math.sqrt(3) + 0.21, -Math.sqrt(3) - 0.24, Math.sqrt(3) + 0.15),
    new Vertex(Math.sqrt(3) + 0.24, Math.sqrt(3) + 0.22, -Math.sqrt(3) - 0.25),
  ];
}

// Character table for XPM output
const letters = [
  '@', '$', '.', ',', ':', ';', '-', '+', '=', '#', '*', '&', 'A', 'B', 'C', 'D',
  'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

// Biome types
const biomes = [
  "IIITTTTTGGGGGGGGDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
  "IIITTTTTGGGGGGGGDDDDGGDSDDSDDDDDDDDDDDDDDDDDD",
  "IITTTTTTTTTBGGGGGGGGGGGSSSSSSDDDDDDDDDDDDDDDD",
  "IITTTTTTTTBBBBBBGGGGGGGSSSSSSSSSWWWWWWWDDDDDD",
  "IITTTTTTTTBBBBBBGGGGGGGSSSSSSSSSSWWWWWWWWWWDD",
  "IIITTTTTTTBBBBBBFGGGGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIITTTTTTBBBBBBFFGGGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIIITTTTTBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWWW",
  "IIIIITTTTTBBBBBBBFFFFGGGSSSSSSSSSSSWWWWWWWWWW",
  "IIIIIITTTTBBBBBBBFFFFFFGGGSSSSSSWWWWWWWWWWW",
  "IIIIIIITTTBBBBBBBFFFFFFFFGGGSSSSSSWWWWWWWWWWW",
  "IIIIIIIITTBBBBBBBFFFFFFFFFFGGSSSSSWWWWWWWWWWW",
  "IIIIIIIIITBBBBBBBFFFFFFFFFFFFFSSSSWWWWWWWWWWW",
  "IIIIIIIIIITBBBBBBFFFFFFFFFFFFFFFSSEEEWWWWWWWW",
  "IIIIIIIIIITBBBBBBFFFFFFFFFFFFFFFFFFEEEEEEWWWW",
  "IIIIIIIIIIIBBBBBBFFFFFFFFFFFFFFFFFFEEEEEEEEWW",
  "IIIIIIIIIIIBBBBBBRFFFFFFFFFFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIBBBBBBRFFFFFFFFFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIBBBBBRRRFFFFFFFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIIIBBBRRRRRFFFFFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIBRRRRRRRFFFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIRRRRRRRRRRFFFFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIRRRRRRRRRRRRFFFFFEEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRFRREEEEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRREEEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRROOEEEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRRRRROOOOOEEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRROOOOOOEEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRRROOOOOOOEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRRROOOOOOOEE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRRRROOOOOOOOE",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRRRRROOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIRROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIROOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO",
  "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIOOOOOOO",
];

// Global variables
let BLACK = 0;
let WHITE = 1;
let BACK = 2;
let GRID = 3;
let OUTLINE1 = 4;
let OUTLINE2 = 5;
let LOWEST = 6;
let SEA = 7;
let LAND = 8;
let HIGHEST = 9;

let nonLinear = false;
let view;

let nocols = 65536;
let rtable = new Array(65536).fill(0);
let gtable = new Array(65536).fill(0);
let btable = new Array(65536).fill(0);

// Default map size
let Width = 800;
let Height = 600;

// Initialize tetrahedron vertices
let tetra = initializeTetrahedron();

// Function to calculate distance squared between vertices
function dist2(vertexA, vertexB) {
  const dx = vertexA.x - vertexB.x;
  const dy = vertexA.y - vertexB.y;
  const dz = vertexA.z - vertexB.z;
  return dx * dx + dy * dy + dz * dz;
}

// Function to perform Mercator projection
function mercatorProjection() {
  const PI = Math.PI;
  const DEG2RAD = PI / 180;

  let longi = 0.0; // Longitude
  let lat = 0.0; // Latitude
  let scale = 1.0; // Scale factor

  const sla = Math.sin(lat * DEG2RAD);
  const cla = Math.cos(lat * DEG2RAD);
  const slo = Math.sin(longi * DEG2RAD);
  const clo = Math.cos(longi * DEG2RAD);

  const yOffset = Math.log((1 + sla) / (1 - sla)) / 2;
  const k = Math.round(0.5 * yOffset * Width * scale / PI);

  for (let j = 0; j < Height; j++) {
    const y = PI * (2.0 * (j - k) - Height) / Width / scale;
    const expY = Math.exp(2 * y);
    const normalizedY = (expY - 1) / (expY + 1);
    const scale1 = scale * Width / Height / Math.sqrt(1.0 - normalizedY * normalizedY) / PI;

    for (let i = 0; i < Width; i++) {
      const theta1 = longi - 0.5 * PI + PI * (2.0 * i - Width) / Width / scale;
      const x = Math.cos(theta1) * Math.sqrt(1.0 - normalizedY * normalizedY);
      const z = -Math.sin(theta1) * Math.sqrt(1.0 - normalizedY * normalizedY);

      // Call a placeholder function to process the projection
      processProjection(x, normalizedY, z, i, j);
    }
  }
}

// Function to perform Orthographic projection
function orthographicProjection() {
  const PI = Math.PI;
  const scale = 1.0; // Scale factor

  for (let j = 0; j < Height; j++) {
    for (let i = 0; i < Width; i++) {
      const x = (2.0 * i - Width) / Height / scale;
      const y = (2.0 * j - Height) / Height / scale;

      if (x * x + y * y > 1.0) {
        // Outside the globe, skip processing
        continue;
      }

      const z = Math.sqrt(1.0 - x * x - y * y);

      // Call a placeholder function to process the projection
      processProjection(x, y, z, i, j);
    }
  }
}

// Function to perform Stereographic projection
function stereographicProjection() {
  const PI = Math.PI;
  const scale = 1.0; // Scale factor

  for (let j = 0; j < Height; j++) {
    for (let i = 0; i < Width; i++) {
      const x = (2.0 * i - Width) / Height / scale;
      const y = (2.0 * j - Height) / Height / scale;
      const zSquared = x * x + y * y;

      if (zSquared > 4.0) {
        // Outside the globe, skip processing
        continue;
      }

      const z = (4.0 - zSquared) / (4.0 + zSquared);
      const scaleFactor = 2.0 / (4.0 + zSquared);
      const xProjected = x * scaleFactor;
      const yProjected = y * scaleFactor;

      // Call a placeholder function to process the projection
      processProjection(xProjected, yProjected, z, i, j);
    }
  }
}

// Function to perform Gnomonic projection
function gnomonicProjection() {
  const PI = Math.PI;
  const scale = 1.0; // Scale factor

  for (let j = 0; j < Height; j++) {
    for (let i = 0; i < Width; i++) {
      const x = (2.0 * i - Width) / Height / scale;
      const y = (2.0 * j - Height) / Height / scale;
      const zz = 1.0 / Math.sqrt(1.0 + x * x + y * y);

      const xProjected = x * zz;
      const yProjected = y * zz;
      const zProjected = Math.sqrt(1.0 - xProjected * xProjected - yProjected * yProjected);

      // Call a placeholder function to process the projection
      processProjection(xProjected, yProjected, zProjected, i, j);
    }
  }
}

// Function to perform Azimuthal projection
function azimuthalProjection() {
  const PI = Math.PI;
  const scale = 1.0; // Scale factor

  for (let j = 0; j < Height; j++) {
    for (let i = 0; i < Width; i++) {
      const x = (2.0 * i - Width) / Height / scale;
      const y = (2.0 * j - Height) / Height / scale;
      const zz = x * x + y * y;
      const z = 1.0 - 0.5 * zz;

      if (z < -1.0) {
        // Outside the globe, skip processing
        continue;
      }

      // Call a placeholder function to process the projection
      processProjection(x, y, z, i, j);
    }
  }
}

// Placeholder function to process the projection
function processProjection(x, y, z, i, j) {
  // This function will handle the logic for processing the projection
  // For now, it simply logs the coordinates
  console.log(`Processing projection at (${i}, ${j}): x=${x}, y=${y}, z=${z}`);
}

// Function to save the map as a BMP file
function saveAsBMP(filename, data, width, height) {
  const fs = require('fs');

  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = fileHeaderSize + infoHeaderSize + pixelArraySize;

  const buffer = Buffer.alloc(fileSize);

  // BMP file header
  buffer.write('BM', 0); // Signature
  buffer.writeUInt32LE(fileSize, 2); // File size
  buffer.writeUInt32LE(0, 6); // Reserved
  buffer.writeUInt32LE(fileHeaderSize + infoHeaderSize, 10); // Pixel data offset

  // DIB header (BITMAPINFOHEADER)
  buffer.writeUInt32LE(infoHeaderSize, 14); // Header size
  buffer.writeInt32LE(width, 18); // Image width
  buffer.writeInt32LE(-height, 22); // Image height (negative for top-down bitmap)
  buffer.writeUInt16LE(1, 26); // Planes
  buffer.writeUInt16LE(24, 28); // Bits per pixel
  buffer.writeUInt32LE(0, 30); // Compression (none)
  buffer.writeUInt32LE(pixelArraySize, 34); // Image size
  buffer.writeInt32LE(2835, 38); // Horizontal resolution (pixels per meter)
  buffer.writeInt32LE(2835, 42); // Vertical resolution (pixels per meter)
  buffer.writeUInt32LE(0, 46); // Colors in color table
  buffer.writeUInt32LE(0, 50); // Important color count

  // Pixel data
  let offset = fileHeaderSize + infoHeaderSize;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = data[y][x];
      buffer.writeUInt8(color.b, offset++); // Blue
      buffer.writeUInt8(color.g, offset++); // Green
      buffer.writeUInt8(color.r, offset++); // Red
    }
    // Padding for 4-byte alignment
    while (offset % 4 !== 0) {
      buffer.writeUInt8(0, offset++);
    }
  }

  // Write to file
  fs.writeFileSync(filename, buffer);
  console.log(`Saved BMP file: ${filename}`);
}

// Function to save the map as a PPM file
function saveAsPPM(filename, data, width, height) {
  const fs = require('fs');

  let ppmData = `P6\n${width} ${height}\n255\n`;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = data[y][x];
      ppmData += String.fromCharCode(color.r, color.g, color.b);
    }
  }

  fs.writeFileSync(filename, ppmData, 'binary');
  console.log(`Saved PPM file: ${filename}`);
}

// Function to save the map as an XPM file
function saveAsXPM(filename, data, width, height) {
  const fs = require('fs');

  const nocols = 64; // Number of colors (limited by `letters` array)
  const charsPerPixel = 1; // Characters per pixel

  let xpmData = `/* XPM */\nstatic char *xpmdata[] = {\n`;
  xpmData += `"${width} ${height} ${nocols} ${charsPerPixel}",\n`;

  // Define colors
  for (let i = 0; i < nocols; i++) {
    const color = letters[i];
    xpmData += `"${color} c #${(i * 4).toString(16).padStart(2, '0')}0000",\n`;
  }

  // Add pixel data
  for (let y = 0; y < height; y++) {
    xpmData += `"`;
    for (let x = 0; x < width; x++) {
      const colorIndex = Math.floor((data[y][x].r / 255) * (nocols - 1));
      xpmData += letters[colorIndex];
    }
    xpmData += `",\n`;
  }

  xpmData += `};\n`;

  fs.writeFileSync(filename, xpmData);
  console.log(`Saved XPM file: ${filename}`);
}

// Function to generate heightfield data
function generateHeightfield(width, height) {
  const heights = Array.from({ length: width }, () => Array(height).fill(0));

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Example height calculation (simple gradient)
      heights[x][y] = Math.floor((x / width) * 255);
    }
  }

  return heights;
}

// Function to save heightfield data to a file
function saveHeightfield(filename, heights, width, height) {
  const fs = require('fs');
  let heightfieldData = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      heightfieldData += `${heights[x][y]} `;
    }
    heightfieldData += '\n';
  }

  fs.writeFileSync(filename, heightfieldData);
  console.log(`Saved heightfield file: ${filename}`);
}

// Function to generate biome colors
function generateBiomes(temperature, rainfall) {
  const biomeMap = [];

  for (let t = 0; t < 45; t++) {
    biomeMap[t] = [];
    for (let r = 0; r < 45; r++) {
      const biomeChar = biomes[t][r];
      biomeMap[t][r] = {
        char: biomeChar,
        color: getBiomeColor(biomeChar),
      };
    }
  }

  return biomeMap;
}

// Function to get biome color based on character
function getBiomeColor(biomeChar) {
  switch (biomeChar) {
    case 'I': return { r: 255, g: 255, b: 255 }; // Icecap
    case 'T': return { r: 210, g: 210, b: 210 }; // Tundra
    case 'G': return { r: 250, g: 215, b: 165 }; // Grasslands
    case 'B': return { r: 105, g: 155, b: 120 }; // Taiga
    case 'D': return { r: 220, g: 195, b: 175 }; // Desert
    case 'S': return { r: 225, g: 155, b: 100 }; // Savanna
    case 'F': return { r: 155, g: 215, b: 170 }; // Temperate Forest
    case 'R': return { r: 170, g: 195, b: 200 }; // Temperate Rainforest
    case 'W': return { r: 185, g: 150, b: 160 }; // Xeric Shrubland
    case 'E': return { r: 130, g: 190, b: 25 };  // Tropical Dry Forest
    case 'O': return { r: 110, g: 160, b: 170 }; // Tropical Rainforest
    default: return { r: 0, g: 0, b: 0 };        // Default to black
  }
}

// Function to parse command-line arguments
function parseArguments(args) {
  const options = {
    width: 800,
    height: 600,
    scale: 1.0,
    fileType: FileType.BMP,
    outputFilename: 'planet-map',
    temperature: false,
    rainfall: false,
    makeBiomes: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-w':
        options.width = parseInt(args[++i], 10);
        break;
      case '-h':
        options.height = parseInt(args[++i], 10);
        break;
      case '-m':
        options.scale = parseFloat(args[++i]);
        break;
      case '-P':
        options.fileType = FileType.PPM;
        break;
      case '-H':
        options.fileType = FileType.HEIGHTFIELD;
        break;
      case '-z':
        options.makeBiomes = true;
        break;
      case '-t':
        options.temperature = true;
        break;
      case '-r':
        options.rainfall = true;
        break;
      case '-o':
        options.outputFilename = args[++i];
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        break;
    }
  }

  return options;
}

// Function to integrate biome generation, shading, and file output
function generatePlanetMap(options) {
  console.log("Generating planet map with options:", options);

  // Generate heightfield data
  const heightfieldData = generateHeightfield(options.width, options.height);

  // Generate biome map if required
  let biomeMap = null;
  if (options.makeBiomes) {
    biomeMap = generateBiomes(options.temperature, options.rainfall);
  }

  // Create color data for the map
  const colorData = Array.from({ length: options.height }, () =>
    Array.from({ length: options.width }, () => ({ r: 0, g: 0, b: 0 }))
  );

  for (let y = 0; y < options.height; y++) {
    for (let x = 0; x < options.width; x++) {
      const height = heightfieldData[x][y];
      let color;

      if (biomeMap) {
        const biomeChar = biomes[Math.min(44, Math.max(0, Math.floor(height / 255 * 44)))][
          Math.min(44, Math.max(0, Math.floor(height / 255 * 44)))
        ];
        color = getBiomeColor(biomeChar);
      } else {
        color = { r: height, g: height, b: height }; // Grayscale for heightfield
      }

      colorData[y][x] = color;
    }
  }

  // Save the map in the specified format
  const outputFilename = `${options.outputFilename}${getFileExtension(options.fileType)}`;
  switch (options.fileType) {
    case FileType.BMP:
      saveAsBMP(outputFilename, colorData, options.width, options.height);
      break;
    case FileType.PPM:
      saveAsPPM(outputFilename, colorData, options.width, options.height);
      break;
    case FileType.XPM:
      saveAsXPM(outputFilename, colorData, options.width, options.height);
      break;
    case FileType.HEIGHTFIELD:
      saveHeightfield(outputFilename, heightfieldData, options.width, options.height);
      break;
    default:
      console.error("Unsupported file type:", options.fileType);
  }

  console.log("Planet map generation complete.");
}

// Main function
function main() {
  console.log("Planet generation started...");

  // Example: Rotate tetrahedron vertices
  const rotate1 = 0.0;
  const rotate2 = 0.0;
  const cR1 = Math.cos(rotate1);
  const sR1 = Math.sin(rotate1);
  const cR2 = Math.cos(rotate2);
  const sR2 = Math.sin(rotate2);

  for (let i = 0; i < tetra.length; i++) {
    const tx = tetra[i].x;
    const ty = tetra[i].y;
    const tz = tetra[i].z;

    // Rotate around y-axis
    tetra[i].x = cR2 * tx + sR2 * tz;
    tetra[i].y = ty;
    tetra[i].z = -sR2 * tx + cR2 * tz;

    // Rotate around x-axis
    const newTx = tetra[i].x;
    const newTy = tetra[i].y;
    const newTz = tetra[i].z;
    tetra[i].x = newTx;
    tetra[i].y = cR1 * newTy - sR1 * newTz;
    tetra[i].z = sR1 * newTy + cR1 * newTz;
  }

  console.log("Tetrahedron vertices after rotation:", tetra);

  // Additional logic for planet generation will go here

  // Example integration of the main program flow
  const args = process.argv.slice(2);
  const options = parseArguments(args);
  generatePlanetMap(options);
}

// Run the main function
main();

// Example usage
console.log(getFileExtension(FileType.BMP)); // Outputs: .bmp

// Example usage of Vertex and dist2
const vertexA = new Vertex(1, 2, 3);
const vertexB = new Vertex(4, 5, 6);
console.log("Distance squared:", dist2(vertexA, vertexB)); // Outputs: 27

// Example usage of rand2
const seed1 = 0.123;
const seed2 = 0.456;
console.log("Random number:", rand2(seed1, seed2)); // Outputs a random number between -1 and 1

// Example usage of initializeTetrahedron
const tetrahedron = initializeTetrahedron();
console.log("Initialized Tetrahedron:", tetrahedron);

// Example usage of Mercator projection
mercatorProjection();

// Example usage of Orthographic projection
orthographicProjection();

// Example usage of Stereographic projection
stereographicProjection();

// Example usage of Gnomonic projection
gnomonicProjection();

// Example usage of Azimuthal projection
azimuthalProjection();

// Example usage of saveAsBMP
const exampleData = Array.from({ length: Height }, () =>
  Array.from({ length: Width }, () => ({ r: 255, g: 255, b: 255 }))
);
saveAsBMP('output.bmp', exampleData, Width, Height);

// Example usage of saveAsPPM and saveAsXPM
saveAsPPM('output.ppm', exampleData, Width, Height);
saveAsXPM('output.xpm', exampleData, Width, Height);

// Example usage of heightfield generation and saving
const heightfieldData = generateHeightfield(Width, Height);
saveHeightfield('output.heightfield', heightfieldData, Width, Height);

// Example usage of biome generation and argument parsing
const args = process.argv.slice(2);
const options = parseArguments(args);
const biomeMap = generateBiomes(options.temperature, options.rainfall);
console.log('Biome Map:', biomeMap);