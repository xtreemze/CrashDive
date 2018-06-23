import { mapGlobals } from "./globalVariables";
import { duskFunction } from "./duskFunction";
import { dayFunction } from "./dayFunction";
import { Color4 } from "babylonjs";

function gui(
  canvas: HTMLCanvasElement,
  setSkyLightDirection,
  skyboxMaterial,
  setLightDirection,
  light,
  setLightColor,
  oceanColorDay,
  daylightColor,
  setLightConfig,
  setSkyConfig
) {
  const dayNightButton = document.createElement("button");
  dayNightButton.innerHTML = "&#x2600";
  dayNightButton.id = "dayNightButton";
  const shadowColor = new Color4(0, 0, 0, 0.5);
  dayNightButton.setAttribute(
    "style",
    `
      position: absolute;
      background-color: ${mapGlobals.sceneAmbient.toHexString()};
      color: ${mapGlobals.ambientColor.toHexString()};
      bottom: 5vh;
      font-size: 2.5rem;
      width: 5rem;
      line-height: 0;
      height: 5rem;
      left: 10vw;
      border-radius: 4rem;
      user-select: none;
      outline: none;
      border: none;
      box-shadow: 0px 0px 0.5rem ${shadowColor.toHexString()};
  }

      `
  );
  const body = document.getElementById("body");
  body.insertBefore(dayNightButton, canvas);
  let isDusk = true;
  dayNightButton.addEventListener("click", () => {
    if (isDusk) {
      dayFunction(
        setSkyLightDirection,
        skyboxMaterial,
        setLightDirection,
        light,
        setLightColor,
        oceanColorDay,
        daylightColor,
        setLightConfig,
        setSkyConfig
      );
      dayNightButton.setAttribute(
        "style",
        `      position: absolute;
        background-color: ${mapGlobals.sceneAmbient.toHexString()};
        color: ${mapGlobals.ambientColor.toHexString()};
        bottom: 5vh;
        font-size: 2.5rem;
        width: 5rem;
        line-height: 0;
        height: 5rem;
        left: 10vw;
        border-radius: 4rem;
        user-select: none;
        outline: none;
        border: none;
        box-shadow: 0px 0px 0.5rem ${shadowColor.toHexString()};`
      );
      isDusk = false;
    } else {
      duskFunction(
        setSkyLightDirection,
        skyboxMaterial,
        setLightDirection,
        light,
        setLightColor,
        oceanColorDay,
        daylightColor,
        setLightConfig,
        setSkyConfig
      );
      dayNightButton.setAttribute(
        "style",
        `      position: absolute;
        background-color: ${mapGlobals.ambientColor.toHexString()};
        color: ${mapGlobals.sceneAmbient.toHexString()};
        bottom: 5vh;
        font-size: 2.5rem;
        width: 5rem;
        line-height: 0;
        height: 5rem;
        left: 10vw;
        border-radius: 4rem;
        user-select: none;
        outline: none;
        border: none;
        box-shadow: 0px 0px 0.5rem ${shadowColor.toHexString()};
      `
      );
      isDusk = true;
    }
  });
}

export { gui };
