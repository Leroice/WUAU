import {
  ACCOUNTS, TOTAL_BALANCE, CONTACTS, TRANSACTIONS, CARD as SAM_CARD, CARD_SPENDS,
  PAYMENTS_CONTACTS, PAYMENTS_UPCOMING, PAYMENTS_RECENT, USER as SAM_USER,
} from './data';
import type { Persona } from '../types';

// ─── Personas / scenarios ────────────────────────────────────────────────────
// Each persona reshapes the app's content so we can demo who WU AU is for.
// Data-layer getters expose the bundles; hooks/usePersona holds the selection.

// 1 — Sam (existing): established AU resident. S1 wallet user, day-1 with card
//      — Apple Pay nudge active because flag is false.
const SAM: Persona = {
  id: 'sam',
  label: 'Sam',
  blurb: 'Established AU resident, multi-currency wallet. Card delivered today — needs Apple Pay.',
  segment: 'S1',
  walletStatus: 'active',
  flags: {
    has_card: true,
    apple_pay_active: false, // ← Apple Pay nudge fires
    first_conversion_done: true,
    first_jar_created: true,
    first_send_done: true,
    direct_deposit_setup: true,
  },
  user: SAM_USER,
  cardHolder: SAM_CARD.holder,
  totalBalance: TOTAL_BALANCE,
  accounts: ACCOUNTS,
  contacts: CONTACTS,
  transactions: TRANSACTIONS,
  cardSpends: CARD_SPENDS,
  paymentsContacts: PAYMENTS_CONTACTS,
  paymentsUpcoming: PAYMENTS_UPCOMING,
  paymentsRecent: PAYMENTS_RECENT,
};

// 2 — New to Australia: just arrived, sending money home, getting set up.
//      S1 wallet user but no card yet — Order Card nudge fires.
const NEWCOMER: Persona = {
  id: 'newcomer',
  label: 'New to Australia',
  blurb: 'Just arrived from India — setting up, sending money home. No card yet.',
  segment: 'S1',
  walletStatus: 'active',
  flags: {
    has_card: false, // ← Order Card nudge fires
    apple_pay_active: false,
    first_conversion_done: false,
    first_jar_created: false,
    first_send_done: true,
    direct_deposit_setup: false,
  },
  user: { firstName: 'Priya', lastName: 'Sharma', initials: 'PS', location: 'Parramatta, NSW' },
  cardHolder: 'Priya Sharma',
  totalBalance: { amount: '1,240.00', currency: 'AUD' },
  accounts: [
    { flag: '🇦🇺', code: 'AUD', amount: '1,240.00', label: 'Home currency', fullName: 'Australian Dollar' },
    { flag: '🇮🇳', code: 'INR', amount: '68,400', label: '1,232.00 AUD', fullName: 'Indian Rupee' },
  ],
  contacts: [
    { initials: 'AS', name: 'Mum', fullName: 'Anjali Sharma', amount: '500.00 AUD', receivesIn: 'INR', action: 'Send again', color: '#FFF0E8', textColor: '#C45E1A', country: 'India', flag: '🇮🇳' },
    { initials: 'RS', name: 'Rohit', fullName: 'Rohit Sharma', amount: '200.00 AUD', receivesIn: 'INR', action: 'Send again', color: '#E8F4FF', textColor: '#1A6FD4', country: 'India', flag: '🇮🇳' },
  ],
  transactions: [
    { initials: 'AS', name: 'Anjali Sharma', date: '24/05/2026 · 06:10PM · Delhi', amount: '500.00 AUD', sub: '27,800.00 INR', color: '#FFF0E8', textColor: '#C45E1A', type: 'send', status: 'Delivered' },
    { initials: 'WU', name: 'Cash deposit', date: '22/05/2026 · 11:00AM · Sydney', amount: '1,500.00 AUD', sub: 'Top up', color: '#E8F9F0', textColor: '#1A8A4A', type: 'spend', status: null },
  ],
  cardSpends: [
    { merchant: 'Coles', date: '24 May 2026, 6:40pm', amount: '- 48.20 AUD', status: 'Pending', statusType: 'warning' as const, initials: 'CO', color: '#E2231A', textColor: '#FFFFFF' },
    { merchant: 'Opal Transport', date: '23 May 2026, 8:05am', amount: '- 12.00 AUD', status: 'In progress', statusType: 'info' as const, initials: 'OP', color: '#1A6FD4', textColor: '#FFFFFF' },
  ],
  paymentsContacts: [
    { name: 'Mum', initials: 'AS', color: '#FFF0E8', textColor: '#C45E1A', flag: '🇮🇳' },
    { name: 'Rohit', initials: 'RS', color: '#E8F4FF', textColor: '#1A6FD4', flag: '🇮🇳' },
    { name: 'Landlord', initials: 'JM', color: '#E8F9F0', textColor: '#1A8A4A', flag: '🇦🇺' },
  ],
  paymentsUpcoming: [
    { initials: 'JM', color: '#1A6FD4', textColor: '#FFFFFF', amount: '420.00', currency: 'AUD', desc: 'Rent · 1 June 2026' },
  ],
  paymentsRecent: [
    { name: 'Anjali Sharma', date: '24 May 2026, 6:10pm', initials: 'AS', color: '#FFF0E8', textColor: '#C45E1A', amount: '27,800 INR', status: 'Delivered', statusType: 'info' as const },
    { name: 'Opal Transport', date: '23 May 2026, 8:05am', initials: 'OP', color: '#E8F4FF', textColor: '#1A6FD4', amount: '12.00 AUD', action: 'Resend' },
  ],
};

