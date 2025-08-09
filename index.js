// Step 1: Read the JSON file
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Step 2: Function to decode numbers from given base into BigInt
function decodeValue(base, value) {
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = 0n;
  const bigBase = BigInt(base);
  for (let char of value.toLowerCase()) {
    const digitVal = BigInt(digits.indexOf(char));
    if (digitVal === -1n || digitVal >= bigBase) {
      throw new Error(`Invalid digit '${char}' for base ${base}`);
    }
    result = result * bigBase + digitVal;
  }
  return result;
}

// Step 3: Prepare k points from JSON
const { n, k } = data.keys;
const points = [];
Object.keys(data).forEach(key => {
  if (key !== "keys") {
    const x = BigInt(key);
    const base = parseInt(data[key].base);
    const y = decodeValue(base, data[key].value);
    points.push({ x, y });
  }
});

// Sort points by x and take first k
points.sort((a, b) => (a.x < b.x ? -1 : 1));
const usedPoints = points.slice(0, k);

// Step 4: Lagrange interpolation at x = 0 to find constant c
function findConstant(points) {
  let c = 0n;
  for (let i = 0; i < points.length; i++) {
    let termNum = points[i].y; // numerator
    let termDen = 1n; // denominator
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        termNum *= (0n - points[j].x);
        termDen *= (points[i].x - points[j].x);
      }
    }
    c += termNum / termDen;
  }
  return c;
}

const c = findConstant(usedPoints);

// Step 5: Print only c
console.log(c.toString());
