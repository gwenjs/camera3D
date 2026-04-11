---
layout: home

hero:
  name: "@gwenjs/camera3d"
  text: "3D Camera for GWEN"
  tagline: Orbit, first-person, third-person, look-at, path animations and screen shake — all in a single composable.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/

features:
  - title: use3DCamera()
    details: One composable creates a camera entity, registers it, and cleans up automatically when the enclosing context is torn down.
  - title: Orbit & Look-At
    details: Auto-rotating showcase cameras, static look-at, and third-person follow — all declarative, no manual math.
  - title: First & Third Person
    details: Attach the camera to any entity with an eye offset, or follow from behind with a configurable 3D offset.
  - title: Camera Paths
    details: Play a sequence of waypoints with per-waypoint FOV and look-at overrides.
  - title: Screen Shake
    details: Add trauma-based screen shake with configurable decay and maximum angle, accumulated across multiple calls.
  - title: Perspective & Orthographic
    details: Switch projection type, FOV, zoom, near/far planes at any time via the Camera3DHandle.
---
