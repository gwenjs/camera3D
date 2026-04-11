# API Reference

## `useCamera3d()`

Returns the `Camera3dService` instance registered by `Camera3dPlugin`.

```typescript
import { useCamera3d } from '@gwenjs/camera3d'

const camera3d = useCamera3d()
```

**Throws** `GwenPluginNotFoundError` if `Camera3dPlugin` is not registered.

## `Camera3dConfig`

Configuration options passed to the plugin.

```typescript
interface Camera3dConfig {
  // Add your options here
}
```

## `Camera3dService`

Runtime service provided by the plugin.

```typescript
interface Camera3dService {
  // Add your methods here
}
```
