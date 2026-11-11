import * as THREE from 'three';
import type { PuntenMood } from './PuntenMascotAvatar';
import {
  type PuntenMascotRig,
  updatePuntenMascotMood,
} from './punten-mascot-animation';

function buildRoundedRectGeometry(w: number, h: number, r: number, depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 3,
    curveSegments: 10,
  });
}

function createEarCup(
  side: -1 | 1,
  creamMat: THREE.Material,
  darkMat: THREE.Material,
  padMat: THREE.Material
): THREE.Group {
  const cup = new THREE.Group();
  const outerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 24), darkMat);
  outerRing.rotation.z = Math.PI / 2;
  cup.add(outerRing);

  const trimRing = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.17, 24), creamMat);
  trimRing.rotation.z = Math.PI / 2;
  cup.add(trimRing);

  const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), padMat);
  cushion.scale.set(0.45, 1, 1);
  cushion.position.x = side * 0.08;
  cup.add(cushion);

  cup.position.set(side * 1.01, -0.02, 0.05);
  return cup;
}

function createHand(side: -1 | 1, bodyMat: THREE.Material, darkMat: THREE.Material): THREE.Group {
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 14), bodyMat);
  palm.scale.set(0.92, 1.12, 0.78);
  hand.add(palm);

  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.08, 16), darkMat);
  cuff.position.set(0, -0.14, 0);
  hand.add(cuff);

  hand.position.set(side * 1.15, -0.54, 0.42);
  return hand;
}

