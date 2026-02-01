import { motion } from "framer-motion";
import { Wallet, ChevronDown } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface HeaderProps {
  // Props can be removed or kept if needed for other things
}

export const Header = ({}: HeaderProps) => {
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
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <motion.button
                          onClick={openConnectModal}
                          className="pixel-button flex items-center gap-2 px-6 py-2 font-pixel text-[10px] bg-white text-black border-2 border-white hover:bg-retro-cyan hover:border-retro-cyan hover:text-black transition-colors rounded-none"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Wallet className="w-4 h-4" />
                          CONNECT WALLET
                        </motion.button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-4 py-2 bg-destructive text-destructive-foreground font-pixel text-xs rounded-none"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={openChainModal}
                          className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-game text-xs rounded-none text-white"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 16,
                                height: 16,
                                borderRadius: 999,
                                overflow: "hidden",
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 16, height: 16 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 px-3 py-2 bg-retro-purple/10 hover:bg-retro-purple/20 transition-colors border border-retro-purple/50 font-game text-base rounded-none"
                        >
                          <div className="w-5 h-5 overflow-hidden border border-white/20">
                            <img
                              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${account.address}`}
                              alt="avatar"
                              className="w-full h-full object-cover"
                              style={{ imageRendering: "pixelated" }}
                            />
                          </div>
                          <span className="font-game text-base text-white">
                            {account.displayName}
                          </span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </motion.div>
      </div>
    </header>
  );
};
