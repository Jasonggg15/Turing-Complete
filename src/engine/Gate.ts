import { type Signal, type Pin, type GateConfig, GateType } from './types';

function createPin(
  gateId: string,
  name: string,
  direction: 'input' | 'output',
): Pin {
  return {
    id: `${gateId}:${name}`,
    gateId,
    name,
    direction,
    value: undefined,
  };
}

export interface Stateful {
  tick(): void;
  resetState(): void;
}

export function isStateful(gate: Gate): gate is Gate & Stateful {
  return 'tick' in gate && 'resetState' in gate;
}

export abstract class Gate {
  readonly id: string;
  readonly type: GateType;
  readonly label: string;
  readonly inputs: Pin[];
  readonly outputs: Pin[];

  constructor(
    type: GateType,
    inputNames: string[],
    outputNames: string[],
    id?: string,
    label?: string,
  ) {
    this.id = id ?? crypto.randomUUID();
    this.type = type;
    this.label = label ?? '';
    this.inputs = inputNames.map((n) => createPin(this.id, n, 'input'));
    this.outputs = outputNames.map((n) => createPin(this.id, n, 'output'));
  }

  abstract evaluate(): void;

  getInput(name: string): Pin {
    const pin = this.inputs.find((p) => p.name === name);
    if (!pin)
      throw new Error(
        `Input pin "${name}" not found on ${this.type} gate ${this.id}`,
      );
    return pin;
  }

  getOutput(name: string): Pin {
    const pin = this.outputs.find((p) => p.name === name);
    if (!pin)
      throw new Error(
        `Output pin "${name}" not found on ${this.type} gate ${this.id}`,
      );
    return pin;
  }

  protected readInput(name: string): Signal {
    return this.getInput(name).value ?? false;
  }

  protected writeOutput(name: string, value: Signal): void {
    this.getOutput(name).value = value;
  }
}

export class NandGate extends Gate {
  constructor(id?: string) {
    super(GateType.NAND, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', !(a && b));
  }
}

export class AndGate extends Gate {
  constructor(id?: string) {
    super(GateType.AND, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', a && b);
  }
}

export class OrGate extends Gate {
  constructor(id?: string) {
    super(GateType.OR, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', a || b);
  }
}

export class NotGate extends Gate {
  constructor(id?: string) {
    super(GateType.NOT, ['in'], ['out'], id);
  }

  evaluate(): void {
    this.writeOutput('out', !this.readInput('in'));
  }
}

export class XorGate extends Gate {
  constructor(id?: string) {
    super(GateType.XOR, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', a !== b);
  }
}

export class NorGate extends Gate {
  constructor(id?: string) {
    super(GateType.NOR, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', !(a || b));
  }
}

export class XnorGate extends Gate {
  constructor(id?: string) {
    super(GateType.XNOR, ['a', 'b'], ['out'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('out', a === b);
  }
}

export class InputGate extends Gate {
  constructor(label: string, id?: string) {
    super(GateType.INPUT, [], ['out'], id, label);
  }

  evaluate(): void {
    // no-op: output is set externally by the simulator
  }
}

export class OutputGate extends Gate {
  constructor(label: string, id?: string) {
    super(GateType.OUTPUT, ['in'], [], id, label);
  }

  evaluate(): void {
    // no-op: input is read after simulation
  }
}

/**
 * D flip-flop: On tick(), latches the value of input 'd' into internal state.
 * evaluate() outputs the current stored state to 'q' and its complement to 'qn'.
 */
export class DFlipFlopGate extends Gate implements Stateful {
  private state: boolean = false;

  constructor(id?: string) {
    super(GateType.D_FLIPFLOP, ['d'], ['q', 'qn'], id);
  }

  evaluate(): void {
    this.writeOutput('q', this.state);
    this.writeOutput('qn', !this.state);
  }

  tick(): void {
    this.state = this.readInput('d');
  }

  resetState(): void {
    this.state = false;
  }
}

export class HalfAdderGate extends Gate {
  constructor(id?: string) {
    super(GateType.HALF_ADDER, ['a', 'b'], ['sum', 'carry'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    this.writeOutput('sum', a !== b);
    this.writeOutput('carry', a && b);
  }
}

export class FullAdderGate extends Gate {
  constructor(id?: string) {
    super(GateType.FULL_ADDER, ['a', 'b', 'cin'], ['sum', 'cout'], id);
  }

  evaluate(): void {
    const a = this.readInput('a');
    const b = this.readInput('b');
    const cin = this.readInput('cin');
    const axorb = a !== b;
    this.writeOutput('sum', axorb !== cin);
    this.writeOutput('cout', (a && b) || (axorb && cin));
  }
}

export function createGate(config: GateConfig): Gate {
  switch (config.type) {
    case GateType.NAND:
      return new NandGate(config.id);
    case GateType.AND:
      return new AndGate(config.id);
    case GateType.OR:
      return new OrGate(config.id);
    case GateType.NOT:
      return new NotGate(config.id);
    case GateType.XOR:
      return new XorGate(config.id);
    case GateType.NOR:
      return new NorGate(config.id);
    case GateType.XNOR:
      return new XnorGate(config.id);
    case GateType.INPUT:
      return new InputGate(config.label ?? '', config.id);
    case GateType.OUTPUT:
      return new OutputGate(config.label ?? '', config.id);
    case GateType.D_FLIPFLOP:
      return new DFlipFlopGate(config.id);
    case GateType.HALF_ADDER:
      return new HalfAdderGate(config.id);
    case GateType.FULL_ADDER:
      return new FullAdderGate(config.id);
  }
}
