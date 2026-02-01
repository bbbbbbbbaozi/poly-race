import { motion } from "framer-motion";
import { Calendar, Clock, Lock } from "lucide-react";
import { CryptoIcon } from "./CryptoIcons";

const UPCOMING_RACES = [
  {
    id: "doge-shib",
    racer1: { symbol: "DOGE", color: "#BA9F33" },
    racer2: { symbol: "SHIB", color: "#FFA409" },
    startsIn: "2h 15m",
    prizePool: 50000,
  },
  {
    id: "pepe-floki",
    racer1: { symbol: "PEPE", color: "#4C9540" },
    racer2: { symbol: "FLOKI", color: "#00E2FF" },
    startsIn: "5h 30m",
    prizePool: 25000,
  },
  {
    id: "link-uni",
    racer1: { symbol: "LINK", color: "#2A5ADA" },
    racer2: { symbol: "UNI", color: "#FF007A" },
    startsIn: "12h 00m",
    prizePool: 100000,
  },
  {
    id: "dot-atom",
    racer1: { symbol: "DOT", color: "#E6007A" },
    racer2: { symbol: "ATOM", color: "#2E3148" },
    startsIn: "18h 45m",
    prizePool: 75000,
  },
  {
    id: "ltc-bch",
    racer1: { symbol: "LTC", color: "#345D9D" },
    racer2: { symbol: "BCH", color: "#8DC351" },
    startsIn: "24h 00m",
    prizePool: 60000,
  },
];

export const UpcomingRaces = () => {
  return (
    <div className="retro-card pixel-corners p-4 mt-6">
      <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2 text-retro-purple">
        <Calendar className="w-4 h-4 text-retro-purple" />
        UPCOMING
      </h3>

      <div className="space-y-2">
        {UPCOMING_RACES.map((race) => (
          <div
            key={race.id}
            className="w-full px-2 py-3 rounded-none flex items-center gap-2 bg-muted/30 border border-transparent opacity-80 hover:opacity-100 hover:border-white/10 transition-all cursor-not-allowed"
          >
            {/* Racers */}
            <div className="flex items-center -space-x-3 grayscale opacity-70">
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
              <div className="flex items-center gap-2 justify-between">
                <span className="font-display text-sm font-bold whitespace-nowrap truncate text-muted-foreground">
                  {race.racer1.symbol} vs {race.racer2.symbol}
                </span>
                <Lock className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {race.startsIn}
                </span>
                <span>•</span>
                <span>${(race.prizePool / 1000).toFixed(0)}K pool</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
