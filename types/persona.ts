import { Account } from './account';
import { Segment, WalletStatus } from './segment';
import { Flags } from './flag';
import { Jar } from './jar';

// Member shapes that make up a persona's data bundle.
export type StatusType = 'warning' | 'info';

export interface Contact {
  initials: string;
  name: string;
  fullName: string;
  amount: string;
  receivesIn: string;
  action: string;
  color: string;
  textColor: string;
  country: string;
  flag: string;
}

export interface HomeTransaction {
  initials: string;
  name: string;
  date: string;
  amount: string;
  sub: string;
  color: string;
  textColor: string;
  type: 'send' | 'spend';
  status: string | null;
  subColor?: string;
  positive?: boolean;
}

export interface CardSpend {
  merchant: string;
  date: string;
  amount: string;
  status: string;
  statusType: StatusType;
  initials: string;
  color: string;
  textColor: string;
}

export interface PaymentContact {
  name: string;
  initials: string;
  color: string;
  textColor: string;
  flag: string;
}

export interface UpcomingPayment {
  initials: string;
  color: string;
  textColor: string;
  amount: string;
  currency: string;
  desc: string;
}

export interface RecentPayment {
  name: string;
  date: string;
  initials: string;
  color: string;
  textColor: string;
  amount: string;
  status?: string;
  statusType?: StatusType;
  action?: string;
  positive?: boolean;
}

export interface PersonaUser {
  firstName: string;
  lastName: string;
  initials: string;
  location: string;
}

export interface Money {
  amount: string;
  currency: string;
}

// A complete demo "account holder" — every screen reads the active persona's
// bundle. `segment` + `walletStatus` + `flags` drive the home-screen variant
// and which nudges fire from the engine.
export interface Persona {
  id: string;
  label: string;
  blurb: string;
  /** Migration segment — determines home-screen variant + nudge eligibility. */
  segment: Segment;
  /** Wallet entitlement — orthogonal to segment (S2='rejected', S6='none'…). */
  walletStatus: WalletStatus;
  /** Behaviour flags read by the nudge engine. Missing = false. */
  flags: Flags;
  /** Optional pre-existing jars (when the segment supports it). */
  jars?: Jar[];
  user: PersonaUser;
  cardHolder: string;
  totalBalance: Money;
  accounts: Account[];
  contacts: Contact[];
  transactions: HomeTransaction[];
  cardSpends: CardSpend[];
  paymentsContacts: PaymentContact[];
  paymentsUpcoming: UpcomingPayment[];
  paymentsRecent: RecentPayment[];
}
