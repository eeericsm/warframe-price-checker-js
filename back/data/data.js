const download = require("../prep/download");
const filter = require("../prep/filter");
const cleaning = require("../prep/cleaning")

async function data() {
    await download();  
    await filter();     
    await cleaning();
}

data();
