// A currency wallet shown on Home and the Accounts → Currencies tab.
export interface Account {
  flag: string;
  code: string;
  amount: string;
  label: string;
  fullName: string;
}

// A selectable currency (converter picker + currency list).
export interface Currency {
  code: string;
  flag: string;
  name: string;
}
