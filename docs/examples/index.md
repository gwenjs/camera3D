# Examples

## Basic Usage

```typescript
import { useCamera3d } from '@gwenjs/camera3d'

// Inside a GWEN system or composable
const camera3d = useCamera3d()
```

## With Custom Config

```typescript
// gwen.config.ts
export default defineConfig({
  modules: [
    ['@gwenjs/camera3d', {
      // your options
    }],
  ],
})
```
