// src/types.ts
/**
 * @file Public types for @gwenjs/camera3d.
 */

import type { Vec3 } from "@gwenjs/math";
import type { EntityId } from "@gwenjs/core";
import type { CameraWaypoint, PathOpts } from "@gwenjs/camera-core";

/** Box bounds in world coordinates. */
export interface Box {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

/** Options accepted by `use3DCamera()`. */
export interface Use3DCameraOpts {
  /** Viewport id to target. @default 'main' */
  viewport?: string;
  /** Camera priority for conflict resolution. @default 0 */
  priority?: number;
  /** Initial position. @default { x: 0, y: 0, z: 0 } */
  position?: Vec3;
  /** Projection configuration. @default perspective, fov = Math.PI/3, near = 0.1, far = 1000 */
  projection?: {
    type: "perspective" | "orthographic";
    /** Vertical field of view in radians. Perspective only. @default Math.PI / 3 */
    fov?: number;
    /** Orthographic zoom. @default 1 */
    zoom?: number;
    near?: number;
    far?: number;
  };
}

/**
 * Handle returned by `use3DCamera()`.
 *
 * All methods are safe to call from any lifecycle callback.
 */
export interface Camera3DHandle {
  // ── Shared behaviours (same surface as Camera2DHandle) ────────────────────

  /**
   * Follow an entity. Removes any active CameraPath.
   * @param opts.lerp   - Smoothing factor 0–1. 1 = instant. @default 0.1
   * @param opts.offset - World-space offset applied after following.
   */
  follow(targetId: EntityId, opts?: { lerp?: number; offset?: Vec3 }): void;

  /** Move camera to an absolute world position immediately. Removes follow and path. */
  setPosition(x: number, y: number, z: number): void;

  /**
   * Start a travelling path.
   * @throws {CameraEmptyPathError} if `waypoints` is empty. Logs `error` before throwing.
   */
  playPath(waypoints: CameraWaypoint[], opts?: PathOpts): void;

  /** Set or clear world-space box bounds. Pass `null` to remove. */
  setBounds(box: Box | null): void;

  /**
   * Re-bind this camera to a different viewport.
   * @throws {CameraViewportNotFoundError} if `viewportId` is not registered. Logs `error` before throwing.
   */
  setViewport(viewportId: string): void;

  /** Add screen shake trauma [0–1]. */
  shake(intensity: number): void;

  activate(): void;
  deactivate(): void;

  // ── 3D-specific behaviours ────────────────────────────────────────────────

  /**
   * Third-person follow: camera orbits behind the target at a fixed offset,
   * optionally looking at an entity or point.
   *
   * @param opts.offset  - Camera offset from the target. @default { x:0, y:3, z:-6 }
   * @param opts.lookAt  - Entity id or world position to orient toward.
   * @param opts.lerp    - Smoothing factor. @default 0.08
   */
  followThirdPerson(
      targetId: EntityId,
      opts?: { offset?: Vec3; lookAt?: EntityId | Vec3; lerp?: number },
  ): void;

  /**
   * First-person: camera is attached to `targetId` at `eyeOffset`,
   * copying the entity's rotation.
   *
   * @param opts.eyeOffset - Eye position relative to entity origin. @default { x:0, y:1.7, z:0 }
   */
  firstPerson(targetId: EntityId, opts?: { eyeOffset?: Vec3 }): void;

  /**
   * Orbit a fixed world point, optionally auto-rotating.
   *
   * @param opts.target     - World position to orbit around.
   * @param opts.radius     - Distance from the target.
   * @param opts.speed      - Rotation speed in radians/second.
   * @param opts.elevation  - Vertical angle in radians (0 = equator, Math.PI/2 = top).
   * @param opts.autoRotate - Continuously rotate. @default false
   */
  orbit(opts: {
    target: Vec3;
    radius: number;
    speed: number;
    elevation: number;
    autoRotate?: boolean;
  }): void;

  /**
   * Look at an entity or world position each frame.
   * Adds `LookAtTarget` component.
   */
  lookAt(target: EntityId | Vec3): void;

  /** Set camera rotation in euler radians. */
  setRotation(x: number, y: number, z: number): void;

  /** Set vertical field of view in radians (perspective cameras only). */
  setFov(fov: number): void;
}
