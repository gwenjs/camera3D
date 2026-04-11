// src/camera3d-extension-system.ts
/**
 * @file Camera3DExtensionSystem — applies look-at and orbit transforms.
 *
 * Runs in `onBeforeUpdate` so Camera.rotX/Y/Z and Camera.x/y/z are ready
 * when CameraSystem runs in `onAfterUpdate`.
 *
 * Look-at math:
 *   direction = normalize(target - camera_position)
 *   rotY = atan2(direction.x, direction.z)
 *   rotX = -asin(direction.y)
 *
 * Orbit math (spherical coordinates):
 *   x = target.x + radius * sin(angle) * cos(elevation)
 *   y = target.y + radius * sin(elevation)
 *   z = target.z + radius * cos(angle) * cos(elevation)
 */

import { defineSystem, onBeforeUpdate, useQuery } from "@gwenjs/core/system";
import { useEngine } from "@gwenjs/core";
import type { EntityId } from "@gwenjs/core";
import { Camera, CameraPath, cameraPathStore } from "@gwenjs/camera-core";
import { Vec3 } from "@gwenjs/math";
import { LookAtTarget, OrbitBehavior } from "./components";

function normalize(x: number, y: number, z: number): [number, number, number] {
  const len = Math.sqrt(x * x + y * y + z * z);
  if (len === 0) return [0, 0, 1];
  return [x / len, y / len, z / len];
}

/**
 * 3D camera extension system.
 *
 * Processes `OrbitBehavior`, `LookAtTarget`, and camera path waypoint look-at transformations
 * before the main `CameraSystem` runs. Computes rotation and position for orbiting and
 * look-at cameras each frame.
 */
export const Camera3DExtensionSystem = defineSystem("Camera3DExtensionSystem", () => {
  const engine = useEngine();
  const orbitQuery = useQuery([Camera, OrbitBehavior]);
  const lookAtQuery = useQuery([Camera, LookAtTarget]);
  const pathQuery = useQuery([Camera, CameraPath]);

  onBeforeUpdate((dt) => {
    const dtSeconds = dt / 1000;

    // ── OrbitBehavior ────────────────────────────────────────────────────────

    for (const entity of orbitQuery) {
      const id = entity.id;
      const orbit = engine.getComponent(id, OrbitBehavior)!;
      const cam = engine.getComponent(id, Camera)!;

      const newAngle = orbit.autoRotate === 1 ? orbit.angle + orbit.speed * dtSeconds : orbit.angle;

      const x = orbit.targetX + orbit.radius * Math.sin(newAngle) * Math.cos(orbit.elevation);
      const y = orbit.targetY + orbit.radius * Math.sin(orbit.elevation);
      const z = orbit.targetZ + orbit.radius * Math.cos(newAngle) * Math.cos(orbit.elevation);

      // Look at the orbit target
      const dx = orbit.targetX - x;
      const dy = orbit.targetY - y;
      const dz = orbit.targetZ - z;
      const [nx, ny, nz] = normalize(dx, dy, dz);
      const rotY = Math.atan2(nx, nz);
      const rotX = -Math.asin(ny);

      engine.addComponent(id, OrbitBehavior, { ...orbit, angle: newAngle });
      engine.addComponent(id, Camera, { ...cam, x, y, z, rotX, rotY });
    }

    // ── LookAtTarget ─────────────────────────────────────────────────────────

    for (const entity of lookAtQuery) {
      const id = entity.id;
      const lookAt = engine.getComponent(id, LookAtTarget)!;
      const cam = engine.getComponent(id, Camera)!;

      let tx: number;
      let ty: number;
      let tz: number;

      if (lookAt.entityId > 0n) {
        // u64 fields are typed as bigint — cast to EntityId for getComponent
        const targetEntityId = lookAt.entityId as EntityId;
        if (lookAt.syncRotation === 1) {
          // first-person: copy rotation directly from target entity
          const targetCam = engine.getComponent(targetEntityId, Camera);
          if (!targetCam) continue;
          engine.addComponent(id, Camera, {
            ...cam,
            rotX: targetCam.rotX,
            rotY: targetCam.rotY,
            rotZ: targetCam.rotZ,
          });
          continue;
        }
        const targetCam = engine.getComponent(targetEntityId, Camera);
        if (!targetCam) continue;
        tx = targetCam.x;
        ty = targetCam.y;
        tz = targetCam.z;
      } else {
        tx = lookAt.fixedX;
        ty = lookAt.fixedY;
        tz = lookAt.fixedZ;
      }

      const dx = tx - cam.x;
      const dy = ty - cam.y;
      const dz = tz - cam.z;
      const [nx, ny, nz] = normalize(dx, dy, dz);
      engine.addComponent(id, Camera, {
        ...cam,
        rotY: Math.atan2(nx, nz),
        rotX: -Math.asin(ny),
      });
    }

    // ── CameraPath — 3D waypoint look-at and fov ─────────────────────────────

    for (const entity of pathQuery) {
      const id = entity.id;
      const pathData = cameraPathStore.get(id);
      if (!pathData) continue;

      const pathComp = engine.getComponent(id, CameraPath)!;
      const wp = pathData.waypoints[pathComp.index as number];
      if (!wp) continue;

      // Read current camera state once; update incrementally via spread
      let cam = engine.getComponent(id, Camera)!;

      // Apply fov interpolation if the waypoint declares one
      if (wp.fov !== undefined) {
        cam = { ...cam, fov: wp.fov };
        engine.addComponent(id, Camera, cam);
      }

      // Apply look-at if the waypoint declares one
      if (wp.lookAt !== undefined) {
        const target = wp.lookAt;
        let tx: number;
        let ty: number;
        let tz: number;

        if (typeof target === "bigint") {
          const targetCam = engine.getComponent(target, Camera);
          if (!targetCam) continue;
          tx = targetCam.x;
          ty = targetCam.y;
          tz = targetCam.z;
        } else {
          tx = (target as Vec3).x;
          ty = (target as Vec3).y;
          tz = (target as Vec3).z;
        }

        const dx = tx - cam.x;
        const dy = ty - cam.y;
        const dz = tz - cam.z;
        const [nx, ny, nz] = normalize(dx, dy, dz);
        engine.addComponent(id, Camera, {
          ...cam,
          rotY: Math.atan2(nx, nz),
          rotX: -Math.asin(ny),
        });
      }
    }
  });
});
