import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_FILE = path.join(__dirname, "..", "data", "raw_items_filtered.json");
const SAVE_PATH = path.join(__dirname, "..", "data", "items.json")

async function prep() {
    // read the raw_items_filtered.json file
    const raw = await fs.readFile(RAW_FILE, "utf-8");
    const data = JSON.parse(raw);

    function formatItem(item) {
        if (!item) return null;
        const obj = {
            slug: item.slug
        };
        // if the item has a name, save it
        //if (item.i18n && item.i18n.en && item.i18n.en.name) obj.name = item.i18n.en.name;
        
        //if the item has tags, save it
        if (item.tags) obj.tags = item.tags;

        // if the item has ducats, save it
        if (item.ducats) obj.ducats = item.ducats;

        // if item has maxRank, save it
        if (item.maxRank) obj.max_rank = item.maxRank;
        
        // if item has a thumb, save it
        if (item.i18n && item.i18n.en && item.i18n.en.thumb) obj.thumb = item.i18n.en.thumb;

        return obj;
    }

    function groupItems(setsData, partsData) {
        
        const result = {};

        if (setsData) {
            for (const item of setsData) {
                const slug = item.slug;
                let baseName = slug.replace(/_set$/, "");
                result[baseName] = {
                    set: formatItem(item),
                    parts: []
                };
            }
        }

        if (partsData) {
            // knownBases = every single warframe_prime
            const knownBases = Object.keys(result);

            for (const item of partsData) {
                const slug = item.slug;
                
                let baseName = knownBases.find(b => slug.startsWith(b + "_") || slug === b);

                if (!baseName) {
                    baseName = slug.substring(0, slug.lastIndexOf('_'));
                }

                if (!result[baseName]) {
                    result[baseName] = { set: null, parts: [] };
                }
                result[baseName].parts.push(formatItem(item));
            }
        }
        
        return result;
    }

    const slugs = {
        warframes: groupItems(data.warframe_sets, data.warframes),
        weapons: groupItems(data.weapon_sets, data.weapons),
        companions: groupItems(data.companion_sets, data.companions),
        // reduce(function, starting value) 
        arcanes: data.arcanes.reduce((acc, item) => {
        // acc = accumulator, item = iterator
            acc[item.slug] = formatItem(item);
            //acc["mod_name"] = formatItem(item)
            return acc;
        }, {}),
        mods: data.mods.reduce((acc, item) => {
            acc[item.slug] = formatItem(item);
            return acc;
        }, {})
    };

    await fs.writeFile(
        SAVE_PATH,
        JSON.stringify(slugs, null, 2)
    )
}

prep()
