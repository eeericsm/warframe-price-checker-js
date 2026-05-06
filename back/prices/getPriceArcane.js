// function to get the arcane prices from the api

export default async function getPriceArcane(slug, rank) {

    const res = await fetch(
    `https://api.warframe.market/v2/orders/item/${slug}/top?rank=${rank}`
    );

    const json = await res.json()
    const sell = json.data.sell
    let avg = 0

    if (sell.length > 0) {
        return avg = Math.ceil(sell.reduce((sum, order) => sum + order.platinum, 0) /
        sell.length)
    }
}