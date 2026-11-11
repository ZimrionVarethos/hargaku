export const BASE_CAMERA_YAW = Math.PI;
export const BASE_CAMERA_PITCH = -0.02;
export const MIN_PITCH_OFFSET = -0.5;
export const MAX_PITCH_OFFSET = 0.44;
export const DRAG_THRESHOLD_PX = 6;
export const GRAB_ANIMATION_MS = 620;
export const REMOVE_ANIMATION_MS = 460;
export const MAX_BASKET_ITEMS = 7;
export const STEP_PROGRESS_STRIDE = 1 / 32;
export const MIN_STEP_INTERVAL_MS = 155;
export const WALK_ARROW_STEP_PROGRESS = 0.04;
export const ARROW_LOOK_STEP_RAD = 0.18;

export type CorridorKeyAction =
  | { type: 'walk'; direction: 1 | -1 }
  | { type: 'look'; deltaYaw: number }
  | { type: 'recenter' };

export interface GrabTimelineState {
  phase: 'reach' | 'carry' | 'drop' | 'idle';
  reachAlpha: number;
  carryAlpha: number;
  settleAlpha: number;
  carryProduce: boolean;
  triggerBasketDrop: boolean;
  isFinished: boolean;
}

export interface RemoveTimelineState {
  phase: 'reach-basket' | 'pull-out' | 'settle' | 'idle';
  reachAlpha: number;
  pullAlpha: number;
  settleAlpha: number;
  pullOut: boolean;
  isFinished: boolean;
}

