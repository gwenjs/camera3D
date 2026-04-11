import { useEngine } from "@gwenjs/core";
import { definePlugin } from "@gwenjs/kit/plugin";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera3DExtensionSystem } from "./camera3d-extension-system.js";

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
