'use client';
import { useEffect, useRef, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { WagmiProvider, http, useAccount, useWriteContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { createConfig } from 'wagmi';
import { Breakout } from '../../components/Breakout';
import { HIGH_SCORES_ABI, HIGH_SCORES_ADDR } from '../../lib/contract';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 👇 burada asla "as any" YOK. Global tipi types/farcaster.d.ts veriyor.
const isMiniEnv = () =>
  typeof window !== 'undefined' && !!window.farcaster?.wallet;

const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [miniAppConnector()],
});

function MintBar({ score }: { score: number }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);

  const canSubmit = isConnected && score > 0;

  const submit = async () => {
    const hash = await writeContractAsync({
      abi: HIGH_SCORES_ABI,
      address: HIGH_SCORES_ADDR,
      functionName: 'submitScore',
      args: [BigInt(score)],
      chainId: base.id,
    });
    setTxHash(hash);
  };

  return (
    <div className="mt-3 flex items-center gap-3 text-sm">
      <div className="opacity-80">
        {isConnected
          ? `Bağlı: ${address?.slice(0, 6)}…${address?.slice(-4)}`
          : 'Mini App cüzdanı bağlanıyor…'}
      </div>
      <button
        disabled={!canSubmit || isPending}
        onClick={submit}
        className="px-3 py-1.5 rounded-lg bg-white/10 disabled:opacity-40"
      >
        {isPending ? 'Gönderiliyor…' : 'Skoru Kaydet (Base)'}
      </button>
      {txHash && (
        <a
          className="underline"
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          Tx
        </a>
      )}
    </div>
  );
}

export default function MiniAppPage() {
  const [score, setScore] = useState(0);
  const readyOnce = useRef(false);
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!readyOnce.current) {
      readyOnce.current = true;
      sdk.actions.ready().catch(() => {});
    }
  }, []);

  if (mounted && !isMiniEnv()) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-3">
          <h1 className="text-xl font-semibold">Breakout (Base)</h1>
          <p className="opacity-80">
            Bu uygulama yalnızca <b>Farcaster Mini App</b> olarak çalışır.
            Lütfen Warpcast içinde açın.
          </p>
        </div>
      </main>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <main className="min-h-dvh flex items-center justify-center p-4">
          <div className="w-[360px]">
            <div className="flex items-center justify-center mb-3">
              <img
                src="/farcaster-logo.png"
                alt="Farcaster Logo"
                className="w-10 h-10 mr-2 rounded-full bg-white/10 p-1"
              />
              <h1 className="text-xl font-semibold">Breakout (Base)</h1>
            </div>
            <Breakout onGameOver={(s) => setScore(s)} />
            <MintBar score={score} />
          </div>
        </main>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
