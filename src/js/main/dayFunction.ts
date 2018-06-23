import { Color3, HemisphericLight, Vector3 } from "babylonjs";
import { SkyMaterial } from "babylonjs-materials";
export function dayFunction(
  setSkyLightDirection: (property: any, from: any, to: any) => void,
  skyboxMaterial: SkyMaterial,
  setLightDirection: (property: any, from: any, to: any) => void,
  light: HemisphericLight,
  setLightColor: (property: any, from: any, to: any) => void,
  oceanColorDay: Color3,
  daylightColor: Color3,
  setLightConfig: (property: any, from: any, to: any) => void,
  setSkyConfig: (property: any, from: any, to: any) => void
) {
  setSkyLightDirection(
    "material.sunPosition",
    skyboxMaterial.sunPosition,
    new Vector3(0, 1, 0)
  );
  setLightDirection("direction", light.direction, new Vector3(0, 1, 0));
  setLightColor("groundColor", light.groundColor, oceanColorDay);
  setLightColor("diffuse", light.diffuse, daylightColor);
  setLightConfig("intensity", light.intensity, 1.05);
  setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 1);
  setSkyConfig("material.luminance", skyboxMaterial.luminance, 1.02);
  setSkyConfig("material.rayleigh", skyboxMaterial.rayleigh, 0.82);
}
