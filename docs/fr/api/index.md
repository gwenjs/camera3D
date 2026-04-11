# Référence API

## `use3DCamera(opts?)`

Crée une entité caméra 3D liée à un viewport. L'entité est détruite automatiquement quand le contexte englobant (système, acteur, scène) est démonté.

```ts
import { use3DCamera } from '@gwenjs/camera3d'

const cam = use3DCamera({
  viewport: 'main',           // défaut : 'main'
  priority: 0,                // défaut : 0
  position: { x: 0, y: 0, z: 0 },
  projection: {
    type: 'perspective',      // 'perspective' | 'orthographic'
    fov: Math.PI / 3,         // perspective uniquement, défaut : Math.PI/3
    zoom: 1,                  // orthographique uniquement, défaut : 1
    near: 0.1,                // défaut : 0.1 (perspective) | -1 (orthographique)
    far: 1000,                // défaut : 1000 (perspective) | 1 (orthographique)
  },
})
```

**Retourne :** `Camera3DHandle`

**Lève :** `CameraViewportNotFoundError` si le viewport n'est pas enregistré.

---

## `Camera3DHandle`

Retourné par `use3DCamera()` et `Camera3dService.getCamera3dHandle()`.

### Méthodes partagées

#### `follow(targetId, opts?)`

Suit une entité. Supprime tout chemin actif.

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `targetId` | `EntityId` | — | Entité à suivre |
| `opts.lerp` | `number` | `0.1` | Facteur de lissage 0–1 (1 = instantané) |
| `opts.offset` | `Vec3` | `{0,0,0}` | Décalage en espace monde |

#### `setPosition(x, y, z)`

Téléporte vers une position absolue en espace monde. Supprime le suivi et le chemin.

#### `playPath(waypoints, opts?)`

Lance une animation de chemin de caméra.

**Lève :** `CameraEmptyPathError` si `waypoints` est vide.

#### `setBounds(box)`

Contraint le déplacement de la caméra dans un cube en espace monde. Passez `null` pour supprimer les limites.

#### `setViewport(viewportId)`

Relie la caméra à un autre viewport enregistré.

**Lève :** `CameraViewportNotFoundError` si le viewport n'est pas enregistré.

#### `shake(intensity, opts?)`

Ajoute du trauma de screen shake.

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `intensity` | `number` | — | Trauma dans `[0, 1]`. S'accumule jusqu'à 1. |
| `opts.decay` | `number` | `0.8` | Multiplicateur de décroissance par frame |
| `opts.maxAngle` | `number` | `10` | Angle de shake maximum (degrés), appliqué aux deux axes |

#### `activate()` / `deactivate()`

Active ou désactive le rendu de cette caméra.

---

### Méthodes spécifiques 3D

#### `followThirdPerson(targetId, opts?)`

Suivi troisième personne : la caméra reste à `offset` derrière la cible.

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `targetId` | `EntityId` | — | Entité à suivre |
| `opts.offset` | `Vec3` | `{x:0,y:3,z:-6}` | Décalage caméra depuis la cible |
| `opts.lookAt` | `EntityId \| Vec3` | — | Entité ou position à regarder |
| `opts.lerp` | `number` | `0.08` | Facteur de lissage |

#### `firstPerson(targetId, opts?)`

Attache la caméra à une entité en copiant sa rotation.

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `targetId` | `EntityId` | — | Entité pilotant la caméra |
| `opts.eyeOffset` | `Vec3` | `{x:0,y:1.7,z:0}` | Décalage position des yeux |

#### `orbit(opts)`

Orbite autour d'un point fixe en espace monde.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `opts.target` | `Vec3` | Point central de l'orbite |
| `opts.radius` | `number` | Distance depuis la cible |
| `opts.speed` | `number` | Vitesse de rotation (radians/seconde) |
| `opts.elevation` | `number` | Angle vertical (0 = équateur, π/2 = sommet) |
| `opts.autoRotate` | `boolean` | Rotation continue (défaut : `false`) |

#### `lookAt(target)`

Oriente la caméra vers une entité ou un point à chaque frame.

#### `setRotation(x, y, z)`

Définit la rotation de la caméra en angles d'Euler en radians.

#### `setFov(fov)`

Définit le champ de vision (FOV) perspective en radians.

#### `setZoom(zoom)`

Définit le facteur de zoom orthographique.

---

## `Camera3DPlugin`

```ts
import { Camera3DPlugin } from '@gwenjs/camera3d'

await engine.use(Camera3DPlugin())
```

Installe `Camera3DExtensionSystem`, initialise les gestionnaires de caméra et de viewport, et enregistre le `Camera3dService` sous `'renderer:camera3d'`.

---

## `Camera3dService`

Enregistré sous `'renderer:camera3d'` par `Camera3DPlugin`. Utilisez ce service en dehors des contextes composables.

```ts
const service = engine.inject('renderer:camera3d')
const handle = service.getCamera3dHandle(opts?)
```

`getCamera3dHandle(opts?)` accepte les mêmes options que `use3DCamera()` et retourne un `Camera3DHandle | null`. Retourne `null` (et logue un avertissement) si le viewport n'est pas trouvé. Contrairement à `use3DCamera()`, aucun cleanup n'est enregistré — vous gérez le cycle de vie de l'entité.

---

## Types

### `Use3DCameraOpts`

```ts
interface Use3DCameraOpts {
  viewport?: string       // défaut : 'main'
  priority?: number       // défaut : 0
  position?: Vec3
  projection?: {
    type: 'perspective' | 'orthographic'
    fov?: number          // défaut : Math.PI/3 (perspective)
    zoom?: number         // défaut : 1 (orthographique)
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
