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
    case GateType.INPUT:
      return new InputGate(config.label ?? '', config.id);
    case GateType.OUTPUT:
      return new OutputGate(config.label ?? '', config.id);
  }
}
