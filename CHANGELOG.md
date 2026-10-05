# Changelog

## [0.2.0](https://github.com/gwenjs/camera3D/compare/camera3d-v0.1.0...camera3d-v0.2.0) (2026-10-05)


### Features

* **camera3d:** add Camera3DExtensionSystem (look-at and orbit) ([2883776](https://github.com/gwenjs/camera3D/commit/2883776833d5d6273171ff0eb2a9c45dedfc03cf))
* **camera3d:** add createCamera3DHandle ([e5a4696](https://github.com/gwenjs/camera3D/commit/e5a4696ec633ecce671410dca6cb4d5352105396))
* **camera3d:** add LookAtTarget and OrbitBehavior ECS components ([d1ce3ba](https://github.com/gwenjs/camera3D/commit/d1ce3ba84bfba749eeb1ef2bd00c9aba494b761b))
* **camera3d:** add public API barrel ([369113f](https://github.com/gwenjs/camera3D/commit/369113f5a522d3acc9f2bb75a565c438a9a35b93))
* **camera3d:** add use3DCamera composable ([68dbcbe](https://github.com/gwenjs/camera3D/commit/68dbcbe6a440860dbc8069bceddfc05da54d7e3a))
* **camera3d:** add Use3DCameraOpts and Camera3DHandle types ([42ec187](https://github.com/gwenjs/camera3D/commit/42ec187ac3e75095cd4abd15be500b8aa22eb57c))
* **camera3d:** add useOrbit and useFirstPerson composables ([1558b8d](https://github.com/gwenjs/camera3D/commit/1558b8d3d6cbdfa23b33a731da8aef3c76285a45))
* implement Camera3dService and register under 'renderer:camera3d' ([65bed15](https://github.com/gwenjs/camera3D/commit/65bed1505cb080652368390367114a30031a615b))
* make shake() decay and maxAngle configurable per call ([a20adb3](https://github.com/gwenjs/camera3D/commit/a20adb3d102dee1bbf015fa0a0f1137c887a4f15))


### Bug Fixes

* add module entry to vite build — dist/module.js was never generated ([0de5ee0](https://github.com/gwenjs/camera3D/commit/0de5ee0ca11f5ce2430c8a7531000711dfe35502))
* correct auto-import name use3DCamera and augment GwenProvides for camera3d service ([7676851](https://github.com/gwenjs/camera3D/commit/7676851b9007849263e4dc2e8ff6f9de2426b182))
* format index ([3f99886](https://github.com/gwenjs/camera3D/commit/3f998866dd5c8990be70273651e1dfaedd0f32d9))
* linting errors ([f97f38a](https://github.com/gwenjs/camera3D/commit/f97f38a4b5603ea3232920c80c528ae28c465fb3))
* remove useless augment and service declaration ([dbde301](https://github.com/gwenjs/camera3D/commit/dbde3016946cbe6873f6dd9bb42a574a507cfb02))
* scafold issue and plugin setup ([c94bedf](https://github.com/gwenjs/camera3D/commit/c94bedfe4555e4b78022b4aaf39ef3000ddf375a))
* use double cast for viewportManager inject to satisfy TypeScript ([b7623cc](https://github.com/gwenjs/camera3D/commit/b7623cc4adfc9f277c709e345e2746fbebcc52e1))
