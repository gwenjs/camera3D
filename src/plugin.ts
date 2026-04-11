/**
 * @file Camera3D plugin factory.
 *
 * Sets up runtime infrastructure for 3D camera management, including the
 * Camera3DExtensionSystem for handling orbit and look-at transformations.
 */

import { useEngine } from "@gwenjs/core";
import { definePlugin } from "@gwenjs/kit/plugin";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera3DExtensionSystem } from "./camera3d-extension-system.js";

/**
 * GWEN plugin that enables 3D camera functionality.
 *
 * Initializes the camera manager, viewport manager, and Camera3DExtensionSystem.
 * Automatically used by the @gwenjs/camera3d module.
 *
 * @example
 * ```ts
 * import { Camera3DPlugin } from "@gwenjs/camera3d"
 *
 * await engine.use(Camera3DPlugin())
 * ```
 */
export const Camera3DPlugin = definePlugin(() => ({
  name: "@gwenjs/camera3d",
  async setup() {
    const engine = useEngine();

    // CameraCorePlugin/CameraSystem currently cross a different core context,
    // so install the compatible runtime pieces here instead.
    getOrCreateCameraManager(engine);
    getOrCreateViewportManager(engine);
    await engine.use(Camera3DExtensionSystem);
  },
}));
