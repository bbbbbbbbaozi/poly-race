import { motion } from "framer-motion";
import { Wallet, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isConnected?: boolean;
  walletAddress?: string;
  onConnect?: () => void;
}

export const Header = ({ isConnected, walletAddress, onConnect }: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Moon className="w-5 h-5 text-background" />
          </motion.div>
          <div>
            <h1 className="font-display text-lg font-black tracking-wider">
              <span className="text-glow-cyan">MOON</span>
              <span className="text-glow-magenta">RACE</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-1">
              AI-Powered Prediction Racing
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Active Races
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Leaderboard
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            History
          </a>
        </nav>

        {/* Wallet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {isConnected ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/50"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta" />
                <span className="font-mono text-sm">{formatAddress(walletAddress!)}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={onConnect}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-neon-cyan to-neon-magenta text-background"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px hsl(var(--neon-cyan) / 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </motion.button>
          )}
        </motion.div>
      </div>
    </header>
  );
};
