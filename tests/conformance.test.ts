/**
 * Conformance test — verifies @gwenjs/camera3d satisfies the RendererService contract.
 *
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import { runConformanceTests } from '@gwenjs/renderer-core/testing'
import { Camera3dRendererService } from '../src/renderer-service.js'

describe('@gwenjs/camera3d conformance', () => {
  it('satisfies the RendererService contract', () => {
    const service = Camera3dRendererService({ layers: { main: { order: 0 } } })
    expect(() => runConformanceTests(service)).not.toThrow()
  })
})
