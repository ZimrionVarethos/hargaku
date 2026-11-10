import assert from 'node:assert/strict';
import { evaluatePrice } from '../src/lib/price-logic.ts';
import {
  PIHPS_POSITIONING_NOTE,
  computeMarketInsights,
  computeMedian,
  computeStationAreaInsights,
  findMentionedMarket,
  normalizeQuantityPrice,
} from '../src/lib/market-insights.ts';
import { filterMarketsForRegion } from '../src/lib/mock/markets.data.ts';
import { INITIAL_ADMIN_STATE } from '../src/lib/store/admin-seed.ts';

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

assert.equal(normalizeQuantityPrice(20000, 1, 'quarter'), 80000);
assert.equal(normalizeQuantityPrice(15800, 2, 'ons'), 79000);
assert.equal(normalizeQuantityPrice(67000, 1, 'half'), 134000);
assert.equal(computeMedian([79000, 82000, 80000]), 80000);
assert.equal(computeMedian([79000, 82000]), 80500);
console.log('✓ TC-CW-09 passed: Unit & quantity normalization + median calculation');

const kebonInsights = computeMarketInsights({
  marketId: 'mkt_kebon_kembang',
  commodities: INITIAL_ADMIN_STATE.commodities,
  markets: INITIAL_ADMIN_STATE.markets,
  dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
  reports: INITIAL_ADMIN_STATE.reports,
});
assert.equal(kebonInsights.nearStation, true);
assert.ok(kebonInsights.expensiveItems.some((item) => item.commodityId === 'cabai-rawit-merah'));
assert.ok(
  kebonInsights.shortageAlerts.some(
    (alert) => alert.commodityId === 'cabai-rawit-merah' && alert.stockStatus === 'TERBATAS'
  )
);

const devriesInsights = computeMarketInsights({
  marketId: 'mkt_devries',
  commodities: INITIAL_ADMIN_STATE.commodities,
  markets: INITIAL_ADMIN_STATE.markets,
  dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
  reports: INITIAL_ADMIN_STATE.reports,
});
assert.ok(
  devriesInsights.shortageAlerts.some(
    (alert) => alert.commodityId === 'minyak-goreng-curah' && alert.stockStatus === 'LANGKA'
  )
);

const stationInsights = computeStationAreaInsights({
  commodities: INITIAL_ADMIN_STATE.commodities,
  markets: INITIAL_ADMIN_STATE.markets,
  dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
  reports: INITIAL_ADMIN_STATE.reports,
});
assert.ok(stationInsights.length >= 3);
assert.equal(
  findMentionedMarket(INITIAL_ADMIN_STATE.markets, 'Di pasar dekat Stasiun Bogor apa yang sedang mahal?'),
  undefined
);
assert.equal(
  findMentionedMarket(INITIAL_ADMIN_STATE.markets, 'Pasar Anyar lagi mahal apa?')?.id,
  'mkt_kebon_kembang'
);
console.log('✓ TC-MI-01 passed: Per-market station insights, shortage alerts & query matching');

const bogorMarkets = filterMarketsForRegion(INITIAL_ADMIN_STATE.markets, 'reg_bogor');
const jabodetabekMarkets = filterMarketsForRegion(INITIAL_ADMIN_STATE.markets, 'reg_bodebek');
const jabarMarkets = filterMarketsForRegion(INITIAL_ADMIN_STATE.markets, 'reg_jabar');
assert.equal(bogorMarkets.length, 13);
assert.ok(jabodetabekMarkets.length > bogorMarkets.length);
assert.ok(jabarMarkets.length > bogorMarkets.length);
assert.ok(PIHPS_POSITIONING_NOTE.toLowerCase().includes('pihps'));
console.log('✓ TC-PH-01 passed: 4-phase rollout hierarchy (Bogor=13, Jabodetabek, Jabar) & PIHPS framing');

console.log('\nAll Test Cases in docs/TEST_MATRIX.md passed successfully 100%!');
