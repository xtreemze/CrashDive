import {
  Scene,
  Vector3,
  ArcRotateCamera,
  Tools,
  Engine,
  Camera
} from "babylonjs";
import { mapGlobals, renderGlobals } from "./globalVariables";

function camera(
  scene: Scene,
  canvas: HTMLCanvasElement,
  engine: Engine,
  camera: ArcRotateCamera
) {
  // Camera1
  camera = new ArcRotateCamera(
    "overhead",
    Math.PI / 2,
    Math.PI / 2,
    1000,
    new Vector3(0, 500, 0),
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

  if (renderGlobals.screenshot) {
    setTimeout(() => {
      var imgNm = 0;
      scene.registerAfterRender(function() {
        if (imgNm++ < 50) {
          Tools.CreateScreenshot(engine, camera, 1024);
        }
      });
    }, 6000);
  }
}

export { camera };
