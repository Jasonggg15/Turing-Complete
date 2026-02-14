import type { Level } from '../Level';
import { level01Not } from './01-not';
import { level02And } from './02-and';
import { level03Or } from './03-or';
import { level04Xor } from './04-xor';
import { level05HalfAdder } from './05-half-adder';

export const levels: Level[] = [
  level01Not,
  level02And,
  level03Or,
  level04Xor,
  level05HalfAdder,
];
