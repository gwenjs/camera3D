// src/components.ts
/**
 * @file 3D-specific ECS components.
 *
 * `LookAtTarget` and `OrbitBehavior` extend the camera pipeline.
 * They are applied by `Camera3DExtensionSystem` (onBeforeUpdate) which writes
 * the computed euler angles into `Camera.rotX/Y/Z` before `CameraSystem` reads them.
 */

import { defineComponent, Types } from "@gwenjs/core";

/**
 * Orient a camera to face a target entity or a fixed world point.
 *
 * - When `entityId > 0n`: look at the entity's Camera position each frame.
 * - When `entityId === 0n`: look at the fixed point `(fixedX, fixedY, fixedZ)`.
 * - When `syncRotation === 1`: copy the target entity's rotation exactly (first-person mode).
 */
export const LookAtTarget = defineComponent({
  name: "LookAtTarget",
  schema: {
    entityId: Types.u64, // 0n = use fixed position
    fixedX: Types.f32,
    fixedY: Types.f32,
    fixedZ: Types.f32,
    syncRotation: Types.u32, // 1 = copy target rotation (first-person)
  },
});

/**
 * Orbit behaviour — camera circles a fixed world point.
 *
 * `Camera3DExtensionSystem` advances `angle` by `speed * dt` each frame when
 * `autoRotate === 1`, then writes the computed position into `Camera.x/y/z`.
 */
export const OrbitBehavior = defineComponent({
  name: "OrbitBehavior",
  schema: {
    targetX: Types.f32,
    targetY: Types.f32,
    targetZ: Types.f32,
    radius: Types.f32,
    speed: Types.f32, // radians per second
    elevation: Types.f32, // vertical angle in radians
    autoRotate: Types.u32, // 1 = advance angle each frame
    angle: Types.f32, // current horizontal angle, managed by the system
  },
});
