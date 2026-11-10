import assert from 'node:assert/strict';
import {
  loginAdmin,
  logoutAdmin,
  getAdminSession,
  isAuthenticatedAdmin,
  DEMO_ADMIN_CREDENTIALS,
} from '../src/lib/auth/admin-auth.ts';

console.log('Running Test Matrix for Admin Auth Service...');

const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

const resSuccess = await loginAdmin({
  email: DEMO_ADMIN_CREDENTIALS.email,
  password: DEMO_ADMIN_CREDENTIALS.password,
});
assert.equal(resSuccess.success, true);
assert.ok(resSuccess.session);
assert.equal(resSuccess.session.user.email, 'admin@hargaku.id');
assert.equal(isAuthenticatedAdmin(), true);
console.log('✓ TC-AUTH-01 passed: loginAdmin succeeded with demo credentials');

const resFail = await loginAdmin({
  email: DEMO_ADMIN_CREDENTIALS.email,
  password: 'wrongPassword123',
});
assert.equal(resFail.success, false);
assert.ok(resFail.error);
console.log('✓ TC-AUTH-02 passed: loginAdmin correctly rejected invalid password');

const session = getAdminSession();
assert.ok(session);
assert.equal(session.user.role, 'Administrator');
console.log('✓ TC-AUTH-03 passed: getAdminSession returned valid persistent session');

logoutAdmin();
assert.equal(isAuthenticatedAdmin(), false);
assert.equal(getAdminSession(), null);
console.log('✓ TC-AUTH-04 passed: logoutAdmin successfully invalidated session');

console.log('All Admin Auth tests passed successfully 100%!');
