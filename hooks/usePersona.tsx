import React, { createContext, useContext, useState } from 'react';
import type { Persona } from '../types';
import { PERSONAS } from '../services/personas';

// Which demo persona is active. Selection is instant client state (a demo toggle);
// the persona's data bundle comes from services/personas.
type Ctx = { persona: Persona; setPersona: (id: string) => void };
const PersonaCtx = createContext<Ctx>({ persona: PERSONAS[0], setPersona: () => {} });

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setP] = useState<Persona>(PERSONAS[0]);
  const setPersona = (id: string) => setP(PERSONAS.find((p) => p.id === id) ?? PERSONAS[0]);
  return <PersonaCtx.Provider value={{ persona, setPersona }}>{children}</PersonaCtx.Provider>;
}

export const usePersona = () => useContext(PersonaCtx);
