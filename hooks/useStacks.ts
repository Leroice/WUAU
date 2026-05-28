import { useAsync } from './useAsync';
import { getStacks } from '../services/stacks';
import type { Stack } from '../types';

export const useStacks = () => {
  const { data, isLoading, error } = useAsync<Stack[]>(getStacks, [], []);
  return { stacks: data, isLoading, error };
};
