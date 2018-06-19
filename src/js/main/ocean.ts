import {
  Scene,
  Texture,
  Color3,
  Mesh,
  Vector2,
  Material,
  GroundMesh
} from "babylonjs";

import { WaterMaterial } from "babylonjs-materials";

declare function require(string): string;

const waterBumpTexture = require("./textures/waterbump.png");

function ocean(scene: Scene) {
  const skybox = scene.getMeshByID("skybox") as Mesh;
  // Water
  var waterMesh = Mesh.CreateGround(
    "waterMesh",
    2048 * 5,
    2048 * 5,
    16 * 5,
    scene,
    false
  ) as GroundMesh;
  var water = new WaterMaterial("water", scene, new Vector2(
    512,
    512
  ) as Vector2);
  water.backFaceCulling = true as boolean;
  water.bumpTexture = new Texture(waterBumpTexture, scene) as Texture;
  water.windForce = -10 as number;
  water.waveHeight = 0.7 as number;
  water.bumpHeight = 0.4 as number;
  water.windDirection = new Vector2(1, 1) as Vector2;
  water.waterColor = new Color3(0, 0, 221 / 255) as Color3;
  water.colorBlendFactor = 0.0 as number;
  water.addToRenderList(skybox);
  waterMesh.material = water as Material;
}

export { ocean };
