import { useAsync } from './useAsync';
import { usePersona } from './usePersona';
import { getAccounts } from '../services/accounts';
import type { Account } from '../types';

export const useAccounts = () => {
  const { persona } = usePersona();
  const { data, isLoading, error } = useAsync<Account[]>(() => getAccounts(persona.id), [], [persona.id]);
  return { accounts: data, isLoading, error };
};
