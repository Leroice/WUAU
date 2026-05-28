import { getPersona } from './personas';
import type { HomeTransaction } from '../types';

export const getHomeTransactions = async (personaId: string): Promise<HomeTransaction[]> =>
  (await getPersona(personaId)).transactions;
