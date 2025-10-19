export const HIGH_SCORES_ADDR =
  '0xEe556bF31914C7403De117DAEa7276D1A1Ff64eF'; // Base mainnet deployed ✅

export const HIGH_SCORES_ABI = [
  { type: "function", name: "submitScore", stateMutability: "nonpayable",
    inputs: [{ name: "score", type: "uint256" }], outputs: [] },
  { type: "function", name: "highScoreOf", stateMutability: "view",
    inputs: [{ name: "player", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "event", name: "ScoreSubmitted", anonymous: false,
    inputs: [
      { name: "player", indexed: true, type: "address" },
      { name: "score", indexed: false, type: "uint256" }
    ] }
] as const;
