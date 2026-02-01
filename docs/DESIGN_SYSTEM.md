# 🎨 PolyRace 设计系统规范

## 设计理念

**Web3 Cyberpunk + Retro Pixel Art** - 结合现代赛博朋克的科技感与复古像素游戏的怀旧风格，打造独特的"蓝绿对决"竞技氛围。

---

## 配色方案 (Color Palette)

### 品牌主色

| 颜色名称          | HEX       | HSL            | 用途                                     |
| ----------------- | --------- | -------------- | ---------------------------------------- |
| **Turtle Blue**   | `#2498e4` | `202° 80% 52%` | 龟队（稳健防御）- 按钮、进度条、数据图表 |
| **Rabbit Green**  | `#5cce59` | `118° 57% 57%` | 兔队（急速增长）- 按钮、进度条、上涨状态 |
| **Versus Purple** | `#7c3aed` | `258° 90% 58%` | AI预测、"VS"标志、中立元素               |

### 背景色

| 颜色名称         | HEX       | 用途                   |
| ---------------- | --------- | ---------------------- |
| **Deep Space**   | `#0f1218` | 主背景色，极深蓝灰     |
| **Card Surface** | `#1a1e29` | 卡片背景，略浅于主背景 |
| **Pixel Grid**   | `#2a3245` | 网格线、边框           |

### 辅助色

| 颜色名称        | HEX       | 用途                   |
| --------------- | --------- | ---------------------- |
| **Warning Red** | `#ef4444` | 错误、下跌状态（少用） |
| **Gold Accent** | `#fbbf24` | 强调、奖励             |

### 文字颜色

| 颜色名称           | HEX                        | 用途                  |
| ------------------ | -------------------------- | --------------------- |
| **Primary Text**   | `#ffffff`                  | 主要文字              |
| **Secondary Text** | `#94a3b8`                  | 次要信息（Slate-400） |
| **Accent Text**    | Turtle Blue / Rabbit Green | 强调文字              |

---

## 字体排印 (Typography)

### 字体家族

```css
--font-pixel: "Press Start 2P", cursive; /* 像素标题 */
--font-display: "VT323", monospace; /* 显示文字 */
--font-body: "Inter", "Space Grotesk", sans-serif; /* 正文 */
```

### 字体使用规范

| 元素            | 字体           | 大小    | 权重    | 用途                   |
| --------------- | -------------- | ------- | ------- | ---------------------- |
| **Pixel Title** | Press Start 2P | 12-20px | Regular | Logo、巨大数字、VS标志 |
| **Display**     | VT323          | 16-48px | Regular | 标题、倒计时、赛事名称 |
| **Body**        | Inter          | 14-16px | 400-600 | 正文、说明文字         |
| **Mono**        | VT323          | 14px    | Regular | 钱包地址、数据         |

### 文字特效

```css
/* 龟队发光 */
.text-glow-turtle {
  text-shadow:
    0 0 10px hsl(var(--turtle-blue) / 0.8),
    0 0 20px hsl(var(--turtle-blue) / 0.5),
    0 0 30px hsl(var(--turtle-blue) / 0.3);
}

/* 兔队发光 */
.text-glow-rabbit {
  text-shadow:
    0 0 10px hsl(var(--rabbit-green) / 0.8),
    0 0 20px hsl(var(--rabbit-green) / 0.5),
    0 0 30px hsl(var(--rabbit-green) / 0.3);
}

/* VS发光 */
.text-glow-versus {
  text-shadow:
    0 0 10px hsl(var(--versus-purple) / 0.8),
    0 0 20px hsl(var(--versus-purple) / 0.5);
}
```

---

## UI组件设计 (UI Components)

### 卡片 (Cards)

**Glassmorphism + Pixel Borders**

```css
.glass-panel {
  background: linear-gradient(
    135deg,
    hsl(var(--card) / 0.9) 0%,
    hsl(var(--card) / 0.6) 100%
  );
  backdrop-filter: blur(24px);
  border: 2px solid hsl(var(--border) / 0.5);
  border-radius: 0.5rem;
}

/* 像素缺角装饰版 */
.glass-panel {
  clip-path: polygon(
    0 8px,
    8px 0,
    calc(100% - 8px) 0,
    100% 8px,
    100% calc(100% - 8px),
    calc(100% - 8px) 100%,
    8px 100%,
    0 calc(100% - 8px)
  );
}
```

