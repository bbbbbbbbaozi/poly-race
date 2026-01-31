import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RacerProps {
  name: string;
  symbol: string;
  position: number;
  color: string;
  icon: string;
  isLeading: boolean;
}

const Racer = ({ name, symbol, position, color, icon, isLeading }: RacerProps) => {
  return (
    <div className="relative h-20">
      {/* Track */}
      <div className="race-track h-3 w-full">
        {/* Finish line */}
        <div className="absolute right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-foreground/80 to-foreground/20" />
        
        {/* Progress glow */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
            opacity: 0.3,
          }}
          animate={{ width: `${position}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Token */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${isLeading ? 'animate-race-shake' : ''}`}
        animate={{ left: `calc(${position}% - 24px)` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Token icon with glow */}
        <motion.div
          className="relative"
          animate={isLeading ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              boxShadow: isLeading ? `0 0 20px ${color}, 0 0 40px ${color}80` : `0 0 10px ${color}80`,
            }}
          >
            {icon}
          </div>
          
          {/* Fire trail for leader */}
          {isLeading && (
            <motion.div
              className="absolute -left-4 top-1/2 -translate-y-1/2 text-xl"
              animate={{ opacity: [1, 0.5, 1], x: [-2, 0, -2] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              🔥
            </motion.div>
          )}
        </motion.div>

        {/* Name tag */}
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-display font-bold whitespace-nowrap"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}50`,
            color: color,
          }}
        >
          {symbol}
        </div>
      </motion.div>

      {/* Position percentage */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span className="font-display text-lg font-bold" style={{ color }}>
          {position.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

interface RaceTrackProps {
  racer1: {
    name: string;
    symbol: string;
    position: number;
    color: string;
    icon: string;
  };
  racer2: {
    name: string;
    symbol: string;
    position: number;
    color: string;
    icon: string;
  };
}

export const RaceTrack = ({ racer1, racer2 }: RaceTrackProps) => {
  const leader = racer1.position > racer2.position ? 1 : racer2.position > racer1.position ? 2 : 0;

  return (
    <div className="glass-panel neon-border p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-glow-cyan">
          🏁 RACE TO MOON
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Racers */}
      <div className="space-y-6">
        <Racer {...racer1} isLeading={leader === 1} />
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 text-2xl font-display font-black text-muted-foreground">
            VS
          </div>
        </div>
        <Racer {...racer2} isLeading={leader === 2} />
      </div>

      {/* Gap indicator */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/50">
        <span className="text-sm text-muted-foreground">Gap:</span>
        <motion.span
          className="font-display text-lg font-bold"
          style={{
            color: leader === 1 ? racer1.color : leader === 2 ? racer2.color : undefined,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5 }}
        >
          {Math.abs(racer1.position - racer2.position).toFixed(2)}%
        </motion.span>
      </div>
    </div>
  );
};
