const fs = require("fs/promises");

const PATH = "https://api.warframe.market/v2/";


// it is possible to instead of saving it, just return the data to some other function
// but that would require more calls to the api
// so i rather download the data locally to test it without spamming calls
async function download() {
    const res = await fetch(`${PATH}items`);
    const data = await res.json();

    await fs.writeFile("./data/raw_items.json", JSON.stringify(data, null, 2));

    console.log("items saved");
}

download()

module.exports = download;