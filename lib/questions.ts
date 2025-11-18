import { Question } from './types';

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'What does PoX stand for in the Stacks ecosystem?',
    options: [
      'Proof of Exchange',
      'Proof of Transfer',
      'Proof of Transaction',
      'Power of X'
    ],
    correctAnswer: 1,
    category: 'Consensus'
  },
  {
    id: 'q2',
    text: 'What programming language are smart contracts written in on Stacks?',
    options: [
      'Solidity',
      'JavaScript',
      'Clarity',
      'Rust'
    ],
    correctAnswer: 2,
    category: 'Development'
  },
  {
    id: 'q3',
    text: 'What reward do Stackers receive for locking their STX?',
    options: [
      'More STX tokens',
      'Bitcoin (BTC)',
      'USD stablecoins',
      'NFTs'
    ],
    correctAnswer: 1,
    category: 'Stacking'
  },
  {
    id: 'q4',
    text: 'What is the ratio of sBTC to Bitcoin?',
    options: [
      '1 sBTC = 0.5 BTC',
      '1 sBTC = 1 BTC',
      '1 sBTC = 2 BTC',
      '1 sBTC = 100 BTC'
    ],
    correctAnswer: 1,
    category: 'sBTC'
  },
  {
    id: 'q5',
    text: 'After the Nakamoto upgrade, how fast are Stacks block times?',
    options: [
      '10 minutes',
      '1 minute',
      'Around 5 seconds',
      '1 hour'
    ],
    correctAnswer: 2,
    category: 'Nakamoto'
  },
  {
    id: 'q6',
    text: 'What do Stacks miners do to participate in block production?',
    options: [
      'Solve complex math puzzles',
      'Lock STX tokens',
      'Spend Bitcoin (BTC)',
      'Run a full Bitcoin node'
    ],
    correctAnswer: 2,
    category: 'Consensus'
  },
  {
    id: 'q7',
    text: 'Can Clarity smart contracts read Bitcoin blockchain data?',
    options: [
      'No, they are completely separate',
      'Yes, Clarity can read Bitcoin state',
      'Only if you pay extra fees',
      'Only during testnet'
    ],
    correctAnswer: 1,
    category: 'Clarity'
  },
  {
    id: 'q8',
    text: 'How many Bitcoin blocks make up one Stacking reward cycle?',
    options: [
      '1,000 blocks',
      '2,100 blocks',
      '5,000 blocks',
      '10,000 blocks'
    ],
    correctAnswer: 1,
    category: 'Stacking'
  },
  {
    id: 'q9',
    text: 'What percentage of stacked STX must sign blocks after Nakamoto?',
    options: [
      '51%',
      '66%',
      '70%',
      '80%'
    ],
    correctAnswer: 2,
    category: 'Nakamoto'
  },
  {
    id: 'q10',
    text: 'What does it mean that Clarity is non-Turing complete?',
    options: [
      'It runs faster than other smart contract languages',
      'It has no unbounded loops',
      'It can only run on Bitcoin',
      'It requires special hardware to execute'
    ],
    correctAnswer: 1,
    category: 'Clarity'
  }
];
