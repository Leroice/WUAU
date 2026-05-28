// Compatibility shim — mock data moved to services/data.ts.
// Existing `from './mockData'` imports keep working while screens migrate to
// hooks; this shim is removed once nothing imports './mockData' directly.
export * from './services/data';
