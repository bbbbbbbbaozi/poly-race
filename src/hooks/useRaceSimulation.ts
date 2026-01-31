import { useState, useEffect, useCallback } from "react";

interface RacerData {
  position: number;
  odds: number;
  volume: number;
}

interface CommentaryMessage {
  id: number;
  text: string;
  type: "neutral" | "bullish" | "bearish" | "alert";
  timestamp: Date;
}

const COMMENTARY_TEMPLATES = {
  bullish: [
    "🚀 大户刚刚买入大量 {symbol}！市场信心爆棚！",
    "💪 {symbol} 势头正猛！空头被无情碾压！",
    "⚡ 监测到 Polymarket 上 {symbol} 出现巨额多单！",
    "🔥 {symbol} 突破关键阻力位！乌龟要反超了！",
    "📈 {symbol} 的买盘深度惊人！庄家在护盘？",
  ],
  bearish: [
    "📉 {symbol} 遭遇抛售！有人在离场...",
    "⚠️ 警报！{symbol} 的支撑位正在被测试！",
    "🐻 空头势力抬头，{symbol} 节节败退！",
    "💔 {symbol} 跌破心理价位，恐慌情绪蔓延！",
    "🔻 大单抛售！有鲸鱼在砸盘 {symbol}！",
  ],
  neutral: [
    "📊 双方势均力敌，胜负难料...",
    "⏳ 市场进入整理阶段，等待下一波行情！",
    "🤔 成交量萎缩，大户在观望？",
    "📡 链上数据显示资金在两边流动...",
    "🎯 关键时刻来临，谁能率先突破？",
  ],
  alert: [
    "⚡ 突发！现货价格剧烈波动！",
    "🚨 注意！检测到异常大单！",
    "🎪 精彩！领先优势正在缩小！",
    "💥 形势反转！落后者开始发力！",
    "🏁 冲刺阶段！胜负就在一线之间！",
  ],
};

export const useRaceSimulation = () => {
  const [racer1Data, setRacer1Data] = useState<RacerData>({
    position: 45,
    odds: 52,
    volume: 1250000,
  });

  const [racer2Data, setRacer2Data] = useState<RacerData>({
    position: 42,
    odds: 48,
    volume: 980000,
  });

  const [commentary, setCommentary] = useState<CommentaryMessage[]>([
    {
      id: 1,
      text: "🎙️ 欢迎来到 MoonRace！今天的对决：BTC vs ETH！",
      type: "neutral",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "📊 当前 BTC 以微弱优势领先，但 ETH 正在蓄力...",
      type: "neutral",
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(3);

  const generateCommentary = useCallback((symbol: string, type: "bullish" | "bearish" | "neutral" | "alert") => {
    const templates = COMMENTARY_TEMPLATES[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace("{symbol}", symbol);
  }, []);

  const addCommentary = useCallback((text: string, type: CommentaryMessage["type"]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessageId((prev) => {
        const newId = prev + 1;
        setCommentary((prev) => [
          ...prev.slice(-9), // Keep last 10 messages
          { id: newId, text, type, timestamp: new Date() },
        ]);
        return newId;
      });
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  }, []);

  // Simulate race updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRacer1Data((prev) => {
        const change = (Math.random() - 0.45) * 3;
        const newPosition = Math.max(5, Math.min(95, prev.position + change));
        const newOdds = Math.max(20, Math.min(80, prev.odds + change * 0.5));
        
        // Generate commentary based on changes
        if (Math.abs(change) > 1.5) {
          if (change > 0) {
            addCommentary(generateCommentary("BTC", "bullish"), "bullish");
          } else {
            addCommentary(generateCommentary("BTC", "bearish"), "bearish");
          }
        }
        
        return {
          position: newPosition,
          odds: newOdds,
          volume: prev.volume + Math.random() * 50000,
        };
      });

      setRacer2Data((prev) => {
        const change = (Math.random() - 0.45) * 3;
        const newPosition = Math.max(5, Math.min(95, prev.position + change));
        const newOdds = Math.max(20, Math.min(80, prev.odds + change * 0.5));
        
        if (Math.abs(change) > 1.5) {
          if (change > 0) {
            addCommentary(generateCommentary("ETH", "bullish"), "bullish");
          } else {
            addCommentary(generateCommentary("ETH", "bearish"), "bearish");
          }
        }
        
        return {
          position: newPosition,
          odds: newOdds,
          volume: prev.volume + Math.random() * 40000,
        };
      });
    }, 2000);

    // Random market events
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: CommentaryMessage["type"][] = ["alert", "neutral"];
        const type = types[Math.floor(Math.random() * types.length)];
        const symbol = Math.random() > 0.5 ? "BTC" : "ETH";
        addCommentary(generateCommentary(symbol, type as any), type);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(eventInterval);
    };
  }, [addCommentary, generateCommentary]);

  const handleBoost = useCallback((symbol: string, amount: number) => {
    addCommentary(
      `🎯 新的力量加入了 ${symbol} 阵营！+$${amount} BOOST！`,
      "alert"
    );
    
    if (symbol === "BTC") {
      setRacer1Data((prev) => ({
        ...prev,
        position: Math.min(95, prev.position + 2),
        odds: Math.min(80, prev.odds + 1),
      }));
    } else {
      setRacer2Data((prev) => ({
        ...prev,
        position: Math.min(95, prev.position + 2),
        odds: Math.min(80, prev.odds + 1),
      }));
    }
  }, [addCommentary]);

  return {
    racer1Data,
    racer2Data,
    commentary,
    isTyping,
    handleBoost,
  };
};