// 3 — Gig economy Uber driver: frequent payouts, remits to Brazil.
//      Mature S1 wallet user with all flags set — Refer-a-Friend nudge candidate.
const GIG: Persona = {
  id: 'gig',
  label: 'Gig driver',
  blurb: 'Drives rideshare — frequent payouts, remits home to Brazil. Mature wallet user.',
  segment: 'S1',
  walletStatus: 'active',
  flags: {
    has_card: true,
    apple_pay_active: true,
    first_conversion_done: true,
    first_jar_created: true,
    first_send_done: true,
    direct_deposit_setup: true,
    refer_friend_done: false, // ← Refer-a-Friend nudge fires
  },
  user: { firstName: 'Diego', lastName: 'Santos', initials: 'DS', location: 'Brunswick, VIC' },
  cardHolder: 'Diego Santos',
  totalBalance: { amount: '2,815.40', currency: 'AUD' },
  accounts: [
    { flag: '🇦🇺', code: 'AUD', amount: '2,815.40', label: 'Home currency', fullName: 'Australian Dollar' },
    { flag: '🇧🇷', code: 'BRL', amount: '4,200.00', label: '1,160.00 AUD', fullName: 'Brazilian Real' },
  ],
  contacts: [
    { initials: 'MS', name: 'Mãe', fullName: 'Maria Santos', amount: '600.00 AUD', receivesIn: 'BRL', action: 'Send again', color: '#E8F9F0', textColor: '#1A8A4A', country: 'Brazil', flag: '🇧🇷' },
    { initials: 'LS', name: 'Lucas', fullName: 'Lucas Santos', amount: '150.00 AUD', receivesIn: 'BRL', action: 'Send again', color: '#FFF6E8', textColor: '#C4801A', country: 'Brazil', flag: '🇧🇷' },
  ],
  transactions: [
    { initials: 'UB', name: 'Rideshare payout', date: '25/05/2026 · 09:30PM · Melbourne', amount: '184.60 AUD', sub: 'Weekly earnings', color: '#E8F9F0', textColor: '#1A8A4A', type: 'spend', status: null },
    { initials: 'MS', name: 'Maria Santos', date: '24/05/2026 · 07:00PM · São Paulo', amount: '600.00 AUD', sub: '2,170.00 BRL', color: '#FFF0E8', textColor: '#C45E1A', type: 'send', status: 'Delivered' },
  ],
  cardSpends: [
    { merchant: 'BP Fuel', date: '25 May 2026, 7:12am', amount: '- 78.40 AUD', status: 'Pending', statusType: 'warning' as const, initials: 'BP', color: '#0A8A0A', textColor: '#FFFFFF' },
    { merchant: 'Woolworths', date: '24 May 2026, 5:55pm', amount: '- 92.10 AUD', status: 'In progress', statusType: 'info' as const, initials: 'W', color: '#178841', textColor: '#FFFFFF' },
  ],
  paymentsContacts: [
    { name: 'Mãe', initials: 'MS', color: '#E8F9F0', textColor: '#1A8A4A', flag: '🇧🇷' },
    { name: 'Lucas', initials: 'LS', color: '#FFF6E8', textColor: '#C4801A', flag: '🇧🇷' },
  ],
  paymentsUpcoming: [
    { initials: 'MS', color: '#FF7A45', textColor: '#FFFFFF', amount: '600.00', currency: 'AUD', desc: 'To Mãe · 1 June 2026' },
  ],
  paymentsRecent: [
    { name: 'Maria Santos', date: '24 May 2026, 7:00pm', initials: 'MS', color: '#FFF0E8', textColor: '#C45E1A', amount: '2,170 BRL', status: 'Delivered', statusType: 'info' as const },
    { name: 'Rideshare payout', date: '25 May 2026, 9:30pm', initials: 'UB', color: '#E8F9F0', textColor: '#1A8A4A', amount: '+184.60 AUD', action: 'Request', positive: true },
  ],
};

