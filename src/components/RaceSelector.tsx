import { motion } from "framer-motion";
import { ChevronRight, Flame, Clock, TrendingUp } from "lucide-react";
import { CryptoIcon } from "./CryptoIcons";

interface Race {
  id: string;
  racer1: { symbol: string; color: string };
  racer2: { symbol: string; color: string };
  volume: number;
  participants: number;
  endsAt: Date;
  isHot?: boolean;
}

interface RaceSelectorProps {
  races: Race[];
  selectedRace: string;
  onSelectRace: (id: string) => void;
  className?: string;
}

export const RaceSelector = ({
  races,
  selectedRace,
  onSelectRace,
  className = "",
}: RaceSelectorProps) => {
  const formatTime = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={`retro-card pixel-corners p-4 flex flex-col ${className}`}>
      <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2 text-retro-cyan flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-retro-cyan" />
        HOT RACES
      </h3>

      <div className="space-y-2 flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
        {races.map((race) => (
          <motion.button
            key={race.id}
            onClick={() => onSelectRace(race.id)}
            className={`w-full px-2 py-3 rounded-none flex items-center gap-2 transition-all ${
              selectedRace === race.id
                ? "bg-retro-purple/20 border-2 border-retro-purple shadow-[0_0_10px_rgba(107,46,199,0.3)]"
                : "bg-muted/30 border border-transparent hover:border-white/20"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Racers */}
            <div className="flex items-center -space-x-3 transition-all">
              <div className="w-9 h-9 z-0">
                <CryptoIcon
                  symbol={race.racer1.symbol}
                  className="w-full h-full drop-shadow-md"
                />
              </div>
              <div className="w-9 h-9 z-10">
                <CryptoIcon
                  symbol={race.racer2.symbol}
                  className="w-full h-full drop-shadow-md"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold whitespace-nowrap truncate">
                  {race.racer1.symbol} vs {race.racer2.symbol}
                </span>
                {race.isHot && (
                  <Flame className="w-3 h-3 text-retro-orange flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 font-mono">
                <span>${(race.volume / 1000).toFixed(0)}K vol</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(race.endsAt)}
                </span>
              </div>
            </div>

            <ChevronRight
              className={`w-4 h-4 transition-colors ${
                selectedRace === race.id
                  ? "text-retro-purple"
                  : "text-muted-foreground"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
