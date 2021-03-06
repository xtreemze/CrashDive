import {
  Scene,
  Vector3,
  Tools,
  Engine,
  UniversalCamera,
  DefaultRenderingPipeline
} from "babylonjs";
import { mapGlobals, renderGlobals } from "./globalVariables";

function camera(
  scene: Scene,
  canvas: HTMLCanvasElement,
  engine: Engine,
  camera: UniversalCamera
) {
  // Camera1
  camera = new UniversalCamera(
    "1stPerson",
    new Vector3(mapGlobals.size / 12, 100, mapGlobals.size / 2.1),
    scene
  ) as UniversalCamera;

  // Faster mobile control
  camera.fov = 1;
  camera.inertia = 0.72;
  camera.speed = 10;
  camera.angularSensibility = 2000;
  camera.touchMoveSensibility = 200;
  camera.touchAngularSensibility = 28000;

  camera.setTarget(new Vector3(0, 25, 0));
  // Attach Control
  camera.attachControl(canvas, true);

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

  // renderPipeline(this._scene, this._camera);
  const pipeline = new DefaultRenderingPipeline(
    "default", // The name of the pipeline
    false,
    scene, // The scene instance,
    [camera] // The list of cameras to be attached to
  ) as DefaultRenderingPipeline;

  pipeline.fxaaEnabled = renderGlobals.antialiasing;
  pipeline.samples = 4;
}

export { camera };
