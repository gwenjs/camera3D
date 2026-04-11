import { describe, it, expect, beforeEach } from "vitest";
import { createEngine } from "@gwenjs/core";
import { getOrCreateCameraManager, getOrCreateViewportManager } from "@gwenjs/renderer-core";
import { Camera, CameraShake, cameraViewportMap, cameraPathStore } from "@gwenjs/camera-core";
import { CameraViewportNotFoundError, CameraEmptyPathError } from "@gwenjs/camera-core";
import { LookAtTarget, OrbitBehavior } from "../src/components.js";
import { createCamera3DHandle } from "../src/camera3d-handle.js";
import { Camera3DPlugin } from "../src/plugin.js";

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

    const camId = engine.createEntity();
    engine.addComponent(camId, Camera, {
        active: 1, priority: 0, projectionType: 1,
        x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
        zoom: 1, fov: Math.PI / 3, near: 0.1, far: 1000,
    });
    cameraViewportMap.set(camId, "main");

    const log = engine.logger.child("camera3d:test");
    const handle = createCamera3DHandle(camId, engine, log);
    return { engine, camId, handle };
}

describe("createCamera3DHandle", () => {
    it("setFov() updates Camera.fov", async () => {
        const { engine, camId, handle } = await setup();
        handle.setFov(Math.PI / 4);
        expect(engine.getComponent(camId, Camera)?.fov).toBeCloseTo(Math.PI / 4);
    });

    it("setRotation() updates Camera.rotX/Y/Z", async () => {
        const { engine, camId, handle } = await setup();
        handle.setRotation(0.1, 0.2, 0.3);
        expect(engine.getComponent(camId, Camera)?.rotX).toBeCloseTo(0.1);
        expect(engine.getComponent(camId, Camera)?.rotY).toBeCloseTo(0.2);
        expect(engine.getComponent(camId, Camera)?.rotZ).toBeCloseTo(0.3);
    });

    it("orbit() adds OrbitBehavior component", async () => {
        const { engine, camId, handle } = await setup();
        handle.orbit({ target: { x: 5, y: 0, z: 0 }, radius: 10, speed: 1, elevation: 0.3 });
        expect(engine.getComponent(camId, OrbitBehavior)?.radius).toBeCloseTo(10);
        expect(engine.getComponent(camId, OrbitBehavior)?.targetX).toBeCloseTo(5);
    });

    it("lookAt(Vec3) adds LookAtTarget with entityId=0n and fixed position", async () => {
        const { engine, camId, handle } = await setup();
        handle.lookAt({ x: 10, y: 0, z: 0 });
        expect(engine.getComponent(camId, LookAtTarget)?.entityId).toBe(0n);
        expect(engine.getComponent(camId, LookAtTarget)?.fixedX).toBeCloseTo(10);
    });

    it("lookAt(entityId) adds LookAtTarget with entityId set", async () => {
        const { engine, camId, handle } = await setup();
        const targetId = engine.createEntity();
        engine.addComponent(targetId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 5, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: 1, near: 0.1, far: 1000,
        });
        handle.lookAt(targetId);
        expect(engine.getComponent(camId, LookAtTarget)?.entityId).toBe(targetId);
    });

    it("firstPerson() adds LookAtTarget with syncRotation=1", async () => {
        const { engine, camId, handle } = await setup();
        const targetId = engine.createEntity();
        engine.addComponent(targetId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: 1, near: 0.1, far: 1000,
        });
        handle.firstPerson(targetId);
        expect(engine.getComponent(camId, LookAtTarget)?.syncRotation).toBe(1);
    });

    it("playPath([]) throws CameraEmptyPathError", async () => {
        const { handle } = await setup();
        expect(() => handle.playPath([])).toThrow(CameraEmptyPathError);
    });

    it("setViewport() throws CameraViewportNotFoundError for unknown viewport", async () => {
        const { handle } = await setup();
        expect(() => handle.setViewport("unknown")).toThrow(CameraViewportNotFoundError);
    });

    it("activate() and deactivate() toggle Camera.active", async () => {
        const { engine, camId, handle } = await setup();
        handle.deactivate();
        expect(engine.getComponent(camId, Camera)?.active).toBe(0);
        handle.activate();
        expect(engine.getComponent(camId, Camera)?.active).toBe(1);
    });

    it("setZoom() updates Camera.zoom", async () => {
        const { engine, camId, handle } = await setup();
        handle.setZoom(2);
        expect(engine.getComponent(camId, Camera)?.zoom).toBeCloseTo(2);
    })

    it("followThirdPerson() without lookAt removes a pre-existing LookAtTarget", async () => {
        const { engine, camId, handle } = await setup();
        const targetId = engine.createEntity();
        engine.addComponent(targetId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: 1, near: 0.1, far: 1000,
        });
        handle.lookAt({ x: 0, y: 0, z: 0 });
        handle.followThirdPerson(targetId);
        expect(engine.hasComponent(camId, LookAtTarget)).toBe(false);
    });

    it("shake() uses default decay=0.8 and maxAngle=10", async () => {
        const { engine, camId, handle } = await setup();
        handle.shake(0.5);
        const shake = engine.getComponent(camId, CameraShake);
        expect(shake?.trauma).toBeCloseTo(0.5);
        expect(shake?.decay).toBeCloseTo(0.8);
        expect(shake?.maxX).toBeCloseTo(10);
        expect(shake?.maxY).toBeCloseTo(10);
    });

    it("shake() accepts custom decay and maxAngle opts", async () => {
        const { engine, camId, handle } = await setup();
        handle.shake(0.6, { decay: 0.4, maxAngle: 20 });
        const shake = engine.getComponent(camId, CameraShake);
        expect(shake?.decay).toBeCloseTo(0.4);
        expect(shake?.maxX).toBeCloseTo(20);
        expect(shake?.maxY).toBeCloseTo(20);
    });

    it("shake() accumulates trauma on repeated calls", async () => {
        const { engine, camId, handle } = await setup();
        handle.shake(0.4);
        handle.shake(0.4);
        const shake = engine.getComponent(camId, CameraShake);
        expect(shake?.trauma).toBeCloseTo(0.8);
    });

    it("shake() clamps total trauma at 1", async () => {
        const { engine, camId, handle } = await setup();
        handle.shake(0.7);
        handle.shake(0.7);
        const shake = engine.getComponent(camId, CameraShake);
        expect(shake?.trauma).toBeCloseTo(1);
    });

    it("followThirdPerson() with lookAt as EntityId adds LookAtTarget with entityId set", async () => {
        const { engine, camId, handle } = await setup();
        const targetId = engine.createEntity();
        engine.addComponent(targetId, Camera, {
            active: 1, priority: 0, projectionType: 1,
            x: 5, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0,
            zoom: 1, fov: 1, near: 0.1, far: 1000,
        });
        handle.followThirdPerson(targetId, { lookAt: targetId });
        expect(engine.getComponent(camId, LookAtTarget)?.entityId).toBe(targetId);
        expect(engine.getComponent(camId, LookAtTarget)?.syncRotation).toBe(0);
    });
});
