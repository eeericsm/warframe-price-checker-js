const { exec } = require('child_process'); // lets node use the terminal
const { promisify } = require('util'); // converts callback into promisses, purely for syntax convenience
const execPromise = promisify(exec);

async function getAllPrices() {
    
    const scripts = [
        'getArcanes.js',
        'getCompanionParts.js',
        'getCompanionSets.js',
        'getWarframeParts.js',
        'getWarframeSets.js',
        'getWeaponParts.js',
        'getWeaponSets.js'
    ];

    try {
        // Run all scripts sequentially to avoid rate limiting
        for (const script of scripts) {
            console.log(`Running ${script}...`);
            const { stdout, stderr } = await execPromise(`node getPrices/${script}`);
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            console.log(`${script} completed\n`);
        }
        
        console.log('All price data fetched successfully!');
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

getAllPrices();
