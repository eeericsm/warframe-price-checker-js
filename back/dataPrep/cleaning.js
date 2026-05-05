import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_FILE = path.join(__dirname, "..", "data", "raw_items_filtered.json");
const SAVE_PATH = path.join(__dirname, "..", "data", "names.json")

async function prep() {
    // read the raw_items_filtered.json file
    const raw = await fs.readFile(RAW_FILE, "utf-8");
    const data = JSON.parse(raw);

    // Map the old keys from your data file to the new keys you want
    const categoryMap = {
        warframes: "warframe_parts",
        warframe_sets: "warframe_sets",
        weapons: "weapon_parts",
        weapon_sets: "weapon_sets",
        companions: "companion_parts",
        companion_sets: "companion_sets",
        arcanes: "arcanes",
        mods: "mods"
    };

    const slugs = {};

    // Loop through the map once and dynamically extract the identifiers
    for (const [oldKey, newKey] of Object.entries(categoryMap)) {
        if (data[oldKey]) {
            slugs[newKey] = data[oldKey].map(i => i.url_name || i.slug);
        }
    }

    await fs.writeFile(
        SAVE_PATH,
        JSON.stringify(slugs, null, 2)
    )
}

prep()
