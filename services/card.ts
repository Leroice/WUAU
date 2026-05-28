import { getPersona } from './personas';
import { CARD, CARD_INSIGHTS } from './data';
import type { CardSpend } from '../types';

export const getCard = async () => CARD;
export const getCardInsights = async () => CARD_INSIGHTS;
export const getCardSpends = async (personaId: string): Promise<CardSpend[]> =>
  (await getPersona(personaId)).cardSpends;
