import { motion } from "framer-motion";
import { ChevronRight, Flame, Clock, TrendingUp } from "lucide-react";

interface Race {
  id: string;
  racer1: { symbol: string; icon: string; color: string };
  racer2: { symbol: string; icon: string; color: string };
  volume: number;
  participants: number;
  endsAt: Date;
  isHot?: boolean;
}

interface RaceSelectorProps {
  races: Race[];
  selectedRace: string;
  onSelectRace: (id: string) => void;
}

export const RaceSelector = ({ races, selectedRace, onSelectRace }: RaceSelectorProps) => {
  const formatTime = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="glass-panel neon-border p-4">
      <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        热门赛事
      </h3>

      <div className="space-y-2">
        {races.map((race) => (
          <motion.button
            key={race.id}
            onClick={() => onSelectRace(race.id)}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
              selectedRace === race.id
                ? 'bg-primary/10 border border-primary/50'
                : 'bg-muted/30 border border-transparent hover:border-border/50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Racers */}
            <div className="flex items-center -space-x-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-background"
                style={{ background: race.racer1.color }}
              >
                {race.racer1.icon}
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-background"
                style={{ background: race.racer2.color }}
              >
                {race.racer2.icon}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold">
                  {race.racer1.symbol} vs {race.racer2.symbol}
                </span>
                {race.isHot && (
                  <Flame className="w-3 h-3 text-neon-orange" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span>${(race.volume / 1000).toFixed(0)}K vol</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(race.endsAt)}
                </span>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 transition-colors ${
              selectedRace === race.id ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
