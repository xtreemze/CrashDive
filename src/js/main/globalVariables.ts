import { Color3, PhysicsImpostor, Mesh } from "babylonjs";

const mapGlobals = {
  diagnosticsOn: false,
  size: 8000.0, // map radius
  optimizerOn: false,
  cameraCutDelay: 3000,
  rotateCameras: false,
  rotationSpeedMultiplier: 16, // higher is slower camera rotation
  allImpostors: [] as PhysicsImpostor[],
  impostorLimit: 100, // keep low for mobile device limits
  lightIntensity: 0.79,
  simultaneousSounds: 0,
  soundDelay: 170,
  soundLimit: 3,
  projectileSounds: 0, // Sounds currently playing
  projectileSoundLimit: 1, // Simultaneous sound limit
  ambientColor: new Color3(0.2, 0.2, 0.2),
  sceneAmbient: new Color3(0.01, 0.0, 0.2)
};

const submarineGlobals = {
  isUnderwater: false,
  surfaceChange: false
};

const renderGlobals = {
  pipelineOn: true,
  glow: false,
  glowIntensity: 2.8,
  sharpenning: false,
  antialiasing: true,
  depthOfField: false,
  bloom: false,
  screenshot: false
};

const allMaterials = {};

//@ts-ignore
window.globals = {
  mapGlobals,
  renderGlobals
};

export { mapGlobals, renderGlobals, submarineGlobals };
