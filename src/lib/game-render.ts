export const W = 320;
export const H = 440;
export const NET_X = 30;
export const NET_W = 260;
export const NET_Y = 36;
export const NET_H = 96;
export const NET_CENTER_X = NET_X + NET_W / 2;
export const GOALIE_HALF = 26;

export type GoaliePose = "idle" | "armsUp" | "slumped";

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

export function drawNet(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(NET_X, NET_Y, NET_W, NET_H);
  ctx.clip();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(NET_X, NET_Y, NET_W, NET_H);
  ctx.strokeStyle = "rgba(19,38,63,.18)";
  ctx.lineWidth = 1;
  for (let x = NET_X - NET_H; x < NET_X + NET_W + NET_H; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, NET_Y);
    ctx.lineTo(x + NET_H, NET_Y + NET_H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, NET_Y + NET_H);
    ctx.lineTo(x + NET_H, NET_Y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.strokeRect(NET_X, NET_Y, NET_W, NET_H);

  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(NET_X - 10, NET_Y + NET_H);
  ctx.lineTo(NET_X + NET_W + 10, NET_Y + NET_H);
  ctx.stroke();
}

function drawGoalieStick(ctx: CanvasRenderingContext2D, cx: number, padsTop: number, padsH: number) {
  const handX = cx + GOALIE_HALF - 2;
  ctx.strokeStyle = "#5b6b7e";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(handX, padsTop - 20);
  ctx.lineTo(handX + 4, padsTop + padsH + 2);
  ctx.stroke();
  ctx.fillStyle = "#5b6b7e";
  ctx.beginPath();
  ctx.roundRect(handX - 1, padsTop + padsH - 6, 8, 12, 2);
  ctx.fill();
}

function drawGoalieLegPads(ctx: CanvasRenderingContext2D, cx: number, padsTop: number, padsH: number) {
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#102a47";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - GOALIE_HALF, padsTop, GOALIE_HALF * 2, padsH, 5);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(16,42,71,.28)";
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const y = padsTop + (padsH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(cx - GOALIE_HALF + 3, y);
    ctx.lineTo(cx + GOALIE_HALF - 3, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx, padsTop + 3);
  ctx.lineTo(cx, padsTop + padsH - 3);
  ctx.stroke();

  ctx.strokeStyle = "#8a97a6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - GOALIE_HALF + 2, padsTop + padsH + 1);
  ctx.lineTo(cx - 6, padsTop + padsH + 1);
  ctx.moveTo(cx + 6, padsTop + padsH + 1);
  ctx.lineTo(cx + GOALIE_HALF - 2, padsTop + padsH + 1);
  ctx.stroke();
}

function drawGoalieArms(
  ctx: CanvasRenderingContext2D,
  cx: number,
  pose: GoaliePose,
  torsoTop: number,
  torsoBottom: number,
  jerseyColor: string,
) {
  if (pose === "idle") {
    ctx.fillStyle = "#c8a165";
    ctx.strokeStyle = "#102a47";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx - GOALIE_HALF - 6, torsoTop + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = jerseyColor;
    ctx.beginPath();
    ctx.roundRect(cx + GOALIE_HALF - 4, torsoTop + 6, 9, 14, 2);
    ctx.fill();
    ctx.stroke();
    return;
  }

  ctx.strokeStyle = jerseyColor;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (pose === "armsUp") {
    ctx.moveTo(cx - GOALIE_HALF + 6, torsoTop + 4);
    ctx.lineTo(cx - GOALIE_HALF - 10, torsoTop - 16);
    ctx.moveTo(cx + GOALIE_HALF - 6, torsoTop + 4);
    ctx.lineTo(cx + GOALIE_HALF + 10, torsoTop - 16);
  } else {
    ctx.moveTo(cx - GOALIE_HALF + 6, torsoTop + 4);
    ctx.lineTo(cx - GOALIE_HALF - 4, torsoBottom + 6);
    ctx.moveTo(cx + GOALIE_HALF - 6, torsoTop + 4);
    ctx.lineTo(cx + GOALIE_HALF + 4, torsoBottom + 6);
  }
  ctx.stroke();
}

function drawGoalieTorso(
  ctx: CanvasRenderingContext2D,
  cx: number,
  torsoTop: number,
  torsoBottom: number,
  jerseyColor: string,
  trimColor: string,
) {
  const grad = ctx.createLinearGradient(0, torsoTop, 0, torsoBottom);
  grad.addColorStop(0, lighten(jerseyColor, 45));
  grad.addColorStop(1, jerseyColor);
  ctx.fillStyle = grad;
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - GOALIE_HALF + 5, torsoTop, GOALIE_HALF * 2 - 10, torsoBottom - torsoTop, 6);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 8, torsoTop + 6);
  ctx.quadraticCurveTo(cx, torsoTop + 10, cx - 6, torsoTop + 16);
  ctx.moveTo(cx + 8, torsoTop + 6);
  ctx.quadraticCurveTo(cx, torsoTop + 10, cx + 6, torsoTop + 16);
  ctx.stroke();
}

