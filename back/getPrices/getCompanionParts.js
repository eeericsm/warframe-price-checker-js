const fs = require("fs/promises")
const getPrice = require("../prices/getPrice.js")

async function price() {
    const raw = await fs.readFile("./data/items.json", "utf-8");
    const sluggage = JSON.parse(raw)
    const prices = {}
    for (const slugs of sluggage.companion_parts) {
        
        try {
            const plat = await getPrice(slugs)
            prices[slugs] = plat
        } catch(err) {
            console.log(err)
            console.log(`${slugs} FAILED`)
            prices[slugs] = null
        }
    }
    
    await fs.writeFile(
        `./pricesData/companion_parts.json`,
        JSON.stringify(prices, null, 2)
    )
}

price()