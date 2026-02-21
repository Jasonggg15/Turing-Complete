# Turing Complete — Development Roadmap

Goal: fully replicate the original Steam game "Turing Complete" by Lee Faulds as a browser game.

## Original Game Structure (82 levels, 8 sections)

| Section             | Levels | Engine Requirements                                      |
| ------------------- | ------ | -------------------------------------------------------- |
| Basic Logic         | 12     | Combinational gates, single-bit wires                    |
| Arithmetic          | 15     | Multi-bit buses (8-bit), byte-wide ops                   |
| Memory              | 11     | Clock/tick system, feedback loops, latches, registers    |
| CPU Architecture    | 9      | ALU, register file, instruction decoder, program counter |
| Programming         | 6      | Assembly editor, program execution runtime               |
| CPU Architecture 2  | 11     | Extended ISA, wider instructions                         |
| Functions           | 10     | Stack, RAM, function call/return                         |
| Assembly Challenges | 8      | Full CPU + assembly programming                          |

---

## Phase 1: Basic Logic (Current)

**Engine changes**: Add NOR, XNOR gate types.

**Levels to implement** (10 building levels, 2 tutorials):

| #   | Level           | Build                       | Available Gates    |
| --- | --------------- | --------------------------- | ------------------ |
| 1   | Crude Awakening | Tutorial — toggle input     | —                  |
| 2   | NAND Gate       | Tutorial — truth table quiz | NAND (observe)     |
| 3   | NOT Gate        | NOT from NAND               | NAND               |
| 4   | NOR Gate        | NOR from NAND+NOT           | NAND, NOT          |
| 5   | OR Gate         | OR from NAND+NOT            | NAND, NOT          |
| 6   | AND Gate        | AND from NAND+NOT           | NAND, NOT, NOR, OR |
| 7   | Always On       | Constant 1 output           | all prior          |
| 8   | Second Tick     | INHIBIT (A AND NOT B)       | all prior          |
| 9   | XOR Gate        | XOR from prior gates        | all prior          |
| 10  | Bigger OR Gate  | 3-input OR (cascade)        | all prior + XOR    |
| 11  | Bigger AND Gate | 3-input AND (cascade)       | all prior          |
| 12  | XNOR Gate       | XNOR = NOT(XOR)             | all prior          |

**UI changes**: Tutorial/quiz level types, level section headers.

**Status**: In progress.

---

## Phase 2: Multi-bit Buses

**Engine changes**:

- `Signal` type: expand from `boolean` to `boolean[]` (or add `Bus` type)
- Multi-bit wire connections (byte-wide)
- Byte-wide gate variants: Byte OR, Byte NOT, Byte AND, Byte XOR
- Splitter/merger components (split byte into bits, merge bits into byte)

**Levels**: ODD Number of Signals, Double Trouble, Binary Racer, Counting Signals, Double the Number, Byte OR, Byte NOT.

**Depends on**: Phase 1.

---

## Phase 3: Arithmetic

**Engine changes**: None beyond Phase 2.

**Levels**: Half Adder, Full Adder, Adding Bytes, Negative Numbers (quiz), Signed Negator, 1 Bit Decoder, 3 Bit Decoder, Logic Engine (programmable ALU).

**Key milestone**: Logic Engine = first programmable component.

**Depends on**: Phase 2.

---

## Phase 4: Custom Components

**Engine changes**:

- Save a solved circuit as a reusable component (serialize + package)
- Custom component has named input/output pins matching the level I/O
- Component library UI: browse, place custom components
- Nested simulation: simulate sub-circuits within parent circuits

**This is CRITICAL** — the original game's core mechanic is progressive composition. Every solved level becomes a reusable building block. Without this, later sections are impossible.

**Depends on**: Phase 3.

---

## Phase 5: Sequential Logic (Memory)

**Engine changes**:

- Clock/tick system: discrete time steps, not instant propagation
- Feedback loop support: replace topological sort with iterative/event-driven simulation
- Delay element: output = input from previous tick
- SR Latch, D Flip-Flop as buildable circuits (not primitives)

**Levels**: Circular Dependency, Delayed Lines, Odd Ticks, Bit Inverter, Bit Switch, Input Selector (MUX), The Bus, Saving Gracefully (D flip-flop), Saving Bytes (8-bit register), Little Box (small RAM), Counter.

**Key milestone**: 8-bit register + counter = foundation for CPU.

**Depends on**: Phase 4.

---

## Phase 6: CPU Architecture

**Engine changes**:

- ROM component (read-only memory for programs)
- Program counter with jump support
- Instruction decoding framework
- Multi-component workspace (larger canvas, component hierarchy)

**Levels**: Arithmetic Engine (ALU), Registers, Component Factory, Instruction Decoder, Calculations, Program, Conditions, Immediate Values, Turing Complete (final CPU level).

**Key milestone**: A working CPU that can execute programs.

**Depends on**: Phase 5.

---

## Phase 7: Programming Environment

**Engine changes**:

- Assembly language editor (text input, syntax highlighting)
- Program loader: assemble instructions into ROM
- Execution runtime: step through instructions, visualize register state
- I/O interface for programs

**Levels**: Add 5, Calibrating Laser Cannons, Masking Time, Storage Cracker, Spacial Invasion, The Maze.

**Depends on**: Phase 6.

---

## Phase 8: CPU Architecture 2 + Functions

**Engine changes**:

- Extended instruction encoding (wider instructions)
- RAM component (read-write memory)
- Stack pointer + stack operations
- Function call/return mechanism

**Levels**: CPU Architecture 2 section (11 levels) + Functions section (10 levels).

**Depends on**: Phase 7.

---

## Phase 9: Assembly Challenges

**Engine changes**: None — pure programming challenges.

**Levels**: AI Showdown, Robot Racing, Unseen Fruit, Delicious Order, Dancing Machine, Tower of Alloy, Planet Names, Water World.

**Depends on**: Phase 8.

---

## Architecture Decisions

### Progressive Component Unlocking

Each completed level unlocks its gate/component for use in later levels. The `Level` interface's `availableGates` field controls this. After Phase 4, custom components extend this system.

### Simulation Strategy

- **Phase 1-3**: Topological sort (DAG-based, no cycles) — current implementation.
- **Phase 5+**: Event-driven simulation with clock ticks. Each tick propagates signals through the circuit. Feedback loops stabilize within a tick (iterative convergence) or flag oscillation.

### Multi-bit Wires

Two approaches:

1. **Implicit**: Each wire carries `boolean[]`. Gates declare pin width. UI shows bus thickness.
2. **Explicit**: Add Splitter/Merger components. Wires stay single-bit internally; buses are visual sugar.

Recommend approach 2 — matches original game and keeps engine simple.

### Custom Components

Stored as `SerializedCircuit` + metadata (name, pin definitions). When placed in a parent circuit, the sub-circuit is instantiated and simulated as a unit. This is the same as the original game's "Component Factory" level.

---

## Effort Estimates

| Phase | Complexity | Key Risk                                              |
| ----- | ---------- | ----------------------------------------------------- |
| 1     | Low        | None — engine already supports this                   |
| 2     | Medium     | Bus UI rendering, pin width validation                |
| 3     | Low        | Depends on Phase 2 bus support                        |
| 4     | High       | Nested simulation correctness, component packaging UX |
| 5     | High       | Feedback loop convergence, clock system design        |
| 6     | High       | Multi-component workspace, instruction decoding       |
| 7     | Medium     | Assembly editor UX, program execution                 |
| 8     | Medium     | Stack/RAM components                                  |
| 9     | Low        | Pure content (assembly puzzles)                       |
