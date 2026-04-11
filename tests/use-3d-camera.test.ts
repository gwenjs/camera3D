import { describe, it, expect, beforeEach } from "vitest";
import { createEngine, withCleanup } from "@gwenjs/core";
import type { EntityId } from "@gwenjs/core";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera, cameraViewportMap, cameraPathStore } from "@gwenjs/camera-core";
import { CameraViewportNotFoundError } from "@gwenjs/camera-core";
import { use3DCamera } from "../src/use-3d-camera";
import { Camera3DPlugin } from "../src/plugin";

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

describe("use3DCamera", () => {
    it("throws CameraViewportNotFoundError if viewport not found", async () => {
        const engine = await makeEngine();
        expect(() =>
            engine.run(() => use3DCamera({ viewport: "nonexistent" }))
        ).toThrow(CameraViewportNotFoundError);
    });

    it("creates a camera entity with perspective defaults", async () => {
        const engine = await makeEngine();
        engine.run(() => use3DCamera({ viewport: "main" }));

        // Locate the camera entity via cameraViewportMap (EntityId is branded bigint)
        let camId: EntityId | undefined;
        for (const [id, viewport] of cameraViewportMap.entries()) {
            if (viewport === "main") { camId = id; break; }
        }
        expect(camId).toBeDefined();
        const cam = engine.getComponent(camId!, Camera);
        expect(cam?.projectionType).toBe(1);
        expect(cam?.active).toBe(1);
        expect(cam?.fov).toBeCloseTo(Math.PI / 3);
    });

    it("applies orthographic projection when specified", async () => {
        const engine = await makeEngine();
        engine.run(() => use3DCamera({ viewport: "main", projection: { type: "orthographic", zoom: 2 } }));

        let camId: EntityId | undefined;
        for (const [id, viewport] of cameraViewportMap.entries()) {
            if (viewport === "main") { camId = id; break; }
        }
        expect(camId).toBeDefined();
        const cam = engine.getComponent(camId!, Camera);
        expect(cam?.projectionType).toBe(0);
        expect(cam?.zoom).toBeCloseTo(2);
    });

    it("returns a handle with all expected methods", async () => {
        const engine = await makeEngine();
        engine.run(() => {
            const handle = use3DCamera({ viewport: "main" });
            expect(typeof handle.follow).toBe("function");
            expect(typeof handle.setPosition).toBe("function");
            expect(typeof handle.playPath).toBe("function");
            expect(typeof handle.setBounds).toBe("function");
            expect(typeof handle.setViewport).toBe("function");
            expect(typeof handle.shake).toBe("function");
            expect(typeof handle.activate).toBe("function");
            expect(typeof handle.deactivate).toBe("function");
            expect(typeof handle.followThirdPerson).toBe("function");
            expect(typeof handle.firstPerson).toBe("function");
            expect(typeof handle.orbit).toBe("function");
            expect(typeof handle.lookAt).toBe("function");
            expect(typeof handle.setRotation).toBe("function");
            expect(typeof handle.setFov).toBe("function");
        });
    });

    it("destroys camera entity and removes it from cameraViewportMap on cleanup", async () => {
        const engine = await makeEngine();

        // withCleanup wraps the composable call and returns [result, dispose]
        // engine.run provides the engine context required by use3DCamera
        const [, dispose] = engine.run(() =>
            withCleanup(() => use3DCamera({ viewport: "main" }))
        );

        // Entity should exist after creation
        let camId: EntityId | undefined;
        for (const [id, vp] of cameraViewportMap) {
            if (vp === "main") { camId = id; break; }
        }
        expect(camId).toBeDefined();
        expect(engine.getComponent(camId!, Camera)).not.toBeNull();

        // Trigger cleanup
        dispose();

        // Entity should be destroyed and viewport entry removed
        expect(cameraViewportMap.has(camId!)).toBe(false);
        expect(engine.getComponent(camId!, Camera)).toBeFalsy();
    });
});
