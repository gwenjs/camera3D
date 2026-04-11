/**
 * Renderer service implementation for @gwenjs/camera3d.
 *
 * Implements the RendererService contract from @gwenjs/renderer-core.
 * All members are required — see the contract interface for details.
 */

import { defineRendererService } from "@gwenjs/renderer-core";
import type { Camera3dOptions } from "./types";

export const Camera3dRendererService = defineRendererService<Camera3dOptions>((opts) => ({
  name: "renderer:camera3d",
  layers: opts.layers,

  // Called once per declared layer — the result is cached automatically.
  createElement(_layerName: string): HTMLElement {
    return document.createElement("canvas");
  },

  // Called once after all layers are created and appended to the DOM.
  mount(_ctx: { getLayer: (name: string) => HTMLElement }): void {
    // TODO: initialise your rendering engine here
  },

  // Called when the scene is destroyed — release all GPU/DOM resources.
  unmount(): void {
    // TODO: dispose your rendering engine here
  },

  // Called on every viewport resize.
  resize(_w: number, _h: number): void {
    // TODO: resize your rendering engine
  },

  // Called each frame — run your render pass and report frame time.
  flush({ reportFrameTime }: { reportFrameTime: (ms: number) => void }): void {
    const t = performance.now();
    // TODO: render one frame
    reportFrameTime(performance.now() - t);
  },
}));
