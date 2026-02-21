import type { Level } from '../Level';

/**
 * Level 53: The Maze
 *
 * Final level: navigate a maze using memory-mapped directions.
 * Memory contains a sequence of direction commands (1=forward, 2=turn left, 3=turn right, 0=stop).
 * Count total forward steps taken before stopping.
 */
export const level53TheMaze: Level = {
  id: '53-the-maze',
  name: 'The Maze',
  section: 'Programming',
  type: 'programming',
  description:
    'Navigate the maze! Memory contains a sequence of commands starting at address 0: 1=step forward, 2=turn left, 3=turn right, 0=stop. Read commands one by one, count the total number of forward steps (command=1), and output the count when you hit a stop command (0). Requires loops, memory access, and conditionals.',
  availableGates: [],
  availableInstructions: [
    'LOAD', 'LOAD_MEM', 'STORE', 'MOV', 'ADD', 'SUB',
    'AND', 'CMP', 'JMP', 'JZ', 'JNZ', 'OUT', 'HALT',
  ],
  inputs: [],
  outputs: [],
  truthTable: [],
  programTestCases: [
    {
      name: 'All forward',
      input: [],
      expectedOutput: [3],
      initialMemory: { 0: 1, 1: 1, 2: 1, 3: 0 },
    },
    {
      name: 'Mixed commands',
      input: [],
      expectedOutput: [2],
      initialMemory: { 0: 1, 1: 2, 2: 3, 3: 1, 4: 0 },
    },
    {
      name: 'Immediate stop',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 0 },
    },
    {
      name: 'Long path',
      input: [],
      expectedOutput: [4],
      initialMemory: { 0: 1, 1: 1, 2: 2, 3: 1, 4: 3, 5: 2, 6: 1, 7: 0 },
    },
    {
      name: 'No forward steps',
      input: [],
      expectedOutput: [0],
      initialMemory: { 0: 2, 1: 3, 2: 2, 3: 3, 4: 0 },
    },
  ],
  hints: [
    'Use R0 as a memory pointer (start at 0), R1 as the forward step counter',
    'Loop: LOAD_MEM R2, R0 to read the next command',
    'If R2 is 0, jump to the end and output R1',
    'If R2 is 1, increment R1. Then increment R0 and loop back.',
    'Use CMP and JZ to check for stop (0) and forward (1) commands',
  ],
  unlocks: ['54-xor'],
};
