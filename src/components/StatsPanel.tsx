import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Users,
  DollarSign,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({
  label,
  value,
  change,
  icon,
  color = "hsl(var(--primary))",
}: StatCardProps) => (
  <motion.div
    className="retro-card pixel-corners p-4 border"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-pixel text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-pixel text-base mt-2" style={{ color }}>
          {value}
        </p>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 mt-1 text-sm font-game ${change >= 0 ? "text-neon-orange" : "text-destructive"}`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <div
        className="p-2 border"
        style={{
          background: `${color}20`,
          borderColor: color,
          imageRendering: "pixelated",
        }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

interface StatsPanelProps {
  racer1: {
    symbol: string;
    odds: number;
    volume: number;
    color: string;
  };
  racer2: {
    symbol: string;
    odds: number;
    volume: number;
    color: string;
  };
  totalVolume: number;
  activeTraders: number;
}

export const StatsPanel = ({
  racer1,
  racer2,
  totalVolume,
  activeTraders,
}: StatsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Odds comparison */}
      <div className="retro-card pixel-corners p-6">
        <h3 className="font-pixel text-[10px] mb-6 flex items-center gap-2 uppercase text-retro-cyan">
          <Activity className="w-4 h-4 text-retro-cyan" />
          ODDS
        </h3>

        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-4 items-center">
          {/* Racer 1 odds */}
          <span
            className="text-base font-bold font-game"
            style={{ color: racer1.color }}
          >
            {racer1.symbol}
          </span>
          <div className="h-3 bg-muted border border-white/10 overflow-hidden relative w-full">
            <motion.div
              className="h-full absolute left-0 top-0 bottom-0"
              style={{ background: racer1.color, imageRendering: "pixelated" }}
              initial={{ width: 0 }}
              animate={{ width: `${racer1.odds}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          <span className="text-base font-pixel text-right w-[4.5rem]">
            {racer1.odds.toFixed(1)}%
          </span>

          {/* Racer 2 odds */}
          <span
            className="text-base font-bold font-game"
            style={{ color: racer2.color }}
          >
            {racer2.symbol}
          </span>
          <div className="h-3 bg-muted border border-white/10 overflow-hidden relative w-full">
            <motion.div
              className="h-full absolute left-0 top-0 bottom-0"
              style={{ background: racer2.color, imageRendering: "pixelated" }}
              initial={{ width: 0 }}
              animate={{ width: `${racer2.odds}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          <span className="text-base font-pixel text-right w-[4.5rem]">
            {racer2.odds.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="24H VOLUME"
          value={`$${(totalVolume / 1000000).toFixed(1)}M`}
          change={12.5}
          icon={<DollarSign className="w-4 h-4 text-white" />}
          color="hsl(var(--retro-orange))"
        />
        <StatCard
          label="ACTIVE TRADERS"
          value={activeTraders.toLocaleString()}
          change={8.3}
          icon={<Users className="w-4 h-4 text-white" />}
          color="hsl(var(--retro-cyan))"
        />
      </div>

      {/* Momentum indicator */}
      <div className="retro-card pixel-corners p-4">
        <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2 text-retro-purple">
          <Zap className="w-4 h-4 text-retro-purple" />
          MOMENTUM
        </h3>
        <div className="relative h-8 bg-muted rounded-none border border-white/10 overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/30 z-10" />

          {/* Momentum bar */}
          <motion.div
            className="absolute top-1 bottom-1"
            style={{
              background:
                racer1.odds > racer2.odds
                  ? `linear-gradient(90deg, transparent, ${racer1.color})`
                  : `linear-gradient(270deg, transparent, ${racer2.color})`,
              left: racer1.odds > racer2.odds ? "50%" : `auto`,
              right: racer1.odds > racer2.odds ? "auto" : "50%",
              width: `${Math.abs(racer1.odds - 50) * 2}%`,
            }}
            animate={{
              width: `${Math.abs(racer1.odds - 50) * 2}%`,
            }}
          />

          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium z-20">
            <span style={{ color: racer2.color }}>{racer2.symbol}</span>
            <span style={{ color: racer1.color }}>{racer1.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
