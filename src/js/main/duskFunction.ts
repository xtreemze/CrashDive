import { Color3, HemisphericLight, Vector3 } from "babylonjs";
import { SkyMaterial } from "babylonjs-materials";
export function duskFunction(
  setSkyLightDirection: (property: any, from: any, to: any) => void,
  skyboxMaterial: SkyMaterial,
  setLightDirection: (property: any, from: any, to: any) => void,
  light: HemisphericLight,
  setLightColor: (property: any, from: any, to: any) => void,
  oceanColorNight: Color3,
  duskColor: Color3,
  setLightConfig: (property: any, from: any, to: any) => void,
  setSkyConfig: (property: any, from: any, to: any) => void
) {
  setSkyLightDirection(
    "material.sunPosition",
    skyboxMaterial.sunPosition,
    new Vector3(0, 0.06, -1)
  );
  setLightDirection("direction", light.direction, new Vector3(0, 0.06, -1));
  setLightColor("groundColor", light.groundColor, oceanColorNight);
  setLightColor("diffuse", light.diffuse, duskColor);
  setLightConfig("intensity", light.intensity, 0.4);
  setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 1.4);
  setSkyConfig("material.luminance", skyboxMaterial.luminance, 0.9);
  setSkyConfig("material.rayleigh", skyboxMaterial.rayleigh, 1.6);
}
