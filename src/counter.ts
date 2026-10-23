export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

const MAX = 10;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

type Shield = { charge: number; capacity: number; missing: number };

function snapshot(): Shield {
  return { charge: count, capacity: MAX, missing: MAX - count };
}

const shieldEvents = new EventTarget();

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(MAX, next));
  if (bounded === count) return;
  count = bounded;
  shieldEvents.dispatchEvent(new Event("changed"));
}

function drawMeter(s: Shield) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < s.capacity; i++) {
    ctx.fillStyle = i < s.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${s.charge} / ${s.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${s.charge} / ${s.capacity}`;
}

shieldEvents.addEventListener("changed", () => drawMeter(snapshot()));

function renderStats(s: Shield) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${s.charge} · Missing charge: ${s.missing}`;
}

// C3: the inspector's own listener; added on open, removed on close
function onShieldChanged() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot());
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () =>
  setCount(count - 1);
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () =>
  setCount(count + 1);
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () =>
  setCount(0);
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(snapshot());
  shieldEvents.addEventListener("changed", onShieldChanged);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldEvents.removeEventListener("changed", onShieldChanged);
  panel.remove();
  panel = null;
};
drawMeter(snapshot());
