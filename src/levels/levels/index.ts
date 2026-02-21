import type { Level } from '../Level';
import { level01CrudeAwakening } from './01-crude-awakening';
import { level02NandGate } from './02-nand-gate';
import { level03NotGate } from './03-not-gate';
import { level04NorGate } from './04-nor-gate';
import { level05OrGate } from './05-or-gate';
import { level06AndGate } from './06-and-gate';
import { level07AlwaysOn } from './07-always-on';
import { level08SecondTick } from './08-second-tick';
import { level09XorGate } from './09-xor-gate';
import { level10BiggerOrGate } from './10-bigger-or-gate';
import { level11BiggerAndGate } from './11-bigger-and-gate';
import { level12XnorGate } from './12-xnor-gate';
// Arithmetic
import { level13OddNumberOfSignals } from './13-odd-number-of-signals';
import { level14DoubleTrouble } from './14-double-trouble';
import { level15BinaryRacer } from './15-binary-racer';
import { level16CountingSignals } from './16-counting-signals';
import { level17DoubleTheNumber } from './17-double-the-number';
import { level18ByteOr } from './18-byte-or';
import { level19ByteNot } from './19-byte-not';
import { level20HalfAdder } from './20-half-adder';
import { level21FullAdder } from './21-full-adder';
import { level22AddingBytes } from './22-adding-bytes';
import { level23NegativeNumbers } from './23-negative-numbers';
import { level24SignedNegator } from './24-signed-negator';
import { level251BitDecoder } from './25-1-bit-decoder';
import { level263BitDecoder } from './26-3-bit-decoder';
import { level27LogicEngine } from './27-logic-engine';

export const levels: Level[] = [
  // Basic Logic
  level01CrudeAwakening,
  level02NandGate,
  level03NotGate,
  level04NorGate,
  level05OrGate,
  level06AndGate,
  level07AlwaysOn,
  level08SecondTick,
  level09XorGate,
  level10BiggerOrGate,
  level11BiggerAndGate,
  level12XnorGate,
  // Arithmetic
  level13OddNumberOfSignals,
  level14DoubleTrouble,
  level15BinaryRacer,
  level16CountingSignals,
  level17DoubleTheNumber,
  level18ByteOr,
  level19ByteNot,
  level20HalfAdder,
  level21FullAdder,
  level22AddingBytes,
  level23NegativeNumbers,
  level24SignedNegator,
  level251BitDecoder,
  level263BitDecoder,
  level27LogicEngine,
];
