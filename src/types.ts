// src/types.ts
/**
 * @file Public types for @gwenjs/camera3d.
 */

import type { Vec3 } from "@gwenjs/math";
import type { EntityId } from "@gwenjs/core";
import type { CameraWaypoint, PathOpts } from "@gwenjs/camera-core";

/** Box bounds in world coordinates. */
export interface Box {
  /** X coordinate of the box origin. */
  x: number;
  /** Y coordinate of the box origin. */
  y: number;
  /** Z coordinate of the box origin. */
  z: number;
  /** Width of the box (X dimension). */
  width: number;
  /** Height of the box (Y dimension). */
  height: number;
  /** Depth of the box (Z dimension). */
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
    /** Projection type: perspective or orthographic. */
    type: "perspective" | "orthographic";
    /** Vertical field of view in radians. Perspective only. @default Math.PI / 3 */
    fov?: number;
    /** Orthographic zoom. @default 1 */
    zoom?: number;
    /** Near clipping plane. @default 0.1 (perspective) or -1 (orthographic) */
    near?: number;
    /** Far clipping plane. @default 1000 (perspective) or 1 (orthographic) */
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
   *
   * @param targetId - Entity to follow.
   * @param opts.lerp   - Smoothing factor 0–1. 1 = instant. @default 0.1
   * @param opts.offset - World-space offset applied after following.
   */
  follow(targetId: EntityId, opts?: { lerp?: number; offset?: Vec3 }): void;

  /**
   * Move the camera to an absolute world position immediately.
   *
   * Removes follow and path behaviours.
   * @param x - World X coordinate.
   * @param y - World Y coordinate.
   * @param z - World Z coordinate.
   */
  setPosition(x: number, y: number, z: number): void;

  /**
   * Start a travelling path.
   *
   * @param waypoints - Ordered path waypoints to play.
   * @param opts - Playback options such as looping or completion callbacks.
   * @throws {CameraEmptyPathError} if `waypoints` is empty. Logs `error` before throwing.
   */
  playPath(waypoints: CameraWaypoint[], opts?: PathOpts): void;

  /**
   * Set or clear world-space box bounds.
   *
   * @param box - Bounds to enforce, or `null` to remove them.
   */
  setBounds(box: Box | null): void;

  /**
   * Re-bind this camera to a different viewport.
   *
   * @param viewportId - Registered viewport identifier to bind to.
   * @throws {CameraViewportNotFoundError} if `viewportId` is not registered. Logs `error` before throwing.
   */
  setViewport(viewportId: string): void;

  /**
   * Add screen shake trauma.
   *
   * @param intensity - Trauma amount in the `[0, 1]` range. Values accumulate up to 1.
   * @param opts.decay    - Per-frame decay multiplier. @default 0.8
   * @param opts.maxAngle - Maximum shake angle in degrees applied to both axes. @default 10
   */
  shake(intensity: number, opts?: { decay?: number; maxAngle?: number }): void;

  /** Enable rendering of this camera. */
  activate(): void;
  /** Disable rendering of this camera. */
  deactivate(): void;

  // ── 3D-specific behaviours ────────────────────────────────────────────────

  /**
   * Third-person follow: camera orbits behind the target at a fixed offset,
   * optionally looking at an entity or point.
   *
   * @param targetId - Entity to follow from a third-person offset.
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
   * @param targetId - Entity whose transform drives the camera.
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
   *
   * Adds `LookAtTarget` component.
   * @param target - Entity id or world-space position to face.
   */
  lookAt(target: EntityId | Vec3): void;

  /**
   * Set camera rotation in Euler radians.
   *
   * @param x - Rotation around the X axis.
   * @param y - Rotation around the Y axis.
   * @param z - Rotation around the Z axis.
   */
  setRotation(x: number, y: number, z: number): void;

  /**
   * Set the vertical field of view in radians.
   *
   * @param fov - Perspective field of view value.
   */
  setFov(fov: number): void;

  /**
   * Set orthographic zoom.
   *
   * @param zoom - Orthographic zoom factor.
   */
  setZoom(zoom: number): void;
}

/**
 * Plugin configuration for @gwenjs/camera3d.
 *
 * Passed to the module configuration in gwen.config.ts.
 */
export interface Camera3dOptions {
  /** Layer configuration with render order. */
  layers?: {
    /** Main layer configuration. */
    main?: {
      /** Render order for the main camera layer. */
      order?: number;
    };
  };
}

/**
 * Service provided by Camera3D plugin under `'renderer:camera3d'`.
 *
 * Provides methods to create and manage 3D cameras at runtime.
 */
export interface Camera3dService {
  /**
   * Create a new 3D camera handle.
   *
   * @param opts - Configuration options for the camera.
   * @returns The camera handle, or null if creation failed.
   */
  getCamera3dHandle(opts?: Use3DCameraOpts): Camera3DHandle | null;
}

// Augment the typed service registry so engine.inject('renderer:camera3d') is fully typed.
declare module "@gwenjs/core" {
  interface GwenProvides {
    "renderer:camera3d": Camera3dService;
  }
}
