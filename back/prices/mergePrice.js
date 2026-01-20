const fs = require('fs').promises;
const path = require('path');

async function mergeJsonFiles() {
  // Resolve to the sibling folder of this file (prices -> pricesData)
  const dirPath = path.join(__dirname, "../pricesData");
  const merged = {};

  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.json') && file !== 'merged.json') {
        const filePath = path.join(dirPath, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const key = file.replace('.json', '');
        merged[key] = JSON.parse(data);
      }
    }

    const outputPath = path.join(dirPath, 'merged.json');
    await fs.writeFile(outputPath, JSON.stringify(merged, null, 2));
    
    console.log(`Merged ${Object.keys(merged).length} JSON files`);
    return merged;
  } catch (error) {
    console.error('Error merging JSON files:', error);
  }
}

mergeJsonFiles();