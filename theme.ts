// Compatibility shim — theme tokens moved to constants/theme.ts.
// Remaining root importers are migrated as files move into their layer folders;
// this shim is removed once nothing imports './theme' directly.
export * from './constants/theme';
