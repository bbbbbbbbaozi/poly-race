# 语音解说系统 (Text-to-Speech)

## 🎙️ 功能概述

为AI解说员添加真实语音播报功能，让比赛解说更加沉浸式。

## 📋 方案对比

| 方案                 | 音质       | 延迟 | 成本           | 适用场景     |
| -------------------- | ---------- | ---- | -------------- | ------------ |
| **Web Speech API**   | ⭐⭐⭐     | 极低 | 免费           | 🎯 Demo/测试 |
| **Google Cloud TTS** | ⭐⭐⭐⭐   | 低   | $4/百万字符    | 生产环境     |
| **Azure TTS**        | ⭐⭐⭐⭐⭐ | 低   | $16/百万字符   | 高质量需求   |
| **Eleven Labs**      | ⭐⭐⭐⭐⭐ | 中   | $0.30/1000字符 | 顶级体验     |

## 🚀 快速开始

### 1. 使用浏览器原生TTS (推荐Demo使用)

**无需任何配置**，代码已自动集成：

```typescript
// 自动使用浏览器Web Speech API
// 支持Chrome、Edge、Safari等现代浏览器
```

**特点：**

- ✅ 完全免费
- ✅ 零配置
- ✅ 延迟极低
- ✅ 支持中文
- ⚠️ 音质一般
- ⚠️ 不同浏览器效果有差异

### 2. 使用Google Cloud TTS (推荐生产使用)

**步骤：**

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目
2. 启用 Cloud Text-to-Speech API
3. 创建API密钥
4. 配置环境变量：

```bash
VITE_TTS_PROVIDER=google
VITE_TTS_API_KEY=your_google_tts_api_key_here
```

**定价：**

- Standard voices: $4/百万字符
- WaveNet voices: $16/百万字符
- Neural2 voices: $16/百万字符
- 每月免费额度: 400万字符 (Standard)

**支持的中文语音：**

```typescript
// 男声
zh - CN - Wavenet - C; // 男性, 自然
zh - CN - Wavenet - D; // 男性, 沉稳

// 女声
zh - CN - Wavenet - A; // 女性, 温柔
zh - CN - Wavenet - B; // 女性, 活泼

// Neural2 (更自然)
zh - CN - Neural2 - C; // 男性
zh - CN - Neural2 - A; // 女性
```

### 3. 使用Azure TTS (高质量)

**步骤：**