// 4 — Student about to travel: budgeting, multi-currency for a trip.
//      S1 wallet user, has jars (JPY for Japan trip). First Jar nudge gone.
const STUDENT: Persona = {
  id: 'student',
  label: 'Travelling student',
  blurb: 'Student about to travel — budgeting across currencies for the trip.',
  segment: 'S1',
  walletStatus: 'active',
  flags: {
    has_card: true,
    apple_pay_active: false, // ← Apple Pay nudge fires (left for travel)
    first_conversion_done: true,
    first_jar_created: true,
    first_send_done: true,
  },
  user: { firstName: 'Mei', lastName: 'Lin', initials: 'ML', location: 'Carlton, VIC' },
  cardHolder: 'Mei Lin',
  totalBalance: { amount: '3,650.00', currency: 'AUD' },
  accounts: [
    { flag: '🇦🇺', code: 'AUD', amount: '3,650.00', label: 'Home currency', fullName: 'Australian Dollar' },
    { flag: '🇯🇵', code: 'JPY', amount: '92,000', label: '1,020.00 AUD', fullName: 'Japanese Yen' },
    { flag: '🇪🇺', code: 'EUR', amount: '600.00', label: '985.00 AUD', fullName: 'Euro' },
  ],
  contacts: [
    { initials: 'YL', name: 'Mum', fullName: 'Yan Lin', amount: '300.00 AUD', receivesIn: 'AUD', action: 'Request', color: '#F0E8FF', textColor: '#6B1AC4', country: 'Australia', flag: '🇦🇺' },
    { initials: 'KT', name: 'Kenji', fullName: 'Kenji Tan', amount: '50.00 AUD', receivesIn: 'JPY', action: 'Send again', color: '#E8F9F0', textColor: '#1A8A4A', country: 'Japan', flag: '🇯🇵' },
  ],
  transactions: [
    { initials: 'JR', name: 'JR Pass (travel)', date: '25/05/2026 · 02:15PM · Tokyo', amount: '14,000 JPY', sub: '155.00 AUD', color: '#E8F4FF', textColor: '#1A6FD4', type: 'spend', status: null },
    { initials: 'YL', name: 'Yan Lin', date: '20/05/2026 · 10:00AM · Melbourne', amount: '300.00 AUD', sub: 'Allowance', color: '#F0E8FF', textColor: '#6B1AC4', type: 'send', status: 'Delivered' },
  ],
  cardSpends: [
    { merchant: 'Uniqlo Tokyo', date: '25 May 2026, 2:40pm', amount: '- 4,500 JPY', status: 'Pending', statusType: 'warning' as const, initials: 'UN', color: '#E60012', textColor: '#FFFFFF' },
    { merchant: 'Hostel World', date: '23 May 2026, 9:00am', amount: '- 240.00 AUD', status: 'In progress', statusType: 'info' as const, initials: 'HW', color: '#1A6FD4', textColor: '#FFFFFF' },
  ],
  paymentsContacts: [
    { name: 'Mum', initials: 'YL', color: '#F0E8FF', textColor: '#6B1AC4', flag: '🇦🇺' },
    { name: 'Kenji', initials: 'KT', color: '#E8F9F0', textColor: '#1A8A4A', flag: '🇯🇵' },
  ],
  paymentsUpcoming: [
    { initials: 'HW', color: '#1A6FD4', textColor: '#FFFFFF', amount: '240.00', currency: 'AUD', desc: 'Hostel · 2 June 2026' },
  ],
  paymentsRecent: [
    { name: 'Yan Lin', date: '20 May 2026, 10:00am', initials: 'YL', color: '#F0E8FF', textColor: '#6B1AC4', amount: '300.00 AUD', status: 'Delivered', statusType: 'info' as const },
    { name: 'JR Pass', date: '25 May 2026, 2:15pm', initials: 'JR', color: '#E8F4FF', textColor: '#1A6FD4', amount: '14,000 JPY', action: 'Resend' },
  ],
};