### 按钮 (Buttons)

**3D 像素按钮效果**

```css
.pixel-button {
  border: 2px solid hsl(0 0% 100% / 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 4px 0 hsl(0 0% 0% / 0.3);
  transition: all 100ms;
}

.pixel-button:hover {
  transform: translateY(2px);
  box-shadow: 0 2px 0 hsl(0 0% 0% / 0.3);
}

.pixel-button:active {
  transform: translateY(4px);
  box-shadow: none;
}
```

**龟队按钮**

```css
background: linear-gradient(135deg, #2498e4, #2498e4cc);
color: #000000;
```

**兔队按钮**

```css
background: linear-gradient(135deg, #5cce59, #5cce59cc);
color: #000000;
```

### 霓虹边框 (Neon Borders)

```css
.neon-border {
  border: 2px solid hsl(var(--primary) / 0.3);
  box-shadow: inset 0 0 0 2px hsl(var(--primary) / 0.3);
}

.neon-glow-turtle {
  box-shadow:
    0 0 20px hsl(var(--turtle-blue) / 0.6),
    0 0 40px hsl(var(--turtle-blue) / 0.3),
    0 4px 0 hsl(var(--turtle-blue) / 0.8);
}

.neon-glow-rabbit {
  box-shadow:
    0 0 20px hsl(var(--rabbit-green) / 0.6),
    0 0 40px hsl(var(--rabbit-green) / 0.3),
    0 4px 0 hsl(var(--rabbit-green) / 0.8);
}
```

---

## 视觉元素 (Visual Elements)

### Logo 使用规范

- **位置**: Header 左侧
- **尺寸**: 40x40px
- **动画**: hover 时轻微放大 (scale: 1.05)
- **分离元素**: 龟（蓝色）+ 兔（绿色）可独立使用

### 对决进度条 (VS Progress Bar)

```
┌─────────────────────────────────┐
│ 🐢 [■■■■■■■■□□] 70%  VS  30% [□□■■] 🐰 │
│     Turtle Blue    VS   Rabbit Green   │
└─────────────────────────────────┘
```

- 左侧蓝色 = 龟队进度
- 右侧绿色 = 兔队进度
- 中间紫色 "VS" 图标
- 使用阶梯线图（Step Line Chart）而非平滑曲线

### 背景纹理

**像素网格**

```css
background-image:
  linear-gradient(to right, hsl(var(--muted) / 0.05) 1px, transparent 1px),
  linear-gradient(to bottom, hsl(var(--muted) / 0.05) 1px, transparent 1px);
background-size: 20px 20px;
```

**扫描线动画**

```css
.scanline {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: scanline 4s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}
```

---

## 动画效果 (Animations)

### Glitch 故障效果

```css
@keyframes glitch {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

.animate-glitch {
  animation: glitch 0.5s ease-in-out infinite;
}
```

### 像素化效果

```css
@keyframes pixelate {
  0%,
  100% {
    filter: blur(0px);
  }
  50% {
    filter: blur(1px);
  }
}

.animate-pixelate {
  animation: pixelate 1s ease-in-out infinite;
}
```

### 霓虹脉冲

```css
@keyframes pulse-neon {
  0%,
  100% {
    opacity: 1;
    box-shadow:
      0 0 20px hsl(var(--primary) / 0.5),
      0 0 40px hsl(var(--primary) / 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow:
      0 0 30px hsl(var(--primary) / 0.7),
      0 0 60px hsl(var(--primary) / 0.5);
  }
}
```

---

## 图表样式 (Chart Styles)

### 阶梯线图 (Step Line Chart)

- **推荐**: 用于代币价格走势
- **风格**: 像素化阶梯而非平滑曲线
- **颜色**:
  - 上涨: Rabbit Green (`#5cce59`)
  - 下跌: Warning Red (`#ef4444`)
  - 中性: Turtle Blue (`#2498e4`)

