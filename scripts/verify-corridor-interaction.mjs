import assert from 'node:assert/strict';
import {
  BASE_CAMERA_PITCH,
  BASE_CAMERA_YAW,
  MAX_BASKET_ITEMS,
  REMOVE_ANIMATION_MS,
  clampCorridorPitch,
  applyLookDelta,
  isPointerDragGesture,
  clampCameraSpaceReachTarget,
  evaluateGrabTimeline,
  evaluateRemoveTimeline,
  allocateBasketSlotIndex,
  advanceFootstepAccumulator,
  isCameraTurnedAway,
  getGrabProduceScale,
  resolveCorridorKeyAction,
  computeSteppedWalkProgress,
} from '../src/components/landing/pasarku/three/three-corridor-math.ts';

console.log('Running Test Matrix for 3D Corridor 360 Look & Right-Hand Grab Math...');

assert.equal(BASE_CAMERA_YAW, Math.PI);
assert.equal(BASE_CAMERA_PITCH, -0.02);

assert.equal(clampCorridorPitch(2.0), 0.44);
assert.equal(clampCorridorPitch(-2.0), -0.5);
assert.equal(clampCorridorPitch(0.15), 0.15);

const turnedBehind = applyLookDelta(0, 0, Math.PI, 0.8);
assert.ok(Math.abs(turnedBehind.yawOffset - Math.PI) < 0.0001);
assert.equal(turnedBehind.pitchOffset, 0.44);

const fullSpin = applyLookDelta(Math.PI * 1.9, 0, 0.5, 0);
assert.ok(fullSpin.yawOffset > Math.PI * 2);

assert.equal(isPointerDragGesture(2, 3), false);
assert.equal(isPointerDragGesture(5, 4), true);
assert.equal(isPointerDragGesture(-7, 0), true);

const leftHit = clampCameraSpaceReachTarget(-1.4, -0.9);
assert.equal(leftHit.reachX, -0.14);
assert.equal(leftHit.reachY, -0.18);

const rightHit = clampCameraSpaceReachTarget(1.8, 0.7);
assert.equal(rightHit.reachX, 0.28);
assert.equal(rightHit.reachY, 0.12);

const sReach = evaluateGrabTimeline(96, 480);
assert.equal(sReach.phase, 'reach');
assert.equal(sReach.carryProduce, false);
assert.equal(sReach.triggerBasketDrop, false);

const sCarry = evaluateGrabTimeline(300, 480);
assert.equal(sCarry.phase, 'carry');
assert.equal(sCarry.carryProduce, true);
assert.equal(sCarry.triggerBasketDrop, false);

const sDrop = evaluateGrabTimeline(420, 480);
assert.equal(sDrop.phase, 'drop');
assert.equal(sDrop.carryProduce, false);
assert.equal(sDrop.triggerBasketDrop, true);
assert.equal(sDrop.isFinished, false);

const sDone = evaluateGrabTimeline(500, 480);
assert.equal(sDone.phase, 'idle');
assert.equal(sDone.isFinished, true);

assert.equal(isCameraTurnedAway(0.1, 0.05), false);
assert.equal(isCameraTurnedAway(0.45, 0), true);
assert.equal(isCameraTurnedAway(0, -0.25), true);
assert.equal(isCameraTurnedAway(Math.PI * 2 + 0.05, 0), false);

const expectedTypes = [
  'tomat',
  'wortel',
  'sayur',
  'kol',
  'bawang-merah',
  'bawang-putih',
  'cabe',
  'beras',
  'gula',
  'minyak',
  'daging',
  'telur',
  'ikan',
  'jeruk',
  'semangka',
];
for (const pt of expectedTypes) {
  const sc = getGrabProduceScale(pt);
  assert.ok(sc > 0 && sc <= 1.2, `Expected positive palm scale for ${pt}`);
}
assert.equal(getGrabProduceScale('unknown-fallback'), 0.65);

assert.equal(MAX_BASKET_ITEMS, 7);
const slot0 = allocateBasketSlotIndex([], 7);
assert.deepEqual(slot0, { slotIndex: 0, evictSlotIndex: null });
const slotGap = allocateBasketSlotIndex([0, 2, 3], 7);
assert.deepEqual(slotGap, { slotIndex: 1, evictSlotIndex: null });
const slotFull = allocateBasketSlotIndex([0, 1, 2, 3, 4, 5, 6], 7);
assert.deepEqual(slotFull, { slotIndex: 0, evictSlotIndex: 0 });

const remReach = evaluateRemoveTimeline(80, REMOVE_ANIMATION_MS);
assert.equal(remReach.phase, 'reach-basket');
assert.equal(remReach.pullOut, false);
const remPull = evaluateRemoveTimeline(260, REMOVE_ANIMATION_MS);
assert.equal(remPull.phase, 'pull-out');
assert.equal(remPull.pullOut, true);
assert.equal(remPull.isFinished, false);
const remSettle = evaluateRemoveTimeline(410, REMOVE_ANIMATION_MS);
assert.equal(remSettle.phase, 'settle');
assert.equal(remSettle.isFinished, false);
const remDone = evaluateRemoveTimeline(REMOVE_ANIMATION_MS + 10, REMOVE_ANIMATION_MS);
assert.equal(remDone.phase, 'idle');
assert.equal(remDone.isFinished, true);

const smallStep = advanceFootstepAccumulator(0, 0.015, 0, 1000, 0);
assert.equal(smallStep.stepTriggered, false);
const triggerStep = advanceFootstepAccumulator(0.015, 0.04, smallStep.nextAccumulator, 1250, 0);
assert.equal(triggerStep.stepTriggered, true);
assert.equal(triggerStep.nextLastStepMs, 1250);
const tooSoonStep = advanceFootstepAccumulator(0.04, 0.08, 0, 1300, 1250);
assert.equal(tooSoonStep.stepTriggered, false);
const jumpReset = advanceFootstepAccumulator(0.05, 0.6, 0, 2000, 1250);
assert.equal(jumpReset.stepTriggered, true);
assert.equal(jumpReset.nextAccumulator, 0);

assert.deepEqual(resolveCorridorKeyAction('ArrowUp'), { type: 'walk', direction: 1 });
assert.deepEqual(resolveCorridorKeyAction('ArrowDown'), { type: 'walk', direction: -1 });
assert.deepEqual(resolveCorridorKeyAction('ArrowLeft'), { type: 'look', deltaYaw: 0.18 });
assert.deepEqual(resolveCorridorKeyAction('ArrowRight'), { type: 'look', deltaYaw: -0.18 });
assert.deepEqual(resolveCorridorKeyAction('q'), { type: 'look', deltaYaw: 0.18 });
assert.deepEqual(resolveCorridorKeyAction('E'), { type: 'look', deltaYaw: -0.18 });
assert.deepEqual(resolveCorridorKeyAction('R'), { type: 'recenter' });
assert.equal(resolveCorridorKeyAction('x'), null);

assert.ok(Math.abs(computeSteppedWalkProgress(0.2, 1) - 0.24) < 0.0001);
assert.ok(Math.abs(computeSteppedWalkProgress(0.2, -1) - 0.16) < 0.0001);
assert.equal(computeSteppedWalkProgress(0.97, 1), 0.98);
assert.equal(computeSteppedWalkProgress(0.02, -1), 0.015);

console.log('✓ All corridor interaction math checks passed');
