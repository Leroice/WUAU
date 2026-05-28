import { useAsync } from './useAsync';
import { getStackTxns } from '../services/stacks';
import type { TxnSection } from '../types';

export const useStackDetail = (name: string) => {
  const { data, isLoading, error } = useAsync<TxnSection[]>(() => getStackTxns(name), [], [name]);
  return { txns: data, isLoading, error };
};