### 数据可视化原则

- 使用**粗线条** (3-4px)
- 避免渐变填充，使用**纯色块**
- 图表背景使用 **Card Surface** 色
- 网格线使用 **Pixel Grid** 色，1px 实线

---

## 响应式设计 (Responsive Design)

### 断点

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1400px /* Extra large */
```

### 移动端适配

- 字体缩小 10-20%
- 像素边框保持 2px
- 按钮高度最小 44px（触摸友好）
- 隐藏扫描线动画（性能考虑）

---

## 可访问性 (Accessibility)

### 对比度

- **主文字**: 白色 (#ffffff) on 深空黑 (#0f1218) = 17.76:1 ✅
- **次要文字**: Slate-400 (#94a3b8) on 深空黑 = 8.59:1 ✅
- **龟队按钮**: 黑色 on Turtle Blue = 4.67:1 ✅
- **兔队按钮**: 黑色 on Rabbit Green = 7.23:1 ✅

### 焦点状态

```css
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### 屏幕阅读器

- 使用语义化 HTML
- 为图标添加 `aria-label`
- 保证键盘导航可用

---

## 暗黑模式

**PolyRace 强制暗黑模式** - 无浅色版本

原因：

1. Web3 用户习惯暗黑界面
2. 霓虹光效在暗背景下效果最佳
3. 减少眼睛疲劳（长时间盯盘）

---

## 组件库使用 (shadcn/ui)

### 自定义主题

```typescript
// tailwind.config.ts
colors: {
  primary: "hsl(var(--turtle-blue))",
  secondary: "hsl(var(--rabbit-green))",
  accent: "hsl(var(--versus-purple))",
  // ...
}
```

### 推荐组件

- ✅ Button (自定义 pixel-button)
- ✅ Card (自定义 glass-panel)
- ✅ Dialog (保持原生)
- ✅ Progress (自定义颜色)
- ✅ Badge (像素风格化)
- ❌ Toast (使用自定义像素样式)

---

## 性能优化

### CSS

- 使用 CSS 变量减少重复
- 避免复杂的 clip-path（移动端）
- 动画使用 `transform` 而非 `left/top`
- 使用 `will-change` 提示浏览器优化

### 字体加载

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### 图片优化

- Logo 使用 SVG 或 WebP
- 背景纹理使用 CSS 而非图片
- 延迟加载非关键图片

---

## 设计工具

### Figma

- 使用 8px 网格系统
- 组件库：shadcn/ui Figma Kit
- 颜色变量：按 HSL 格式定义

### 开发工具

- Tailwind CSS IntelliSense (VSCode)
- PostCSS Language Support
- Prettier + prettier-plugin-tailwindcss

---

## 示例代码

### 龟队卡片

```tsx
<div className="glass-panel-simple neon-border p-6">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-turtle-blue rounded-lg flex items-center justify-center">
      🐢
    </div>
    <div>
      <h3 className="font-display text-2xl text-glow-turtle">TURTLE TEAM</h3>
      <p className="text-sm text-muted-foreground">稳健防御策略</p>
    </div>
  </div>
  <button className="pixel-button mt-4 w-full py-3 bg-turtle-blue text-background font-display">
    支持龟队
  </button>
</div>
```

### VS 标题

```tsx
<h1 className="font-display text-4xl font-bold flex items-center gap-4">
  <span className="text-glow-turtle">TURTLE</span>
  <span className="text-glow-versus">VS</span>
  <span className="text-glow-rabbit">RABBIT</span>
</h1>
```

---

## 更新日志

- **v2.0** (2026-02-01): 重构为像素赛博朋克主题
  - 新增 Turtle Blue / Rabbit Green 配色
  - 引入 Press Start 2P 像素字体
  - 添加 3D 像素按钮效果
  - 更新所有组件为新风格

- **v1.0** (2026-01-15): 初始版本
  - 基础赛博朋克主题
  - Cyan/Magenta 配色方案

---

**设计原则**: **简洁、像素化、高对比、霓虹发光**

让每个玩家都能感受到 80 年代街机游戏的怀旧魅力，同时享受 Web3 时代的科技体验！🎮✨
