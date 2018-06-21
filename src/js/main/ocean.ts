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
  Vector3
} from "babylonjs";

import { WaterMaterial, SkyMaterial } from "babylonjs-materials";

import { mapGlobals, submarineGlobals } from "./globalVariables";

declare function require(string): string;

const waterBumpTexture = require("./textures/waterbump.png");

function ocean(scene: Scene) {
  const oceanFloor = MeshBuilder.CreateBox(
    "oceanFloor",
    {
      height: mapGlobals.size / 2 - 25,
      width: mapGlobals.size - 25,
      depth: mapGlobals.size - 25
    },
    scene
  );

  oceanFloor.flipFaces();
  const oceanColor = new Color3(0.12, 0.27, 0.41) as Color3;
  const oceanFloorMaterial = new StandardMaterial("oceanFloorMaterial", scene);
  oceanFloorMaterial.disableLighting = true;
  oceanFloorMaterial.emissiveColor = oceanColor;
  // oceanFloorMaterial.diffuseColor = oceanColor;
  oceanFloorMaterial.alpha = 0.6;
  oceanFloor.material = oceanFloorMaterial;

  // Skybox

  // Sky material
  const skyboxMaterial = new SkyMaterial("skyMaterial", scene) as SkyMaterial;
  skyboxMaterial.backFaceCulling = false as boolean;
  //skyboxMaterial._cachedDefines.FOG = true;

  const skybox = Mesh.CreateBox("skyBox", mapGlobals.size, scene) as Mesh;
  // skybox.infiniteDistance = true;

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

    scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 0.2);
  };
  const setSkyLightDirection = function(property, from, to) {
    const keys = [{ frame: 0, value: from }, { frame: 100, value: to }];

    const animation = new Animation(
      "animation",
      property,
      100,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    ) as Animation;
    animation.setKeys(keys);

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

  const daylightColor = new Color3(0.89, 0.91, 0.92) as Color3;
  const oceanColorDay = new Color3(0.48, 0.54, 0.59) as Color3;
  const duskColor = new Color3(0.7, 0.71, 0.64) as Color3;
  const oceanColorNight = new Color3(0.25, 0.37, 0.4) as Color3;

  window.addEventListener("keydown", function(evt) {
    scene.stopAnimation(skybox);
    scene.stopAnimation(light);
    switch (evt.keyCode) {
      case 49:
        // setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
        setSkyLightDirection(
          "material.sunPosition",
          skyboxMaterial.sunPosition,
          new Vector3(0, 1, 0)
        );
        setLightDirection("direction", light.direction, new Vector3(0, 1, 0));
        setLightColor("groundColor", light.groundColor, oceanColorDay);
        setLightColor("diffuse", light.diffuse, daylightColor);
        setLightConfig("intensity", light.intensity, 0.95);
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 1);
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 1);
        setSkyConfig("material.rayleigh", skyboxMaterial.rayleigh, 0.82);
        break; // 1
      case 50:
        // setSkyConfig("material.inclination", skyboxMaterial.inclination, 0.485);
        setSkyLightDirection(
          "material.sunPosition",
          skyboxMaterial.sunPosition,
          new Vector3(0, 0.06, -1)
        );
        setLightDirection(
          "direction",
          light.direction,
          new Vector3(0, 0.06, -1)
        );
        setLightColor("groundColor", light.groundColor, oceanColorNight);
        setLightColor("diffuse", light.diffuse, duskColor);
        setLightConfig("intensity", light.intensity, 0.4);
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 1.4);
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 0.9);
        setSkyConfig("material.rayleigh", skyboxMaterial.rayleigh, 1.6);
        break; // 2

      case 51:
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 0.8);
        break; // 3
      case 52:
        setSkyConfig("material.luminance", skyboxMaterial.luminance, 1.09);
        break; // 4

      case 53:
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 30);
        break; // 5
      case 54:
        setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 0);
        break; // 6

      default:
        break;
    }
  });
  // Set to Day
  // setSkyConfig("material.inclination", skyboxMaterial.inclination, -0.44);
  skyboxMaterial.turbidity = 1.4;
  skyboxMaterial.luminance = 0.9;
  light.direction = new Vector3(0, 0.06, -1) as Vector3;
  light.groundColor = oceanColorNight;
  light.diffuse = duskColor;
  light.intensity = 0.36;
  skyboxMaterial.rayleigh = 1.6;
  //@ts-ignore
  // skyboxMaterial.inclination = 0.485;
  skyboxMaterial.useSunPosition = true;
  skyboxMaterial.sunPosition = new Vector3(0, 0.06, -1) as Vector3;

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
    new Vector2(2048, 2048)
  ) as WaterMaterial;
  waterMaterial.backFaceCulling = true as boolean;
  waterMaterial.bumpTexture = new Texture(waterBumpTexture, scene) as Texture;
  waterMaterial.bumpHeight = 0.8 as number;
  waterMaterial.windForce = -2.4 as number;
  waterMaterial.waveHeight = 2.6 as number;
  waterMaterial.waveLength = 0.32 as number;
  waterMaterial.windDirection = new Vector2(1, 1) as Vector2;
  waterMaterial.waterColor = new Color3(0, 0.54, 0.74) as Color3;
  waterMaterial.colorBlendFactor = 0.03 as number;
  // waterMaterial.wireframe = true;
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
  // cloudMaterial.lightmapTexture = skybox;

  cloud1.position = new Vector3(
    mapGlobals.size / 16,
    mapGlobals.size / 40,
    mapGlobals.size / 2.8
  );

  // Assign the water material

  waterMaterial.addToRenderList(skybox);
  waterMaterial.addToRenderList(oceanFloor);
  waterMaterial.addToRenderList(cloud1);

  waterMaterial.alpha = 0.96;
  waterMaterial.backFaceCulling = false;
  oceanFloorMaterial.backFaceCulling = false;

  scene.registerAfterRender(() => {
    oceanFloor.position = new Vector3(
      scene.activeCamera.position.x,
      -mapGlobals.size / 4 + 12.43,
      scene.activeCamera.position.z
    );
    waterMesh.position = new Vector3(
      scene.activeCamera.position.x,
      0,
      scene.activeCamera.position.z
    );

    skybox.position = new Vector3(
      scene.activeCamera.position.x,
      0,
      scene.activeCamera.position.z
    );
  });
}

export { ocean };
