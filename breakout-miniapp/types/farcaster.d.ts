export {};

declare global {
  interface Window {
    farcaster?: {
      wallet?: unknown;
    };
  }
}
