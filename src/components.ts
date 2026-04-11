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
    /** Entity ID to track (0n for fixed point). */
    entityId: Types.u64,
    /** Fixed X coordinate when entityId is 0n. */
    fixedX: Types.f32,
    /** Fixed Y coordinate when entityId is 0n. */
    fixedY: Types.f32,
    /** Fixed Z coordinate when entityId is 0n. */
    fixedZ: Types.f32,
    /** 1 to copy target rotation (first-person mode), 0 for look-at only. */
    syncRotation: Types.u32,
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
    /** X coordinate of the orbit center point. */
    targetX: Types.f32,
    /** Y coordinate of the orbit center point. */
    targetY: Types.f32,
    /** Z coordinate of the orbit center point. */
    targetZ: Types.f32,
    /** Distance from the target point. */
    radius: Types.f32,
    /** Rotation speed in radians per second. */
    speed: Types.f32,
    /** Vertical angle in radians (0 = equator, π/2 = top). */
    elevation: Types.f32,
    /** 1 to continuously auto-rotate, 0 to keep current angle. */
    autoRotate: Types.u32,
    /** Current horizontal angle, managed by Camera3DExtensionSystem. */
    angle: Types.f32,
  },
});
