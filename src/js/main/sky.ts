import { Mesh, Material, SkyMaterial, HemisphericLight } from "babylonjs";

function sky(scene) {
  // Skybox

  // Light
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  ) as HemisphericLight;

  // Sky material
  const skyboxMaterial = new BABYLON.SkyMaterial(
    "skyMaterial",
    scene
  ) as SkyMaterial;
  skyboxMaterial.backFaceCulling = false as boolean;
  //skyboxMaterial._cachedDefines.FOG = true;

  const skybox = Mesh.CreateBox("skyBox", 5000.0 * 2, scene) as Mesh;

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

    var animation = new BABYLON.Animation(
      "animation",
      property,
      100,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animation.setKeys(keys);

    scene.stopAnimation(skybox);
    scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 1);
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
  setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
}

export { sky };
