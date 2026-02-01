import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { CryptoIcon } from "./CryptoIcons";

interface RacerProps {
  name: string;
  symbol: string;
  position: number;
  color: string;
  isLeading: boolean;
}

const Racer = ({ name, symbol, position, color, isLeading }: RacerProps) => {
  return (
    <div className="relative h-24 flex items-center">
      {/* Track */}
      <div className="race-track h-3 w-full border-2 border-border/30 absolute left-0 right-0 top-1/2 -translate-y-1/2">
        {/* Finish line */}
        <div className="absolute right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-foreground/80 to-foreground/20" />

        {/* Progress glow */}
        <motion.div
          className="absolute top-0 bottom-0 left-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
            opacity: 0.3,
            imageRendering: "pixelated",
          }}
          animate={{ width: `${position}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Token */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${isLeading ? "animate-race-shake" : ""}`}
        animate={{ left: `calc(${position}% - 32px)` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Token icon with glow */}
        <div className="relative">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-full"
            style={{
              boxShadow: isLeading
                ? `0 0 30px ${color}60`
                : `0 0 10px ${color}20`,
            }}
          >
            <CryptoIcon symbol={symbol} className="w-16 h-16" />
          </div>

          {/* Fire trail for leader */}
          {isLeading && (
            <motion.div
              className="absolute -left-6 top-1/2 -translate-y-1/2"
              animate={{ opacity: [1, 0.5, 1], x: [-2, 0, -2] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              <Flame className="w-5 h-5 text-orange-500" />
            </motion.div>
          )}
        </div>

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
      <div className="absolute right-0 -bottom-5 flex items-center gap-2 z-0">
        <span className="font-display text-sm font-bold" style={{ color }}>
          {position.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

interface RaceTrackProps {
  racer1: { name: string; symbol: string; position: number; color: string };
  racer2: { name: string; symbol: string; position: number; color: string };
  className?: string;
}

export const RaceTrack = ({
  racer1,
  racer2,
  className = "",
}: RaceTrackProps) => {
  const leader =
    racer1.position > racer2.position
      ? 1
      : racer2.position > racer1.position
        ? 2
        : 0;

  return (
    <div
      className={`retro-card pixel-corners p-6 space-y-8 flex flex-col justify-center ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-sm text-retro-purple flex items-center gap-2 uppercase tracking-wider">
          <span className="text-neon-cyan">TURTLE</span>
          <span className="text-neon-purple">×</span>
          <span className="text-neon-orange">RABBIT</span>
        </h2>
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-game uppercase">
          <span
            className="w-2 h-2 bg-retro-orange animate-pulse"
            style={{ imageRendering: "pixelated" }}
          />
          LIVE
        </div>
      </div>

      {/* Racers */}
      <div className="flex flex-col gap-1">
        <Racer {...racer1} isLeading={leader === 1} />

        <div className="flex items-center justify-center py-2 h-8 relative -z-10">
          <div className="text-base font-pixel text-muted-foreground px-4">
            VS
          </div>
          {/* Decorative line behind VS */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 -z-10" />
        </div>

        <Racer {...racer2} isLeading={leader === 2} />
      </div>

      {/* Gap indicator */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
        <span className="text-sm text-muted-foreground">Gap:</span>
        <motion.span
          className="font-display text-lg font-bold"
          style={{
            color:
              leader === 1
                ? racer1.color
                : leader === 2
                  ? racer2.color
                  : undefined,
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
