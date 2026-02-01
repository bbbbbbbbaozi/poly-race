// Text-to-Speech 语音合成服务

/**
 * 方案1: Web Speech API (浏览器原生，免费)
 * 优点: 免费、无需API、延迟低
 * 缺点: 音质一般、不同浏览器效果差异大
 */
export class BrowserTTS {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if ("speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;

    // 语音列表可能异步加载
    this.voices = this.synth.getVoices();

    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth!.getVoices();
      };
    }
  }

  /**
   * 播放文本
   */
  speak(
    text: string,
    options?: {
      rate?: number; // 语速 0.1-10 (默认1)
      pitch?: number; // 音调 0-2 (默认1)
      volume?: number; // 音量 0-1 (默认1)
      lang?: string; // 语言
    },
  ) {
    if (!this.synth) {
      console.warn("浏览器不支持语音合成");
      return;
    }

    // 停止当前播放
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // 选择中文语音
    const chineseVoice = this.voices.find(
      (voice) => voice.lang.includes("zh") || voice.lang.includes("CN"),
    );
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    // 设置参数
    utterance.rate = options?.rate ?? 1.2; // 稍快的语速
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 0.8;
    utterance.lang = options?.lang ?? "zh-CN";

    this.synth.speak(utterance);
  }

  /**
   * 停止播放
   */
  stop() {
    this.synth?.cancel();
  }

  /**
   * 暂停播放
   */
  pause() {
    this.synth?.pause();
  }

  /**
   * 恢复播放
   */
  resume() {
    this.synth?.resume();
  }
}

/**
 * 方案2: Google Cloud TTS (高质量，付费)
 * 优点: 音质好、支持多种语言和音色、可调参数多
 * 缺点: 需要API密钥、有费用($4/百万字符)
 */
export class GoogleTTS {
  private apiKey: string;
  private audioCache = new Map<string, string>();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 合成语音并播放
   */
  async speak(
    text: string,
    options?: {
      languageCode?: string;
      voiceName?: string;
      speakingRate?: number;
      pitch?: number;
    },
  ) {
    // 检查缓存
    const cacheKey = `${text}-${JSON.stringify(options)}`;
    let audioUrl = this.audioCache.get(cacheKey);

    if (!audioUrl) {
      // 调用Google TTS API
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: options?.languageCode ?? "zh-CN",
              name: options?.voiceName ?? "zh-CN-Wavenet-D", // 男声
              // 其他选项: zh-CN-Wavenet-A (女声)
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: options?.speakingRate ?? 1.2,
              pitch: options?.pitch ?? 0,
            },
          }),
        },
      );

      const data = await response.json();
      const audioContent = data.audioContent;

      // Base64转为Blob URL
      const audioBlob = this.base64ToBlob(audioContent, "audio/mp3");
      audioUrl = URL.createObjectURL(audioBlob);

      // 缓存
      this.audioCache.set(cacheKey, audioUrl);
    }

    // 播放音频
    const audio = new Audio(audioUrl);
    audio.play();

    return audio;
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

/**
 * 方案3: Azure TTS (微软，高质量)
 * 优点: 音质优秀、神经网络语音、支持SSML
 * 缺点: 需要Azure账号、有费用
 */
export class AzureTTS {
  private subscriptionKey: string;
  private region: string;

  constructor(subscriptionKey: string, region: string = "eastasia") {
    this.subscriptionKey = subscriptionKey;
    this.region = region;
  }

  async speak(text: string, voiceName: string = "zh-CN-XiaoxiaoNeural") {
    // 获取访问令牌
    const tokenResponse = await fetch(
      `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.subscriptionKey,
        },
      },
    );
    const token = await tokenResponse.text();

    // 构建SSML
    const ssml = `
      <speak version='1.0' xml:lang='zh-CN'>
        <voice name='${voiceName}'>
          <prosody rate='1.2' pitch='0%'>
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

    // 合成语音
    const response = await fetch(
      `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      },
    );

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();

    return audio;
  }
}

/**
 * 方案4: Eleven Labs (AI语音克隆，最高质量)
 * 优点: 音质极佳、可以克隆特定声音、情感丰富
 * 缺点: 价格较贵($0.30/1000字符)
 */
export class ElevenLabsTTS {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async speak(
    text: string,
    voiceId: string = "pNInz6obpgDQGcFmaJgB", // Adam (中性)
    options?: {
      stability?: number;
      similarityBoost?: number;
    },
  ) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: options?.stability ?? 0.5,
            similarity_boost: options?.similarityBoost ?? 0.75,
          },
        }),
      },
    );

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();

    return audio;
  }
}

/**
 * 智能TTS管理器 - 根据环境自动选择最佳方案
 */
export class SmartTTS {
  private tts: BrowserTTS | GoogleTTS | AzureTTS | ElevenLabsTTS;
  private enabled: boolean = false;
  private queue: string[] = [];
  private isPlaying: boolean = false;

  constructor() {
    // 优先使用浏览器原生TTS (Demo阶段免费)
    this.tts = new BrowserTTS();

    // 生产环境可以根据配置切换
    const apiKey = import.meta.env.VITE_TTS_API_KEY;
    const ttsProvider = import.meta.env.VITE_TTS_PROVIDER;

    if (apiKey && ttsProvider === "google") {
      this.tts = new GoogleTTS(apiKey);
    } else if (apiKey && ttsProvider === "azure") {
      this.tts = new AzureTTS(apiKey);
    } else if (apiKey && ttsProvider === "elevenlabs") {
      this.tts = new ElevenLabsTTS(apiKey);
    }
  }

  /**
   * 启用语音
   */
  enable() {
    this.enabled = true;
  }

  /**
   * 禁用语音
   */
  disable() {
    this.enabled = false;
    this.stop();
  }

  /**
   * 切换语音状态
   */
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
  }

  /**
   * 播放文本
   */
  async speak(text: string) {
    if (!this.enabled) return;

    // 清理emoji和特殊字符，只保留文字
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // 移除所有emoji
      .replace(/[\u26A1\u26A0\u23F3]/gu, "") // 移除常用符号
      .trim();

    if (!cleanText) return;

    // 添加到队列
    this.queue.push(cleanText);

    // 如果没在播放，开始播放
    if (!this.isPlaying) {
      this.playQueue();
    }
  }

  /**
   * 播放队列
   */
  private async playQueue() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const text = this.queue.shift()!;

    try {
      if (this.tts instanceof BrowserTTS) {
        this.tts.speak(text);
        // 浏览器TTS需要等待播放完成
        await this.waitForSpeech();
      } else {
        const audio = await (
          this.tts as GoogleTTS | AzureTTS | ElevenLabsTTS
        ).speak(text);
        await new Promise<void>((resolve) => {
          audio.onended = () => resolve();
        });
      }
    } catch (error) {
      console.error("TTS播放失败:", error);
    }

    // 继续播放队列
    this.playQueue();
  }

  /**
   * 等待浏览器语音播放完成
   */
  private waitForSpeech(): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // 最长等待10秒
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 10000);
    });
  }

  /**
   * 停止播放
   */
  stop() {
    this.queue = [];
    this.isPlaying = false;

    if (this.tts instanceof BrowserTTS) {
      this.tts.stop();
    }
  }

  /**
   * 检查是否支持TTS
   */
  isSupported(): boolean {
    return "speechSynthesis" in window;
  }
}

// 导出单例
export const ttsService = new SmartTTS();
