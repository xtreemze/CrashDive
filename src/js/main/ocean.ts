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
  MeshBuilder,
  HemisphericLight,
  DirectionalLight,
  Vector3
} from "babylonjs";

import { WaterMaterial, SkyMaterial } from "babylonjs-materials";

import { mapGlobals } from "./globalVariables";

declare function require(string): string;

const waterBumpTexture = require("./textures/waterbump.png");

function ocean(scene: Scene) {
  let oceanSurface = MeshBuilder.CreateGround(
    "oceanSurface",
    {
      height: mapGlobals.size / 2 - 4,
      width: mapGlobals.size - 2
    },
    scene
  );
  oceanSurface.position.y -= 2;
  let oceanFloor = MeshBuilder.CreateBox(
    "oceanFloor",
    {
      height: mapGlobals.size / 2 - 4,
      width: mapGlobals.size - 2,
      depth: mapGlobals.size - 2
    },
    scene
  );

  const oceanColor = new Color3(0, 0.06, 0.15) as Color3;
  oceanFloor.position.y -= mapGlobals.size / 4;
  const oceanFloorMaterial = new StandardMaterial("oceanFloorMaterial", scene);
  oceanFloorMaterial.emissiveColor = oceanColor;
  oceanFloorMaterial.disableLighting = true;
  oceanFloorMaterial.alpha = 0.8;
  oceanFloor.flipFaces();
  oceanFloor.material = oceanFloorMaterial;
  oceanSurface.material = oceanFloorMaterial;

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
  const setSkyConfig = function(property, from, to) {
    const keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    const animation = new Animation(
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

  const setLightConfig = function(property, from, to) {
    const keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    const animation = new Animation(
      "animation",
      property,
      100,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    ) as Animation;
    animation.setKeys(keys);

    scene.beginDirectAnimation(light, [animation], 0, 100, false, 0.2);
  };
  const setLightDirection = function(property, from, to) {
    const keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    const animation = new Animation(
      "animation",
      property,
      100,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    ) as Animation;
    animation.setKeys(keys);
    scene.stopAnimation(light);
    scene.beginDirectAnimation(light, [animation], 0, 100, false, 0.2);
  };

  const setLightColor = function(property, from, to) {
    const keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    const animation = new Animation(
      "animation",
      property,
      100,
      Animation.ANIMATIONTYPE_COLOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    ) as Animation;
    animation.setKeys(keys);

    scene.beginDirectAnimation(light, [animation], 0, 100, false, 0.2);
  };

  // Light
  // const light = new DirectionalLight(
  //   "light",
  //   new Vector3(0, -1, 0),
  //   scene
  // ) as DirectionalLight;

  const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene
  ) as HemisphericLight;

  const daylightColor = new Color3(0.9, 0.9, 0.9) as Color3;
  const oceanColorDay = new Color3(0.2, 0.25, 0.31) as Color3;
  const duskColor = new Color3(0.75, 0.65, 0.5) as Color3;
  const oceanColorNight = new Color3(0.03, 0.12, 0.18) as Color3;

  window.addEventListener("keydown", function(evt) {
    switch (evt.keyCode) {
      case 49:
        setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
        setLightDirection("direction", light.direction, new Vector3(0, 1, 0));
        setLightColor("groundColor", light.groundColor, oceanColorDay);
        setLightColor("diffuse", light.diffuse, daylightColor);
        setLightConfig("intensity", light.intensity, 1);
        break; // 1
      case 50:
        setSkyConfig("material.inclination", skyboxMaterial.inclination, 0.48);
        setLightDirection("direction", light.direction, new Vector3(0, 0, -1));
        setLightColor("groundColor", light.groundColor, oceanColorNight);
        setLightColor("diffuse", light.diffuse, duskColor);
        setLightConfig("intensity", light.intensity, 1);
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
  // setSkyConfig("material.inclination", skyboxMaterial.inclination, -0.44);
  light.direction = new Vector3(0, 0, -1);
  light.groundColor = oceanColorNight;
  light.diffuse = duskColor;
  light.intensity = 1;
  setSkyConfig("material.inclination", skyboxMaterial.inclination, 0.48);

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
    new Vector2(1024, 1024)
  ) as WaterMaterial;
  waterMaterial.backFaceCulling = true as boolean;
  waterMaterial.bumpTexture = new Texture(waterBumpTexture, scene) as Texture;
  waterMaterial.bumpHeight = 0.5 as number;
  waterMaterial.windForce = -3 as number;
  waterMaterial.waveHeight = 0.7 as number;
  waterMaterial.waveLength = 0.3 as number;
  waterMaterial.windDirection = new Vector2(1, 1) as Vector2;
  waterMaterial.waterColor = new Color3(0, 0.54, 0.74) as Color3;
  waterMaterial.colorBlendFactor = 0.03 as number;

  waterMesh.material = waterMaterial as Material;

  // Clouds
  const cloud1 = MeshBuilder.CreateIcoSphere(
    "cloud",
    { radius: 100, subdivisions: 5 },
    scene
  );
  const cloudMaterial = new StandardMaterial("cloudMaterial", scene);
  // cloudMaterial.alpha = 0.8;
  // cloudMaterial.disableLighting = true;
  cloudMaterial.diffuseColor = new Color3(1, 1, 1);
  cloud1.material = cloudMaterial;

  cloud1.position.y += mapGlobals.size / 10.8;

  // Assign the water material

  waterMaterial.addToRenderList(skybox);
  waterMaterial.addToRenderList(oceanFloor);
  waterMaterial.addToRenderList(cloud1);
}

export { ocean };
