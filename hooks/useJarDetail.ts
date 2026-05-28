import { useAsync } from './useAsync';
import { getJarTxns } from '../services/jars';
import type { TxnSection } from '../types';

export const useJarDetail = (name: string) => {
  const { data, isLoading, error } = useAsync<TxnSection[]>(() => getJarTxns(name), [], [name]);
  return { txns: data, isLoading, error };
};
