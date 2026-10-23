export {};

const CREW_SIZE = 6;
const SUPPLY_PER_PRODUCER = 3;
const DEFAULT_ASSIGNED = 2;

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedToSupplies = DEFAULT_ASSIGNED;

function computeShift(assigned: number) {
  const production = assigned * SUPPLY_PER_PRODUCER;
  const consumption = CREW_SIZE;
  const balance = production - consumption;
  return { assigned, production, consumption, balance };
}

function renderAllocation() {
  const { production, consumption, balance } = computeShift(assignedToSupplies);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < CREW_SIZE; i++) {
    ctx.fillStyle = i < assignedToSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedToSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedToSupplies} / ${CREW_SIZE}`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  readout.textContent =
    `Assigned: ${assignedToSupplies}/${CREW_SIZE} · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = Math.max(0, assignedToSupplies - 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = Math.min(CREW_SIZE, assignedToSupplies + 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = DEFAULT_ASSIGNED;
    renderAllocation();
  };
renderAllocation();
