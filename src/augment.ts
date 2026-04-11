/**
 * Declaration merging — types useService('renderer:camera3d') as Camera3dService.
 * Activated as a side-effect when importing from '@gwenjs/camera3d'.
 */

import type { Camera3dService } from "./types";

declare module "@gwenjs/core" {
  interface GwenProvides {
    "renderer:camera3d": Camera3dService;
  }
}

export {};
