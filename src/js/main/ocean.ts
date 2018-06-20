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
    2048,
    2048,
    16,
    scene,
    false
  ) as GroundMesh;
  var waterMaterial = new WaterMaterial("water", scene, new Vector2(
    512,
    512
  ) as Vector2);
  waterMaterial.backFaceCulling = true as boolean;
  waterMaterial.bumpTexture = new Texture(waterBumpTexture, scene) as Texture;
  waterMaterial.windForce = -10 as number;
  waterMaterial.waveHeight = 0.9 as number;
  waterMaterial.bumpHeight = 1.4 as number;
  waterMaterial.windDirection = new Vector2(1, 1) as Vector2;
  waterMaterial.waterColor = new Color3(0.1, 0.1, 0.8) as Color3;
  waterMaterial.colorBlendFactor = 0.2 as number;
  waterMaterial.addToRenderList(skybox);
  waterMesh.material = waterMaterial as Material;
  waterMaterial.alpha = 0.5;
  //@ts-ignore
}

export { ocean };
