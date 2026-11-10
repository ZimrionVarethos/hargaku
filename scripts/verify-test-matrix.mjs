import assert from 'node:assert/strict';
import { evaluatePrice } from '../src/lib/price-logic.ts';

const layers = {
  lapis1HapHet: 57000,
  lapis2OfficialAvg: 60000,
  lapis3CitizenMedian: 60000,
};

console.log('Running Test Matrix for Price Check Evaluation...');

const tc1 = evaluatePrice(60000, 60000, layers);
assert.equal(tc1.diffPercentage, 0.0);
assert.equal(tc1.status, 'FAIR');
assert.equal(tc1.statusBadgeColor, 'emerald');
console.log('✓ TC-CW-01 passed: 0% -> FAIR (emerald)');

const tc2 = evaluatePrice(66000, 60000, layers);
assert.equal(tc2.diffPercentage, 10.0);
assert.equal(tc2.status, 'FAIR');
assert.equal(tc2.statusBadgeColor, 'emerald');
console.log('✓ TC-CW-02 passed: +10% -> FAIR (emerald)');

const tc3 = evaluatePrice(54000, 60000, layers);
assert.equal(tc3.diffPercentage, -10.0);
assert.equal(tc3.status, 'FAIR');
assert.equal(tc3.statusBadgeColor, 'emerald');
console.log('✓ TC-CW-03 passed: -10% -> FAIR (emerald)');

const tc4 = evaluatePrice(66500, 60000, layers);
assert.equal(tc4.diffPercentage, 10.83);
assert.equal(tc4.status, 'SLIGHTLY_EXPENSIVE');
assert.equal(tc4.statusBadgeColor, 'amber');
console.log('✓ TC-CW-04 passed: +10.83% -> SLIGHTLY_EXPENSIVE (amber)');

const tc5 = evaluatePrice(75000, 60000, layers);
assert.equal(tc5.diffPercentage, 25.0);
assert.equal(tc5.status, 'SLIGHTLY_EXPENSIVE');
assert.equal(tc5.statusBadgeColor, 'amber');
console.log('✓ TC-CW-05 passed: +25% -> SLIGHTLY_EXPENSIVE (amber)');

const tc6 = evaluatePrice(76000, 60000, layers);
assert.equal(tc6.diffPercentage, 26.67);
assert.equal(tc6.status, 'OVERPRICED');
assert.equal(tc6.statusBadgeColor, 'rose');
console.log('✓ TC-CW-06 passed: +26.67% -> OVERPRICED (rose)');

const tc7 = evaluatePrice(50000, 60000, layers);
assert.equal(tc7.diffPercentage, -16.67);
assert.equal(tc7.status, 'MUCH_CHEAPER');
assert.equal(tc7.statusBadgeColor, 'blue');
console.log('✓ TC-CW-07 passed: -16.67% -> MUCH_CHEAPER (blue)');

console.log('\nAll Test Cases in docs/TEST_MATRIX.md passed successfully 100%!');
