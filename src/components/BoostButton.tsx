import { motion } from "framer-motion";
import { Rocket, Zap } from "lucide-react";
import { useState } from "react";

interface BoostButtonProps {
  racer: {
    name: string;
    symbol: string;
    color: string;
  };
  onBoost: (amount: number) => void;
  disabled?: boolean;
}

export const BoostButton = ({ racer, onBoost, disabled }: BoostButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [amount, setAmount] = useState(100);

  const presets = [50, 100, 250, 500];

  return (
    <motion.div
      className="glass-panel neon-border p-4"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5" style={{ color: racer.color }} />
        <h3 className="font-display text-sm font-bold">
          支持 <span style={{ color: racer.color }}>{racer.symbol}</span>
        </h3>
      </div>

      {/* Amount presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              amount === preset
                ? 'text-background'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
            style={{
              background: amount === preset ? racer.color : undefined,
            }}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-8 pr-4 font-display text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Boost button */}
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => onBoost(amount)}
        disabled={disabled}
        className="w-full relative overflow-hidden rounded-xl py-4 font-display font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${racer.color}, ${racer.color}cc)`,
          boxShadow: isHovered 
            ? `0 0 30px ${racer.color}80, 0 0 60px ${racer.color}40`
            : `0 0 15px ${racer.color}50`,
          color: 'hsl(var(--background))',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6 }}
        />
        
        <span className="relative flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          BOOST ${amount}
        </span>
      </motion.button>

      {/* Potential return */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        预计回报: <span className="text-neon-green font-medium">${(amount * 1.85).toFixed(2)}</span>
      </p>
    </motion.div>
  );
};
