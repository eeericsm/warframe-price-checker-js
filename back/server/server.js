import express from 'express';
import cors from 'cors';
import { readJsonFile } from './utils/fileUtils.js';

const PORT = 8000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// in-memory Cache for items.json
let cachedItems = null;

// read it once when the server boots
const loadCache = async () => {
  try {
    cachedItems = await readJsonFile('items.json', 'data');
    console.log('Successfully cached items.json in memory.');
  } catch (err) {
    console.error('Failed to cache items.json:', err);
  }
};
await loadCache();

// map the URL path category to the correct prices filename
const categoryConfigs = {
  arcanes: 'arcanePrices.json',
  companions: 'companionPrices.json',
  mods: 'modPrices.json',
  warframes: 'warframePrices.json',
  weapons: 'weaponPrices.json'
};

// GET all items of a specific category: /api/:category
// e.g., /api/warframes
app.get('/api/:category', async (req, res) => {
  const category = req.params.category;
  const pricesFile = categoryConfigs[category];

  if (!pricesFile) return res.status(404).json({ error: 'Category not found' });
  if (!cachedItems) return res.status(500).json({ error: 'Server data not ready' });

  try {
    const prices = await readJsonFile(pricesFile, 'pricesData');
    const itemsInfo = cachedItems[category] || {};
    
    // combine them dynamically
    const combinedData = Object.keys(itemsInfo).map(slug => {
      return {
        slug,
        info: itemsInfo[slug] || null,
        prices: prices[slug] || null
      };
    });

    res.json(combinedData);
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${category} data` });
  }
});

// GET specific item data: /api/:category/:slug
// e.g., /api/weapons/braton_prime
app.get('/api/:category/:slug', async (req, res) => {
  const { category, slug } = req.params;
  const pricesFile = categoryConfigs[category];

  if (!pricesFile) return res.status(404).json({ error: 'Category not found' });
  if (!cachedItems) return res.status(500).json({ error: 'Server data not ready' });

  try {
    const prices = await readJsonFile(pricesFile, 'pricesData');
    
    const itemPrices = prices[slug];
    const itemInfo = cachedItems[category]?.[slug];

    if (!itemPrices && !itemInfo) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      slug,
      info: itemInfo || null,
      prices: itemPrices || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server connected on port: ${PORT}`);
});
