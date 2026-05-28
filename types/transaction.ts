import { IconSpec } from './common';

// A row in an account/jar transaction list.
export interface Txn {
  title: string;
  sub: string;
  amount: string;
  positive?: boolean;
  status?: string;
  icon: IconSpec;
}

// Transactions grouped under a date heading.
export interface TxnSection {
  date: string;
  items: Txn[];
}
