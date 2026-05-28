import { TOP_CURRENCIES, ALL_CURRENCIES, RATES_PER_AUD } from './data';
import type { Currency } from '../types';

export const listCurrencies = async (): Promise<Currency[]> => ALL_CURRENCIES;
export const topCurrencies = async (): Promise<Currency[]> => TOP_CURRENCIES;

// Rates are AUD-based ("1 AUD = N units"); derive any pair from the two legs.
export const ratePerAud = (code: string): number => RATES_PER_AUD[code] ?? 1;
export const convert = (amount: number, from: string, to: string): number =>
  amount * (ratePerAud(to) / ratePerAud(from));
