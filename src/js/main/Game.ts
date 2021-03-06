// import "babylonjs-inspector";
import "./../../vendor/pep";

import {
  Engine,
  Scene,
  SceneOptimizer,
  SceneOptimizerOptions,
  UniversalCamera,
  Vector3,
  CannonJSPlugin,
  Camera
} from "babylonjs";

import { mapGlobals } from "./globalVariables";
import { ocean } from "./ocean";
import { camera } from "./camera";

import runtime = require("offline-plugin/runtime");

import { titleScreen } from "./titleScreen";
import { soundPrep, spatialization } from "./sounds";
import { particle } from "./particle";

// runtime.install({
//   onUpdating: () => {},
//   onUpdateReady: () => {
//     runtime.applyUpdate();
//   },
//   onUpdated: () => {
//     window.location.reload();
//   },
//   onUpdateFailed: () => {}
// });

class Game {
  public _canvas: HTMLCanvasElement;
  private _engine: Engine;
  public _scene: Scene;
  public _camera: UniversalCamera;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true, {
      // preserveDrawingBuffer: true,
      // stencil: true,
      // doNotHandleContextLost: true
    });
    this._engine.enableOfflineSupport = false;
    this._engine.disableManifestCheck = true;
  }

  createScene(): void {
    this._scene = new Scene(this._engine);

    // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    // this._scene.workerCollisions = true;

    camera(this._scene, this._canvas, this._engine, this._camera);
    ocean(this._scene, this._canvas);
    particle(this._scene);
    if (mapGlobals.optimizerOn) {
      const options = SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new SceneOptimizer(this._scene, options);

      optimizer.start();
    }

    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
      // spatialization(this._scene.activeCamera);
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game = new Game("renderCanvas");

  game.createScene();
  // soundPrep();
  game.doRender();

  // window.addEventListener("load", () => {
  // titleScreen(game._canvas);
  // });
});
