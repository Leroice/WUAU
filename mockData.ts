// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// WU AU POC — Sam Bellegrito
// Edit this file to update all app content.
// ─────────────────────────────────────────────────────────────────────────────

export const USER = {
  firstName: 'Sam',
  lastName: 'Bellegrito',
  initials: 'SB',
  location: 'Victoria, Australia',
  avatar: null,
};

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
export const ACCOUNTS = [
  {
    flag: '\uD83C\uDDE6\uD83C\uDDFA',
    code: 'AUD',
    amount: '4,280.50',
    label: 'Home currency',
    fullName: 'Australian Dollar',
  },
  {
    flag: '\uD83C\uDDF5\uD83C\uDDED',
    code: 'PHP',
    amount: '12,500.00',
    label: '305.20 AUD',
    fullName: 'Philippine Peso',
  },
  {
    flag: '\uD83C\uDDEF\uD83C\uDDF5',
    code: 'JPY',
    amount: '48,200',
    label: '430.80 AUD',
    fullName: 'Japanese Yen',
  },
  {
    flag: '\uD83C\uDDFA\uD83C\uDDF8',
    code: 'USD',
    amount: '620.00',
    label: '950.40 AUD',
    fullName: 'US Dollar',
  },
];

export const TOTAL_BALANCE = {
  amount: '5,966.90',
  currency: 'AUD',
};

export const AVAILABLE_BALANCE = {
  amount: '5,210.30',
  currency: 'AUD',
};

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export const CONTACTS = [
  {
    initials: 'MB',
    name: 'Maria B.',
    fullName: 'Maria Bellegrito',
    amount: '500.00 AUD',
    receivesIn: 'PHP',
    action: 'Send again',
    color: '#FFF0E8',
    textColor: '#C45E1A',
    country: 'Philippines',
    flag: '\uD83C\uDDF5\uD83C\uDDED',
  },
  {
    initials: 'JR',
    name: 'Jake R.',
    fullName: 'Jake Reyes',
    amount: '200.00 AUD',
    receivesIn: 'USD',
    action: 'Track transfer',
    color: '#E8F4FF',
    textColor: '#1A6FD4',
    country: 'United States',
    flag: '\uD83C\uDDFA\uD83C\uDDF8',
  },
  {
    initials: 'AK',
    name: 'Aiko K.',
    fullName: 'Aiko Kuroda',
    amount: '5,000 JPY',
    receivesIn: 'JPY',
    action: 'Send again',
    color: '#F0E8FF',
    textColor: '#6B1AC4',
    country: 'Japan',
    flag: '\uD83C\uDDEF\uD83C\uDDF5',
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const TRANSACTIONS = [
  {
    initials: 'MB',
    name: 'Maria Bellegrito',
    date: '24/05/2026 \u00b7 09:15AM \u00b7 Manila',
    amount: '500.00 AUD',
    sub: '28,750.00 PHP',
    color: '#FFF0E8',
    textColor: '#C45E1A',
    type: 'send',
    status: 'Delivered',
  },
  {
    initials: 'TS',
    name: 'Tokyo Station Bento',
    date: '18/05/2026 \u00b7 12:30PM \u00b7 Tokyo',
    amount: '1,200 JPY',
    sub: '10.70 AUD',
    color: '#E8F9F0',
    textColor: '#1A8A4A',
    type: 'spend',
    status: null,
  },/*
  {
    initials: 'MB',
    name: 'Maria Bellegrito',
    date: '10/05/2026 \u00b7 08:45AM \u00b7 Manila',
    amount: '500.00 AUD',
    sub: '28,600.00 PHP',
    color: '#FFF0E8',
    textColor: '#C45E1A',
    type: 'send',
    status: 'Delivered',
  },
  {
    initials: '7E',
    name: '7-Eleven Shibuya',
    date: '17/05/2026 \u00b7 07:20AM \u00b7 Tokyo',
    amount: '580 JPY',
    sub: '5.20 AUD',
    color: '#E8F4FF',
    textColor: '#1A6FD4',
    type: 'spend',
    status: null,
  },
  {
    initials: 'SB',
    name: 'Shinkansen JR Pass',
    date: '16/05/2026 \u00b7 10:00AM \u00b7 Osaka',
    amount: '14,000 JPY',
    sub: '125.00 AUD',
    color: '#E8F4FF',
    textColor: '#1A6FD4',
    type: 'spend',
    status: null,
  },
  {
    initials: 'JR',
    name: 'Jake Reyes',
    date: '05/05/2026 \u00b7 03:30PM \u00b7 San Francisco',
    amount: '200.00 USD',
    sub: '306.40 AUD',
    subColor: '#1A6FD4',
    color: '#E8F4FF',
    textColor: '#1A6FD4',
    type: 'send',
    status: 'Track transfer',
  },
  {
    initials: 'MB',
    name: 'Maria Bellegrito',
    date: '25/04/2026 \u00b7 09:00AM \u00b7 Manila',
    amount: '500.00 AUD',
    sub: '28,400.00 PHP',
    color: '#FFF0E8',
    textColor: '#C45E1A',
    type: 'send',
    status: 'Delivered',
  },
  {
    initials: 'AK',
    name: 'Aiko Kuroda',
    date: '19/05/2026 \u00b7 07:00PM \u00b7 Tokyo',
    amount: '5,000 JPY',
    sub: '44.70 AUD',
    color: '#F0E8FF',
    textColor: '#6B1AC4',
    type: 'send',
    status: 'Delivered',
  },*/
];

// ─── QUICK ACTIONS ───────────────────────────────────────────────────────────
// Drives the home-screen action buttons. Add/remove an entry or change a label
// or icon here and the row updates automatically. Each `icon` carries the
// platform-native name: an SF Symbol for iOS, a Material Icons name for Android.
export type QuickAction = {
  key: string;
  label: string;
  icon: { ios: string; android: string };
};

export const QUICK_ACTIONS: QuickAction[] = [
  { key: 'send', label: 'Send', icon: { ios: 'arrow.up', android: 'arrow_upward' } },
  { key: 'add', label: 'Add', icon: { ios: 'australiandollarsign.circle', android: 'add' } },
  { key: 'cashout', label: 'Cash out', icon: { ios: 'arrow.down.to.line', android: 'arrow_downward' } },
  /*{ key: 'more', label: 'More', icon: { ios: 'ellipsis.circle', android: 'more-horiz' } } */
];

// ─── EXCHANGE RATES ──────────────────────────────────────────────────────────
export const EXCHANGE_RATES = [
  { from: 'AUD', to: 'PHP', rate: '57.50', trend: 'up' },
  { from: 'AUD', to: 'JPY', rate: '112.40', trend: 'down' },
  { from: 'AUD', to: 'USD', rate: '0.653', trend: 'up' },
];

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export const SETTINGS = {
  appVersion: '1.0.0',
  copyright: '2026 Western Union Holdings, Inc. All Rights Reserved',
};
