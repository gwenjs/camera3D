/**
 * @file createCamera3DHandle — factory for Camera3DHandle.
 *
 * Mutates ECS components directly. Changes take effect on the next
 * Camera3DExtensionSystem + CameraSystem tick.
 */

import type { GwenEngine, EntityId } from "@gwenjs/core";
import type { GwenLogger } from "@gwenjs/core";
import {
  Camera,
  FollowTarget,
  CameraBounds,
  CameraShake,
  CameraPath,
  CameraErrorCodes,
  CameraViewportNotFoundError,
  CameraEmptyPathError,
  cameraViewportMap,
  cameraPathStore,
} from "@gwenjs/camera-core";
import type { Vec3 } from "@gwenjs/math";
import { LookAtTarget, OrbitBehavior } from "./components.js";
import type { Camera3DHandle, Box } from "./types.js";

/**
 * Create a handle that controls the 3D camera entity `id`.
 *
 * @param id     - The camera entity id.
 * @param engine - The engine instance (for viewport validation and logging).
 * @param log    - A scoped child logger.
 */
export function createCamera3DHandle(
  id: EntityId,
  engine: GwenEngine,
  log: GwenLogger,
): Camera3DHandle {
  function getViewports() {
    return engine.inject("viewportManager");
  }

  return {
    // ── Shared behaviours ──────────────────────────────────────────────────

    follow(targetId, opts) {
      cameraPathStore.delete(id);
      engine.removeComponent(id, LookAtTarget);
      engine.removeComponent(id, OrbitBehavior);
      engine.addComponent(id, FollowTarget, {
        entityId: targetId,
        lerp: opts?.lerp ?? 0.1,
        offsetX: opts?.offset?.x ?? 0,
        offsetY: opts?.offset?.y ?? 0,
        offsetZ: opts?.offset?.z ?? 0,
      });
    },

    setPosition(x, y, z) {
      engine.removeComponent(id, FollowTarget);
      engine.removeComponent(id, LookAtTarget);
      engine.removeComponent(id, OrbitBehavior);
      cameraPathStore.delete(id);
      const cam = engine.getComponent(id, Camera)!;
      engine.addComponent(id, Camera, { ...cam, x, y, z });
    },

    playPath(waypoints, opts) {
      if (waypoints.length === 0) {
        const err = new CameraEmptyPathError();
        log.error(`[${CameraErrorCodes.EMPTY_PATH}] ${err.message} — ${err.hint}`);
        throw err;
      }
      engine.removeComponent(id, FollowTarget);
      cameraPathStore.set(id, { waypoints, opts: opts ?? {}, elapsed: 0 });
      engine.addComponent(id, CameraPath, { index: 0, progress: 0 });
    },

    setBounds(box: Box | null) {
      if (box === null) {
        engine.removeComponent(id, CameraBounds);
      } else {
        engine.addComponent(id, CameraBounds, {
          minX: box.x,
          minY: box.y,
          minZ: box.z,
          maxX: box.x + box.width,
          maxY: box.y + box.height,
          maxZ: box.z + box.depth,
        });
      }
    },

    setViewport(viewportId) {
      const viewports = getViewports();
      if (!viewports.get(viewportId)) {
        const err = new CameraViewportNotFoundError(viewportId);
        log.error(`[${CameraErrorCodes.VIEWPORT_NOT_FOUND}] ${err.message} — ${err.hint}`);
        throw err;
      }
      cameraViewportMap.set(id, viewportId);
    },

    shake(intensity) {
      const current = engine.getComponent(id, CameraShake);
      if (!current || current.trauma === 0) {
        engine.addComponent(id, CameraShake, {
          trauma: Math.min(1, intensity),
          decay: 0.8,
          maxX: 10,
          maxY: 10,
        });
      } else {
        engine.addComponent(id, CameraShake, {
          ...current,
          trauma: Math.min(1, current.trauma + intensity),
        });
      }
    },

    activate() {
      const cam = engine.getComponent(id, Camera)!;
      engine.addComponent(id, Camera, { ...cam, active: 1 });
    },
    deactivate() {
      const cam = engine.getComponent(id, Camera)!;
      engine.addComponent(id, Camera, { ...cam, active: 0 });
    },

    // ── 3D-specific behaviours ─────────────────────────────────────────────

    followThirdPerson(targetId, opts) {
      engine.removeComponent(id, OrbitBehavior);
      const offset = opts?.offset ?? { x: 0, y: 3, z: -6 };
      engine.addComponent(id, FollowTarget, {
        entityId: targetId,
        lerp: opts?.lerp ?? 0.08,
        offsetX: offset.x,
        offsetY: offset.y,
        offsetZ: offset.z,
      });
      if (opts?.lookAt !== undefined) {
        const lookAt = opts.lookAt;
        if (typeof lookAt === "bigint") {
          engine.addComponent(id, LookAtTarget, {
            entityId: lookAt,
            fixedX: 0,
            fixedY: 0,
            fixedZ: 0,
            syncRotation: 0,
          });
        } else {
          engine.addComponent(id, LookAtTarget, {
            entityId: 0n,
            fixedX: (lookAt as Vec3).x,
            fixedY: (lookAt as Vec3).y,
            fixedZ: (lookAt as Vec3).z,
            syncRotation: 0,
          });
        }
      }
    },

    firstPerson(targetId, opts) {
      engine.removeComponent(id, OrbitBehavior);
      const eyeOffset = opts?.eyeOffset ?? { x: 0, y: 1.7, z: 0 };
      engine.addComponent(id, FollowTarget, {
        entityId: targetId,
        lerp: 1, // instant
        offsetX: eyeOffset.x,
        offsetY: eyeOffset.y,
        offsetZ: eyeOffset.z,
      });
      engine.addComponent(id, LookAtTarget, {
        entityId: targetId,
        fixedX: 0,
        fixedY: 0,
        fixedZ: 0,
        syncRotation: 1,
      });
    },

    orbit(opts) {
      engine.removeComponent(id, FollowTarget);
      engine.removeComponent(id, LookAtTarget);
      cameraPathStore.delete(id);
      engine.addComponent(id, OrbitBehavior, {
        targetX: opts.target.x,
        targetY: opts.target.y,
        targetZ: opts.target.z,
        radius: opts.radius,
        speed: opts.speed,
        elevation: opts.elevation,
        autoRotate: opts.autoRotate ? 1 : 0,
        angle: 0,
      });
    },

    lookAt(target) {
      engine.removeComponent(id, OrbitBehavior);
      if (typeof target === "bigint") {
        engine.addComponent(id, LookAtTarget, {
          entityId: target,
          fixedX: 0,
          fixedY: 0,
          fixedZ: 0,
          syncRotation: 0,
        });
      } else {
        engine.addComponent(id, LookAtTarget, {
          entityId: 0n,
          fixedX: (target as Vec3).x,
          fixedY: (target as Vec3).y,
          fixedZ: (target as Vec3).z,
          syncRotation: 0,
        });
      }
    },

    setRotation(x, y, z) {
      const cam = engine.getComponent(id, Camera)!;
      engine.addComponent(id, Camera, { ...cam, rotX: x, rotY: y, rotZ: z });
    },

    setFov(fov) {
      const cam = engine.getComponent(id, Camera)!;
      engine.addComponent(id, Camera, { ...cam, fov });
    },
  };
}
