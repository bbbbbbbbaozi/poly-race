import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
} from "lucide-react";
import { ttsService } from "@/lib/tts";

interface CommentaryMessage {
  id: number;
  text: string;
  type: "neutral" | "bullish" | "bearish" | "alert";
  timestamp: Date;
}

interface AICommentaryProps {
  messages: CommentaryMessage[];
  isTyping?: boolean;
  className?: string;
}

const typeColors = {
  neutral: "text-foreground",
  bullish: "text-neon-orange",
  bearish: "text-destructive",
  alert: "text-neon-purple",
};

const typeBg = {
  neutral: "bg-muted/30",
  bullish: "bg-retro-orange/10",
  bearish: "bg-destructive/10",
  alert: "bg-retro-purple/10",
};

const typeIcons = {
  neutral: BarChart3,
  bullish: TrendingUp,
  bearish: TrendingDown,
  alert: Zap,
};

export const AICommentary = ({
  messages,
  isTyping,
  className = "",
}: AICommentaryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true); // 默认关闭语音
  const lastMessageIdRef = useRef<number>(0);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 播放新消息的语音
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    // 只播放新消息
    if (latestMessage.id > lastMessageIdRef.current) {
      lastMessageIdRef.current = latestMessage.id;

      if (!isMuted) {
        ttsService.speak(latestMessage.text);
      }
    }
  }, [messages, isMuted]);

  // 切换静音状态
  const toggleMute = () => {
    if (isMuted) {
      ttsService.enable();
      setIsMuted(false);
    } else {
      ttsService.disable();
      setIsMuted(true);
    }
  };

  return (
    <div
      className={`retro-card pixel-corners flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className="w-10 h-10 border-2 bg-gradient-to-br from-retro-cyan to-retro-orange flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ imageRendering: "pixelated" }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </motion.div>
            <span
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-retro-orange border-2 border-black"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div>
            <h3 className="font-pixel text-[10px] uppercase text-retro-cyan">
              AI COMMENTATOR
            </h3>
            <p className="text-[8px] text-muted-foreground font-game uppercase">
              LIVE MODE
            </p>
          </div>
        </div>
        <button
          onClick={toggleMute}
          className="p-2 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-white/20"
          disabled={!ttsService.isSupported()}
          title={
            !ttsService.isSupported()
              ? "浏览器不支持语音合成"
              : isMuted
                ? "开启语音解说"
                : "关闭语音解说"
          }
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-retro-cyan" />
          )}
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`p-3 border ${typeBg[msg.type]} border-white/10`}
            >
              <div className="flex items-start gap-2">
                {(() => {
                  const IconComponent = typeIcons[msg.type];
                  return (
                    <IconComponent
                      className="w-5 h-5 mt-0.5"
                      style={{
                        color: `hsl(var(--${msg.type === "neutral" ? "muted-foreground" : msg.type === "bullish" ? "retro-orange" : msg.type === "bearish" ? "destructive" : "retro-purple"}))`,
                      }}
                    />
                  );
                })()}
                <div className="flex-1">
                  <p
                    className={`text-sm font-game leading-relaxed ${typeColors[msg.type]}`}
                  >
                    {msg.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-game">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-retro-purple"
                  style={{ imageRendering: "pixelated" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-game uppercase">
              ANALYZING...
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
