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
    initials: 'JL',
    name: 'Jessie Lai Lai',
    date: '11/05/2026 \u00b7 09:15AM \u00b7 Manila',
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
  { key: 'send', label: 'Send', icon: { ios: 'arrow.up', android: 'arrow-upward' } },
  { key: 'add', label: 'Add', icon: { ios: 'australiandollarsign.circle', android: 'monetization-on' } },
  { key: 'cashout', label: 'Cash out', icon: { ios: 'arrow.down.to.line', android: 'vertical-align-bottom' } },
  /*{ key: 'more', label: 'More', icon: { ios: 'ellipsis.circle', android: 'more-horiz' } } */
];

// ─── EXCHANGE RATES ──────────────────────────────────────────────────────────
export const EXCHANGE_RATES = [
  { from: 'AUD', to: 'PHP', rate: '57.50', trend: 'up' },
  { from: 'AUD', to: 'JPY', rate: '112.40', trend: 'down' },
  { from: 'AUD', to: 'USD', rate: '0.653', trend: 'up' },
];

// ─── CONVERT (swipe-down currency view) ──────────────────────────────────────
export const CONVERT_MAIN = {
  flag: '🇦🇺',
  code: 'AUD',
  name: 'Australian Dollar',
  symbol: '$',
  amount: '2,500.00',
  sendTo: 'PHP',
};

export const CONVERSIONS = [
  { flag: '🇵🇭', code: 'PHP', name: 'Philippine Peso', symbol: '₱', amount: '95,750.00', rate: '38.30' },
  { flag: '🇯🇵', code: 'JPY', name: 'Japanese Yen', symbol: '¥', amount: '238,500', rate: '95.40' },
  { flag: '🇺🇸', code: 'USD', name: 'US Dollar', symbol: '$', amount: '1,632.50', rate: '0.653' },
  { flag: '🇪🇺', code: 'EUR', name: 'Euro', symbol: '€', amount: '1,525.00', rate: '0.610' },
  { flag: '🇬🇧', code: 'GBP', name: 'British Pound', symbol: '£', amount: '1,300.00', rate: '0.520' },
];

// ─── CURRENCY CONVERTER WIDGET (Home "Send Money") ───────────────────────────
// Drives the home-screen converter widget, its currency picker pop-up, and the
// "More Currencies" full-list page.
export type Currency = { code: string; flag: string; name: string };

// Top 5 currencies for the AU region — shown first in the picker pop-up menu.
export const TOP_CURRENCIES: Currency[] = [
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
];

