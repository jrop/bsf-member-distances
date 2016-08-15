bsf-member-distances
====================

A simple utility to calculate distances from BSF members to each airport: KGXY and KFNL.

## Requirements

Install Node.js 6+.

## Generating Data

Step 1: Obtain a Google Maps Directions API key, and place it in a file named `maps-api-key.js` like so:

```js
module.exports = 'YOUR_API_KEY'
```

Step 2: Go to the Roster page on the MyFBO website, and run the snippet located in `extract-members.js`.

Step 3: Save the generated JSON to a file named `members.json` in this directory.

Step 4: Run the following commands:

```sh
npm install # install dependencies
node index.js > results.csv # generate CSV
```

Step 5: Open results.csv with Excel, add computations, etc., then save as XLSX.
