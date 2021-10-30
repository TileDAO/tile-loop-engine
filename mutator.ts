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

const randChar = () => chars[Math.floor(Math.random() * chars.length)];

for (let i = 0; i < 40; i++) {
  address += randChar();
}

function mutate() {
  const newAddress = address.split("");
  newAddress[Math.floor(Math.random() * 40)] = randChar();
  address = newAddress.join("");

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

mutate();

(window as any).setTileInterval = setInterval;
(window as any).setTileAddress = setAddress;

console.log("Call setTileInterval(millis) to set phase interval.");
console.log("Call setTileAddress(address) to reset Tile for that address.");
