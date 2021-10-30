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

let address = "";
let interval = 1000;
let rate = 1;

const randChar = () => chars[Math.floor(Math.random() * chars.length)];

for (let i = 0; i < 40; i++) {
  address += randChar();
}

function mutate() {
  const newAddress = address.split("");

  for (let i = 0; i < rate; i++) {
    newAddress[Math.floor(Math.random() * 40)] = randChar();
  }

  address = newAddress.join("");

  console.log(address);

  const canvas = document.getElementById("canvas");

  if (canvas) canvas.innerHTML = tileForAddress(address).svg();

  setTimeout(function () {
    mutate();
  }, interval);
}

export function setInterval(_interval: number) {
  interval = _interval;
}

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

export function setRate(_rate: number) {
  if (_rate === 0 || _rate > 40) return;
  rate = _rate;
}

mutate();

(window as any).phaseInterval = setInterval;
(window as any).phaseRate = setRate;
(window as any).tileAddress = setAddress;

console.log(
  "Call phaseInterval(millis) to set phase interval in milliseconds."
);
console.log(
  "Call phaseRate(rate) to set number of address characters to change in each phase."
);
console.log("Call tileAddress(address) to reset Tile for that address.");
