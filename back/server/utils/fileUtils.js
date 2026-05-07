import path from 'node:path';
import fs from 'node:fs/promises';

const __dirname = import.meta.dirname;

export const readJsonFile = async (filename, targetFolder = 'pricesData') => {
  try {
    const filePath = path.join(__dirname, '..', '..', targetFolder, filename);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${filename} from ${targetFolder}:`, error);
    throw error; 
  }
};