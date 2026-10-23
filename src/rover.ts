export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

// B2: the compass is just a list
type Heading = { name: string; dx: number; dy: number };

const compass: Heading[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let facing = 0;

type Command = { label: string; run: () => void };

const forward: Command = {
  label: "Forward",
  run: () => {
    const h = compass[facing];
    x = Math.min(4, Math.max(0, x + h.dx));
    y = Math.min(4, Math.max(0, y + h.dy));
  },
};

const right: Command = {
  label: "Right",
  run: () => {
    facing = (facing + 1) % compass.length;
  },
};

function doNow(c: Command) {
  c.run();
  drawRover();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(facing * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    compass[facing].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () =>
  doNow(forward);
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () =>
  doNow(right);
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  facing = 0;
  drawRover();
};
drawRover();