// ─── Migration segment personas ──────────────────────────────────────────────
// These cover the 7-segment matrix from WU-eOne-Migration-UX-v0.2.docx so we
// can demo every entry experience by switching persona in the dev affordance.

// 5 — Maria (S6): Verified R4 user, IMT only on E1. No wallet. Remittance home
//      (IMT widgets only). Sees the wallet intro nudge — non-pushy.
const MARIA_S6: Persona = {
  id: 'maria-s6',
  label: 'Maria · IMT only (S6)',
  blurb: 'Verified R4 customer on E1 — IMT-first home, wallet earns its way in.',
  segment: 'S6',
  walletStatus: 'none',
  flags: { has_card: false, apple_pay_active: false },
  user: { firstName: 'Maria', lastName: 'Cruz', initials: 'MC', location: 'Cabramatta, NSW' },
  cardHolder: 'Maria Cruz',
  totalBalance: { amount: '0.00', currency: 'AUD' },
  accounts: [],
  contacts: [
    { initials: 'JC', name: 'Mum', fullName: 'Josefa Cruz', amount: '400.00 AUD', receivesIn: 'PHP', action: 'Send again', color: '#FFF0E8', textColor: '#C45E1A', country: 'Philippines', flag: '🇵🇭' },
  ],
  transactions: [
    { initials: 'JC', name: 'Josefa Cruz', date: '18/05/2026 · 04:30PM · Cebu', amount: '400.00 AUD', sub: '15,800.00 PHP', color: '#FFF0E8', textColor: '#C45E1A', type: 'send', status: 'Delivered' },
    { initials: 'JC', name: 'Josefa Cruz', date: '11/05/2026 · 04:20PM · Cebu', amount: '350.00 AUD', sub: '13,820.00 PHP', color: '#FFF0E8', textColor: '#C45E1A', type: 'send', status: 'Delivered' },
  ],
  cardSpends: [],
  paymentsContacts: [
    { name: 'Mum', initials: 'JC', color: '#FFF0E8', textColor: '#C45E1A', flag: '🇵🇭' },
  ],
  paymentsUpcoming: [],
  paymentsRecent: [
    { name: 'Josefa Cruz', date: '18 May 2026, 4:30pm', initials: 'JC', color: '#FFF0E8', textColor: '#C45E1A', amount: '15,800 PHP', status: 'Delivered', statusType: 'info' as const },
  ],
};

