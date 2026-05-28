import { useAsync } from './useAsync';
import { getAccountTxns } from '../services/accounts';
import type { TxnSection } from '../types';

export const useAccountDetail = (code: string) => {
  const { data, isLoading, error } = useAsync<TxnSection[]>(() => getAccountTxns(code), [], [code]);
  return { txns: data, isLoading, error };
};
