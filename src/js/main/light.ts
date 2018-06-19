import { HemisphericLight, Scene } from "babylonjs";

function light(light: HemisphericLight, scene: Scene) {
  // Light
  light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  ) as HemisphericLight;
}

export { light };
