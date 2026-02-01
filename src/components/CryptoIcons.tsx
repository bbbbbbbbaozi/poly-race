import React, { useState } from "react";

// Mapping for special cases or renames
const SYMBOL_MAP: Record<string, string> = {
  GOLD: "paxg", // Mapping GOLD to PAX Gold as a representative token
};

export const CryptoIcon = ({
  symbol,
  className,
  style,
}: {
  symbol: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [error, setError] = useState(false);

  const normalizedSymbol =
    SYMBOL_MAP[symbol.toUpperCase()] || symbol.toLowerCase();

  // Using spothq/cryptocurrency-icons CDN for high quality pngs
  const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${normalizedSymbol}.png`;

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-white/10 rounded-full`}
        style={style}
      >
        <span className="text-[10px] font-bold">{symbol[0]}</span>
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
};
