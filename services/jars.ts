import { JARS, JAR_TXNS } from './data';
import type { Jar, TxnSection } from '../types';

export const getJars = async (): Promise<Jar[]> => JARS;

export const getJarTxns = async (_name: string): Promise<TxnSection[]> => JAR_TXNS;
