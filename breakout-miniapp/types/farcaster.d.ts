// types/farcaster.d.ts
export {};

declare global {
  interface Window {
    farcaster?: {
      wallet?: unknown; // sadece var-yok kontrolü yapıyoruz
    };
  }
}
