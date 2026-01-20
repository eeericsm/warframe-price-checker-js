const fs = require("fs/promises");

async function prep() {
    // read the categories.json file
    const raw = await fs.readFile("./data/raw_categories.json", "utf-8");
    const data = JSON.parse(raw);

    // get only the names of the items and separate by key inside the slugs obj
    const slugs = {
        warframe_parts: data.primes.map(i => i.slug),
        warframe_sets: data.prime_sets.map(i => i.slug),
        weapon_parts: data.weapons.map(i => i.slug),
        weapon_sets: data.weapon_sets.map(i => i.slug),
        companion_parts: data.companions.map(i => i.slug),
        companion_sets: data.companion_sets.map(i => i.slug),
        arcanes: data.arcanes.map(i => i.slug),
    };

    await fs.writeFile(
        `./data/items.json`,
        JSON.stringify(slugs, null, 2)
    )
}

prep()
