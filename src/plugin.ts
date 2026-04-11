import { CameraCorePlugin } from "@gwenjs/camera-core";
import { definePlugin } from "@gwenjs/kit/plugin";

export const Camera3dPlugin = definePlugin(() => ({
  name: "@gwenjs/camera3d",
  async setup(engine) {
    await engine.use(CameraCorePlugin());
  },
}));
