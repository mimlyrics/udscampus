import fs from "fs";
import path from "path";
// Load the GeoJSON file
const geojsonPath = '../../UDS.geojson';
const outputGeojsonPath = '../../UDS_updated.geojson';

const data = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

data.features.forEach(feature => {
  const imagePath = feature.properties.IMAGE;
  if (imagePath) {
    // Normalize and split the path
    const segments = imagePath.split(/[\\/]/); // Handles both \ and /
    const lastTwo = segments.slice(-2); // Get last two parts
    const newPath = path.posix.join('/', 'images', ...lastTwo);
    feature.properties.IMAGE = newPath;
  }
});

fs.writeFileSync(outputGeojsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('GeoJSON image paths updated with last two segments.');