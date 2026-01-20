// function to get the prices from the api

async function getPrice(slug) {

    const res = await fetch(
    `https://api.warframe.market/v2/orders/item/${slug}/top`
    );
    const json = await res.json()
    const sell = json.data.sell
    let avg = 0

    if (sell.length > 0) {
        return avg = Math.round(sell.reduce((sum, order) => sum + order.platinum, 0) /
        sell.length)
    }
}

module.exports = getPrice