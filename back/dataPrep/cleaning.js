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

    function formatItem(item) {
        if (!item) return null;
        const obj = {
            slug: item.slug
        };
        if (item.i18n && item.i18n.en && item.i18n.en.name) obj.name = item.i18n.en.name;
        else if (item.item_name) obj.name = item.item_name;
        
        if (item.tags) obj.tags = item.tags;
        if ('ducats' in item) obj.ducats = item.ducats;
        if ('maxRank' in item) obj.max_rank = item.maxRank;
        else if ('max_rank' in item) obj.max_rank = item.max_rank;
        
        if (item.i18n && item.i18n.en && item.i18n.en.thumb) {
            obj.thumb = item.i18n.en.thumb;
        } else if (item.thumb) {
            obj.thumb = item.thumb;
        }
        return obj;
    }

    function groupItems(setsData, partsData) {
        const result = {};

        if (setsData) {
            for (const item of setsData) {
                const slug = item.slug;
                let baseName = slug.replace(/_prime_set$/, "").replace(/_set$/, "");
                result[baseName] = {
                    set: formatItem(item),
                    parts: []
                };
            }
        }

        if (partsData) {
            for (const item of partsData) {
                const slug = item.slug;
                let baseName = slug;
                if (slug.includes("_prime_")) {
                    baseName = slug.split("_prime_")[0];
                } else {
                    let matchingBase = Object.keys(result).find(b => slug.startsWith(b + "_") || slug === b);
                    if (matchingBase) baseName = matchingBase;
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
        arcanes: data.arcanes ? data.arcanes.reduce((acc, item) => {
            acc[item.slug] = formatItem(item);
            return acc;
        }, {}) : {},
        mods: data.mods ? data.mods.reduce((acc, item) => {
            acc[item.slug] = formatItem(item);
            return acc;
        }, {}) : {}
    };

    await fs.writeFile(
        SAVE_PATH,
        JSON.stringify(slugs, null, 2)
    )
}

prep()
