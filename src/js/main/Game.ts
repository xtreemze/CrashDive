// import "babylonjs-inspector";
import "./../../vendor/pep";

import {
  Engine,
  Scene,
  Vector3,
  SceneOptimizer,
  SceneOptimizerOptions,
  CannonJSPlugin,
  ArcRotateCamera,
  HemisphericLight
} from "babylonjs";
import renderPipeline from "./renderPipeline";
import { mapGlobals } from "./globalVariables";

import { ocean } from "./ocean";
import { sky } from "./sky";
import { camera } from "./camera";

import runtime = require("offline-plugin/runtime");
import { titleScreen } from "./titleScreen";

import { soundPrep, spatialization } from "./sounds";
import { light } from "./light";
runtime.install({
  onUpdating: () => {},
  onUpdateReady: () => {
    runtime.applyUpdate();
  },
  onUpdated: () => {
    window.location.reload();
  },
  onUpdateFailed: () => {}
});

class Game {
  public _canvas: HTMLCanvasElement;
  private _engine: Engine;
  public _scene: Scene;
  public _camera: ArcRotateCamera;
  public _light: HemisphericLight;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      doNotHandleContextLost: true
    });
    this._engine.enableOfflineSupport = false;
    this._engine.disableManifestCheck = true;
  }

  createScene(): void {
    this._scene = new Scene(this._engine);

    if (mapGlobals.optimizerOn) {
      const options = SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new SceneOptimizer(this._scene, options);

      optimizer.start();
    }

    this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    this._scene.workerCollisions = true;

    sky(this._scene);
    light(this._light, this._scene);
    ocean(this._scene);
    camera(this._scene, this._canvas, this._engine, this._camera);

    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    renderPipeline(this._scene, this._camera);
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      spatialization(this._scene.activeCamera);
      this._scene.render();
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

  game.doRender();

  window.addEventListener("load", () => {
    // titleScreen(this._canvas);
  });
});
