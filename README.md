# 🏁 PolyRace - AI驱动的加密货币预测竞赛

> 基于Polymarket链上数据的实时加密货币"龟兔赛跑"预测游戏平台

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 项目简介

PolyRace 是一个创新的区块链预测游戏平台，将加密货币市场与AI预测相结合。系统选定两种代币作为"龟"和"兔"，基于Polymarket的链上真实数据，由AI实时分析并预测胜率。用户可以下注支持自己看好的代币，在设定时间范围内，根据代币的价格涨跌幅度决定最终赢家。

### 核心特性

- 🤖 **AI实时预测**：集成Gemini 1.5 Flash AI，基于Polymarket WebSocket实时数据流分析
- 📊 **链上数据验证**：所有预测和结算基于Polymarket CLOB的真实链上数据
- 🎮 **动态赛道系统**：实时可视化展示两种代币的竞争状态
- 💰 **用户跟注系统**：用户下注会影响赔率和AI预测概率
- 🎙️ **AI实况解说**：AI实时生成中文解说，增强游戏体验
- 🔐 **防作恶机制**：基于智能合约的透明结算和激励机制

## 🏗️ 技术架构

### 前端技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI框架**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: TanStack Query (React Query)
- **路由**: React Router v6

### 后端与数据

- **数据源**: Polymarket CLOB API
- **实时通信**: WebSocket (Polymarket订阅)
- **AI引擎**: Google Gemini 1.5 Flash
- **区块链**: Polygon/Ethereum智能合约

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- Bun >= 1.0.0 (推荐)

### 安装步骤

1. **克隆项目**

```bash
git clone <YOUR_GIT_URL>
cd poly-race
```

2. **安装依赖**

使用 Bun (推荐):

```bash
bun install
```

或使用 npm:

```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
# Polymarket API配置
VITE_POLYMARKET_API_KEY=your_api_key_here
VITE_POLYMARKET_WS_URL=wss://ws-subscriptions-clob.polymarket.com/ws/market

# AI配置
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 智能合约地址
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=137
```

4. **启动开发服务器**

```bash
bun run dev
```

或

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
bun run build
# 或
npm run build
```

构建产物将生成在 `dist/` 目录

## 📁 项目结构

```
poly-race/
├── src/
│   ├── components/          # React组件
│   │   ├── ui/             # shadcn/ui组件库
│   │   ├── AICommentary.tsx   # AI解说组件
│   │   ├── BoostButton.tsx    # 下注按钮
│   │   ├── Header.tsx         # 页面头部
│   │   ├── RaceSelector.tsx   # 赛事选择器
│   │   ├── RaceTrack.tsx      # 赛道可视化
│   │   └── StatsPanel.tsx     # 数据统计面板
│   ├── hooks/              # 自定义Hooks
│   │   └── useRaceSimulation.ts  # 赛事模拟逻辑
│   ├── pages/              # 页面组件
│   │   ├── Index.tsx          # 主页
│   │   └── NotFound.tsx       # 404页面
│   ├── lib/                # 工具函数
│   │   └── utils.ts           # 通用工具
│   ├── App.tsx             # 应用根组件
│   └── main.tsx            # 应用入口
├── public/                 # 静态资源
├── docs/                   # 项目文档
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🎮 使用说明

### 基本流程

1. **连接钱包**: 点击右上角"Connect Wallet"连接你的Web3钱包
2. **选择赛事**: 从左侧赛事列表中选择感兴趣的代币对（如BTC vs ETH）
3. **观察赛况**: 实时查看赛道上两个代币的位置和AI解说
4. **下注参与**: 点击"Boost"按钮为你看好的代币下注
5. **等待结算**: 赛事结束后，根据代币实际涨跌幅度自动结算

### 赛事规则

- **时间范围**: 每场赛事持续2-6小时
- **胜负判定**:
  - 一涨一跌：涨的一方获胜
  - 同涨同跌：涨/跌幅度大的一方获胜
- **赔率计算**: 基于双方下注总额动态调整
- **AI预测**: 实时分析Polymarket数据流更新胜率预测

## 🧪 测试

运行测试套件：

```bash
bun run test
# 或
npm run test
```

监听模式：

```bash
bun run test:watch
```

## 📚 相关文档

详细文档请查看 `docs/` 目录：

- [系统架构设计](docs/ARCHITECTURE.md) - 完整的系统架构说明
- [运行与部署指南](docs/DEPLOYMENT.md) - 详细的部署步骤
- [智能合约交互](docs/CONTRACT.md) - 合约接口与交互文档
- [逻辑架构图](docs/LOGIC_FLOW.md) - 系统各组件交互流程图

## 🔧 开发指南

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
bun run lint
# 或
npm run lint
```

### 提交规范

推荐使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具链相关

## 🛡️ 激励机制与防作恶

### 激励设计

1. **正确预测奖励**: 跟注获胜方的用户按比例分享奖池
2. **早期参与优势**: 越早下注获得的潜在收益越高
3. **AI辅助**: 免费提供AI预测参考，降低参与门槛

### 防作恶机制

1. **链上验证**: 所有交易和结算数据来自Polymarket链上记录，不可篡改
2. **时间锁定**: 下注后不能更改，防止最后时刻套利
3. **最小下注限制**: 防止spam攻击
4. **透明结算**: 智能合约自动执行，结算逻辑公开透明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 📞 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [GitHub Issues]

---

**⚠️ 风险提示**: 加密货币投资存在风险，请理性参与，不要投入超过你能承受损失的资金。
