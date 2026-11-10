import assert from 'node:assert/strict';
import {
  DEFAULT_ADMIN_USER,
  INITIAL_COMMODITIES,
  INITIAL_MARKETS,
  INITIAL_DAILY_PRICES,
  adminStoreReducer,
} from '../src/lib/store/admin-state.ts';

console.log('Running Test Matrix for Admin Store State Reducer...');

const initialState = {
  currentUser: DEFAULT_ADMIN_USER,
  commodities: INITIAL_COMMODITIES,
  markets: INITIAL_MARKETS,
  dailyPrices: INITIAL_DAILY_PRICES,
  reports: [
    {
      id: 'REP-01',
      commodityName: 'Cabai Rawit Merah',
      marketName: 'Pasar Anyar',
      reportedPrice: 20000,
      unit: '1/4 kg',
      normalizedPricePerKg: 80000,
      officialHapPrice: 57000,
      cityAvgPrice: 62000,
      diffPercent: 29.0,
      submittedAt: '23 Okt 2026',
      hasPhoto: true,
      status: 'PENDING',
      exifSanitized: true,
    },
  ],
};

const newCommodity = {
  id: 'com_test_01',
  name: 'Buncis Super',
  slug: 'buncis-super',
  category: 'SAYUR',
  unit: 'kg',
  hapHetPrice: 22000,
  tolerancePercentage: 10,
  imageUrl: '',
  isActive: true,
};

const stateAfterAdd = adminStoreReducer(initialState, {
  type: 'ADD_COMMODITY',
  payload: newCommodity,
});

assert.equal(stateAfterAdd.commodities.length, initialState.commodities.length + 1);
assert.equal(stateAfterAdd.commodities[0].id, 'com_test_01');
console.log('✓ TC-ADM-01 passed: ADD_COMMODITY successfully prepended');

const stateAfterUpdate = adminStoreReducer(stateAfterAdd, {
  type: 'UPDATE_COMMODITY',
  payload: { id: 'com_test_01', hapHetPrice: 25000, name: 'Buncis Super Lembang' },
});
const updated = stateAfterUpdate.commodities.find((c) => c.id === 'com_test_01');
assert.equal(updated?.hapHetPrice, 25000);
assert.equal(updated?.name, 'Buncis Super Lembang');
console.log('✓ TC-ADM-02 passed: UPDATE_COMMODITY successfully applied partial patch');

const stateAfterDelete = adminStoreReducer(stateAfterUpdate, {
  type: 'DELETE_COMMODITY',
  payload: 'com_test_01',
});
assert.equal(stateAfterDelete.commodities.length, initialState.commodities.length);
console.log('✓ TC-ADM-03 passed: DELETE_COMMODITY successfully removed item');

const newMarket = {
  id: 'mkt_test_01',
  name: 'Pasar Taman Kencana',
  slug: 'pasar-taman-kencana',
  district: 'Bogor Tengah',
  address: 'Jl. Taman Kencana No. 5',
  latitude: -6.589,
  longitude: 106.801,
  operatingHours: '06:00 - 12:00 WIB',
  specialty: 'Kuliner & Sayur Organik',
  isActive: true,
};
const stateWithMarket = adminStoreReducer(initialState, {
  type: 'ADD_MARKET',
  payload: newMarket,
});
assert.equal(stateWithMarket.markets.length, initialState.markets.length + 1);

const stateMarketUpdated = adminStoreReducer(stateWithMarket, {
  type: 'UPDATE_MARKET',
  payload: { id: 'mkt_test_01', specialty: 'Aneka Bumbu Basah' },
});
assert.equal(
  stateMarketUpdated.markets.find((m) => m.id === 'mkt_test_01')?.specialty,
  'Aneka Bumbu Basah'
);
console.log('✓ TC-ADM-04 passed: ADD_MARKET and UPDATE_MARKET passed');

const statePrices = adminStoreReducer(initialState, {
  type: 'UPDATE_DAILY_PRICES',
  payload: {
    marketId: 'sukasari',
    recordedDate: '2026-10-23',
    entries: [
      { commodityId: 'cabai-rawit-merah', price: 61000 },
      { commodityId: 'bawang-merah-brebes', price: 34500 },
    ],
  },
});
const priceEntry = statePrices.dailyPrices['sukasari_cabai-rawit-merah'];
assert.equal(priceEntry?.price, 61000);
assert.equal(priceEntry?.recordedDate, '2026-10-23');
console.log('✓ TC-ADM-05 passed: UPDATE_DAILY_PRICES batch update recorded correctly');

const stateApproved = adminStoreReducer(initialState, {
  type: 'APPROVE_REPORT',
  payload: 'REP-01',
});
assert.equal(stateApproved.reports.find((r) => r.id === 'REP-01')?.status, 'APPROVED');

const stateRejected = adminStoreReducer(initialState, {
  type: 'REJECT_REPORT',
  payload: { id: 'REP-01', reason: 'Foto tidak jelas' },
});
assert.equal(stateRejected.reports.find((r) => r.id === 'REP-01')?.status, 'REJECTED');
console.log('✓ TC-ADM-06 passed: APPROVE_REPORT and REJECT_REPORT status changed');

const newReport = {
  id: 'REP-TEST-NEW',
  commodityName: 'Bawang Merah Brebes',
  marketName: 'Pasar Baru',
  reportedPrice: 35000,
  unit: '1 kg',
  normalizedPricePerKg: 35000,
  officialHapPrice: 36500,
  cityAvgPrice: 34000,
  diffPercent: 2.9,
  submittedAt: 'Baru saja',
  hasPhoto: true,
  status: 'PENDING',
  exifSanitized: true,
};
const stateWithReport = adminStoreReducer(initialState, {
  type: 'ADD_REPORT',
  payload: newReport,
});
assert.equal(stateWithReport.reports.length, initialState.reports.length + 1);
assert.equal(stateWithReport.reports[0].id, 'REP-TEST-NEW');
console.log('✓ TC-ADM-06B passed: ADD_REPORT successfully queued report');

const stateProfile = adminStoreReducer(initialState, {
  type: 'UPDATE_PROFILE',
  payload: { name: 'Super Admin', email: 'superadmin@hargaku.id' },
});
assert.equal(stateProfile.currentUser.name, 'Super Admin');
assert.equal(stateProfile.currentUser.email, 'superadmin@hargaku.id');
console.log('✓ TC-ADM-07 passed: UPDATE_PROFILE updated admin user details');

const stalePayload = {
  commodities: INITIAL_COMMODITIES,
  markets: INITIAL_MARKETS,
  dailyPrices: INITIAL_DAILY_PRICES,
  reports: [],
};
const stateAfterStaleLoad = adminStoreReducer(initialState, {
  type: 'SET_STATE',
  payload: stalePayload,
});
assert.ok(stateAfterStaleLoad.currentUser);
assert.equal(stateAfterStaleLoad.currentUser.fullName, DEFAULT_ADMIN_USER.fullName);
console.log('✓ TC-ADM-08 passed: SET_STATE safely populated fallback currentUser for stale payload');

console.log('All Admin Store Reducer tests passed successfully!');
