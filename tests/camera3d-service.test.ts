import { describe, it, expect, beforeEach } from "vitest";
import { createEngine } from "@gwenjs/core";
import type { EntityId } from "@gwenjs/core";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera, cameraViewportMap, cameraPathStore } from "@gwenjs/camera-core";
import { Camera3DPlugin } from "../src/plugin.js";
import type { Camera3dService } from "../src/types.js";

beforeEach(() => {
  cameraViewportMap.clear();
  cameraPathStore.clear();
});

async function makeEngine() {
  const engine = await createEngine({ maxEntities: 100 });
  getOrCreateCameraManager(engine);
  const viewports = getOrCreateViewportManager(engine);
  viewports.set("main", { x: 0, y: 0, width: 1, height: 1 });
  await engine.use(Camera3DPlugin());
  return engine;
}

describe("Camera3dService", () => {
  it("plugin registers 'renderer:camera3d' service", async () => {
    const engine = await makeEngine();
    const service = engine.inject("renderer:camera3d");
    expect(service).toBeDefined();
    expect(typeof service.getCamera3dHandle).toBe("function");
  });

  it("getCamera3dHandle() returns a valid Camera3DHandle", async () => {
    const engine = await makeEngine();
    const service = engine.inject("renderer:camera3d");
    const handle = service.getCamera3dHandle({ viewport: "main" });
    expect(handle).not.toBeNull();
    expect(typeof handle?.setFov).toBe("function");
    expect(typeof handle?.orbit).toBe("function");
    expect(typeof handle?.firstPerson).toBe("function");
  });

  it("getCamera3dHandle() creates a Camera entity with perspective defaults", async () => {
    const engine = await makeEngine();
    const service = engine.inject("renderer:camera3d");
    service.getCamera3dHandle({ viewport: "main" });

    let camId: EntityId | undefined;
    for (const [id, vp] of cameraViewportMap) {
      if (vp === "main") {
        camId = id;
        break;
      }
    }
    expect(camId).toBeDefined();
    const cam = engine.getComponent(camId!, Camera);
    expect(cam?.projectionType).toBe(1);
    expect(cam?.active).toBe(1);
    expect(cam?.fov).toBeCloseTo(Math.PI / 3);
  });

  it("getCamera3dHandle() returns null for an unknown viewport", async () => {
    const engine = await makeEngine();
    const service = engine.inject("renderer:camera3d");
    const handle = service.getCamera3dHandle({ viewport: "nonexistent" });
    expect(handle).toBeNull();
  });

  it("getCamera3dHandle() applies orthographic projection when specified", async () => {
    const engine = await makeEngine();
    const service = engine.inject("renderer:camera3d");
    service.getCamera3dHandle({
      viewport: "main",
      projection: { type: "orthographic", zoom: 3 },
    });

    let camId: EntityId | undefined;
    for (const [id, vp] of cameraViewportMap) {
      if (vp === "main") {
        camId = id;
        break;
      }
    }
    const cam = engine.getComponent(camId!, Camera);
    expect(cam?.projectionType).toBe(0);
    expect(cam?.zoom).toBeCloseTo(3);
  });
});
