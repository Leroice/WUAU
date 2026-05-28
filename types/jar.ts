// A goal-based savings "jar" — a per-currency container the user can hold money
// in for a specific purpose. Multiple jars sit under one currency account
// (e.g. USD might have an "FX trading" jar and a "Rainy day" jar). Jars don't
// earn interest; the value prop is convenience (money on hand in the right
// currency) + timing (hold until the rate suits).
export interface Jar {
  emoji: string;
  name: string;
  /** Human purpose blurb — "Holiday in Japan", "Send to mum", "FX trading". */
  purpose?: string;
  /** Currency code this jar holds (e.g. 'AUD', 'JPY'). Optional during rename
   *  pass — will be tightened once jars are nested under currency accounts. */
  currency?: string;
  goal?: string;
  amount: string;
  subAmount?: string;
  progress?: number;
  goalAmount?: string;
  targetDate?: string;
}
