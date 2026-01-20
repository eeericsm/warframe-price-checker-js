const fs = require("fs/promises");

// this function will read items.json, which is a collection of all items downloaded from warframe api
// it will filter all the items inside and return only those who fit the requisites
async function readItems() {
    const categories = {
        primes: [],
        prime_sets: [],
        weapons: [],
        weapon_sets: [],
        companions: [],
        companion_sets: [],
        arcanes: [],
    };

    // absolute path because i dont want to call the api several times just to download items
    const raw = await fs.readFile("./data/raw_items.json", "utf-8");
    const data = JSON.parse(raw);

    // single pass
    for (const item of data.data) {
        const tags = item.tags || [];

        // primes
        if (tags.includes("prime")) {
            // sets
            if (tags.includes("set")) {
                // warframe
                if (tags.includes("warframe")) {
                    categories.prime_sets.push(item)
                // weapon
                } else if (tags.includes("weapon")) {
                    categories.weapon_sets.push(item)
                // companion
                } else {
                    categories.companion_sets.push(item)
                }
            // non sets
            } else {
                // warframe
                if (tags.includes("warframe")) {
                    categories.primes.push(item)
                // weapon
                } else if (tags.includes("weapon")) {
                    categories.weapons.push(item)
                // companion
                } else {
                    categories.companions.push(item)
                }
            }
        }

        // arcanes
        if (tags.includes("arcane_enhancement")) {
            categories.arcanes.push(item);
        }
    }

    await fs.writeFile("./data/raw_categories.json", JSON.stringify(categories, null, 2));
}

module.exports = readItems;
