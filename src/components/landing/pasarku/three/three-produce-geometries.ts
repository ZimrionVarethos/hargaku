import * as THREE from 'three';

function displaceGeometry(
  geo: THREE.BufferGeometry,
  fn: (x: number, y: number, z: number, i: number) => [number, number, number]
) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const [nx, ny, nz] = fn(pos.getX(i), pos.getY(i), pos.getZ(i), i);
    pos.setXYZ(i, nx, ny, nz);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createTomatoGeo(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.056, 10, 8);
  return displaceGeometry(geo, (x, y, z) => {
    const angle = Math.atan2(z, x);
    const rib = 1 + Math.cos(angle * 5) * 0.065;
    const indent = y > 0.036 ? 0.78 : 1;
    return [x * rib, y * 0.78 * indent, z * rib];
  });
}

export function createOrangeGeo(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.052, 10, 8);
  return displaceGeometry(geo, (x, y, z, i) => {
    const dimple = 1 + Math.sin(i * 3.1) * 0.025;
    return [x * dimple, y * 0.88 * dimple, z * dimple];
  });
}

export function createOnionGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.001, -0.042),
    new THREE.Vector2(0.038, -0.034),
    new THREE.Vector2(0.048, -0.008),
    new THREE.Vector2(0.036, 0.022),
    new THREE.Vector2(0.014, 0.042),
    new THREE.Vector2(0.002, 0.058),
  ];
  return new THREE.LatheGeometry(pts, 9);
}

export function createCarrotGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.004, -0.115),
    new THREE.Vector2(0.016, -0.055),
    new THREE.Vector2(0.028, 0.015),
    new THREE.Vector2(0.034, 0.08),
    new THREE.Vector2(0.024, 0.098),
    new THREE.Vector2(0.001, 0.1),
  ];
  const geo = new THREE.LatheGeometry(pts, 8);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function createChiliGeo(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -0.08),
    new THREE.Vector3(0.008, 0.014, -0.03),
    new THREE.Vector3(0.018, 0.006, 0.035),
    new THREE.Vector3(0.005, -0.018, 0.088),
  ]);
  const geo = new THREE.TubeGeometry(curve, 8, 0.016, 6, false);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const uAlong = uv.getX(i);
    const vWrap = uv.getY(i);
    uv.setXY(i, vWrap, 1 - uAlong);

    const z = pos.getZ(i);
    const pt = curve.getPoint(Math.max(0, Math.min(1, uAlong)));
    const scale =
      uAlong < 0.12
        ? 0.36
        : uAlong < 0.22
          ? 0.72
          : Math.max(0.14, 1.05 * (1 - (uAlong - 0.2) * 0.95));

    const dx = pos.getX(i) - pt.x;
    const dy = pos.getY(i) - pt.y;
    pos.setXYZ(i, pt.x + dx * scale, pt.y + dy * scale, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createFishGeo(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 16, 10);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const sx = pos.getX(i);
    const sy = pos.getY(i);
    const sz = pos.getZ(i);

    let x = sx * 0.145;
    let y = sy * 0.038;
    let z = sz * 0.016;

    if (sx < -0.45) {
      const t = (-0.45 - sx) / 0.55;
      const flare = 0.26 + t * 1.15;
      y = sy * 0.038 * flare;
      z = sz * 0.016 * Math.max(0.1, 0.55 - t * 0.45);
      const absY = Math.abs(sy);
      x -= t * 0.012;
      if (t > 0.5 && absY < 0.55) {
        x += (1 - absY / 0.55) * 0.022;
      }
    } else if (sx > 0.55) {
      const h = (sx - 0.55) / 0.45;
      const taper = 1 - h * 0.45;
      y *= taper;
      z *= taper;
    }

    pos.setXYZ(i, x, y, z);
    const u = Math.max(0.02, Math.min(0.98, (x + 0.155) / 0.3));
    const v = Math.max(0.02, Math.min(0.98, 0.5 + y * 11.5));
    uv.setXY(i, u, v);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createMoundGeo(): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(0.32, 0.07, 1.0, 4, 2, 8);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (y > 0) {
      const mx = Math.cos((x / 0.16) * (Math.PI / 2));
      const mz = Math.cos((z / 0.5) * (Math.PI / 2));
      pos.setY(i, y + Math.max(0, mx * mz) * 0.065);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

export function createPotatoGeo(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(0.06, 1);
  return displaceGeometry(geo, (x, y, z, i) => {
    const lump = 1 + Math.sin(i * 1.7 + x * 24) * 0.14 + Math.cos(z * 21) * 0.1;
    return [x * 1.22 * lump, y * 0.84 * lump, z * 1.06 * lump];
  });
}

export function createCabbageGeo(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(0.112, 1);
  return displaceGeometry(geo, (x, y, z, i) => {
    const leaf = 1 + Math.sin(i * 2.3 + y * 14) * 0.08;
    return [x * 1.06 * leaf, y * 0.88 * leaf, z * 1.06 * leaf];
  });
}

export function createEggGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.001, -0.034),
    new THREE.Vector2(0.025, -0.024),
    new THREE.Vector2(0.028, -0.004),
    new THREE.Vector2(0.022, 0.018),
    new THREE.Vector2(0.001, 0.036),
  ];
  return new THREE.LatheGeometry(pts, 8);
}

export function createGreensBundleGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.001, -0.14),
    new THREE.Vector2(0.036, -0.135),
    new THREE.Vector2(0.024, -0.04),
    new THREE.Vector2(0.052, 0.04),
    new THREE.Vector2(0.072, 0.12),
    new THREE.Vector2(0.02, 0.15),
  ];
  const geo = new THREE.LatheGeometry(pts, 7);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function createOilBottleGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(0.055, 0),
    new THREE.Vector2(0.058, 0.16),
    new THREE.Vector2(0.025, 0.21),
    new THREE.Vector2(0.025, 0.24),
    new THREE.Vector2(0.028, 0.26),
    new THREE.Vector2(0.001, 0.26),
  ];
  return new THREE.LatheGeometry(pts, 9);
}

export function createSackGeo(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.001, -0.19),
    new THREE.Vector2(0.19, -0.18),
    new THREE.Vector2(0.21, -0.04),
    new THREE.Vector2(0.17, 0.1),
    new THREE.Vector2(0.07, 0.16),
    new THREE.Vector2(0.11, 0.21),
    new THREE.Vector2(0.001, 0.21),
  ];
  return new THREE.LatheGeometry(pts, 10);
}

export function createCrateGeo(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(0.34, 0.11, 0.46);
}

export function createBasinGeo(): THREE.BufferGeometry {
  return new THREE.CylinderGeometry(0.21, 0.15, 0.14, 12);
}
