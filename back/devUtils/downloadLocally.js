import fs from "fs/promises";
import path from "path";

// recreating __dirname for ES Modules
const __dirname = import.meta.dirname;

const PATH = "https://api.warframe.market/v2/";
const RAW_FILE = path.join(__dirname, "..", "data", "raw_items.json");


// it is possible to instead of saving it, just return the data to some other function
// but that would require more calls to the api
// so i rather download the data locally to test it without spamming calls
async function downloadLocally() {
    const res = await fetch(`${PATH}items`);
    if (!res.ok) {
        throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    await fs.writeFile(RAW_FILE, JSON.stringify(data, null, 2));
    
    console.log("items saved locally");
}

downloadLocally()