// A goal-based savings "stack" (Accounts → Stacks tab + Stack detail).
export interface Stack {
  emoji: string;
  name: string;
  goal?: string;
  amount: string;
  subAmount?: string;
  progress?: number;
  goalAmount?: string;
  targetDate?: string;
}
