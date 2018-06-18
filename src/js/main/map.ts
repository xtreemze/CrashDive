import * as BABYLON from "babylonjs";
import { mapGlobals, renderGlobals } from "./variables";
import render from "./render";

export default function map1(scene: any = BABYLON.Scene, canvas, engine) {
  const groundMaterial = scene.getMaterialByID("groundMaterial");
  const skyMaterial = scene.getMaterialByID("skyMaterial");

  // Camera1
  const camera = new BABYLON.ArcRotateCamera(
    "overhead",
    Math.PI / 3,
    Math.PI / 14,
    mapGlobals.size / 6,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Attach Control
  camera.attachControl(canvas, true);

  // Upper Beta Limit
  camera.upperBetaLimit = Math.PI / 2.01;

  // Upper Radius Limit
  camera.upperRadiusLimit = mapGlobals.size / 2;

  // Lower Radius Limit
  camera.lowerRadiusLimit = mapGlobals.size / 12;

  camera.panningDistanceLimit = mapGlobals.size / 5;

  const rotateCamera = camera => {
    scene.registerBeforeRender(() => {
      camera.alpha += Math.PI / (360 * mapGlobals.rotationSpeedMultiplier);
      if (camera.alpha <= Math.PI) {
      }
    });
  };

  if (mapGlobals.rotateCameras) {
    rotateCamera(camera);
  }

  const allCameras = scene.cameras;

  let deltaTime = Date.now();

  scene.registerAfterRender(() => {
    if (Date.now() - deltaTime > mapGlobals.cameraCutDelay) {
      deltaTime = Date.now();
      scene.setActiveCameraByID(allCameras[0].id);
      const previousCamera = allCameras.shift();
      allCameras.push(previousCamera);
      scene.activeCamera.inertia = 0;
      setTimeout(() => {
        scene.activeCamera.inertia = 0.9;
      }, 100);
    }
  });

  const skyLight = new BABYLON.HemisphericLight(
    "skyLight",
    new BABYLON.Vector3(1, -1.05, 0),
    scene
  );

  const upLight = new BABYLON.DirectionalLight(
    "upLight",
    new BABYLON.Vector3(0.5, -1.2, -0.5),
    scene
  );

  upLight.intensity = mapGlobals.lightIntensity * 2;
  upLight.diffuse = new BABYLON.Color3(0.82, 0.89, 0.94);

  skyLight.intensity = mapGlobals.lightIntensity;
  skyLight.diffuse = new BABYLON.Color3(0.82, 0.89, 0.94);
  skyLight.groundColor = new BABYLON.Color3(0.05, 0, 0.18);

  scene.ambientColor = mapGlobals.sceneAmbient;

  const atmosphere = BABYLON.MeshBuilder.CreateIcoSphere(
    "atmosphere",
    {
      radius: mapGlobals.size / 2,
      subdivisions: 5,
      updatable: false
    },
    scene
  );
  atmosphere.flipFaces(true);
  atmosphere.freezeWorldMatrix(); // freeze ground

  atmosphere.material = skyMaterial;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    {
      height: mapGlobals.size,
      width: mapGlobals.size,
      subdivisions: mapGlobals.size / 10,
      updatable: false
    },
    scene
  );

  ground.material = groundMaterial;
  ground.freezeWorldMatrix(); // freeze ground

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9, friction: 1 },
    scene
  );

  render(scene, camera, ground, atmosphere, groundMaterial);

  if (renderGlobals.screenshot) {
    setTimeout(() => {
      var imgNm = 0;
      scene.registerAfterRender(function() {
        if (imgNm++ < 50) {
          BABYLON.Tools.CreateScreenshot(engine, camera, 1024);
        }
      });
    }, 6000);
  }
}