function drawGoalieMask(ctx: CanvasRenderingContext2D, cx: number, headCY: number, headR: number) {
  ctx.fillStyle = "#102a47";
  ctx.beginPath();
  ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,.6)";
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    const y = headCY + i * 4;
    ctx.beginPath();
    ctx.moveTo(cx - headR + 3, y);
    ctx.lineTo(cx + headR - 3, y);
    ctx.stroke();
  }
  for (let i = -1; i <= 1; i++) {
    const x = cx + i * 5;
    ctx.beginPath();
    ctx.moveTo(x, headCY - headR + 4);
    ctx.lineTo(x, headCY + headR - 4);
    ctx.stroke();
  }
}

function drawJerseyText(
  ctx: CanvasRenderingContext2D,
  cx: number,
  torsoTop: number,
  torsoBottom: number,
  crest?: string,
  number?: number,
) {
  if (!crest && number === undefined) return;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  if (crest) {
    ctx.font = "bold 6px system-ui, sans-serif";
    ctx.fillText(crest, cx, torsoTop + 9);
  }
  if (number !== undefined) {
    ctx.font = "bold 10px system-ui, sans-serif";
    ctx.fillText(String(number), cx, torsoBottom - 6);
  }
}

export function drawGoalie(
  ctx: CanvasRenderingContext2D,
  cx: number,
  pose: GoaliePose,
  liftY: number,
  jerseyColor = "#1f5fd4",
  trimColor = "#102a47",
  crest?: string,
  number?: number,
) {
  const bodyTop = NET_Y + 8 + liftY;
  const bodyBottom = NET_Y + NET_H - 6 + liftY;
  const padsH = 34;
  const padsTop = bodyBottom - padsH;
  const headR = 11;
  const headCY = bodyTop + headR + (pose === "slumped" ? 4 : 0);
  const torsoTop = headCY + headR - 3;
  const torsoBottom = padsTop + 6;

  drawGoalieStick(ctx, cx, padsTop, padsH);
  drawGoalieLegPads(ctx, cx, padsTop, padsH);
  drawGoalieArms(ctx, cx, pose, torsoTop, torsoBottom, jerseyColor);
  drawGoalieTorso(ctx, cx, torsoTop, torsoBottom, jerseyColor, trimColor);
  drawJerseyText(ctx, cx, torsoTop, torsoBottom, crest, number);
  drawGoalieMask(ctx, cx, headCY, headR);
}

export function drawShooter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  jerseyColor = "#e08e2b",
  trimColor = "#102a47",
  crest?: string,
  number?: number,
  hit = false,
) {
  const bodyW = 22;
  const bodyH = 30;
  const headR = 9;
  const torsoTop = y - bodyH - headR * 1.2;
  const torsoBottom = torsoTop + bodyH;
  const headCY = torsoTop - headR + 3;

  ctx.strokeStyle = "#5b6b7e";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + bodyW / 2 - 2, torsoTop + 8);
  ctx.lineTo(x + bodyW / 2 + 12, y - 4);
  ctx.stroke();
  ctx.fillStyle = "#5b6b7e";
  ctx.beginPath();
  ctx.roundRect(x + bodyW / 2 + 8, y - 6, 11, 5, 2);
  ctx.fill();

  ctx.strokeStyle = "#13263F";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 6, torsoBottom);
  ctx.lineTo(x - 7, torsoBottom + 16);
  ctx.moveTo(x + 6, torsoBottom);
  ctx.lineTo(x + 7, torsoBottom + 16);
  ctx.stroke();
  ctx.strokeStyle = "#8a97a6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 12, torsoBottom + 17);
  ctx.lineTo(x - 2, torsoBottom + 17);
  ctx.moveTo(x + 2, torsoBottom + 17);
  ctx.lineTo(x + 12, torsoBottom + 17);
  ctx.stroke();

  ctx.strokeStyle = jerseyColor;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (hit) {
    ctx.moveTo(x + bodyW / 2 - 3, torsoTop + 5);
    ctx.lineTo(x + bodyW / 2 + 9, torsoBottom - 4);
    ctx.moveTo(x - bodyW / 2 + 3, torsoTop + 5);
    ctx.lineTo(x - bodyW / 2 - 9, torsoBottom - 4);
  } else {
    ctx.moveTo(x + bodyW / 2 - 3, torsoTop + 5);
    ctx.lineTo(x + bodyW / 2 + 5, torsoTop + 17);
    ctx.moveTo(x - bodyW / 2 + 3, torsoTop + 5);
    ctx.lineTo(x - bodyW / 2 - 5, torsoTop + 14);
  }
  ctx.stroke();

  const grad = ctx.createLinearGradient(0, torsoTop, 0, torsoBottom);
  grad.addColorStop(0, lighten(jerseyColor, 40));
  grad.addColorStop(1, jerseyColor);
  ctx.fillStyle = grad;
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x - bodyW / 2, torsoTop, bodyW, bodyH, 7);
  ctx.fill();
  ctx.stroke();

  drawJerseyText(ctx, x, torsoTop, torsoBottom, crest, number);

  if (!hit) {
    ctx.fillStyle = trimColor;
    ctx.beginPath();
    ctx.arc(x, headCY, headR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - headR + 2, headCY - 1);
    ctx.lineTo(x + headR - 2, headCY - 1);
    ctx.stroke();
  }
}

