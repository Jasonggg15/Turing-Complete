import { useRef, useEffect, useCallback } from 'react';
import { Circuit } from '../engine/Circuit';
import { GateType } from '../engine/types';
import type { Level } from '../levels/Level';
import type { Camera } from './Grid';
import { drawGrid } from './Grid';
import { drawGate } from './GateRenderer';
import { drawWire, drawWirePreview } from './WireRenderer';
import { Interaction } from './Interaction';
import { Simulator } from '../engine/Simulator';

interface CanvasProps {
  circuit: Circuit;
  selectedTool: GateType | null;
  onCircuitChange: () => void;
  selectedGateId: string | null;
  onSelectGate: (id: string | null) => void;
  renderVersion: number;
  level?: Level;
}

export default function Canvas({
  circuit,
  selectedTool,
  onCircuitChange,
  selectedGateId,
  onSelectGate,
  renderVersion,
  level,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>({ offsetX: 100, offsetY: 100, zoom: 1 });
  const interactionRef = useRef<Interaction | null>(null);
  const rafRef = useRef<number>(0);
  const needsRenderRef = useRef(true);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const camera = cameraRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height, camera);

    ctx.save();
    ctx.translate(camera.offsetX, camera.offsetY);
    ctx.scale(camera.zoom, camera.zoom);

    let simulationResult: Map<string, boolean> | undefined;
    try {
      const inputGates = circuit
        .getGates()
        .filter((g) => g.type === GateType.INPUT);
      const inputsMap = new Map<string, boolean>();
      for (const ig of inputGates) {
        const outPin = ig.outputs[0];
        if (outPin) {
          inputsMap.set(outPin.id, outPin.value ?? false);
        }
      }
      simulationResult = new Simulator().simulate(circuit, inputsMap);
    } catch {
      simulationResult = undefined;
    }

    for (const wire of circuit.getWires()) {
      drawWire(ctx, circuit, wire, simulationResult);
    }

    for (const gate of circuit.getGates()) {
      const pos = circuit.getGatePosition(gate.id);
      if (pos) {
        drawGate(ctx, gate, pos, gate.id === selectedGateId, simulationResult);
      }
    }

    const interaction = interactionRef.current;
    if (interaction) {
      const wiringFrom = interaction.getWiringFrom();
      if (wiringFrom && interaction.getState() === 'wiring') {
        drawWirePreview(ctx, wiringFrom.pos, interaction.getMouseWorld());
      }
    }

    ctx.restore();
  }, [circuit, selectedGateId]);

  const requestRender = useCallback(() => {
    needsRenderRef.current = true;
  }, []);

  useEffect(() => {
    const loop = () => {
      if (needsRenderRef.current) {
        needsRenderRef.current = false;
        render();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const interaction = new Interaction(
      canvas,
      circuit,
      cameraRef.current,
      {
        onCircuitChange,
        onSelectGate,
        requestRender,
      },
      level,
    );
    interactionRef.current = interaction;

    return () => {
      interaction.destroy();
      interactionRef.current = null;
    };
  }, [circuit, onCircuitChange, onSelectGate, requestRender, level]);

  useEffect(() => {
    interactionRef.current?.setSelectedTool(selectedTool);
    requestRender();
  }, [selectedTool, requestRender]);

  useEffect(() => {
    interactionRef.current?.setSelectedGateId(selectedGateId);
    requestRender();
  }, [selectedGateId, requestRender]);

  useEffect(() => {
    requestRender();
  }, [circuit, renderVersion, requestRender]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
        requestRender();
      }
    });

    observer.observe(canvas.parentElement ?? canvas);
    return () => observer.disconnect();
  }, [requestRender]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: selectedTool ? 'crosshair' : 'default',
      }}
    />
  );
}
