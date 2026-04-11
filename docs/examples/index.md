# Examples

## Orbit — auto-rotating showcase camera

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('ShowcaseCamera', () => {
  const cam = use3DCamera({ viewport: 'main' })

  cam.orbit({
    target: { x: 0, y: 0, z: 0 },
    radius: 25,
    speed: 0.4,
    elevation: Math.PI / 8,
    autoRotate: true,
  })
})
```

## First-person — player POV

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('FirstPersonCamera', () => {
  const cam = use3DCamera({
    viewport: 'main',
    projection: { type: 'perspective', fov: Math.PI / 2.5 },
  })

  // playerId resolved from query or actor context
  cam.firstPerson(playerId, { eyeOffset: { x: 0, y: 1.7, z: 0 } })
})
```

## Third-person — follow behind player

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('ThirdPersonCamera', () => {
  const cam = use3DCamera({ viewport: 'main' })

  cam.followThirdPerson(playerId, {
    offset: { x: 0, y: 3, z: -6 },
    lookAt: playerId,
    lerp: 0.08,
  })
})
```

## Camera path with look-at and FOV change

```ts
import { use3DCamera } from '@gwenjs/camera3d'
import type { CameraWaypoint } from '@gwenjs/camera-core'

defineSystem('CinematicCamera', () => {
  const cam = use3DCamera({ viewport: 'main' })

  const waypoints: CameraWaypoint[] = [
    {
      position: { x: -10, y: 5, z: 0 },
      duration: 3,
      lookAt: { x: 0, y: 0, z: 0 },
      fov: Math.PI / 3,
    },
    {
      position: { x: 0, y: 2, z: 8 },
      duration: 2,
      lookAt: { x: 0, y: 1, z: 0 },
      fov: Math.PI / 5,
    },
  ]

  cam.playPath(waypoints, { loop: false })
})
```

## Screen shake on impact

```ts
// In a collision handler or system
cam.shake(0.6, { decay: 0.7, maxAngle: 15 })

// Lighter shake for ambient effects
cam.shake(0.2)
```
