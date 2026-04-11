// tests/camera3d-extension-system.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createEngine } from "@gwenjs/core";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera, cameraViewportMap, cameraPathStore, CameraPath } from "@gwenjs/camera-core";
import { LookAtTarget, OrbitBehavior } from "../src/components.js";
import { Camera3DPlugin } from "../src/plugin.js";
import type { CameraWaypoint } from "@gwenjs/camera-core";

beforeEach(() => {
    cameraViewportMap.clear();
    cameraPathStore.clear();
});

async function setup() {
    const engine = await createEngine({ maxEntities: 100 });
    getOrCreateCameraManager(engine);
    const viewports = getOrCreateViewportManager(engine);
    viewports.set("main", { x: 0, y: 0, width: 1, height: 1 });
    await engine.use(Camera3DPlugin());
    return engine;
}

describe("Camera3DExtensionSystem — orbit", () => {
    it("positions camera on the orbit circle at angle=0, elevation=0", async () => {
        const engine = await setup();

        const camId = engine.createEntity();
        engine.addComponent(camId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
        });
        engine.addComponent(camId, OrbitBehavior, {
            targetX: 0, targetY: 0, targetZ: 0,
            radius: 10,
            speed: 0,        // no auto-rotate
            elevation: 0,
            autoRotate: 0,
            angle: 0,        // angle = 0 → camera at (0, 0, 10) relative to target
        });
        cameraViewportMap.set(camId, "main");

        await engine.advance(16);

        // At angle=0, elevation=0: x = sin(0)*cos(0)*10 = 0, z = cos(0)*cos(0)*10 = 10
        expect(engine.getComponent(camId, Camera)?.x).toBeCloseTo(0);
        expect(engine.getComponent(camId, Camera)?.z).toBeCloseTo(10);
    });

    it("auto-rotate advances angle each frame", async () => {
        const engine = await setup();

        const camId = engine.createEntity();
        engine.addComponent(camId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
        });
        engine.addComponent(camId, OrbitBehavior, {
            targetX: 0, targetY: 0, targetZ: 0,
            radius: 5,
            speed: Math.PI, // half rotation per second
            elevation: 0,
            autoRotate: 1,
            angle: 0,
        });
        cameraViewportMap.set(camId, "main");

        const angleBefore = engine.getComponent(camId, OrbitBehavior)!.angle;
        await engine.advance(16); // 16ms = 0.016s
        const angleAfter = engine.getComponent(camId, OrbitBehavior)!.angle;
        expect(angleAfter).toBeGreaterThan(angleBefore);
    });
});

describe("Camera3DExtensionSystem — look-at (fixed point)", () => {
    it("orients camera toward a fixed world point", async () => {
        const engine = await setup();

        const camId = engine.createEntity();
        engine.addComponent(camId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 10, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
        });
        engine.addComponent(camId, LookAtTarget, {
            entityId: 0n,
            fixedX: 0, fixedY: 0, fixedZ: 0,
            syncRotation: 0,
        });
        cameraViewportMap.set(camId, "main");

        await engine.advance(16);

        // Camera at (0,0,10) looking at (0,0,0) — should be rotY ≈ Math.PI (180°)
        expect(engine.getComponent(camId, Camera)?.rotY).toBeCloseTo(Math.PI);
    });
});

describe("Camera3DExtensionSystem — path look-at", () => {
    it("applies waypoint fov when declared", async () => {
        const engine = await setup();

        const camId = engine.createEntity();
        engine.addComponent(camId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
        });
        const waypoints: CameraWaypoint[] = [
            { position: { x: 10, y: 0, z: 0 }, duration: 2, fov: Math.PI / 6 },
        ];
        cameraPathStore.set(camId, { waypoints, opts: {}, elapsed: 0 });
        engine.addComponent(camId, CameraPath, { index: 0, progress: 0 });
        cameraViewportMap.set(camId, "main");

        await engine.advance(16);

        expect(engine.getComponent(camId, Camera)?.fov).toBeCloseTo(Math.PI / 6);
    });

    it("orients camera toward waypoint lookAt (fixed Vec3)", async () => {
        const engine = await setup();

        const camId = engine.createEntity();
        engine.addComponent(camId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 10, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
        });
        const waypoints: CameraWaypoint[] = [
            { position: { x: 0, y: 0, z: 10 }, duration: 2, lookAt: { x: 0, y: 0, z: 0 } },
        ];
        cameraPathStore.set(camId, { waypoints, opts: {}, elapsed: 0 });
        engine.addComponent(camId, CameraPath, { index: 0, progress: 0 });
        cameraViewportMap.set(camId, "main");

        await engine.advance(16);

        // Camera at (0,0,10) looking at (0,0,0) → rotY ≈ Math.PI
        expect(engine.getComponent(camId, Camera)?.rotY).toBeCloseTo(Math.PI);
    });
});
