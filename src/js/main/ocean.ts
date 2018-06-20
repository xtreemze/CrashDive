import {
  Scene,
  Texture,
  Color3,
  Mesh,
  Vector2,
  Material,
  GroundMesh,
  StandardMaterial,
  Animation,
  MeshBuilder
} from "babylonjs";

import { WaterMaterial, SkyMaterial } from "babylonjs-materials";

import { mapGlobals } from "./globalVariables";

declare function require(string): string;

const waterBumpTexture = require("./textures/waterbump.png");

function ocean(scene: Scene) {
  let oceanFloor = MeshBuilder.CreateBox(
    "oceanFloor",
    {
      height: mapGlobals.size / 2 - 2,
      width: mapGlobals.size - 2,
      depth: mapGlobals.size - 2
    },
    scene
  );
  oceanFloor.position.y -= mapGlobals.size / 4;
  const oceanFloorMaterial = new StandardMaterial("oceanFloorMaterial", scene);
  oceanFloorMaterial.diffuseColor = new Color3(0, 0.02, 0.1);
  oceanFloorMaterial.specularColor = new Color3(0, 0.1, 0.1);
  oceanFloor.material = oceanFloorMaterial;

  // Skybox

  // Sky material
  const skyboxMaterial = new SkyMaterial("skyMaterial", scene) as SkyMaterial;
  skyboxMaterial.backFaceCulling = false as boolean;
  //skyboxMaterial._cachedDefines.FOG = true;

  const skybox = Mesh.CreateBox("skyBox", 3000.0, scene) as Mesh;

  skyboxMaterial.backFaceCulling = false as boolean;

  skybox.material = skyboxMaterial as Material;

  /*
	* Keys:
	* - 1: Day
	* - 2: Evening
	* - 3: Increase Luminance
	* - 4: Decrease Luminance
	* - 5: Increase Turbidity
	* - 6: Decrease Turbidity
	*/
  var setSkyConfig = function(property, from, to) {
    var keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    var animation = new Animation(
      "animation",
      property,
      100,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    ) as Animation;
    animation.setKeys(keys);

    scene.stopAnimation(skybox);
    scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 0.2);
  };

  window.addEventListener("keydown", function(evt) {
    switch (evt.keyCode) {
      case 49:
        setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
        break; // 1
      case 50:
        setSkyConfig("material.inclination", skyboxMaterial.inclination, -0.5);
        break; // 2

      case 51:
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 0.1);
        break; // 3
      case 52:
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 1.0);
        break; // 4

      case 53:
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 40);
        break; // 5
      case 54:
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 5);
        break; // 6

      default:
        break;
    }
  });
  // Set to Day
  setSkyConfig("material.inclination", skyboxMaterial.inclination, -0.44);

  // Water
  const waterMesh = MeshBuilder.CreateGround(
    "waterMesh",
    {
      height: mapGlobals.size,
      width: mapGlobals.size,
      subdivisions: 16
    },
    scene
  ) as GroundMesh;
  const waterMaterial = new WaterMaterial(
    "water",
    scene,
    new Vector2(512, 512)
  ) as WaterMaterial;
  waterMaterial.backFaceCulling = true as boolean;
  waterMaterial.bumpTexture = new Texture(waterBumpTexture, scene) as Texture;
  waterMaterial.bumpHeight = 0.3 as number;
  waterMaterial.windForce = -3 as number;
  waterMaterial.waveHeight = 0.6 as number;
  waterMaterial.waveLength = 0.3 as number;
  waterMaterial.windDirection = new Vector2(1, 1) as Vector2;
  waterMaterial.waterColor = new Color3(0, 0.6, 0.8) as Color3;
  waterMaterial.colorBlendFactor = 0.1 as number;
  waterMaterial.addToRenderList(skybox);
  waterMaterial.addToRenderList(oceanFloor);
  waterMesh.material = waterMaterial as Material;

  // Assign the water material
}

export { ocean };
