import { useAsync } from './useAsync';
import { getJars } from '../services/jars';
import type { Jar } from '../types';

export const useJars = () => {
  const { data, isLoading, error } = useAsync<Jar[]>(getJars, [], []);
  return { jars: data, isLoading, error };
};
