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

  // At low zoom, use larger grid spacing to reduce dot count
  const step = zoom < 0.5 ? GRID_SIZE * 2 : GRID_SIZE;

  const startX = Math.floor(-offsetX / zoom / step) * step;
  const startY = Math.floor(-offsetY / zoom / step) * step;
  const endX = Math.ceil((width - offsetX) / zoom / step) * step;
  const endY = Math.ceil((height - offsetY) / zoom / step) * step;

  // Draw subtle dot grid
  const dotRadius = 1 / zoom;
  ctx.fillStyle = '#1e2a4a';

  for (let x = startX; x <= endX; x += step) {
    for (let y = startY; y <= endY; y += step) {
      const sx = x * zoom + offsetX;
      const sy = y * zoom + offsetY;
      ctx.beginPath();
      ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
