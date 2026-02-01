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
      className="retro-card pixel-corners p-4"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5" style={{ color: racer.color }} />
        <h3 className="font-pixel text-[10px] uppercase">
          BOOST <span style={{ color: racer.color }}>{racer.symbol}</span>
        </h3>
      </div>

      {/* Amount presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`py-2 px-3 border-2 text-lg font-game transition-all rounded-none ${
              amount === preset
                ? "text-background border-current"
                : "bg-muted hover:bg-muted/80 text-foreground border-white/20"
            }`}
            style={{
              background: amount === preset ? racer.color : undefined,
              borderColor: amount === preset ? racer.color : undefined,
              imageRendering: "pixelated",
            }}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-black/40 border border-white/20 py-2 pl-8 pr-4 font-game text-2xl focus:outline-none focus:ring-1 focus:ring-primary/50 rounded-none text-white"
        />
      </div>

      {/* Boost button */}
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => onBoost(amount)}
        disabled={disabled}
        className="pixel-button w-full relative overflow-hidden py-4 font-pixel text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase rounded-none border-2"
        style={{
          background: `linear-gradient(135deg, ${racer.color}, ${racer.color}cc)`,
          color: "hsl(var(--background))",
          borderColor: racer.color,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.6 }}
        />

        <span className="relative flex items-center justify-center gap-2 font-bold text-gray-50 drop-shadow-md">
          <Zap className="w-4 h-4" />
          BOOST ${amount}
        </span>
      </motion.button>

      {/* Potential return */}
      <p className="text-center text-sm text-muted-foreground mt-3 font-game uppercase">
        RETURN:{" "}
        <span className="text-retro-orange text-base font-bold">
          ${(amount * 1.85).toFixed(2)}
        </span>
      </p>
    </motion.div>
  );
};
