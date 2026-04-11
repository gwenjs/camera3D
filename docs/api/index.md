# API Reference

## `use3DCamera(opts?)`

Creates a 3D camera entity bound to a viewport. The entity is automatically destroyed when the enclosing context (system, actor, scene) is torn down.

```ts
import { use3DCamera } from '@gwenjs/camera3d'

const cam = use3DCamera({
  viewport: 'main',           // default: 'main'
  priority: 0,                // default: 0
  position: { x: 0, y: 0, z: 0 },
  projection: {
    type: 'perspective',      // 'perspective' | 'orthographic'
    fov: Math.PI / 3,         // perspective only, default: Math.PI/3
    zoom: 1,                  // orthographic only, default: 1
    near: 0.1,                // default: 0.1 (perspective) | -1 (orthographic)
    far: 1000,                // default: 1000 (perspective) | 1 (orthographic)
  },
})
```

**Returns:** `Camera3DHandle`

**Throws:** `CameraViewportNotFoundError` if the viewport is not registered.

---

## `Camera3DHandle`

Returned by `use3DCamera()` and `Camera3dService.getCamera3dHandle()`.

### Shared methods

#### `follow(targetId, opts?)`

Follow an entity. Removes any active path.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `targetId` | `EntityId` | — | Entity to follow |
| `opts.lerp` | `number` | `0.1` | Smoothing factor 0–1 (1 = instant) |
| `opts.offset` | `Vec3` | `{0,0,0}` | World-space offset |

#### `setPosition(x, y, z)`

Teleport to an absolute world position. Clears follow and path behaviours.

#### `playPath(waypoints, opts?)`

Start a camera path animation.

**Throws:** `CameraEmptyPathError` if `waypoints` is empty.

#### `setBounds(box)`

Constrain camera movement to a world-space box. Pass `null` to remove bounds.

#### `setViewport(viewportId)`

Re-bind the camera to a different registered viewport.

**Throws:** `CameraViewportNotFoundError` if the viewport is not registered.

#### `shake(intensity, opts?)`

Add screen shake trauma.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `intensity` | `number` | — | Trauma amount in `[0, 1]`. Accumulates up to 1. |
| `opts.decay` | `number` | `0.8` | Per-frame decay multiplier |
| `opts.maxAngle` | `number` | `10` | Maximum shake angle (degrees) applied to both axes |

#### `activate()` / `deactivate()`

Enable or disable rendering of this camera.

---

### 3D-specific methods

#### `followThirdPerson(targetId, opts?)`

Third-person follow: camera stays at `offset` behind the target.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `targetId` | `EntityId` | — | Entity to follow |
| `opts.offset` | `Vec3` | `{x:0,y:3,z:-6}` | Camera offset from the target |
| `opts.lookAt` | `EntityId \| Vec3` | — | Entity or position to face |
| `opts.lerp` | `number` | `0.08` | Smoothing factor |

#### `firstPerson(targetId, opts?)`

Attach the camera to an entity, copying its rotation.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `targetId` | `EntityId` | — | Entity driving the camera |
| `opts.eyeOffset` | `Vec3` | `{x:0,y:1.7,z:0}` | Eye height offset |

#### `orbit(opts)`

Orbit a fixed world point.

| Param | Type | Description |
|-------|------|-------------|
| `opts.target` | `Vec3` | World position to orbit |
| `opts.radius` | `number` | Distance from target |
| `opts.speed` | `number` | Rotation speed (radians/second) |
| `opts.elevation` | `number` | Vertical angle (0 = equator, π/2 = top) |
| `opts.autoRotate` | `boolean` | Continuously rotate (default: `false`) |

#### `lookAt(target)`

Orient the camera toward an entity or point each frame.

#### `setRotation(x, y, z)`

Set camera rotation as Euler angles in radians.

#### `setFov(fov)`

Set the perspective field of view in radians.

#### `setZoom(zoom)`

Set the orthographic zoom factor.

---

## `Camera3DPlugin`

```ts
import { Camera3DPlugin } from '@gwenjs/camera3d'

await engine.use(Camera3DPlugin())
```

Installs `Camera3DExtensionSystem`, initializes camera and viewport managers, and registers the `Camera3dService` under `'renderer:camera3d'`.

---

## `Camera3dService`

Registered under `'renderer:camera3d'` by `Camera3DPlugin`. Use this outside composable contexts.

```ts
const service = engine.inject('renderer:camera3d')
const handle = service.getCamera3dHandle(opts?)
```

`getCamera3dHandle(opts?)` accepts the same options as `use3DCamera()` and returns a `Camera3DHandle | null`. Returns `null` (and logs a warning) if the viewport is not found. Unlike `use3DCamera()`, no cleanup is registered — you own the entity lifecycle.

---

## Types

### `Use3DCameraOpts`

```ts
interface Use3DCameraOpts {
  viewport?: string       // default: 'main'
  priority?: number       // default: 0
  position?: Vec3
  projection?: {
    type: 'perspective' | 'orthographic'
    fov?: number          // default: Math.PI/3 (perspective)
    zoom?: number         // default: 1 (orthographic)
    near?: number
    far?: number
  }
}
```

### `Box`

```ts
interface Box {
  x: number; y: number; z: number
  width: number; height: number; depth: number
}
```

### `Camera3dOptions`

```ts
interface Camera3dOptions {
  layers?: {
    main?: { order?: number }
  }
}
```
