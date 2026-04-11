# Getting Started

## Installation

```bash
pnpm add @gwenjs/camera3d
```

## Setup

Register the module in your `gwen.config.ts`:

```typescript
import { defineConfig } from '@gwenjs/core'

export default defineConfig({
  modules: ['@gwenjs/camera3d'],
})
```

## Usage

Use the composable in your game code:

```typescript
import { useCamera3d } from '@gwenjs/camera3d'

const camera3d = useCamera3d()
```
