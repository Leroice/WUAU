import { getPersona } from './personas';
import { ACCOUNT_TXNS } from './data';
import type { Account, TxnSection } from '../types';

// Currency wallets belong to the active persona; transactions are demo-static.
export const getAccounts = async (personaId: string): Promise<Account[]> =>
  (await getPersona(personaId)).accounts;

export const getAccountTxns = async (_code: string): Promise<TxnSection[]> => ACCOUNT_TXNS;
