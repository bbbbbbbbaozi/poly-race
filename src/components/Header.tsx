import { motion } from "framer-motion";
import { Wallet, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isConnected?: boolean;
  walletAddress?: string;
  onConnect?: () => void;
}

export const Header = ({
  isConnected,
  walletAddress,
  onConnect,
}: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            className="w-10 h-10 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/logo.png"
              alt="PolyRace Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div>
            <h1 className="font-pixel text-lg text-white tracking-normal">
              POLYRACE
            </h1>
            <p className="text-[12px] text-muted-foreground font-game uppercase">
              Polymarket × AI Racing
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-xs font-pixel text-muted-foreground hover:text-retro-cyan transition-colors uppercase tracking-widest"
          >
            RACES
          </a>
          <a
            href="#"
            className="text-xs font-pixel text-muted-foreground hover:text-retro-purple transition-colors uppercase tracking-widest"
          >
            LEADERBOARD
          </a>
          <a
            href="#"
            className="text-xs font-pixel text-muted-foreground hover:text-retro-orange transition-colors uppercase tracking-widest"
          >
            HISTORY
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
                className="flex items-center gap-2 px-3 py-2 bg-retro-purple/10 hover:bg-retro-purple/20 transition-colors border border-retro-purple/50 font-game text-base rounded-none"
              >
                <div className="w-5 h-5 overflow-hidden border border-white/20">
                  <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${walletAddress}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className="font-game text-base text-white">
                  {formatAddress(walletAddress!)}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={onConnect}
              className="pixel-button flex items-center gap-2 px-6 py-2 font-pixel text-[10px] bg-white text-black border-2 border-white hover:bg-retro-cyan hover:border-retro-cyan hover:text-black transition-colors rounded-none"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="w-4 h-4" />
              CONNECT WALLET
            </motion.button>
          )}
        </motion.div>
      </div>
    </header>
  );
};
