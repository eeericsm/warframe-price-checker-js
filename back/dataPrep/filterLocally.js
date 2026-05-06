import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_FILE = path.join(__dirname, "..", "data", "raw_items.json");
const SAVE_PATH = path.join(__dirname, "..", "data", "raw_items_filtered.json")

async function filterLocally() {
    const categories = {
        warframes: [],
        warframe_sets: [],
        weapons: [],
        weapon_sets: [],
        companions: [],
        companion_sets: [],
        arcanes: [],
        mods: []
    };

    const raw = await fs.readFile(RAW_FILE, "utf-8");
    const data = JSON.parse(raw);

    for (const item of data.data) {
        const tags = item.tags || [];
        
        // Arcanes
        if (tags.includes("arcane_enhancement")) {
            categories.arcanes.push(item)
            continue // Move to the next item if its just an arcane
        }

        // Mods
        if (tags.includes("mod")) {
            // Only keep legendary mods (like Primed Continuity) for our app
            if (tags.includes("legendary")) {
                categories.mods.push(item);
            }
            continue; // Skip all other mods entirely so they don't leak into primes
        }

        // Primes
        if (tags.includes("prime")) {
            const isSet = tags.includes("set");
            let isWarframe = tags.includes("warframe");
            let isWeapon = tags.includes("weapon");
            let isCompanion = tags.includes("sentinel");

            const slug = item.slug || "";

            // Force companion if it has specific companion part names
            if (
                slug.includes("carapace") || 
                slug.includes("cerebrum") || 
                (slug.includes("systems") && !slug.includes("blueprint"))
            ) {
                isCompanion = true;
                isWeapon = false;
                isWarframe = false;
            }

            let baseName = "";
            if (isWarframe) baseName = "warframe"; 
            else if (isCompanion) baseName = "companion";
            else if (isWeapon) baseName = "weapon"; 

            if (baseName) {
                const category = isSet ? `${baseName}_sets` : `${baseName}s`;
                categories[category].push(item);
            }
        }
    }
    await fs.writeFile(SAVE_PATH, JSON.stringify(categories, null, 2));
    console.log('raw items filtered')
}

filterLocally()