export interface Camera {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export const GRID_SIZE = 20;

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camera: Camera,
): void {
  const { offsetX, offsetY, zoom } = camera;

  const startX = Math.floor(-offsetX / zoom / GRID_SIZE) * GRID_SIZE;
  const startY = Math.floor(-offsetY / zoom / GRID_SIZE) * GRID_SIZE;
  const endX =
    Math.ceil((width - offsetX) / zoom / GRID_SIZE) * GRID_SIZE;
  const endY =
    Math.ceil((height - offsetY) / zoom / GRID_SIZE) * GRID_SIZE;

  ctx.strokeStyle = '#16213e';
  ctx.lineWidth = 1 / zoom;

  ctx.beginPath();
  for (let x = startX; x <= endX; x += GRID_SIZE) {
    const sx = x * zoom + offsetX;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
  }
  for (let y = startY; y <= endY; y += GRID_SIZE) {
    const sy = y * zoom + offsetY;
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
  }
  ctx.stroke();
}