// Full currency list (the "More Currencies" page). Top 5 first, then the rest.
export const ALL_CURRENCIES: Currency[] = [
  ...TOP_CURRENCIES,
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'NZD', flag: '🇳🇿', name: 'New Zealand Dollar' },
  { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan' },
  { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar' },
  { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
  { code: 'KRW', flag: '🇰🇷', name: 'South Korean Won' },
  { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah' },
  { code: 'VND', flag: '🇻🇳', name: 'Vietnamese Dong' },
  { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit' },
];

// Exchange rates as "1 AUD = N units" (AUD-base = the home currency). The
// converter derives any pair as RATES_PER_AUD[to] / RATES_PER_AUD[from].
export const RATES_PER_AUD: Record<string, number> = {
  AUD: 1, USD: 0.653, JPY: 112.4, PHP: 57.5, GBP: 0.52,
  EUR: 0.61, NZD: 1.085, CAD: 0.895, SGD: 0.88, INR: 54.3,
  CNY: 4.73, HKD: 5.09, THB: 23.6, KRW: 895, IDR: 10450, VND: 16600, MYR: 3.08,
};

export const CONVERTER = {
  title: 'Send Money',
  fromCode: 'AUD',
  toCode: 'JPY',
  amount: '100.00',
  cta: 'Send',
  moreLabel: 'More Currencies',
  pageTitle: 'Select currency',
};

// ─── ACCOUNTS PAGE ───────────────────────────────────────────────────────────
export const ACCOUNTS_PAGE = {
  title: 'Accounts',
  totalLabel: 'Total balance',
  tabs: ['Currencies', 'Stacks'] as const,
  addCurrency: 'Add new currency',
  addStack: 'Add new stack',
};

// Savings "stacks" — goal-based pots shown on the Accounts → Stacks tab.
export type Stack = { emoji: string; name: string; goal?: string; amount: string; subAmount?: string; progress?: number; goalAmount?: string; targetDate?: string };
export const STACKS: Stack[] = [
  { emoji: '💍', name: 'Vow Renewal', goal: 'Goal 13,000.00 AUD', amount: '1,800.56 AUD', progress: 0.14, goalAmount: '13,000.00 AUD', targetDate: '01/09/2026' },
  { emoji: '⛷️', name: 'Niseko', goal: 'Goal 250,000.00 JPY', amount: '207,059.38 JPY', subAmount: '1,883.75 AUD', progress: 0.83 },
  { emoji: '😎', name: 'New sunglasses', amount: '0.00 GBP', subAmount: '0.00 AUD' },
];

// ─── ACCOUNT / STACK DETAIL ──────────────────────────────────────────────────
export type Txn = { title: string; sub: string; amount: string; positive?: boolean; status?: string; icon: { ios: string; android: string } };
export type TxnSection = { date: string; items: Txn[] };

const TX_CART = { ios: 'cart.fill', android: 'shopping-cart' };
const TX_CASH = { ios: 'banknote.fill', android: 'payments' };
const TX_BANK = { ios: 'building.columns.fill', android: 'account-balance' };
const TX_XFER = { ios: 'arrow.left.arrow.right', android: 'swap-horiz' };

export const ACCOUNT_TXNS: TxnSection[] = [
  { date: '8 March 2026', items: [
    { title: 'Woolworths', sub: '11:04AM • Melbourne', amount: '180.22 AUD', status: 'Pending', icon: TX_CART },
    { title: 'ATM withdrawal', sub: '09:15AM • Richmond', amount: '500.00 AUD', icon: TX_CASH },
  ] },
  { date: '6 March 2026', items: [
    { title: 'Cash deposit', sub: '09:15PM • Richmond', amount: '+350.00 AUD', positive: true, icon: TX_BANK },
    { title: 'ATM withdrawal', sub: '09:15AM • Richmond', amount: '500.00 AUD', icon: TX_CASH },
    { title: 'Woolworths', sub: '11:04AM • Melbourne', amount: '58.46 AUD', status: 'Pending', icon: TX_CART },
  ] },
  { date: '2 March 2026', items: [
    { title: 'Woolworths', sub: '11:04AM • Melbourne', amount: '180.22 AUD', status: 'Pending', icon: TX_CART },
    { title: 'Cash deposit', sub: '09:15PM • Richmond', amount: '+350.00 AUD', positive: true, icon: TX_BANK },
  ] },
];

export const ACCOUNT_DETAIL = {
  availableLabel: 'Available balance',
  accountRef: '123456 123456789',
  emptyTitle: 'Uh oh! No transactions found.',
  emptySubtitle: 'Start transacting to see your activity here.',
};

// "More" native bottom-sheet content for an account.
export const ACCOUNT_MORE = {
  rows: [
    { label: 'Account name', value: 'Liam Smith Johnson' },
    { label: 'Bank', value: 'Western Union Financial Services' },
    { label: 'Bank address', value: '--' },
    { label: 'BSB', value: '123 456' },
    { label: 'Account number', value: '123 456 789' },
  ],
  links: [
    { title: 'View statements', desc: 'Description.', icon: { ios: 'doc.text.fill', android: 'description' } },
    { title: 'Need help?', desc: 'Get support or find out more.', icon: { ios: 'questionmark.circle.fill', android: 'help-outline' } },
  ],
  close: 'Close account',
};

export const STACK_TXNS: TxnSection[] = [
  { date: '8 March 2026', items: [{ title: 'Payment from AUD', sub: '05:55PM', amount: '+350.00 AUD', positive: true, icon: TX_XFER }] },
  { date: '6 March 2026', items: [{ title: 'Payment from AUD', sub: '05:55PM', amount: '+50.20 AUD', positive: true, icon: TX_XFER }] },
  { date: '22 February 2026', items: [{ title: 'Payment from AUD', sub: '05:55PM', amount: '+100.06 AUD', positive: true, icon: TX_XFER }] },
  { date: '2 February 2026', items: [{ title: 'Payment from AUD', sub: '05:55PM', amount: '+500.00 AUD', positive: true, icon: TX_XFER }] },
];

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export const SETTINGS = {
  appVersion: '1.0.0',
  copyright: '2026 Western Union Holdings, Inc. All Rights Reserved',
  title: 'Profile & settings',
  sections: { moreServices: 'More services', legal: 'Legal and support', needHelp: 'Need help?' },
  appSettings: 'App settings',
  logout: 'Log out',
};

// ─── HOME SCREEN COPY ────────────────────────────────────────────────────────
export const HOME = {
  totalBalanceLabel: 'Total balance',
  viewAllAccounts: 'View all accounts',
  sections: { quickActions: 'Quick Actions', recentTransactions: 'Recent transactions' },
};

// Placeholder copy for tabs not yet built.
export const PLACEHOLDERS = {};

// ─── PAYMENTS SCREEN ─────────────────────────────────────────────────────────
export const PAYMENTS_SECTIONS = { contacts: 'Contacts', upcoming: 'Upcoming', recent: 'Recent payments' };

export const PAYMENTS_CONTACTS = [
  { name: 'Elias', initials: 'EG', color: '#E8F4FF', textColor: '#1A6FD4', flag: '🇨🇦' },
  { name: 'Alex', initials: 'AW', color: '#FFE8E8', textColor: '#C4321A', flag: '🇺🇸' },
  { name: 'Aurora', initials: 'AH', color: '#E8F9F0', textColor: '#1A8A4A', flag: '🇯🇵' },
  { name: 'Juan', initials: 'JC', color: '#FFF6E8', textColor: '#C4801A', flag: '🇵🇭' },
  { name: 'Chandra', initials: 'CP', color: '#F0E8FF', textColor: '#6B1AC4', flag: '🇮🇳' },
];

export const PAYMENTS_ACTIONS = [
  { key: 'send', label: 'Send', icon: { ios: 'arrow.up', android: 'arrow-upward' } },
  { key: 'request', label: 'Request', icon: { ios: 'arrow.down', android: 'arrow-downward' } },
  { key: 'paybill', label: 'Pay bill', icon: { ios: 'doc.text', android: 'receipt-long' } },
  { key: 'track', label: 'Track', icon: { ios: 'dot.radiowaves.left.and.right', android: 'track-changes' } },
];

// Upcoming payments carousel (grey inner cards inside the widget).
export const PAYMENTS_UPCOMING = [
  { initials: 'AH', color: '#FF7A45', textColor: '#FFFFFF', amount: '350.32', currency: 'AUD', desc: 'Repayment · 2 May 2026' },
  { initials: 'AH', color: '#C9F1E8', textColor: '#048F6E', amount: '50,000.00', currency: 'JPY', desc: 'To Aurora · 16 April 2026' },
];

// Recent payments list. Either a status (dot + label) OR an action link.
export const PAYMENTS_RECENT = [
  { name: 'Elias Gonzales', date: '4 April 2026, 7:55pm', initials: 'EG', color: '#E8F4FF', textColor: '#1A6FD4', amount: '250.00 CAD', status: 'Incomplete', statusType: 'warning' as const },
  { name: 'Juan Dela Cruz', date: '6 April 2026, 10:45am', initials: 'JC', color: '#FFF6E8', textColor: '#C4801A', amount: '300.00 PHP', status: 'In progress', statusType: 'info' as const },
  { name: 'Elias Gonzales', date: '22 March 2026, 7:55pm', initials: 'EG', color: '#E8F4FF', textColor: '#1A6FD4', amount: '250.00 CAD', action: 'Resend' },
  { name: 'Aurora Howard', date: '3 March, 8:22am', initials: 'AH', color: '#E8F9F0', textColor: '#1A8A4A', amount: '50,000.00 JPY', action: 'Resend' },
  { name: 'Alex Whiteman', date: '2 February 2026, 1:55pm', initials: 'AW', color: '#FFE8E8', textColor: '#C4321A', amount: '+150.00 USD', action: 'Request', positive: true },
];

// ─── CONVERT SHEET COPY ──────────────────────────────────────────────────────
export const CONVERT = {
  title: 'Convert',
  // {code}/{to} are interpolated from CONVERT_MAIN.
  sendTemplate: 'Send {code} to {to}',
  viewQuote: 'View Quote',
  addCurrency: 'Add another currency',
};

// ─── CARDS PAGE ──────────────────────────────────────────────────────────────
export const CARD = {
  last4: '0795',
  network: 'VISA',
  holder: 'Sam Bellegrito',
  currency: 'AUD',
  // Back-of-card details (revealed on flip / "Show details").
  number: '4012 8888 8888 0795',
  expiry: '08/29',
  cvv: '321',
  labels: { number: 'Card number', holder: 'Card holder', expiry: 'Expires', cvv: 'CVV' },
};

// Top-row card actions (standalone yellow buttons).
export const CARD_ACTIONS = [
  { key: 'details', label: 'Show details', icon: { ios: 'eye', android: 'visibility' } },
  { key: 'freeze', label: 'Freeze card', icon: { ios: 'snowflake', android: 'ac-unit' } },
  { key: 'controls', label: 'Controls', icon: { ios: 'slider.horizontal.3', android: 'tune' } },
];

// Recent card spends (list items). NOTE: the second row in Figma shows a green
// logo (Woolworths) under "Uniqlo" copy — interpreted as Woolworths here.
export const CARD_SPENDS = [
  {
    merchant: 'Uniqlo',
    date: '4 April 2026, 7:55pm',
    amount: '- 32.00 AUD',
    status: 'Pending',
    statusType: 'warning' as const,
    initials: 'UN',
    color: '#E60012',
    textColor: '#FFFFFF',
  },
  {
    merchant: 'Woolworths',
    date: '4 April 2026, 7:55pm',
    amount: '- 300.56 AUD',
    status: 'In progress',
    statusType: 'info' as const,
    initials: 'W',
    color: '#178841',
    textColor: '#FFFFFF',
  },
];

// Insights — monthly spend curve (values normalised 0–1; rendered as an SVG line).
export const CARD_INSIGHTS = {
  period: 'Spent this April',
  amount: '450.00 AUD',
  delta: '$100.00',
  deltaUp: true,
  thisMonth: [0.04, 0.07, 0.1, 0.13, 0.18, 0.21, 0.25, 0.31, 0.35, 0.4, 0.46, 0.52, 0.56, 0.63, 0.72, 0.8, 0.85, 0.9, 0.96, 1.0],
  lastMonth: [0.03, 0.05, 0.08, 0.1, 0.12, 0.15, 0.17, 0.2, 0.22, 0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.53],
  axis: ['1', '6', '11', '16', '21', '30'],
};

// Card settings (list items with native icons).
export const CARD_SETTINGS = [
  { label: 'Travel Mode', icon: { ios: 'globe', android: 'public' } },
  { label: 'Setup Apple Pay', icon: { ios: 'apple.logo', android: 'account-balance-wallet' } },
  { label: 'Change Card PIN', icon: { ios: 'circle.grid.3x3.fill', android: 'dialpad' } },
  { label: 'Report card as lost or stolen', icon: { ios: 'creditcard.trianglebadge.exclamationmark', android: 'credit-card' } },
  { label: 'Dispute Transaction', icon: { ios: 'questionmark.circle', android: 'help-outline' } },
];

// Apple Pay setup banner copy.
export const CARD_APPLE_PAY = {
  badge: 'Pay',
  title: 'Setup Apple Pay',
  subtitle: 'Take your card with you and pay in local currency.',
};

// Section header titles for the Cards page.
export const CARD_SECTIONS = {
  spends: 'Recent Spends',
  insights: 'Insights',
  settings: 'Settings',
};
