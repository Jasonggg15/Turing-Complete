# 任务列表 — Turing Complete

每个任务对应一次 `oh-my-opencode run` 调用。按顺序执行。

---

## Phase 1: 项目初始化 + Circuit Engine

### Task 1.0 — 项目脚手架

**Prompt:**
```
ultrawork

Initialize a TypeScript + React + Vite project in the current directory:
- Use pnpm as package manager
- Configure TypeScript strict mode
- Set up Vitest for testing
- Set up ESLint + Prettier
- Create the folder structure as defined in docs/ARCHITECTURE.md
- Create placeholder files for each module (empty exports)
- DO NOT install unnecessary dependencies

Read docs/ARCHITECTURE.md first for the full project structure.
```

**验收标准：**
- `pnpm dev` 能跑起来看到空白 React 页面
- `pnpm test` 能运行（即使没有真实测试）
- 目录结构与 ARCHITECTURE.md 一致

---

### Task 1.1 — 逻辑门实现

**Prompt:**
```
ultrawork

Implement the core logic gate system in src/engine/:

1. types.ts: Define Pin, GateType, GateConfig interfaces
2. Gate.ts: Implement base Gate class and concrete gates:
   - NAND (2 inputs, 1 output) — this is the fundamental gate
   - AND, OR, NOT, XOR — all derived from NAND conceptually, but implemented directly for efficiency
3. Each gate must have:
   - A unique id (uuid)
   - Named input/output pins
   - An evaluate() method that computes outputs from inputs
4. Write comprehensive tests in src/engine/__tests__/Gate.test.ts
   - Test each gate with all input combinations (truth table verification)

Read docs/ARCHITECTURE.md for context.
```

**验收标准：**
- 所有门的真值表测试通过
- 类型定义清晰完整

---

### Task 1.2 — Wire + Circuit 容器

**Prompt:**
```
ultrawork

Implement Wire and Circuit in src/engine/:

1. Wire.ts: A wire connects one output Pin to one input Pin
   - Validate: cannot connect output-to-output or input-to-input
   - A pin can have multiple wires (fan-out from output, but only one wire to each input)

2. Circuit.ts: Container that manages gates and wires
   - addGate(type, position) → Gate
   - removeGate(id) → void
   - addWire(fromPin, toPin) → Wire
   - removeWire(id) → void
   - getGates() / getWires() — accessors
   - serialize() / deserialize() — for save system later

3. Write tests in src/engine/__tests__/Circuit.test.ts
   - Test adding/removing gates and wires
   - Test wire validation rules
   - Test serialization round-trip

Read docs/ARCHITECTURE.md and existing code in src/engine/ for context.
```

---

### Task 1.3 — Simulator（信号传播）

**Prompt:**
```
ultrawork

Implement the circuit simulator in src/engine/Simulator.ts:

1. Takes a Circuit as input
2. Performs topological sort on the gate graph
3. Propagates signals from inputs through all gates to outputs
4. Detects combinational loops (error, not supported in MVP)
5. Returns the final state of all pins

Key method: simulate(circuit: Circuit, inputs: Map<string, boolean>) → Map<string, boolean>

Write thorough tests in src/engine/__tests__/Simulator.test.ts:
- Simple NOT gate circuit
- AND gate with 2 inputs
- Chained gates (output of one → input of another)
- Half adder circuit (XOR + AND)
- Loop detection (should throw error)

Read docs/ARCHITECTURE.md and existing src/engine/ code.
```

---

## Phase 2: 可视化编辑器

### Task 2.0 — Canvas 基础渲染

**Prompt:**
```
ultrawork

Implement the circuit canvas renderer in src/editor/:

1. Canvas.tsx: React component wrapping an HTML5 Canvas
   - Manages canvas sizing (fill parent container)
   - Sets up render loop (requestAnimationFrame)
   - Handles zoom and pan (scroll to zoom, middle-click drag to pan)

2. GateRenderer.ts: Draw logic gates on canvas
   - Each gate type has a distinct visual (standard logic gate symbols or simple labeled boxes)
   - Show pin connection points as small circles
   - Highlight pins based on signal state (green = HIGH/true, gray = LOW/false)

3. WireRenderer.ts: Draw wires between pins
   - Use bezier curves for nice routing
   - Color based on signal (green = HIGH, gray = LOW)

4. Grid.ts: Snap-to-grid system for neat placement

Read docs/ARCHITECTURE.md. Use the Circuit model from src/engine/ as the data source.
```

---

### Task 2.1 — 交互系统

**Prompt:**
```
ultrawork

Implement user interaction for the circuit editor in src/editor/Interaction.ts and Toolbar.tsx:

1. Interaction.ts — event handling on canvas:
   - Click gate in toolbar → click canvas to place it
   - Drag existing gate to move it
   - Click output pin → drag to input pin to create wire
   - Right-click gate/wire to delete
   - Click input pins (with no wire) to toggle their value (for testing)

2. Toolbar.tsx — React component:
   - Shows available gates for current level
   - Gate selection with visual feedback
   - Run/simulate button
   - Clear circuit button

Integrate with Canvas.tsx and the Circuit model. All interactions should update the Circuit and trigger re-render.

Read existing code in src/editor/ and src/engine/.
```

---

## Phase 3: 关卡系统

### Task 3.0 — Level 框架 + 前 3 关

**Prompt:**
```
ultrawork

Implement the level system in src/levels/:

1. Level.ts: Level interface (see docs/ARCHITECTURE.md for the schema)

2. LevelRunner.ts:
   - Takes a Level definition and a player's Circuit
   - Runs the Simulator with each truth table input combination
   - Compares outputs to expected values
   - Returns pass/fail with details on which cases failed

3. Implement first 3 levels in src/levels/levels/:
   - 01-not.ts: Build NOT from NAND only
   - 02-and.ts: Build AND from NAND only
   - 03-or.ts: Build OR from NAND and NOT

4. LevelSelect.tsx: Simple level selection UI showing completed/locked/available

5. Integrate into the main App with React Router:
   - / → Home page (title + start button)
   - /levels → Level select
   - /play/:levelId → Game view (editor + level info panel)

Write tests for LevelRunner.

Read docs/ARCHITECTURE.md and all existing code.
```

---

## 使用说明

每个 Task 在项目根目录下运行：

```bash
cd ~/Turing-Complete
oh-my-opencode run "你的 prompt"
```

跑完后：
1. `pnpm test` 确认测试通过
2. `pnpm dev` 看看效果
3. 觉得 OK 就 commit：
   ```bash
   git add .
   git commit -m "feat(engine): implement logic gates with truth table tests"
   git push
   ```
4. 有问题找石像讨论

## Commit 规范 (Conventional Commits)

格式：`type(scope): description`

常用 type：
- `feat` — 新功能
- `fix` — 修 bug
- `docs` — 文档
- `test` — 测试
- `refactor` — 重构
- `chore` — 构建/工具

scope 建议：`engine`, `editor`, `levels`, `save`, `app`
