/**
 * @file Camera3D plugin factory.
 *
 * Sets up runtime infrastructure for 3D camera management, including the
 * Camera3DExtensionSystem for handling orbit and look-at transformations,
 * and registers the Camera3dService under 'renderer:camera3d'.
 */

import { useEngine } from "@gwenjs/core";
import { definePlugin } from "@gwenjs/kit/plugin";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import {
  Camera,
  CameraErrorCodes,
  CameraViewportNotFoundError,
  cameraViewportMap,
} from "@gwenjs/camera-core";
import { Camera3DExtensionSystem } from "./camera3d-extension-system.js";
import { createCamera3DHandle } from "./camera3d-handle.js";
import type { Camera3dOptions, Camera3dService, Use3DCameraOpts, Camera3DHandle } from "./types.js";

/**
 * GWEN plugin that enables 3D camera functionality.
 *
 * Initializes the camera manager, viewport manager, Camera3DExtensionSystem,
 * and registers the `Camera3dService` under `'renderer:camera3d'`.
 *
 * @example
 * ```ts
 * import { Camera3DPlugin } from "@gwenjs/camera3d"
 *
 * await engine.use(Camera3DPlugin())
 * ```
 */
export const Camera3DPlugin = definePlugin((_options?: Camera3dOptions) => ({
  name: "@gwenjs/camera3d",
  async setup() {
    const engine = useEngine();

    getOrCreateCameraManager(engine);
    getOrCreateViewportManager(engine);
    await engine.use(Camera3DExtensionSystem);

    const log = engine.inject("logger").child("camera3d:service");

    const service: Camera3dService = {
      getCamera3dHandle(opts: Use3DCameraOpts = {}): Camera3DHandle | null {
        const viewportId = opts.viewport ?? "main";
        const viewports = engine.inject("viewportManager") as Map<string, unknown>;

        if (!viewports.get(viewportId)) {
          const err = new CameraViewportNotFoundError(viewportId);
          log.warn(`[${CameraErrorCodes.VIEWPORT_NOT_FOUND}] ${err.message} — ${err.hint}`);
          return null;
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

        return createCamera3DHandle(id, engine, log);
      },
    };

    engine.provide("renderer:camera3d", service);
  },
}));
