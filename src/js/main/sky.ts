import {
  Mesh,
  Material,
  Scene,
  StandardMaterial,
  Texture,
  Color3,
  Animation
} from "babylonjs";

import { CubeTexture, SkyMaterial } from "babylonjs-materials";

declare function require(string): string;

function sky(scene: Scene, skybox: Mesh) {
  // Skybox

  // Sky material
  const skyboxMaterial = new SkyMaterial("skyMaterial", scene) as SkyMaterial;
  skyboxMaterial.backFaceCulling = false as boolean;
  //skyboxMaterial._cachedDefines.FOG = true;

  skybox = Mesh.CreateBox("skyBox", 5000.0 * 2, scene) as Mesh;

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
    scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 0.4);
  };

  window.addEventListener("keydown", function(evt) {
    switch (evt.keyCode) {
      case 49:
        setSkyConfig("material.inclination", skyboxMaterial.inclination, 0.01);
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
  setSkyConfig("material.inclination", skyboxMaterial.inclination, 0.24);
}

export { sky };
