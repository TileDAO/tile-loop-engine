import { tileForAddress } from "./generator";

const chars = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
] as const;

let showAddress = true;
let addresses: string[] = [];
let bpm = 60;
let rate = 1;
let size = 300;
let paused = false;
let tileCount = 1;
let inputsHidden = false;

const randChar = () => chars[Math.floor(Math.random() * chars.length)];

function mutate() {
  if (tileCount !== addresses.length) {
    addresses = [];
    for (let i = 0; i < 40; i++) {
      const char = randChar();

      for (let i = 0; i < tileCount; i++) {
        if (!addresses[i]) addresses.push("");
        addresses[i] = addresses[i] += char;
      }
    }
  }

  const tilesContainer = document.getElementById("tiles-container");

  if (rate > 0 && !paused && tilesContainer) {
    tilesContainer.innerHTML = "";

    const oldAddresses = addresses;

    addresses = [];

    for (let i = 0; i < tileCount; i++) {
      const canvas = document.createElement("div");
      canvas.className = "canvas";

      const address = document.createElement("div");
      address.className = "address";

      const tileContainer = document.createElement("div");
      tileContainer.className = "tile-container";

      tileContainer.appendChild(canvas);
      tileContainer.appendChild(address);
      tilesContainer.appendChild(tileContainer);

      tilesContainer.style.width = tileCount * 33 + "vw";
      tilesContainer.style.justifyContent =
        tileCount > 1 ? "space-between" : "center";

      const newAddress = oldAddresses[i] ? oldAddresses[i].split("") : [];

      for (let i = 0; i < rate; i++) {
        newAddress[Math.floor(Math.random() * 40)] = randChar();
      }

      addresses.push(newAddress.join(""));
    }
  }

  const inputsElem = document.getElementById("inputs");
  const showInputsElem = document.getElementById("show-inputs");
  const canvases = document.getElementsByClassName("canvas");
  const addressElems = document.getElementsByClassName("address");
  const bpmInput = document.getElementById("bpm") as HTMLInputElement;
  const bpmRange = document.getElementById("bpm-range") as HTMLInputElement;
  const rateInput = document.getElementById("rate") as HTMLInputElement;

  if (showInputsElem) {
    showInputsElem.style.visibility = inputsHidden ? "visible" : "hidden";
  }
  if (inputsElem) {
    inputsElem.style.visibility = inputsHidden ? "hidden" : "visible";
  }

  if (canvases?.length) {
    for (let i = 0; i < canvases.length; i++) {
      if (canvases[i]) {
        canvases[i].innerHTML = tileForAddress(addresses[i])
          .viewbox("0 0 300 300")
          .addClass("tile")
          .svg();
      }
    }
  }

  if (addressElems?.length) {
    for (let i = 0; i < addressElems.length; i++) {
      addressElems[i].innerHTML = showAddress ? "0x" + addresses[i] : "";
      (addressElems[i] as HTMLElement).style.fontSize = size / 25 + "px";
    }
  }
  if (bpmInput) bpmInput.value = bpm.toString();
  if (bpmRange) bpmRange.value = bpm.toString();
  if (rateInput) rateInput.value = rate.toString();

  const svgElems = document.getElementsByClassName("tile");
  if (svgElems) {
    for (let i = 0; i < svgElems.length; i++) {
      svgElems[i].setAttribute("width", size.toString() + "px");
      svgElems[i].setAttribute("height", size.toString() + "px");
    }
  }

  const pausePlayElem = document.getElementById("pause-play");
  if (pausePlayElem) {
    pausePlayElem.innerText = paused ? ">>" : "||";
  }

  setTimeout(function () {
    mutate();
  }, (60 / bpm) * 1000);
}

mutate();

function docReady(fn: VoidFunction) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(() => {
  const canvases = document.getElementsByClassName("canvas");
  for (let i = 0; i < canvases.length; i++) {
    canvases[i].addEventListener("click", () => {
      showAddress = !showAddress;
    });
  }

  document.getElementById("bpm").addEventListener("input", (e: InputEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    if (val < 12 || val > 800) return;
    bpm = val;
  });

  document
    .getElementById("bpm-range")
    .addEventListener("input", (e: InputEvent) => {
      const val = parseInt((e.target as HTMLInputElement).value);
      if (val < 12) return;
      bpm = val;
    });

  document.getElementById("rate").addEventListener("input", (e: InputEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    if (val < 0 || val > 40) return;
    rate = val;
  });

  // Set all addresses to input value
  document
    .getElementById("address-input")
    .addEventListener("input", (e: InputEvent) => {
      let val = (e.target as HTMLInputElement).value;
      if (val.startsWith("0x")) val = val.split("0x")[1];
      if (val.length !== 40) return;
      addresses = addresses.map(() => val.toLowerCase());
    });

  document.getElementById("decrease-size").addEventListener("click", () => {
    size = size - 25;
  });

  document.getElementById("increase-size").addEventListener("click", () => {
    size = size + 25;
  });

  document.getElementById("pause-play").addEventListener("click", () => {
    paused = !paused;
  });

  document.getElementById("tiles-1").addEventListener("click", () => {
    tileCount = 1;
  });

  document.getElementById("tiles-2").addEventListener("click", () => {
    tileCount = 2;
  });

  document.getElementById("tiles-3").addEventListener("click", () => {
    tileCount = 3;
  });

  document.getElementById("show-inputs").addEventListener("click", () => {
    inputsHidden = false;
  });

  document.getElementById("hide-inputs").addEventListener("click", () => {
    inputsHidden = true;
  });
});
