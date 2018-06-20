import { mapGlobals } from "./globalVariables";
import { startSound } from "./sounds";

function titleScreen(canvas: HTMLCanvasElement) {
  const title = document.createElement("h1");
  title.innerText = `CrashDive`;
  title.setAttribute(
    "style",
    `
      position: absolute;
      color: ${mapGlobals.ambientColor.toHexString()};
      top: 30vh;
      width: 100vw;
      text-align: center;
      margin-top: -1.5rem;
      font-weight: 500;
      font-family: fantasy;
      font-size: 4rem;
      `
  );

  const startButton = document.createElement("button");
  startButton.innerText = `Start!`;
  startButton.id = "startButton";
  startButton.setAttribute(
    "style",
    `
      position: absolute;
      background-color: ${mapGlobals.sceneAmbient.toHexString()};
      color: ${mapGlobals.ambientColor.toHexString()};
      border-color: ${mapGlobals.ambientColor.toHexString()};
      top: 50vh;
      left: 50vw;
      width: 6rem;
      height: 3rem;
      margin-top: -1.5rem;
      margin-left: -3rem;
      border-radius: 8rem;
      font-weight: 600;
      `
  );
  const body = document.getElementById("body");
  body.insertBefore(title, canvas);
  body.insertBefore(startButton, canvas);

  startButton.addEventListener("click", () => {
    startSound();

    title.parentNode.removeChild(title);
    startButton.parentNode.removeChild(startButton);
  });
}

export { titleScreen };