export function createPuntenMascotGroup(initialMood: PuntenMood): PuntenMascotRig {
  const root = new THREE.Group();
  const headPivot = new THREE.Group();
  root.add(headPivot);

  const ceramicMat = new THREE.MeshStandardMaterial({ color: '#F8F2EB', roughness: 0.34, metalness: 0.05 });
  const warmTanMat = new THREE.MeshStandardMaterial({ color: '#D9C9B3', roughness: 0.4, metalness: 0.18 });
  const forestDarkMat = new THREE.MeshStandardMaterial({ color: '#123B2B', roughness: 0.36, metalness: 0.1 });
  const visorMat = new THREE.MeshStandardMaterial({ color: '#0D291E', roughness: 0.14, metalness: 0.22 });
  const chiliMat = new THREE.MeshStandardMaterial({ color: '#B52D19', roughness: 0.36, metalness: 0.05 });
  const earPadMat = new THREE.MeshStandardMaterial({ color: '#D9481E', roughness: 0.32, metalness: 0.08 });
  const eyeGlowMat = new THREE.MeshStandardMaterial({
    color: '#6EE7A0',
    emissive: '#34D399',
    emissiveIntensity: 1.45,
    roughness: 0.18,
  });
  const thrusterMat = new THREE.MeshStandardMaterial({
    color: '#FEF3C7',
    emissive: '#F59E0B',
    emissiveIntensity: 0.9,
    roughness: 0.25,
  });

  const headBody = new THREE.Mesh(new THREE.SphereGeometry(0.95, 34, 26), ceramicMat);
  headBody.scale.set(1.06, 0.85, 0.88);
  headPivot.add(headBody);

  const thrusterRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 12, 28), thrusterMat);
  thrusterRing.rotation.x = Math.PI / 2;
  thrusterRing.position.set(0, -0.77, 0);
  headPivot.add(thrusterRing);

  const rearVentLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.18, 6, 10), eyeGlowMat);
  rearVentLeft.rotation.z = Math.PI / 2;
  rearVentLeft.position.set(-0.2, -0.1, -0.82);
  headPivot.add(rearVentLeft);

  const rearVentRight = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.18, 6, 10), thrusterMat);
  rearVentRight.rotation.z = Math.PI / 2;
  rearVentRight.position.set(0.2, -0.1, -0.82);
  headPivot.add(rearVentRight);

  const visorMesh = new THREE.Mesh(buildRoundedRectGeometry(1.18, 0.72, 0.24, 0.09), visorMat);
  visorMesh.position.set(0, -0.05, 0.73);
  headPivot.add(visorMesh);

  const visorRimMesh = new THREE.Mesh(buildRoundedRectGeometry(1.26, 0.8, 0.27, 0.06), forestDarkMat);
  visorRimMesh.position.set(0, -0.05, 0.71);
  headPivot.add(visorRimMesh);

  const eyesContainer = new THREE.Group();
  eyesContainer.position.set(0, -0.04, 0.885);
  headPivot.add(eyesContainer);

  const eyesNormalGroup = new THREE.Group();
  const arcGeo = new THREE.TorusGeometry(0.11, 0.03, 12, 20, Math.PI);
  const leftArc = new THREE.Mesh(arcGeo, eyeGlowMat);
  leftArc.position.set(-0.26, 0.04, 0);
  const rightArc = new THREE.Mesh(arcGeo, eyeGlowMat);
  rightArc.position.set(0.26, 0.04, 0);
  eyesNormalGroup.add(leftArc, rightArc);
  eyesContainer.add(eyesNormalGroup);

  const eyesHappyGroup = new THREE.Group();
  const chevGeo = new THREE.CapsuleGeometry(0.026, 0.13, 6, 10);
  const buildChev = (dir: -1 | 1) => {
    const g = new THREE.Group();
    const topBar = new THREE.Mesh(chevGeo, eyeGlowMat);
    topBar.rotation.z = dir * -0.92;
    topBar.position.set(0, 0.05, 0);
    const botBar = new THREE.Mesh(chevGeo, eyeGlowMat);
    botBar.rotation.z = dir * 0.92;
    botBar.position.set(0, -0.04, 0);
    g.add(topBar, botBar);
    return g;
  };
  const leftChev = buildChev(-1);
  leftChev.position.set(-0.27, 0.06, 0);
  const rightChev = buildChev(1);
  rightChev.position.set(0.27, 0.06, 0);
  eyesHappyGroup.add(leftChev, rightChev);
  eyesContainer.add(eyesHappyGroup);

  const eyesOpenGroup = new THREE.Group();
  const pupilGeo = new THREE.CapsuleGeometry(0.058, 0.09, 8, 14);
  const leftPupil = new THREE.Mesh(pupilGeo, eyeGlowMat);
  leftPupil.position.set(-0.25, 0.06, 0);
  const rightPupil = new THREE.Mesh(pupilGeo, eyeGlowMat);
  rightPupil.position.set(0.25, 0.06, 0);
  eyesOpenGroup.add(leftPupil, rightPupil);
  eyesContainer.add(eyesOpenGroup);

  const eyesSurprisedGroup = new THREE.Group();
  const oGeo = new THREE.TorusGeometry(0.095, 0.028, 12, 22);
  const leftO = new THREE.Mesh(oGeo, eyeGlowMat);
  leftO.position.set(-0.25, 0.06, 0);
  const rightO = new THREE.Mesh(oGeo, eyeGlowMat);
  rightO.position.set(0.25, 0.06, 0);
  eyesSurprisedGroup.add(leftO, rightO);
  eyesContainer.add(eyesSurprisedGroup);

  const mouthArc = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 18, Math.PI), eyeGlowMat);
  mouthArc.rotation.z = Math.PI;
  mouthArc.position.set(0, -0.1, 0);
  eyesContainer.add(mouthArc);

  const hatGroup = new THREE.Group();
  hatGroup.position.set(0, 0.34, 0.02);
  hatGroup.rotation.x = 0.08;
  headPivot.add(hatGroup);

  const slices = 8;
  const sliceAngle = (Math.PI * 2) / slices;
  for (let i = 0; i < slices; i++) {
    const mat = i % 2 === 0 ? chiliMat : ceramicMat;
    const wedge = new THREE.Mesh(
      new THREE.SphereGeometry(1.09, 12, 12, i * sliceAngle, sliceAngle, 0, Math.PI * 0.44),
      mat
    );
    wedge.scale.set(1.06, 0.72, 0.96);
    hatGroup.add(wedge);

    const midAngle = i * sliceAngle + sliceAngle * 0.5;
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), mat);
    lobe.scale.set(1.15, 0.78, 0.9);
    lobe.position.set(Math.sin(midAngle) * 1.03, 0.16, Math.cos(midAngle) * 0.93);
    hatGroup.add(lobe);
  }

  const brimBand = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.055, 12, 32), forestDarkMat);
  brimBand.rotation.x = Math.PI / 2;
  brimBand.scale.set(1.08, 0.96, 1);
  brimBand.position.set(0, 0.19, 0);
  hatGroup.add(brimBand);

  const hatCrown = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), forestDarkMat);
  hatCrown.scale.set(1.1, 0.52, 1.1);
  hatCrown.position.set(0, 0.77, 0);
  hatGroup.add(hatCrown);

  const headsetBand = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.04, 10, 28, Math.PI), forestDarkMat);
  headsetBand.position.set(0, 0.05, 0.04);
  headPivot.add(headsetBand);

  headPivot.add(createEarCup(-1, warmTanMat, forestDarkMat, earPadMat));
  headPivot.add(createEarCup(1, warmTanMat, forestDarkMat, earPadMat));

  const boomCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.98, -0.14, 0.15),
    new THREE.Vector3(0.96, -0.45, 0.54),
    new THREE.Vector3(0.62, -0.62, 0.8),
    new THREE.Vector3(0.22, -0.6, 0.87),
  ]);
  const boomMesh = new THREE.Mesh(new THREE.TubeGeometry(boomCurve, 18, 0.032, 8, false), forestDarkMat);
  headPivot.add(boomMesh);

  const micTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.07, 8, 12), chiliMat);
  micTip.rotation.z = Math.PI / 2;
  micTip.position.set(0.17, -0.6, 0.87);
  headPivot.add(micTip);

  const leftHand = createHand(-1, ceramicMat, forestDarkMat);
  const rightHand = createHand(1, ceramicMat, forestDarkMat);
  root.add(leftHand, rightHand);

  const rig: PuntenMascotRig = {
    root,
    headPivot,
    leftHand,
    rightHand,
    eyesNormalGroup,
    eyesHappyGroup,
    eyesOpenGroup,
    eyesSurprisedGroup,
    mouthArc,
    leftPupil,
    rightPupil,
    thrusterRing,
  };
  updatePuntenMascotMood(rig, initialMood);
  return rig;
}
