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
let address = "";
let bpm = 60;
let rate = 1;
let size = 300;
let paused = false;

const randChar = () => chars[Math.floor(Math.random() * chars.length)];

for (let i = 0; i < 40; i++) {
  address += randChar();
}

function mutate() {
  if (rate > 0 && !paused) {
    const newAddress = address.split("");

    for (let i = 0; i < rate; i++) {
      newAddress[Math.floor(Math.random() * 40)] = randChar();
    }

    address = newAddress.join("");
  }

  const canvas = document.getElementById("canvas");
  const addressElem = document.getElementById("address");
  const bpmInput = document.getElementById("bpm") as HTMLInputElement;
  const bpmRange = document.getElementById("bpm-range") as HTMLInputElement;
  const rateInput = document.getElementById("rate") as HTMLInputElement;
  const addressInput = document.getElementById(
    "address-input"
  ) as HTMLInputElement;

  if (canvas) {
    canvas.innerHTML = tileForAddress(address)
      .viewbox("0 0 300 300")
      .id("tile")
      .svg();
  }
  if (addressElem) {
    addressElem.innerHTML = showAddress ? "0x" + address : "";
    addressElem.style.fontSize = size / 25 + "px";
  }
  if (bpmInput) bpmInput.value = bpm.toString();
  if (bpmRange) bpmRange.value = bpm.toString();
  if (rateInput) rateInput.value = rate.toString();
  if (addressInput) addressInput.value = address;

  const svgElem = document.getElementById("tile");
  if (svgElem) {
    svgElem.setAttribute("width", size.toString() + "px");
    svgElem.setAttribute("height", size.toString() + "px");
  }

  const pausePlayElem = document.getElementById("pause-play");
  if (pausePlayElem) {
    pausePlayElem.innerText = paused ? "Play" : "Pause";
  }

  setTimeout(function () {
    mutate();
  }, (60 / bpm) * 1000);
}

mutate();

export function setAddress(_address: string) {
  if (_address.startsWith("0x")) _address = _address.split("0x")[1];
  if (_address.length !== 40) {
    return;
  }
  if (
    _address
      .toLowerCase()
      .split("")
      .some((x) => !chars.includes(x as any))
  ) {
    return;
  }

  address = _address.toLowerCase();
}

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
  document.getElementById("canvas").addEventListener("click", () => {
    showAddress = !showAddress;
  });

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

  document
    .getElementById("address-input")
    .addEventListener("input", (e: InputEvent) => {
      let val = (e.target as HTMLInputElement).value;
      if (val.startsWith("0x")) val = val.split("0x")[1];
      if (val.length !== 40) return;
      address = val.toLowerCase();
    });

  document.getElementById("decrease-size").addEventListener("click", () => {
    size = size - 50;
  });

  document.getElementById("increase-size").addEventListener("click", () => {
    size = size + 50;
  });

  document.getElementById("pause-play").addEventListener("click", () => {
    paused = !paused;
  });
});
