import { useAsync } from './useAsync';
import { usePersona } from './usePersona';
import { getHomeTransactions } from '../services/transactions';
import type { HomeTransaction } from '../types';

export const useTransactions = () => {
  const { persona } = usePersona();
  const { data, isLoading, error } = useAsync<HomeTransaction[]>(() => getHomeTransactions(persona.id), [], [persona.id]);
  return { transactions: data, isLoading, error };
};
