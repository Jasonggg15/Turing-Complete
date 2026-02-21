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
// Memory
import { level28CircularDependency } from './28-circular-dependency';
import { level29DelayedLines } from './29-delayed-lines';
import { level30OddTicks } from './30-odd-ticks';
import { level31BitInverter } from './31-bit-inverter';
import { level32BitSwitch } from './32-bit-switch';
import { level33InputSelector } from './33-input-selector';
import { level34TheBus } from './34-the-bus';
import { level35SavingGracefully } from './35-saving-gracefully';
import { level36SavingBytes } from './36-saving-bytes';
import { level37LittleBox } from './37-little-box';
import { level38Counter } from './38-counter';
// CPU Architecture
import { level39ArithmeticEngine } from './39-arithmetic-engine';
import { level40Registers } from './40-registers';
import { level41ComponentFactory } from './41-component-factory';
import { level42InstructionDecoder } from './42-instruction-decoder';
import { level43Calculations } from './43-calculations';
import { level44Program } from './44-program';
import { level45Conditions } from './45-conditions';
import { level46ImmediateValues } from './46-immediate-values';
import { level47TuringComplete } from './47-turing-complete';
// Programming
import { level48Add5 } from './48-add-5';
import { level49CalibratingLaserCannons } from './49-calibrating-laser-cannons';
import { level50MaskingTime } from './50-masking-time';
import { level51StorageCracker } from './51-storage-cracker';
import { level52SpacialInvasion } from './52-spacial-invasion';
import { level53TheMaze } from './53-the-maze';
// CPU Architecture 2
import { level54Xor } from './54-xor';
import { level55ByteConstant } from './55-byte-constant';
import { level56ByteXor } from './56-byte-xor';
import { level57Equality } from './57-equality';
import { level58UnsignedLess } from './58-unsigned-less';
import { level59SignedLess } from './59-signed-less';
import { level60WideInstructions } from './60-wide-instructions';
import { level61WireSpaghetti } from './61-wire-spaghetti';
import { level62Opcodes } from './62-opcodes';
import { level63ImmediateValuesLeg } from './63-immediate-values-leg';
import { level64Conditionals } from './64-conditionals';
// Functions
import { level65HexRacer } from './65-hex-racer';
import { level66Shift } from './66-shift';
import { level67Ram } from './67-ram';
import { level68Delay } from './68-delay';
import { level69TheProductOfNibbles } from './69-the-product-of-nibbles';
import { level70Stack } from './70-stack';
import { level71TheLab } from './71-the-lab';
import { level72Divide } from './72-divide';
import { level73PushAndPop } from './73-push-and-pop';
import { level74Functions } from './74-functions';
// Assembly Challenges
import { level75AiShowdown } from './75-ai-showdown';
import { level76RobotRacing } from './76-robot-racing';
import { level77UnseenFruit } from './77-unseen-fruit';
import { level78DeliciousOrder } from './78-delicious-order';
import { level79DancingMachine } from './79-dancing-machine';
import { level80TowerOfAlloy } from './80-tower-of-alloy';
import { level81PlanetNames } from './81-planet-names';
import { level82Waterworld } from './82-waterworld';

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
  // Memory
  level28CircularDependency,
  level29DelayedLines,
  level30OddTicks,
  level31BitInverter,
  level32BitSwitch,
  level33InputSelector,
  level34TheBus,
  level35SavingGracefully,
  level36SavingBytes,
  level37LittleBox,
  level38Counter,
  // CPU Architecture
  level39ArithmeticEngine,
  level40Registers,
  level41ComponentFactory,
  level42InstructionDecoder,
  level43Calculations,
  level44Program,
  level45Conditions,
  level46ImmediateValues,
  level47TuringComplete,
  // Programming
  level48Add5,
  level49CalibratingLaserCannons,
  level50MaskingTime,
  level51StorageCracker,
  level52SpacialInvasion,
  level53TheMaze,
  // CPU Architecture 2
  level54Xor,
  level55ByteConstant,
  level56ByteXor,
  level57Equality,
  level58UnsignedLess,
  level59SignedLess,
  level60WideInstructions,
  level61WireSpaghetti,
  level62Opcodes,
  level63ImmediateValuesLeg,
  level64Conditionals,
  // Functions
  level65HexRacer,
  level66Shift,
  level67Ram,
  level68Delay,
  level69TheProductOfNibbles,
  level70Stack,
  level71TheLab,
  level72Divide,
  level73PushAndPop,
  level74Functions,
  // Assembly Challenges
  level75AiShowdown,
  level76RobotRacing,
  level77UnseenFruit,
  level78DeliciousOrder,
  level79DancingMachine,
  level80TowerOfAlloy,
  level81PlanetNames,
  level82Waterworld,
];
