// Compatibility shim — provider/hook moved to hooks/usePersona.
// Removed once nothing imports './PersonaContext' directly.
export { PersonaProvider, usePersona } from './hooks/usePersona';
export { PERSONAS } from './services/personas';
export type { Persona } from './types';