const PALM_PRODUCE_SCALE: Record<string, number> = {
  tomat: 0.72,
  wortel: 0.48,
  sayur: 0.42,
  kol: 0.36,
  'bawang-merah': 0.85,
  'bawang-putih': 0.85,
  cabe: 0.62,
  beras: 0.24,
  gula: 0.24,
  minyak: 0.3,
  daging: 0.58,
  telur: 0.95,
  ikan: 0.38,
  jeruk: 0.72,
  semangka: 0.46,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function clampCorridorPitch(pitchOffset: number): number {
  return clamp(pitchOffset, MIN_PITCH_OFFSET, MAX_PITCH_OFFSET);
}

export function applyLookDelta(
  yawOffset: number,
  pitchOffset: number,
  deltaYaw: number,
  deltaPitch: number
): { yawOffset: number; pitchOffset: number } {
  return {
    yawOffset: yawOffset + deltaYaw,
    pitchOffset: clampCorridorPitch(pitchOffset + deltaPitch),
  };
}

export function isPointerDragGesture(
  dx: number,
  dy: number,
  thresholdPx = DRAG_THRESHOLD_PX
): boolean {
  return Math.hypot(dx, dy) > thresholdPx;
}

export function clampCameraSpaceReachTarget(
  localX: number,
  localY: number
): { reachX: number; reachY: number } {
  return {
    reachX: clamp(localX * 0.24, -0.14, 0.28),
    reachY: clamp(localY * 0.2, -0.18, 0.12),
  };
}

export function evaluateGrabTimeline(
  elapsedMs: number,
  durationMs = GRAB_ANIMATION_MS
): GrabTimelineState {
  if (elapsedMs >= durationMs || elapsedMs < 0) {
    return {
      phase: 'idle',
      reachAlpha: 0,
      carryAlpha: 0,
      settleAlpha: 0,
      carryProduce: false,
      triggerBasketDrop: elapsedMs >= durationMs,
      isFinished: true,
    };
  }

  const norm = clamp(elapsedMs / durationMs, 0, 1);

  if (norm < 0.4) {
    const t = norm / 0.4;
    return {
      phase: 'reach',
      reachAlpha: 1 - (1 - t) * (1 - t),
      carryAlpha: 0,
      settleAlpha: 0,
      carryProduce: false,
      triggerBasketDrop: false,
      isFinished: false,
    };
  }

  if (norm < 0.84) {
    const t = (norm - 0.4) / 0.44;
    const smooth = t * t * (3 - 2 * t);
    return {
      phase: 'carry',
      reachAlpha: 1,
      carryAlpha: smooth,
      settleAlpha: 0,
      carryProduce: true,
      triggerBasketDrop: false,
      isFinished: false,
    };
  }

  const t = (norm - 0.84) / 0.16;
  return {
    phase: 'drop',
    reachAlpha: 1,
    carryAlpha: 1,
    settleAlpha: t * t * (3 - 2 * t),
    carryProduce: false,
    triggerBasketDrop: true,
    isFinished: false,
  };
}

export function isCameraTurnedAway(yawOffset: number, pitchOffset: number): boolean {
  const twoPi = Math.PI * 2;
  let wrappedYaw = ((yawOffset % twoPi) + twoPi) % twoPi;
  if (wrappedYaw > Math.PI) wrappedYaw -= twoPi;
  return Math.abs(wrappedYaw) > 0.32 || Math.abs(pitchOffset) > 0.18;
}

export function getGrabProduceScale(produceType: string): number {
  return PALM_PRODUCE_SCALE[produceType] ?? 0.65;
}

export function allocateBasketSlotIndex(
  occupiedSlots: readonly number[],
  capacity = MAX_BASKET_ITEMS
): { slotIndex: number; evictSlotIndex: number | null } {
  const used = new Set(occupiedSlots);
  for (let i = 0; i < capacity; i++) {
    if (!used.has(i)) {
      return { slotIndex: i, evictSlotIndex: null };
    }
  }
  const evict = occupiedSlots[0] ?? 0;
  return { slotIndex: evict, evictSlotIndex: evict };
}

export function evaluateRemoveTimeline(
  elapsedMs: number,
  durationMs = REMOVE_ANIMATION_MS
): RemoveTimelineState {
  if (elapsedMs >= durationMs || elapsedMs < 0) {
    return {
      phase: 'idle',
      reachAlpha: 0,
      pullAlpha: 0,
      settleAlpha: 0,
      pullOut: false,
      isFinished: true,
    };
  }

  const norm = clamp(elapsedMs / durationMs, 0, 1);

  if (norm < 0.36) {
    const t = norm / 0.36;
    return {
      phase: 'reach-basket',
      reachAlpha: 1 - (1 - t) * (1 - t),
      pullAlpha: 0,
      settleAlpha: 0,
      pullOut: false,
      isFinished: false,
    };
  }

  if (norm < 0.82) {
    const t = (norm - 0.36) / 0.46;
    return {
      phase: 'pull-out',
      reachAlpha: 1,
      pullAlpha: t * t * (3 - 2 * t),
      settleAlpha: 0,
      pullOut: true,
      isFinished: false,
    };
  }

  const t = (norm - 0.82) / 0.18;
  return {
    phase: 'settle',
    reachAlpha: 1,
    pullAlpha: 1,
    settleAlpha: t * t * (3 - 2 * t),
    pullOut: false,
    isFinished: false,
  };
}

export function advanceFootstepAccumulator(
  prevProgress: number,
  nextProgress: number,
  accumulatedDelta: number,
  nowMs: number,
  lastStepMs: number
): { stepTriggered: boolean; nextAccumulator: number; nextLastStepMs: number } {
  const rawDelta = Math.abs(nextProgress - prevProgress);
  if (rawDelta < 0.0005) {
    return {
      stepTriggered: false,
      nextAccumulator: accumulatedDelta,
      nextLastStepMs: lastStepMs,
    };
  }

  const canPlay = nowMs - lastStepMs >= MIN_STEP_INTERVAL_MS;
  if (rawDelta >= 0.25) {
    return {
      stepTriggered: canPlay,
      nextAccumulator: 0,
      nextLastStepMs: canPlay ? nowMs : lastStepMs,
    };
  }

  const nextAcc = accumulatedDelta + rawDelta;
  if (nextAcc >= STEP_PROGRESS_STRIDE) {
    if (canPlay) {
      return {
        stepTriggered: true,
        nextAccumulator: nextAcc % STEP_PROGRESS_STRIDE,
        nextLastStepMs: nowMs,
      };
    }
    return {
      stepTriggered: false,
      nextAccumulator: STEP_PROGRESS_STRIDE,
      nextLastStepMs: lastStepMs,
    };
  }

  return {
    stepTriggered: false,
    nextAccumulator: nextAcc,
    nextLastStepMs: lastStepMs,
  };
}

export function resolveCorridorKeyAction(key: string): CorridorKeyAction | null {
  if (key === 'ArrowUp') return { type: 'walk', direction: 1 };
  if (key === 'ArrowDown') return { type: 'walk', direction: -1 };
  if (key === 'ArrowLeft' || key === 'q' || key === 'Q') {
    return { type: 'look', deltaYaw: ARROW_LOOK_STEP_RAD };
  }
  if (key === 'ArrowRight' || key === 'e' || key === 'E') {
    return { type: 'look', deltaYaw: -ARROW_LOOK_STEP_RAD };
  }
  if (key === 'r' || key === 'R') return { type: 'recenter' };
  return null;
}

export function computeSteppedWalkProgress(
  currentWalkProgress: number,
  direction: 1 | -1,
  stepDelta = WALK_ARROW_STEP_PROGRESS
): number {
  return clamp(currentWalkProgress + direction * stepDelta, 0.015, 0.98);
}
