// Side-effect: activates typed useService('renderer:camera3d') in manual mode
import "./augment";

// Plugin factory — for manual registration in plugins: []
export { Camera3DPlugin } from "./plugin";

// Composables — useCamera3d() for runtime access inside defineActor()
export { useCamera3d } from "./composables";

// Public types
export type { Camera3dOptions, Camera3dService } from "./types";

// The build-time module is exposed via the './module' package export.
// Do NOT re-export it here — that creates a circular dependency.
