import {
  ACCOUNTS, TOTAL_BALANCE, CONTACTS, TRANSACTIONS, CARD as SAM_CARD, CARD_SPENDS,
  PAYMENTS_CONTACTS, PAYMENTS_UPCOMING, PAYMENTS_RECENT, USER as SAM_USER,
} from './data';
import type { Persona } from '../types';

// ─── Personas / scenarios ────────────────────────────────────────────────────
// Each persona reshapes the app's content so we can demo who WU AU is for.
// Data-layer getters expose the bundles; hooks/usePersona holds the selection.

// 1 — Sam (existing): established AU resident.
const SAM: Persona = {
  id: 'sam',
  label: 'Sam',
  blurb: 'Established AU resident, multi-currency wallet.',
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
const NEWCOMER: Persona = {
  id: 'newcomer',
  label: 'New to Australia',
  blurb: 'Just arrived from India — setting up, sending money home.',
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
const GIG: Persona = {
  id: 'gig',
  label: 'Gig driver',
  blurb: 'Drives rideshare — frequent payouts, remits home to Brazil.',
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
const STUDENT: Persona = {
  id: 'student',
  label: 'Travelling student',
  blurb: 'Student about to travel — budgeting across currencies for the trip.',
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

export const PERSONAS: Persona[] = [SAM, NEWCOMER, GIG, STUDENT];

// Data-layer getters. Swap these bodies for real API calls keyed by user id.
export const listPersonas = async (): Promise<Persona[]> => PERSONAS;
export const getPersona = async (id: string): Promise<Persona> =>
  PERSONAS.find((p) => p.id === id) ?? SAM;
