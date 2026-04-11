/**
 * Public types for @gwenjs/camera3d.
 */

import type { LayerDef } from "@gwenjs/renderer-core";

/** Options accepted by the Camera3d module in gwen.config.ts. */
export interface Camera3dOptions {
  /** Named canvas/div layers managed by this renderer. */
  layers: Record<string, LayerDef>;
  /** DOM container to mount layers into. Defaults to document.body. */
  container?: HTMLElement;
}

/** Public API exposed via engine.provide('renderer:camera3d'). */
export interface Camera3dService {
  // TODO: expose public methods your composables need
}