1. 创建 [Azure账号](https://azure.microsoft.com/)
2. 创建 Speech Services 资源
3. 获取订阅密钥和区域
4. 配置环境变量：

```bash
VITE_TTS_PROVIDER=azure
VITE_TTS_API_KEY=your_azure_subscription_key
VITE_TTS_REGION=eastasia
```

**定价：**

- 标准语音: $1/百万字符
- 神经网络语音: $16/百万字符
- 每月免费额度: 50万字符

**推荐中文语音：**

```typescript
// 神经网络语音 (最自然)
zh - CN - XiaoxiaoNeural; // 女性, 活泼
zh - CN - XiaoyiNeural; // 女性, 温柔
zh - CN - YunjianNeural; // 男性, 专业
zh - CN - YunxiNeural; // 男性, 年轻

// 特色语音
zh - CN - XiaochenNeural; // 男性, 新闻播报
zh - CN - XiaohanNeural; // 女性, 客服
```

### 4. 使用Eleven Labs (顶级音质)

**步骤：**

1. 注册 [Eleven Labs](https://elevenlabs.io/)
2. 创建API密钥
3. 配置环境变量：

```bash
VITE_TTS_PROVIDER=elevenlabs
VITE_TTS_API_KEY=your_elevenlabs_api_key
```

**定价：**

- Free: 10,000字符/月
- Starter: $5/月 (30,000字符)
- Creator: $22/月 (100,000字符)
- Pro: $99/月 (500,000字符)

**特点：**

- ⭐ 音质最佳
- ⭐ 支持语音克隆
- ⭐ 情感丰富
- ⚠️ 价格较高
- ⚠️ 需要额外配置

## 🎮 使用方法

### 用户操作

1. 打开比赛页面
2. 点击AI解说员面板右上角的 🔊 图标
3. 自动播放新的解说内容

### 开发者使用

```typescript
import { ttsService } from "@/lib/tts";

// 播放文本
ttsService.speak("BTC突破关键阻力位！");

// 启用语音
ttsService.enable();

// 禁用语音
ttsService.disable();

// 切换状态
ttsService.toggle();

// 停止播放
ttsService.stop();

// 检查浏览器支持
if (ttsService.isSupported()) {
  console.log("支持TTS");
}
```

## 🔧 高级配置

### 自定义浏览器TTS参数

```typescript
const tts = new BrowserTTS();

tts.speak("测试文本", {
  rate: 1.2, // 语速 (0.1-10, 默认1)
  pitch: 1.0, // 音调 (0-2, 默认1)
  volume: 0.8, // 音量 (0-1, 默认1)
  lang: "zh-CN", // 语言
});
```

### 切换Google TTS语音

修改 `src/lib/tts.ts` 中的 `GoogleTTS.speak()`:

```typescript
voice: {
  languageCode: 'zh-CN',
  name: 'zh-CN-Neural2-D', // 更换语音
}
```

### 调整Azure TTS SSML

```typescript
const ssml = `
  <speak version='1.0' xml:lang='zh-CN'>
    <voice name='zh-CN-XiaoxiaoNeural'>
      <prosody rate='1.3' pitch='+5%' volume='loud'>
        ${text}
      </prosody>
    </voice>
  </speak>
`;
```

## 📊 性能优化

### 1. 消息队列管理

系统自动维护播放队列，防止消息重叠：

```typescript
private queue: string[] = [];
private isPlaying: boolean = false;
```

### 2. 文本清理

自动移除emoji和特殊字符，提升播放效果：

```typescript
const cleanText = text
  .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // 移除emoji
  .replace(/[⚡🚀💪📈📉⚠️]/g, "") // 移除图标
  .trim();
```

### 3. 音频缓存 (Google/Azure/Eleven Labs)

已合成的音频自动缓存，避免重复请求：

```typescript
private audioCache = new Map<string, string>();
```

## 🐛 故障排除

### 问题1: 浏览器不播放

**原因：** 某些浏览器需要用户交互后才能播放音频

**解决：**

```typescript
// 在用户点击后初始化
document.addEventListener(
  "click",
  () => {
    ttsService.enable();
  },
  { once: true },
);
```

### 问题2: 语音中断或卡顿

**原因：** 消息发送过快

**解决：** 已实现队列系统自动处理

### 问题3: Google TTS请求失败

**原因：** API密钥无效或超出配额

**检查：**

```bash
curl -X POST \
  "https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"test"},"voice":{"languageCode":"zh-CN"},"audioConfig":{"audioEncoding":"MP3"}}'
```

### 问题4: 中文发音不准确

**解决：**

- 使用 Neural/WaveNet 语音
- 添加拼音标注
- 使用SSML调整发音

## 💡 最佳实践

### Demo阶段

```bash
VITE_TTS_PROVIDER=browser
# 无需其他配置
```

### 生产环境

```bash
VITE_TTS_PROVIDER=google
VITE_TTS_API_KEY=your_key_here
```

### 高端场景

```bash
VITE_TTS_PROVIDER=elevenlabs
VITE_TTS_API_KEY=your_key_here
```

## 📈 成本估算

假设每场比赛生成30条解说，每条20字：

| 场景 | 日均比赛 | 月字符数 | 成本/月 |
| ---- | -------- | -------- | ------- |
| 小型 | 100场    | 180万    | $0-7    |
| 中型 | 500场    | 900万    | $36     |
| 大型 | 2000场   | 3600万   | $144    |

**推荐策略：**

- Demo/测试: 使用 `browser` (免费)
- 小规模: 使用 `google` + 免费额度
- 中等规模: 使用 `google` Standard voices
- 高端体验: 使用 `azure` Neural voices
- 顶级体验: 使用 `elevenlabs`

## 🎯 未来优化

- [ ] 支持多种音色切换
- [ ] 用户自定义语速/音调
- [ ] 支持情感化语音 (兴奋/紧张/平静)
- [ ] 离线语音包
- [ ] 语音克隆 (Eleven Labs)
- [ ] 实时字幕同步

## 📚 参考资料

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Google Cloud TTS](https://cloud.google.com/text-to-speech/docs)
- [Azure TTS](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/text-to-speech)
- [Eleven Labs API](https://docs.elevenlabs.io/api-reference/text-to-speech)
