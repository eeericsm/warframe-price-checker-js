import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import getPriceArcane from "../prices/getPriceArcane.js";

// recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAVE_PATH = path.join(__dirname, "..", "pricesData", "modPrices.json")
const ITEM_FILE = path.join(__dirname, "..", "data", "items.json")

// helper wait function to respect API rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

async function price() {
    const raw = await fs.readFile(ITEM_FILE, "utf-8");
    const items = JSON.parse(raw);
    const prices = {};
    
    for (const [baseName, mods] of Object.entries(items.mods)) {

        prices[baseName] = {
            max: null,
            min: null
        };

        const maxRank = mods.max_rank.toString()

        try {
            const plat = await getPriceArcane(baseName, maxRank);
            prices[baseName].max = plat;
            console.log(`[MAX] ${baseName} SAVED`);
        } catch(err) {
            console.log(`[MAX] ${baseName} FAILED`);
            prices[baseName].max = null;
        }
        await delay(350); // slight pause to not hammer the API

        try {
            const plat = await getPriceArcane(baseName, 0);
            prices[baseName].min = plat;
            console.log(`[MIN] ${baseName} SAVED`);
        } catch(err) {
            console.log(`[MIN] ${baseName} FAILED`);
            prices[baseName].min = null;
        }
        await delay(350); // slight pause to not hammer the API
    
    await fs.writeFile(
    SAVE_PATH,
    JSON.stringify(prices, null, 2)
    )
    
    }

}
    
    


price()