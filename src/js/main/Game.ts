// import "babylonjs-inspector";
import "./../../vendor/pep";

import {
  Engine,
  Scene,
  Vector3,
  SceneOptimizer,
  SceneOptimizerOptions,
  CannonJSPlugin
} from "babylonjs";

import * as FX from "./../../vendor/wafxr/wafxr";
import { mapGlobals, projectileGlobals } from "./globalVariables";

import enemies from "./Enemy";
import towers from "./Submarine";
import map from "./map";
import materialGenerator from "./materialGenerator";

import runtime = require("offline-plugin/runtime");
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

    FX.setVolume(1);
    FX._tone.Master.mute = true;

    if (mapGlobals.optimizerOn) {
      const options = SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new SceneOptimizer(this._scene, options);

      optimizer.start();
    }

    this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    this._scene.workerCollisions = true;

    materialGenerator(this._scene);
    map(this._scene, this._canvas, this._engine);

    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      const cameraDirection = this._scene.activeCamera.getForwardRay()
        .direction as Vector3;
      const cameraUp = this._scene.activeCamera.upVector as Vector3;

      FX.setListenerPosition(
        this._scene.activeCamera.position.x,
        this._scene.activeCamera.position.y,
        this._scene.activeCamera.position.z
      );

      FX._tone.Listener.setOrientation(
        -cameraDirection.x,
        -cameraDirection.y,
        -cameraDirection.z,
        cameraUp.x,
        cameraUp.y,
        cameraUp.z
      );

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
  const body = document.getElementById("body");

  window.addEventListener("load", () => {
    const title = document.createElement("h1");
    title.innerText = `CrashDive`;
    title.setAttribute(
      "style",
      `
      position: absolute;
      color: ${projectileGlobals.livingColor.toHexString()};
      top: 30vh;
      width: 100vw;
      text-align: center;
      margin-top: -1.5rem;
      font-weight: 500;
      font-family: fantasy;
      font-size: 4rem;
      `
    );

    const startButton = document.createElement("button");
    startButton.innerText = `Start!`;
    startButton.id = "startButton";
    startButton.setAttribute(
      "style",
      `
      position: absolute;
      background-color: ${mapGlobals.sceneAmbient.toHexString()};
      color: ${projectileGlobals.livingColor.toHexString()};
      border-color: ${projectileGlobals.livingColor.toHexString()};
      top: 50vh;
      left: 50vw;
      width: 6rem;
      height: 3rem;
      margin-top: -1.5rem;
      margin-left: -3rem;
      border-radius: 8rem;
      font-weight: 600;
      `
    );
    body.insertBefore(title, game._canvas);
    body.insertBefore(startButton, game._canvas);

    startButton.addEventListener("click", () => {
      towers(game._scene);
      enemies(game._scene);
      FX._tone.context.resume();
      FX._tone.Master.mute = false;

      title.parentNode.removeChild(title);
      startButton.parentNode.removeChild(startButton);
    });
  });
});
