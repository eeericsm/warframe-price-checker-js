import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import getPrice from "../prices/getPrice.js";

// recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAVE_PATH = path.join(__dirname, "..", "pricesData", "weaponPrices.json")
const ITEM_FILE = path.join(__dirname, "..", "data", "items.json")

// helper wait function to respect API rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

async function price() {
    const raw = await fs.readFile(ITEM_FILE, "utf-8");
    const items = JSON.parse(raw);
    const prices = {};
    
    for (const [baseName, weapon] of Object.entries(items.weapons)) {
        
        prices[baseName] = {
            set: null,
            parts: {}
        };

        // 1. fetch the Set Price
        if (weapon.set) {
            const setSlug = weapon.set.slug;
            try {
                const plat = await getPrice(setSlug);
                prices[baseName].set = plat;
                console.log(`[SET] ${setSlug} SAVED`);
            } catch(err) {
                console.log(`[SET] ${setSlug} FAILED`);
                prices[baseName].set = null;
            }
            await delay(350); // slight pause to not hammer the API
        }

        // 2. fetch the Parts Prices
        if (weapon.parts && weapon.parts.length > 0) {
            for (const part of weapon.parts) {
                const partSlug = part.slug;
                try {
                    const plat = await getPrice(partSlug);
                    prices[baseName].parts[partSlug] = plat;
                    console.log(`[PART] ${partSlug} SAVED`);
                } catch(err) {
                    console.log(`[PART] ${partSlug} FAILED`);
                    prices[baseName].parts[partSlug] = null;
                }
                await delay(350); 
            }
        }
    }
    
    await fs.writeFile(
        SAVE_PATH,
        JSON.stringify(prices, null, 2)
    )
}

price()