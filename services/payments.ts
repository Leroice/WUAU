import { getPersona } from './personas';
import type { PaymentContact, UpcomingPayment, RecentPayment } from '../types';

export const getPaymentContacts = async (personaId: string): Promise<PaymentContact[]> =>
  (await getPersona(personaId)).paymentsContacts;

export const getUpcomingPayments = async (personaId: string): Promise<UpcomingPayment[]> =>
  (await getPersona(personaId)).paymentsUpcoming;

export const getRecentPayments = async (personaId: string): Promise<RecentPayment[]> =>
  (await getPersona(personaId)).paymentsRecent;
