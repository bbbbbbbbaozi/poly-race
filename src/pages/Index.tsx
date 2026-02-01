import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { RaceTrack } from "@/components/RaceTrack";
import { AICommentary } from "@/components/AICommentary";
import { StatsPanel } from "@/components/StatsPanel";
import { BoostButton } from "@/components/BoostButton";
import { RaceSelector } from "@/components/RaceSelector";
import { TopBetsList } from "@/components/TopBetsList";
import { UpcomingRaces } from "@/components/UpcomingRaces";
import { useRaceSimulation } from "@/hooks/useRaceSimulation";

const RACES = [
  {
    id: "btc-eth",
    racer1: { symbol: "BTC", color: "hsl(var(--turtle-blue))" },
    racer2: { symbol: "ETH", color: "hsl(var(--rabbit-green))" },
    volume: 2450000,
    participants: 1847,
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isHot: true,
  },
  {
    id: "sol-avax",
    racer1: { symbol: "SOL", color: "hsl(var(--turtle-blue))" },
    racer2: { symbol: "AVAX", color: "hsl(var(--rabbit-green))" },
    volume: 890000,
    participants: 623,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    id: "btc-gold",
    racer1: { symbol: "BTC", color: "hsl(var(--turtle-blue))" },
    racer2: { symbol: "GOLD", color: "hsl(var(--rabbit-green))" },
    volume: 1200000,
    participants: 892,
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
  {
    id: "bnb-matic",
    racer1: { symbol: "BNB", color: "hsl(var(--turtle-blue))" },
    racer2: { symbol: "MATIC", color: "hsl(var(--rabbit-green))" },
    volume: 750000,
    participants: 512,
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
  },
  {
    id: "ada-xrp",
    racer1: { symbol: "ADA", color: "hsl(var(--turtle-blue))" },
    racer2: { symbol: "XRP", color: "hsl(var(--rabbit-green))" },
    volume: 620000,
    participants: 430,
    endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
];

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedRace, setSelectedRace] = useState("btc-eth");

  const { racer1Data, racer2Data, commentary, isTyping, handleBoost } =
    useRaceSimulation();

  const currentRace = RACES.find((r) => r.id === selectedRace)!;

  const racer1 = {
    name: currentRace.racer1.symbol,
    symbol: currentRace.racer1.symbol,
    position: racer1Data.position,
    color: currentRace.racer1.color,
  };

  const racer2 = {
    name: currentRace.racer2.symbol,
    symbol: currentRace.racer2.symbol,
    position: racer2Data.position,
    color: currentRace.racer2.color,
  };

  return (
    <div className="min-h-screen bg-retro-bg font-mono relative overflow-hidden selection:bg-retro-cyan selection:text-black flex flex-col">
      {/* RetroBlock Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Orbs */}
        <div className="orb orb-purple top-[10%] left-[5%] animate-pulse" />
        <div
          className="orb orb-orange bottom-[20%] right-[10%] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="orb orb-cyan top-[40%] right-[30%] opacity-20" />

        {/* Hex/Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Header
        isConnected={isConnected}
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
        onConnect={() => setIsConnected(true)}
      />

      <main className="container mx-auto px-4 pt-24 pb-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Race selector */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RaceSelector
              races={RACES}
              selectedRace={selectedRace}
              onSelectRace={setSelectedRace}
            />
            <div className="mt-6">
              <UpcomingRaces />
            </div>
          </motion.div>

          {/* Center - Main race display */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Race Track */}
            <RaceTrack racer1={racer1} racer2={racer2} />

            {/* Boost buttons */}
            <div className="grid grid-cols-2 gap-4">
              <BoostButton
                racer={{
                  name: racer1.name,
                  symbol: racer1.symbol,
                  color: racer1.color,
                }}
                onBoost={(amount) => handleBoost(racer1.symbol, amount)}
                disabled={!isConnected}
              />
              <BoostButton
                racer={{
                  name: racer2.name,
                  symbol: racer2.symbol,
                  color: racer2.color,
                }}
                onBoost={(amount) => handleBoost(racer2.symbol, amount)}
                disabled={!isConnected}
              />
            </div>

            <TopBetsList
              racer1={{ symbol: racer1.symbol, color: racer1.color }}
              racer2={{ symbol: racer2.symbol, color: racer2.color }}
            />

            {/* Stats panel on mobile */}
            <div className="lg:hidden">
              <StatsPanel
                racer1={{
                  symbol: racer1.symbol,
                  odds: racer1Data.odds,
                  volume: racer1Data.volume,
                  color: racer1.color,
                }}
                racer2={{
                  symbol: racer2.symbol,
                  odds: racer2Data.odds,
                  volume: racer2Data.volume,
                  color: racer2.color,
                }}
                totalVolume={currentRace.volume}
                activeTraders={currentRace.participants}
              />
            </div>
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* AI Commentary */}
            <div className="h-[400px]">
              <AICommentary messages={commentary} isTyping={isTyping} />
            </div>

            {/* Stats panel on desktop */}
            <div className="hidden lg:block">
              <StatsPanel
                racer1={{
                  symbol: racer1.symbol,
                  odds: racer1Data.odds,
                  volume: racer1Data.volume,
                  color: racer1.color,
                }}
                racer2={{
                  symbol: racer2.symbol,
                  odds: racer2Data.odds,
                  volume: racer2Data.volume,
                  color: racer2.color,
                }}
                totalVolume={currentRace.volume}
                activeTraders={currentRace.participants}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md mt-auto">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between text-base text-muted-foreground">
          <span>© 2024 MoonRace.ai</span>
          <div className="flex items-center gap-6">
            <span>Powered by Polymarket</span>
            <span>•</span>
            <span>Gemini 1.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
