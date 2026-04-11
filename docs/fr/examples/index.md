# Exemples

## Orbite — caméra de présentation en rotation automatique

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

## Première personne — point de vue du joueur

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('FirstPersonCamera', () => {
  const cam = use3DCamera({
    viewport: 'main',
    projection: { type: 'perspective', fov: Math.PI / 2.5 },
  })

  // playerId résolu depuis une query ou un contexte d'acteur
  cam.firstPerson(playerId, { eyeOffset: { x: 0, y: 1.7, z: 0 } })
})
```

## Troisième personne — suivi derrière le joueur

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

## Chemin de caméra avec look-at et changement de FOV

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

## Screen shake à l'impact

```ts
// Dans un gestionnaire de collision ou un système
cam.shake(0.6, { decay: 0.7, maxAngle: 15 })

// Shake léger pour des effets ambiants
cam.shake(0.2)
```
