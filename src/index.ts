/**
 * @file Public API for `@gwenjs/camera3d`.
 *
 * @example
 * ```ts
 * import { use3DCamera, Camera3DPlugin } from '@gwenjs/camera3d'
 * ```
 */

export { use3DCamera } from "./use-3d-camera";
export { createCamera3DHandle } from "./camera3d-handle";
export { Camera3DPlugin } from "./plugin";
export { Camera3DExtensionSystem } from "./camera3d-extension-system";
export { LookAtTarget, OrbitBehavior } from "./components";
export { useOrbit, useFirstPerson } from "./behaviors";

export type { Use3DCameraOpts, Camera3DHandle, Box } from "./types";
