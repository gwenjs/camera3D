/**
 * @file useOrbit, useFirstPerson — high-level 3D camera behaviour composables.
 *
 * These are sugar over `Camera3DHandle` methods for use in `defineSystem` or
 * `defineActor` contexts where a handle isn't directly available.
 *
 * Both composables require `use3DCamera()` to have been called in the same context
 * and accept the returned handle as the first argument.
 */

import type { Vec3 } from "@gwenjs/math";
import type { EntityId } from "@gwenjs/core";
import type { Camera3DHandle } from "./types.js";

/**
 * Configure orbit behaviour on an existing 3D camera handle.
 *
 * @example
 * ```ts
 * const cam = use3DCamera({ viewport: 'main' })
 * useOrbit(cam, { target: { x:0, y:0, z:0 }, radius: 20, speed: 0.3, elevation: Math.PI/6, autoRotate: true })
 * ```
 */
export function useOrbit(
  handle: Camera3DHandle,
  opts: {
    target: Vec3;
    radius: number;
    speed: number;
    elevation: number;
    autoRotate?: boolean;
  },
): void {
  handle.orbit(opts);
}

/**
 * Configure first-person mode on an existing 3D camera handle.
 *
 * @example
 * ```ts
 * const cam = use3DCamera({ viewport: 'main' })
 * useFirstPerson(cam, playerId, { eyeOffset: { x: 0, y: 1.7, z: 0 } })
 * ```
 */
export function useFirstPerson(
  handle: Camera3DHandle,
  targetId: EntityId,
  opts?: { eyeOffset?: Vec3 },
): void {
  handle.firstPerson(targetId, opts);
}
