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

  // Draw subtle dot grid
  const dotRadius = 1 / zoom;
  ctx.fillStyle = '#1e2a4a';

  for (let x = startX; x <= endX; x += GRID_SIZE) {
    for (let y = startY; y <= endY; y += GRID_SIZE) {
      const sx = x * zoom + offsetX;
      const sy = y * zoom + offsetY;
      ctx.beginPath();
      ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
