# Démarrage

## Installation

```bash
pnpm add @gwenjs/camera3d
```

## Configuration du module

Enregistrez le module dans `gwen.config.ts` :

```ts
// gwen.config.ts
import { defineConfig } from '@gwenjs/core'

export default defineConfig({
  modules: ['@gwenjs/camera3d'],
})
```

Cela enregistre `Camera3DPlugin`, `Camera3DExtensionSystem` et l'auto-import `use3DCamera`.

## Créer votre première caméra

Appelez `use3DCamera()` dans une fonction de setup `defineSystem`, `defineActor` ou `defineScene`. L'entité caméra est créée immédiatement et détruite automatiquement quand le contexte est démonté.

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

## Suivi en troisième personne

```ts
import { use3DCamera } from '@gwenjs/camera3d'

defineSystem('ThirdPersonCamera', () => {
  const cam = use3DCamera({ viewport: 'main' })

  onUpdate(() => {
    // playerId est un EntityId résolu par ailleurs
    cam.followThirdPerson(playerId, {
      offset: { x: 0, y: 3, z: -6 },
      lookAt: playerId,
    })
  })
})
```

## Utiliser le service impératif

En dehors d'un contexte de setup de système, utilisez le `Camera3dService` enregistré par le plugin :

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

`getCamera3dHandle()` retourne `null` si le viewport n'est pas enregistré.
