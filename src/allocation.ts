export {};

const CREW_SIZE = 6;
const SUPPLY_PER_PRODUCER = 3;
const DEFAULT_ASSIGNED = 2;

// A2: the facts for one shift, no DOM or canvas involved
type ShiftResult = {
  assigned: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedToSupplies = DEFAULT_ASSIGNED;

function computeShift(assigned: number): ShiftResult {
  const production = assigned * SUPPLY_PER_PRODUCER;
  const consumption = CREW_SIZE;
  const balance = production - consumption;
  return { assigned, production, consumption, balance };
}

// Graphic view
function drawChart(shift: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < CREW_SIZE; i++) {
    ctx.fillStyle = i < shift.assigned ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < shift.assigned ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.assigned} / ${CREW_SIZE}`, 18, 76);
  ctx.fillText(`Production: ${shift.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shift.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shift.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shift.consumption * 14, 20);
}

// Numerical view
function writeReadout(shift: ShiftResult) {
  const sign = shift.balance > 0 ? "+" : "";
  readout.textContent =
    `Assigned: ${shift.assigned}/${CREW_SIZE} · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${sign}${shift.balance}`;
}

function renderAllocation() {
  const shift = computeShift(assignedToSupplies);
  drawChart(shift);
  writeReadout(shift);
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
