import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Better {
  address: string;
  amount: number;
  racer: "racer1" | "racer2";
  timestamp: Date;
}

interface TopBetsListProps {
  racer1: { symbol: string; color: string };
  racer2: { symbol: string; color: string };
}

const generateMockBetters = (
  count: number,
  racer: "racer1" | "racer2",
): Better[] => {
  return Array.from({ length: count })
    .map((_, i) => ({
      address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      amount: Math.floor(Math.random() * 5000) + 100,
      racer,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000)),
    }))
    .sort((a, b) => b.amount - a.amount);
};

const BetRow = ({ better, color }: { better: Better; color: string }) => (
  <div className="flex flex-col items-center justify-center p-1.5 hover:bg-white/5 transition-colors border border-white/5 bg-black/20 gap-1">
    <div className="w-8 h-8 bg-white/10 overflow-hidden relative border border-white/10 shrink-0">
      <img
        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${better.address}`}
        alt="avatar"
        className="w-full h-full object-cover"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
    <div className="flex flex-col items-center text-center w-full min-w-0">
      <span className="font-mono text-[9px] text-muted-foreground w-full truncate px-0.5">
        {better.address}
      </span>
      <div className="font-display text-[10px] mt-0.5" style={{ color }}>
        ${better.amount.toLocaleString()}
      </div>
    </div>
  </div>
);

export const TopBetsList = ({ racer1, racer2 }: TopBetsListProps) => {
  const [racer1Bets, setRacer1Bets] = useState<Better[]>([]);
  const [racer2Bets, setRacer2Bets] = useState<Better[]>([]);

  useEffect(() => {
    setRacer1Bets(generateMockBetters(3, "racer1"));
    setRacer2Bets(generateMockBetters(3, "racer2"));
  }, [racer1.symbol, racer2.symbol]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {/* Racer 1 List */}
      <div className="retro-card pixel-corners p-3">
        <h3
          className="font-display text-xs font-bold mb-2 flex items-center justify-between"
          style={{ color: racer1.color }}
        >
          <span>TOP 3 {racer1.symbol}</span>
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {racer1Bets.map((bet, idx) => (
            <BetRow
              key={`${bet.address}-${idx}`}
              better={bet}
              color={racer1.color}
            />
          ))}
        </div>
      </div>

      {/* Racer 2 List */}
      <div className="retro-card pixel-corners p-3">
        <h3
          className="font-display text-xs font-bold mb-2 flex items-center justify-between"
          style={{ color: racer2.color }}
        >
          <span>TOP 3 {racer2.symbol}</span>
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {racer2Bets.map((bet, idx) => (
            <BetRow
              key={`${bet.address}-${idx}`}
              better={bet}
              color={racer2.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
