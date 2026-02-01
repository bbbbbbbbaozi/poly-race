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
    "🚀 {symbol} 突破 +{change}%！监测到 ${volume}M 大额买单流入，多头势不可挡！",
    "💪 {symbol} 连续 3 根阳线！24h 成交量达 ${volume}M，较昨日增长 {growth}%",
    "⚡ Polymarket 数据：{symbol} 多头持仓量激增 {positions}K，看涨情绪升温",
    "🔥 技术信号：{symbol} RSI 突破 70，MACD 金叉确认，趋势强劲！",
    "📈 链上分析：{symbol} 活跃地址数增加 {addresses}%，鲸鱼钱包净流入 ${whale}M",
    "💎 {symbol} 突破 MA50 均线！当前价格 ${price}，距前高仅差 {gap}%",
    "🎯 订单簿显示：{symbol} 买一价深度 ${depth}M，卖压薄弱，上涨空间打开",
    "⚡ 资金流向：过去 1h 内 {symbol} 净流入 ${inflow}M，大户正在建仓",
  ],
  bearish: [
    "📉 {symbol} 重挫 -{change}%！${volume}M 抛盘涌现，支撑位岌岌可危",
    "⚠️ 警报！{symbol} 跌破 MA20 均线，当前 ${price}，下方支撑 ${support}",
    "🐻 技术面恶化：{symbol} RSI 跌至 {rsi}，MACD 死叉，空头占据主导",
    "💔 链上数据：{symbol} 24h 净流出 ${outflow}M，鲸鱼地址减持 {whale} 枚",
    "🔻 {symbol} 失守关键价位！交易量萎缩至 ${volume}M，买盘接力不足",
    "⚠️ 订单簿分析：{symbol} 卖一价挂单 ${sell}M，抛压沉重，需警惕瀑布",
    "📊 情绪指标：{symbol} 恐慌指数升至 {fear}，市场避险情绪浓厚",
    "💸 资金撤离：过去 4h 内 {symbol} 流出 ${outflow}M，大户正在出货",
  ],
  neutral: [
    "📊 {symbol} 窄幅震荡于 ${price} 附近，24h 波动率仅 {volatility}%，等待方向选择",
    "⏳ 成交量持平 ${volume}M，买卖力量均衡，多空双方进入拉锯战",
    "🤔 技术指标：{symbol} RSI 维持 {rsi}，布林带收窄，酝酿变盘信号",
    "📡 链上数据平稳：{symbol} 活跃地址 {addresses}K，持币分布无明显变化",
    "🎯 {symbol} 在 ${support}-${resistance} 区间整理，突破方向将决定后市",
    "⚖️ 订单簿显示：{symbol} 买卖盘比 {ratio}，力量相当，静待催化剂",
    "📈 {symbol} 日内振幅 {amplitude}%，交投清淡，大资金观望为主",
    "🔍 相关性分析：{symbol} 与大盘相关度 {correlation}%，独立走势明显",
  ],
  alert: [
    "⚡ 突发！{symbol} 单笔 ${orderSize}M 巨单成交，价格瞬间波动 {spike}%！",
    "🚨 异常监测：{symbol} 交易量暴增 {surge}%，达 ${volume}M，疑似主力入场",
    "🎪 反转信号！{symbol} 从 -{change}% 拉升至 +{recovery}%，空头爆仓进行中",
    "💥 Polymarket 预测市场更新：{symbol} 胜率从 {oldOdds}% 跳升至 {newOdds}%",
    "🏁 最后 {timeLeft} 分钟！{symbol} 仅领先 {gap}%，结局扑朔迷离",
    "⚡ 链上异动：{symbol} 大额转账 {txCount} 笔，金额合计 ${totalTx}M",
    "🔔 技术突破：{symbol} 突破 {days} 日盘整区间，目标位看向 ${target}",
    "🎯 做市商动向：{symbol} 买卖价差收窄至 {spread} bps，流动性改善",
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

  const generateCommentary = useCallback(
    (symbol: string, type: "bullish" | "bearish" | "neutral" | "alert") => {
      const templates = COMMENTARY_TEMPLATES[type];
      const template = templates[Math.floor(Math.random() * templates.length)];

      // 生成随机但合理的数据
      const mockData = {
        symbol,
        change: (Math.random() * 5 + 1).toFixed(2),
        volume: (Math.random() * 50 + 10).toFixed(1),
        growth: (Math.random() * 30 + 10).toFixed(0),
        positions: (Math.random() * 50 + 20).toFixed(0),
        addresses: (Math.random() * 40 + 10).toFixed(0),
        whale: (Math.random() * 10 + 2).toFixed(1),
        price: (Math.random() * 10000 + 40000).toFixed(0),
        gap: (Math.random() * 10 + 2).toFixed(1),
        depth: (Math.random() * 20 + 5).toFixed(1),
        inflow: (Math.random() * 30 + 5).toFixed(1),
        support: (Math.random() * 10000 + 38000).toFixed(0),
        rsi: (Math.random() * 30 + 20).toFixed(0),
        outflow: (Math.random() * 25 + 5).toFixed(1),
        sell: (Math.random() * 15 + 5).toFixed(1),
        fear: (Math.random() * 30 + 50).toFixed(0),
        volatility: (Math.random() * 3 + 0.5).toFixed(1),
        ratio: (Math.random() * 0.4 + 0.8).toFixed(2),
        amplitude: (Math.random() * 5 + 1).toFixed(1),
        correlation: (Math.random() * 30 + 60).toFixed(0),
        orderSize: (Math.random() * 20 + 5).toFixed(1),
        spike: (Math.random() * 3 + 1).toFixed(1),
        surge: (Math.random() * 100 + 50).toFixed(0),
        recovery: (Math.random() * 4 + 1).toFixed(1),
        oldOdds: (Math.random() * 10 + 45).toFixed(0),
        newOdds: (Math.random() * 10 + 55).toFixed(0),
        timeLeft: Math.floor(Math.random() * 30 + 10),
        txCount: Math.floor(Math.random() * 50 + 10),
        totalTx: (Math.random() * 100 + 20).toFixed(1),
        days: Math.floor(Math.random() * 20 + 5),
        target: (Math.random() * 10000 + 50000).toFixed(0),
        spread: (Math.random() * 5 + 1).toFixed(1),
        resistance: (Math.random() * 10000 + 42000).toFixed(0),
      };

      // 替换模板中的所有占位符
      let result = template;
      Object.entries(mockData).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{${key}}`, "g"), String(value));
      });

      return result;
    },
    [],
  );

  const addCommentary = useCallback(
    (text: string, type: CommentaryMessage["type"]) => {
      setIsTyping(true);
      setTimeout(
        () => {
          setMessageId((prev) => {
            const newId = prev + 1;
            setCommentary((prev) => [
              ...prev.slice(-9), // Keep last 10 messages
              { id: newId, text, type, timestamp: new Date() },
            ]);
            return newId;
          });
          setIsTyping(false);
        },
        500 + Math.random() * 500,
      );
    },
    [],
  );

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

  const handleBoost = useCallback(
    (symbol: string, amount: number) => {
      addCommentary(
        `🎯 新的力量加入了 ${symbol} 阵营！+$${amount} BOOST！`,
        "alert",
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
    },
    [addCommentary],
  );

  return {
    racer1Data,
    racer2Data,
    commentary,
    isTyping,
    handleBoost,
  };
};
