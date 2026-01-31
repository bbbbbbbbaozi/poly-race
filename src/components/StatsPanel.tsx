import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, Users, DollarSign } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ label, value, change, icon, color = "hsl(var(--primary))" }: StatCardProps) => (
  <motion.div
    className="glass-panel p-4 rounded-xl"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-display text-xl font-bold mt-1" style={{ color }}>
          {value}
        </p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${change >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div
        className="p-2 rounded-lg"
        style={{ background: `${color}20` }}
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

export const StatsPanel = ({ racer1, racer2, totalVolume, activeTraders }: StatsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Odds comparison */}
      <div className="glass-panel neon-border p-4">
        <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          实时赔率
        </h3>
        
        <div className="space-y-3">
          {/* Racer 1 odds */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-12" style={{ color: racer1.color }}>
              {racer1.symbol}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: racer1.color }}
                initial={{ width: 0 }}
                animate={{ width: `${racer1.odds}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
            <span className="text-sm font-display font-bold w-14 text-right">
              {racer1.odds.toFixed(1)}%
            </span>
          </div>

          {/* Racer 2 odds */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-12" style={{ color: racer2.color }}>
              {racer2.symbol}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: racer2.color }}
                initial={{ width: 0 }}
                animate={{ width: `${racer2.odds}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
            <span className="text-sm font-display font-bold w-14 text-right">
              {racer2.odds.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="24h 交易量"
          value={`$${(totalVolume / 1000000).toFixed(1)}M`}
          change={12.5}
          icon={<DollarSign className="w-4 h-4 text-neon-gold" />}
          color="hsl(var(--neon-gold))"
        />
        <StatCard
          label="活跃交易者"
          value={activeTraders.toLocaleString()}
          change={8.3}
          icon={<Users className="w-4 h-4 text-neon-cyan" />}
          color="hsl(var(--neon-cyan))"
        />
      </div>

      {/* Momentum indicator */}
      <div className="glass-panel neon-border p-4">
        <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-gold" />
          动量指标
        </h3>
        <div className="relative h-8 bg-muted rounded-full overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/30" />
          
          {/* Momentum bar */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            style={{
              background: racer1.odds > racer2.odds 
                ? `linear-gradient(90deg, transparent, ${racer1.color})`
                : `linear-gradient(270deg, transparent, ${racer2.color})`,
              left: racer1.odds > racer2.odds ? '50%' : `${50 - (racer2.odds - 50)}%`,
              width: `${Math.abs(racer1.odds - 50)}%`,
            }}
            animate={{
              width: `${Math.abs(racer1.odds - 50)}%`,
            }}
          />
          
          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
            <span style={{ color: racer2.color }}>{racer2.symbol}</span>
            <span style={{ color: racer1.color }}>{racer1.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
