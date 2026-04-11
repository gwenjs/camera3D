/**
 * Composables for @gwenjs/camera3d.
 *
 * Must be called inside defineActor() — lifecycle hooks are registered automatically.
 */

import { useService } from "@gwenjs/core/system";
import { onCleanup } from "@gwenjs/core";
import type { Camera3dService } from "./types";
import "./augment";

/**
 * Retrieves the Camera3d renderer service registered by Camera3dPlugin.
 *
 * Call inside defineActor() to access the renderer for this actor's lifetime.
 * Resources registered via onDestroy are cleaned up automatically.
 *
 * @example
 * ```ts
 * export const MyActor = defineActor(MyPrefab, () => {
 *   const camera3d = useCamera3d()
 *   onUpdate(() => console.log('camera3d ready'))
 * })
 * ```
 */
export function useCamera3d(): Camera3dService {
  const service = useService("renderer:camera3d");

  onCleanup(() => {
    // TODO: release any per-actor resources created from this service
  });

  return service;
}
