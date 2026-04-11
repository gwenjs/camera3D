/**
 * @file use3DCamera — self-contained 3D camera composable.
 *
 * Creates a camera entity, registers it, and wires cleanup automatically.
 * Works in `defineActor`, `defineScene`, and `defineSystem` setup contexts.
 *
 * @example
 * ```ts
 * const cam = use3DCamera({ projection: { type: 'perspective', fov: Math.PI / 3 } })
 * cam.followThirdPerson(playerId, { offset: { x: 0, y: 3, z: -6 } })
 * ```
 */

import { useEngine, onCleanup } from "@gwenjs/core";
import { useService } from "@gwenjs/core/system";
import {
  Camera,
  CameraErrorCodes,
  CameraViewportNotFoundError,
  cameraViewportMap,
} from "@gwenjs/camera-core";
import { createCamera3DHandle } from "./camera3d-handle.js";
import type { Camera3DHandle, Use3DCameraOpts } from "./types.js";

/**
 * Create a 3D camera bound to `opts.viewport` (default: `'main'`).
 *
 * The camera entity is destroyed automatically when the enclosing context
 * (actor, scene, or system) is torn down via `onCleanup`.
 *
 * @param opts - Initial viewport, projection, priority, and position settings.
 * @returns A `Camera3DHandle` used to control the created camera entity.
 * @throws {CameraViewportNotFoundError} if the viewport is not registered.
 */
export function use3DCamera(opts: Use3DCameraOpts = {}): Camera3DHandle {
  const engine = useEngine();
  const viewports = useService("viewportManager");
  const viewportId = opts.viewport ?? "main";
  const log = engine.logger.child("camera3d:use3DCamera");

  if (!viewports.get(viewportId)) {
    const err = new CameraViewportNotFoundError(viewportId);
    log.error(`[${CameraErrorCodes.VIEWPORT_NOT_FOUND}] ${err.message} — ${err.hint}`);
    throw err;
  }

  const proj = opts.projection;
  const isPerspective = proj?.type !== "orthographic";

  const id = engine.createEntity();

  engine.addComponent(id, Camera, {
    active: 1,
    priority: opts.priority ?? 0,
    projectionType: isPerspective ? 1 : 0,
    zoom: proj?.zoom ?? 1,
    fov: proj?.fov ?? Math.PI / 3,
    near: proj?.near ?? (isPerspective ? 0.1 : -1),
    far: proj?.far ?? (isPerspective ? 1000 : 1),
    x: opts.position?.x ?? 0,
    y: opts.position?.y ?? 0,
    z: opts.position?.z ?? 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  cameraViewportMap.set(id, viewportId);

  onCleanup(() => {
    engine.destroyEntity(id);
    cameraViewportMap.delete(id);
  });

  return createCamera3DHandle(id, engine, engine.logger.child("camera3d:handle"));
}
