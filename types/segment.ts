// Migration segment — the 7 entry experiences defined in
// WU-eOne-Migration-UX-v0.2.docx. Determines which home-screen variant the
// user sees, which nudges fire, and which actions are locked.
//
//   S1   — E1 wallet user (full new home, no migration friction)
//   S2   — E1 IMT user, wallet rejected (IMT-first, wallet retry available)
//   S3   — E1 user on R4 web (redirect; edge case)
//   S4   — R4 unverified, abandoned (What's-New → fresh onboarding)
//   S5a  — R4 verification in progress (KYC review)
//   S5b  — KYC failed, retry available
//   S5c  — ECDD / high-risk hold (compliance sign-off; log-out only)
//   S6   — Verified R4, IMT only on E1 (IMT home + wallet card)
//   S7a  — Verified R4 upgrading: value prop / pre-eligibility
//   S7b  — Verified R4 upgrading: eligibility check
//   S7c  — Verified R4 upgrading: transact-paused (wallet onboarding in flight)
export type Segment =
  | 'S1' | 'S2' | 'S3' | 'S4'
  | 'S5a' | 'S5b' | 'S5c'
  | 'S6'
  | 'S7a' | 'S7b' | 'S7c';

// Wallet entitlement (orthogonal to segment — S2 is "rejected", S6 is "none",
// S7c is "pending", S1 is "active").
export type WalletStatus = 'active' | 'pending' | 'rejected' | 'none';
