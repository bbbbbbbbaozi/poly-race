import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { RaceTrack } from "@/components/RaceTrack";
import { AICommentary } from "@/components/AICommentary";
import { StatsPanel } from "@/components/StatsPanel";
import { BoostButton } from "@/components/BoostButton";
import { RaceSelector } from "@/components/RaceSelector";
import { useRaceSimulation } from "@/hooks/useRaceSimulation";

const RACES = [
  {
    id: "btc-eth",
    racer1: { symbol: "BTC", icon: "₿", color: "#F7931A" },
    racer2: { symbol: "ETH", icon: "Ξ", color: "#627EEA" },
    volume: 2450000,
    participants: 1847,
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isHot: true,
  },
  {
    id: "sol-avax",
    racer1: { symbol: "SOL", icon: "◎", color: "#9945FF" },
    racer2: { symbol: "AVAX", icon: "A", color: "#E84142" },
    volume: 890000,
    participants: 623,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    id: "btc-gold",
    racer1: { symbol: "BTC", icon: "₿", color: "#F7931A" },
    racer2: { symbol: "GOLD", icon: "Au", color: "#FFD700" },
    volume: 1200000,
    participants: 892,
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
];

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedRace, setSelectedRace] = useState("btc-eth");
  
  const { racer1Data, racer2Data, commentary, isTyping, handleBoost } = useRaceSimulation();

  const currentRace = RACES.find(r => r.id === selectedRace)!;

  const racer1 = {
    name: currentRace.racer1.symbol,
    symbol: currentRace.racer1.symbol,
    position: racer1Data.position,
    color: currentRace.racer1.color,
    icon: currentRace.racer1.icon,
  };

  const racer2 = {
    name: currentRace.racer2.symbol,
    symbol: currentRace.racer2.symbol,
    position: racer2Data.position,
    color: currentRace.racer2.color,
    icon: currentRace.racer2.icon,
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neon-cyan/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-magenta/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <Header 
        isConnected={isConnected}
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
        onConnect={() => setIsConnected(true)}
      />

      <main className="container mx-auto px-4 pt-24 pb-8">
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
                racer={{ name: racer1.name, symbol: racer1.symbol, color: racer1.color }}
                onBoost={(amount) => handleBoost(racer1.symbol, amount)}
                disabled={!isConnected}
              />
              <BoostButton
                racer={{ name: racer2.name, symbol: racer2.symbol, color: racer2.color }}
                onBoost={(amount) => handleBoost(racer2.symbol, amount)}
                disabled={!isConnected}
              />
            </div>

            {/* Stats panel on mobile */}
            <div className="lg:hidden">
              <StatsPanel
                racer1={{ symbol: racer1.symbol, odds: racer1Data.odds, volume: racer1Data.volume, color: racer1.color }}
                racer2={{ symbol: racer2.symbol, odds: racer2Data.odds, volume: racer2Data.volume, color: racer2.color }}
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
                racer1={{ symbol: racer1.symbol, odds: racer1Data.odds, volume: racer1Data.volume, color: racer1.color }}
                racer2={{ symbol: racer2.symbol, odds: racer2Data.odds, volume: racer2Data.volume, color: racer2.color }}
                totalVolume={currentRace.volume}
                activeTraders={currentRace.participants}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2024 MoonRace.ai - AI-Powered Prediction Racing</span>
          <div className="flex items-center gap-4">
            <span>Powered by Polymarket CLOB</span>
            <span>•</span>
            <span>Gemini 1.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
