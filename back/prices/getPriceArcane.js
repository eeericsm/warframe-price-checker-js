// function to get the prices from the api

async function getPriceArcane(slug) {

    let res = await fetch(
        `https://api.warframe.market/v2/orders/item/${slug}/top?rank=5`
    );
    let json = await res.json();

    if (json.data === null) {
        res = await fetch(
        `https://api.warframe.market/v2/orders/item/${slug}/top?rank=3`
        );
        json = await res.json();
    }

    if (json.data === null) {
        return null;
    }

    const sell = json.data.sell;

    if (sell.length === 0) {
        return null;
    }

    let avg = 0

    if (sell.length > 0) {
        return avg = Math.round(sell.reduce((sum, order) => sum + order.platinum, 0) /
        sell.length)
    }
}

module.exports = getPriceArcane