// 6 — Tom (S7a): Verified R4 user upgrading to wallet — at the value-prop /
//      eligibility-check entry point. Banner: wallet value prop.
const TOM_S7A: Persona = {
  id: 'tom-s7a',
  label: 'Tom · Upgrading (S7a)',
  blurb: 'Verified R4 → starting wallet upgrade. Sees the value prop.',
  segment: 'S7a',
  walletStatus: 'none',
  flags: { has_card: false, apple_pay_active: false, first_send_done: true },
  user: { firstName: 'Tom', lastName: 'Whitford', initials: 'TW', location: 'Bondi, NSW' },
  cardHolder: 'Tom Whitford',
  totalBalance: { amount: '0.00', currency: 'AUD' },
  accounts: [],
  contacts: [
    { initials: 'EW', name: 'Dad', fullName: 'Edward Whitford', amount: '250.00 AUD', receivesIn: 'GBP', action: 'Send again', color: '#E8F4FF', textColor: '#1A6FD4', country: 'UK', flag: '🇬🇧' },
  ],
  transactions: [
    { initials: 'EW', name: 'Edward Whitford', date: '24/05/2026 · 09:15AM · London', amount: '250.00 AUD', sub: '130.50 GBP', color: '#E8F4FF', textColor: '#1A6FD4', type: 'send', status: 'Delivered' },
  ],
  cardSpends: [],
  paymentsContacts: [
    { name: 'Dad', initials: 'EW', color: '#E8F4FF', textColor: '#1A6FD4', flag: '🇬🇧' },
  ],
  paymentsUpcoming: [],
  paymentsRecent: [
    { name: 'Edward Whitford', date: '24 May 2026, 9:15am', initials: 'EW', color: '#E8F4FF', textColor: '#1A6FD4', amount: '130.50 GBP', status: 'Delivered', statusType: 'info' as const },
  ],
};

// 7 — Anh (S4): R4 abandoned — registered but never verified, now logging into
//      E1 for the first time. Sees What's-New → resume onboarding.
const ANH_S4: Persona = {
  id: 'anh-s4',
  label: 'Anh · R4 abandoned (S4)',
  blurb: 'Registered on R4, never verified. First time on E1. Treat as new.',
  segment: 'S4',
  walletStatus: 'none',
  flags: { whats_new_seen: false },
  user: { firstName: 'Anh', lastName: 'Nguyen', initials: 'AN', location: 'Cabramatta, NSW' },
  cardHolder: 'Anh Nguyen',
  totalBalance: { amount: '0.00', currency: 'AUD' },
  accounts: [],
  contacts: [],
  transactions: [],
  cardSpends: [],
  paymentsContacts: [],
  paymentsUpcoming: [],
  paymentsRecent: [],
};

// 8 — Sofia (S5b): KYC failed — retry available. Banner: try again.
const SOFIA_S5B: Persona = {
  id: 'sofia-s5b',
  label: 'Sofia · KYC failed (S5b)',
  blurb: 'Identity verification failed — retry banner with updated documents.',
  segment: 'S5b',
  walletStatus: 'none',
  flags: {},
  user: { firstName: 'Sofia', lastName: 'Rivera', initials: 'SR', location: 'Bankstown, NSW' },
  cardHolder: 'Sofia Rivera',
  totalBalance: { amount: '0.00', currency: 'AUD' },
  accounts: [],
  contacts: [],
  transactions: [],
  cardSpends: [],
  paymentsContacts: [],
  paymentsUpcoming: [],
  paymentsRecent: [],
};

export const PERSONAS: Persona[] = [SAM, NEWCOMER, GIG, STUDENT, MARIA_S6, TOM_S7A, ANH_S4, SOFIA_S5B];

// Data-layer getters. Swap these bodies for real API calls keyed by user id.
export const listPersonas = async (): Promise<Persona[]> => PERSONAS;
export const getPersona = async (id: string): Promise<Persona> =>
  PERSONAS.find((p) => p.id === id) ?? SAM;
