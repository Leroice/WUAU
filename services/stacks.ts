import { STACKS, STACK_TXNS } from './data';
import type { Stack, TxnSection } from '../types';

export const getStacks = async (): Promise<Stack[]> => STACKS;

export const getStackTxns = async (_name: string): Promise<TxnSection[]> => STACK_TXNS;
