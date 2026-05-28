// Typed route params for the root native stack. Screens read these instead of `any`.
export type RootStackParamList = {
  Main: undefined;
  Convert: undefined;
  AppSettings: undefined;
  ChooseCurrency: undefined;
  Accounts: undefined;
  AccountDetail: { code: string; amount: string };
  JarDetail: {
    emoji: string;
    name: string;
    amount: string;
    goalAmount?: string;
    progress?: number;
    targetDate?: string;
  };
  AccountMore: { code: string };
};
