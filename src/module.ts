/**
 * Build-time GWEN module for @gwenjs/camera3d.
 *
 * Add to gwen.config.ts:
 *   modules: [['@gwenjs/camera3d', { layers: { main: { order: 0 } } }]]
 *
 * IMPORTANT: Never import from './index.js' here — always import from './plugin.js'.
 */

import { defineGwenModule } from "@gwenjs/kit/module";
import type { Camera3dOptions } from "./types";

export default defineGwenModule<Camera3dOptions>({
  meta: {
    name: "@gwenjs/camera3d",
    configKey: "camera3d",
  },
  defaults: {
    layers: { main: { order: 0 } },
  },
  async setup(options, kit) {
    const { Camera3DPlugin } = await import("./plugin");

    kit.addPlugin(Camera3DPlugin(options));

    kit.addAutoImports([{ name: "useCamera3d", from: "@gwenjs/camera3d" }]);
  },
});