export function drawSkater(ctx: CanvasRenderingContext2D, x: number, y: number, jersey: string, armsUp: boolean) {
  const bodyW = 15;
  const bodyH = 19;
  const headR = 6.5;

  ctx.strokeStyle = "#13263F";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 4, y + bodyH / 2);
  ctx.lineTo(x - 5, y + bodyH / 2 + 13);
  ctx.moveTo(x + 4, y + bodyH / 2);
  ctx.lineTo(x + 5, y + bodyH / 2 + 13);
  ctx.stroke();

  ctx.strokeStyle = jersey;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (armsUp) {
    ctx.moveTo(x - bodyW / 2, y - bodyH / 2 + 3);
    ctx.lineTo(x - bodyW / 2 - 7, y - bodyH / 2 - 9);
    ctx.moveTo(x + bodyW / 2, y - bodyH / 2 + 3);
    ctx.lineTo(x + bodyW / 2 + 7, y - bodyH / 2 - 9);
  } else {
    ctx.moveTo(x - bodyW / 2, y - bodyH / 2 + 3);
    ctx.lineTo(x - bodyW / 2 - 3, y + bodyH / 2 - 2);
    ctx.moveTo(x + bodyW / 2, y - bodyH / 2 + 3);
    ctx.lineTo(x + bodyW / 2 + 3, y + bodyH / 2 - 2);
  }
  ctx.stroke();

  ctx.fillStyle = jersey;
  ctx.beginPath();
  ctx.roundRect(x - bodyW / 2, y - bodyH / 2, bodyW, bodyH, 4);
  ctx.fill();

  ctx.fillStyle = "#13263F";
  ctx.beginPath();
  ctx.arc(x, y - bodyH / 2 - headR + 2, headR, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHelmetDrop(
  ctx: CanvasRenderingContext2D,
  x: number,
  startY: number,
  endY: number,
  t: number,
  color = "#102a47",
) {
  const y = startY + (endY - startY) * t;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
}

export function drawSaveCelebration(
  ctx: CanvasRenderingContext2D,
  goalieX: number,
  elapsed: number,
  jerseyColor = "#1f5fd4",
  trimColor = "#102a47",
) {
  const enter = Math.min(1, Math.max(0, (elapsed - 250) / 500));
  const lift = Math.min(1, Math.max(0, (elapsed - 700) / 700));
  const liftY = -18 * lift;
  const leftStart = NET_X - 50;
  const rightStart = NET_X + NET_W + 50;
  const leftX = leftStart + (goalieX - GOALIE_HALF - 14 - leftStart) * enter;
  const rightX = rightStart + (goalieX + GOALIE_HALF + 14 - rightStart) * enter;
  const teamY = NET_Y + NET_H - 20 + liftY;
  drawSkater(ctx, leftX, teamY, jerseyColor, enter > 0.5);
  drawSkater(ctx, rightX, teamY, jerseyColor, enter > 0.5);
  drawGoalie(ctx, goalieX, "armsUp", liftY, jerseyColor, trimColor);
}

export function drawGoalCelebration(
  ctx: CanvasRenderingContext2D,
  goalieX: number,
  elapsed: number,
  jerseyColor = "#1f5fd4",
  trimColor = "#102a47",
  opponentJersey = "#e08e2b",
) {
  drawGoalie(ctx, goalieX, "slumped", 0, jerseyColor, trimColor);

  const breakT = Math.min(1, elapsed / 500);
  const sx = goalieX + GOALIE_HALF + 6;
  const sy = NET_Y + NET_H - 30;
  ctx.strokeStyle = "#5b6b7e";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + 14 * breakT, sy - 10 - 14 * breakT);
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx - 4 * breakT, sy + 16 + 10 * breakT);
  ctx.stroke();

  drawHelmetDrop(ctx, goalieX - GOALIE_HALF - 6, NET_Y + 4, NET_Y + NET_H + 6, Math.min(1, Math.max(0, (elapsed - 100) / 450)), trimColor);

  const crowdEnter = Math.min(1, Math.max(0, (elapsed - 400) / 700));
  const bounce = crowdEnter > 0.05 ? Math.sin(elapsed / 120) * 3 : 0;
  [-40, 0, 40].forEach((offset, i) => {
    const startY = H + 20;
    const endY = H * 0.62 + (i % 2 === 0 ? 6 : -6);
    const y = startY + (endY - startY) * crowdEnter + bounce;
    drawSkater(ctx, NET_CENTER_X + offset, y, opponentJersey, crowdEnter > 0.3);
  });
}
