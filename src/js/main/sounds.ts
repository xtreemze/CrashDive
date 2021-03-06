import * as FX from "./../../vendor/wafxr/wafxr";
import { Camera, Vector3 } from "babylonjs";

function soundPrep() {
  FX.setVolume(1);
  FX._tone.Master.mute = true;
}

function startSound() {
  FX._tone.context.resume();
  FX._tone.Master.mute = false;
}

function onDestroy(enemyPosition, level) {
  setTimeout(() => {
    FX.play({
      volume: -2,
      sustain: 0.64,
      release: 2,
      frequency: 1400 / level,
      sweep: -4,
      source: "pulse",
      compressorThreshold: -50,
      soundX: enemyPosition.x,
      soundY: enemyPosition.y,
      soundZ: enemyPosition.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

function shoot(projectile, level) {
  setTimeout(() => {
    FX.play({
      volume: -12,
      sustain: 0.02 * level ** 2,
      release: 0.44,
      frequency: (750 / level) * 1.5,
      sweep: -0.8,
      source: "square",
      highpass: 1920,
      lowpass: 2040,
      // bitcrush: 3,
      compressorThreshold: -55,
      soundX: projectile.position.x,
      soundY: projectile.position.y,
      soundZ: projectile.position.z,
      rolloff: 0.04
    } as FX.audioParams);
  }, 1);
}

function damage(enemy) {
  setTimeout(() => {
    FX.play({
      volume: -1,
      sustain: 0.3,
      release: 0.15,
      //@ts-ignore
      frequency: 20000 / enemy.hitPoints + 200,
      sweep: -0.8,
      source: "square",
      // lowpass: 4252,
      // lowpassSweep: 771,
      compressorThreshold: -3,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.2
    } as FX.audioParams);
  }, 1);
}

function spatialization(activeCamera: Camera) {
  const cameraDirection = activeCamera.getForwardRay().direction as Vector3;
  const cameraUp = activeCamera.upVector as Vector3;

  FX.setListenerPosition(
    activeCamera.position.x as number,
    activeCamera.position.y as number,
    activeCamera.position.z as number
  );

  FX._tone.Listener.setOrientation(
    -cameraDirection.x as number,
    -cameraDirection.y as number,
    -cameraDirection.z as number,
    cameraUp.x as number,
    cameraUp.y as number,
    cameraUp.z as number
  );
}

export { onDestroy, shoot, damage, soundPrep, startSound, spatialization };
