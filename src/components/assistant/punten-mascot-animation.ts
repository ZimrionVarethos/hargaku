import * as THREE from 'three';
import type { PuntenMood } from './PuntenMascotAvatar';

export interface PuntenMascotRig {
  root: THREE.Group;
  headPivot: THREE.Group;
  leftHand: THREE.Group;
  rightHand: THREE.Group;
  eyesNormalGroup: THREE.Group;
  eyesHappyGroup: THREE.Group;
  eyesOpenGroup: THREE.Group;
  eyesSurprisedGroup: THREE.Group;
  mouthArc: THREE.Mesh;
  leftPupil: THREE.Mesh;
  rightPupil: THREE.Mesh;
  thrusterRing: THREE.Mesh;
}

export function updatePuntenMascotMood(rig: PuntenMascotRig, mood: PuntenMood): void {
  rig.eyesNormalGroup.visible = mood === 'normal';
  rig.eyesHappyGroup.visible = mood === 'happy';
  rig.eyesOpenGroup.visible = mood === 'curious' || mood === 'thinking';
  rig.eyesSurprisedGroup.visible = mood === 'surprised';
  rig.mouthArc.visible = mood !== 'surprised';
}

export function updatePuntenMascotFrame(
  rig: PuntenMascotRig,
  timeSec: number,
  pointerX: number,
  pointerY: number,
  isHovered: boolean,
  mood: PuntenMood,
  reducedMotion: boolean
): void {
  if (reducedMotion) {
    rig.root.position.set(0, 0, 0);
    rig.headPivot.rotation.set(0.04, 0, 0);
    rig.leftHand.position.set(-1.15, -0.54, 0.42);
    rig.rightHand.position.set(1.15, -0.54, 0.42);
    rig.rightHand.rotation.set(0, 0, 0);
    return;
  }

  const floatAmp = isHovered ? 0.08 : 0.055;
  rig.root.position.y = Math.sin(timeSec * 2.2) * floatAmp;

  const targetYaw = pointerX * 0.4 + Math.sin(timeSec * 0.9) * 0.14;
  const targetPitch = -pointerY * 0.24 + (mood === 'thinking' ? -0.06 : 0.03);
  rig.headPivot.rotation.y += (targetYaw - rig.headPivot.rotation.y) * 0.1;
  rig.headPivot.rotation.x += (targetPitch - rig.headPivot.rotation.x) * 0.1;
  rig.headPivot.rotation.z =
    mood === 'thinking' ? Math.sin(timeSec * 1.6) * 0.08 : Math.sin(timeSec * 1.1) * 0.03;

  const blinkCycle = timeSec % 4.2;
  const blinkScale = blinkCycle > 4.02 ? Math.max(0.15, Math.abs(blinkCycle - 4.11) * 11) : 1;
  rig.leftPupil.scale.y = blinkScale;
  rig.rightPupil.scale.y = blinkScale;

  const waveSpeed = isHovered || mood === 'happy' ? 6.2 : 2.6;
  const waveLift = isHovered || mood === 'happy' ? 0.26 : 0.12;
  rig.rightHand.position.y = -0.44 + Math.sin(timeSec * waveSpeed) * 0.12 + waveLift;
  rig.rightHand.rotation.z = -0.25 + Math.sin(timeSec * waveSpeed) * 0.28;
  rig.leftHand.position.y = -0.56 + Math.cos(timeSec * 2.3) * 0.05;

  const thrusterMat = rig.thrusterRing.material as THREE.MeshStandardMaterial;
  thrusterMat.emissiveIntensity = 0.72 + Math.sin(timeSec * 4) * 0.25;
}

export function disposePuntenMascotTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      geometries.add(obj.geometry);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        materials.add(m);
      }
    }
  });

  for (const g of geometries) g.dispose();
  for (const m of materials) m.dispose();
}

