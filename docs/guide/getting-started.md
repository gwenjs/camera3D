# Getting Started

## Installation

```bash
pnpm add @gwenjs/camera3d
```

## Module setup

Register the module in `gwen.config.ts`:

```ts
// gwen.config.ts
import { defineConfig } from '@gwenjs/core'

export default defineConfig({
  modules: ['@gwenjs/camera3d'],
})
```

This registers `Camera3DPlugin`, `Camera3DExtensionSystem`, and the `use3DCamera` auto-import.

## Creating your first camera

Call `use3DCamera()` inside a `defineSystem`, `defineActor`, or `defineScene` setup function. The camera entity is created immediately and destroyed automatically when the enclosing context is torn down.

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('GameCamera', () => {
  const cam = use3DCamera({
    viewport: 'main',
    projection: { type: 'perspective', fov: Math.PI / 3 },
    position: { x: 0, y: 5, z: 10 },
  })

  cam.lookAt({ x: 0, y: 0, z: 0 })
})
```

## Third-person follow

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('ThirdPersonCamera', () => {
  const cam = use3DCamera({ viewport: 'main' })

  onUpdate(() => {
    // playerId is an EntityId resolved elsewhere
    cam.followThirdPerson(playerId, {
      offset: { x: 0, y: 3, z: -6 },
      lookAt: playerId,
    })
  })
})
```

## Using the imperative service

Outside a system setup context, use the `Camera3dService` registered by the plugin:

```ts
const service = engine.inject('renderer:camera3d')
const cam = service.getCamera3dHandle({ viewport: 'main' })

if (cam) {
  cam.orbit({
    target: { x: 0, y: 0, z: 0 },
    radius: 20,
    speed: 0.5,
    elevation: Math.PI / 6,
    autoRotate: true,
  })
}
```

`getCamera3dHandle()` returns `null` if the viewport is not registered.
