# 系统架构设计文档

## 1. 系统概述

PolyRace 是一个基于区块链的去中心化预测竞赛平台，采用前后端分离、链上数据验证、AI实时分析的架构设计。系统整合了Polymarket CLOB API、Google Gemini AI、智能合约等多个关键组件。

## 2. 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                          用户层                                   │
│                     Web Browser / Wallet                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS / WebSocket
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                       前端应用层                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │  React UI   │  │   Hooks     │  │  Framer Motion      │    │
│  │  Components │  │   Manager   │  │  Animations         │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          TanStack Query (状态管理)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────┬──────────────────────────┘
             │                        │
             │                        │
    ┌────────▼────────┐      ┌───────▼────────────┐
    │   Web3 Provider  │      │  API Gateway       │
    │   (MetaMask等)   │      │  (BFF Layer)       │
    └────────┬─────────┘      └───────┬────────────┘
             │                        │
             │                        │
┌────────────▼────────────────────────▼──────────────────────────┐
│                        数据与服务层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │  Polygon    │  │ Polymarket  │  │   Gemini AI         │    │
│  │  Smart      │  │ CLOB API    │  │   Service           │    │
│  │  Contract   │  │ WebSocket   │  │                     │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 核心模块

### 3.1 前端架构

#### 3.1.1 技术选型

- **UI框架**: React 18 with TypeScript
  - 类型安全
  - 组件化开发
  - 高性能虚拟DOM

- **状态管理**: TanStack Query (React Query)
  - 服务端状态管理
  - 自动缓存和重新验证
  - 乐观更新

- **UI组件库**: shadcn/ui + Radix UI
  - 无样式基础组件
  - 高度可定制
  - 无障碍支持

- **动画系统**: Framer Motion
  - 声明式动画API
  - 手势支持
  - 性能优化

#### 3.1.2 组件架构

```
src/
├── components/
│   ├── ui/                    # 基础UI组件（shadcn/ui）
│   ├── AICommentary.tsx       # AI解说展示组件
│   ├── BoostButton.tsx        # 用户下注交互
│   ├── Header.tsx             # 顶部导航栏
│   ├── RaceSelector.tsx       # 赛事选择器
│   ├── RaceTrack.tsx          # 赛道可视化核心
│   └── StatsPanel.tsx         # 实时数据统计
├── hooks/
│   ├── useRaceSimulation.ts   # 赛事状态管理
│   ├── useWebSocket.ts        # WebSocket连接管理
│   └── useContract.ts         # 智能合约交互
├── pages/
│   └── Index.tsx              # 主页面容器
└── lib/
    ├── utils.ts               # 通用工具函数
    ├── polymarket.ts          # Polymarket API封装
    └── contract.ts            # 合约调用封装
```

#### 3.1.3 数据流

```
用户操作 → Action
    ↓
React Component
    ↓
Custom Hook (useRaceSimulation)
    ↓
┌─────────────┬──────────────┬─────────────┐
│             │              │             │
▼             ▼              ▼             ▼
WebSocket   Contract Call  API Request   Local State
(实时数据)   (链上交易)    (历史数据)    (UI状态)
    │             │              │             │
    └─────────────┴──────────────┴─────────────┘
                   ↓
            TanStack Query Cache
                   ↓
            Component Re-render
```

### 3.2 数据源层

#### 3.2.1 Polymarket CLOB API

**功能**:

- 提供市场数据（价格、交易量、订单簿）
- WebSocket实时推送交易事件
- 历史数据查询

**集成方式**:

```typescript
// 示例：WebSocket连接
const ws = new WebSocket(
  "wss://ws-subscriptions-clob.polymarket.com/ws/market",
);

ws.on("message", (data) => {
  const event = JSON.parse(data);
  // 解析交易事件
  // 更新赛事状态
  // 触发AI分析
});
```

**数据模型**:

```typescript
interface PolymarketEvent {
  type: "trade" | "order" | "price_update";
  market: string;
  timestamp: number;
  data: {
    price: number;
    volume: number;
    side: "buy" | "sell";
  };
}
```

#### 3.2.2 AI分析引擎（Gemini 1.5 Flash）

**功能**:

- 实时分析市场数据
- 生成胜率预测
- 生成中文解说文本

**工作流程**:

```
Polymarket数据流 → 数据预处理 → Gemini API
                                    ↓
                            特征提取 + 模型推理
                                    ↓
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
              胜率预测 (0-100%)              解说文本生成
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                            返回前端展示
```

**API调用示例**:

```typescript
async function analyzeRaceData(data: MarketData) {
  const prompt = `
    分析以下加密货币市场数据，预测BTC和ETH在未来2小时内的相对表现：
    
    BTC: 价格 $${data.btc.price}, 交易量 ${data.btc.volume}
    ETH: 价格 $${data.eth.price}, 交易量 ${data.eth.volume}
    
    请提供：
    1. BTC胜率（0-100）
    2. 简短的中文解说（不超过50字）
  `;

  const response = await gemini.generateContent(prompt);
  return parseAIResponse(response);
}
```

#### 3.2.3 智能合约层

**合约功能**:

1. 用户下注管理
2. 奖池管理
3. 自动结算
4. 防作恶机制

**核心合约结构**:

```solidity
contract PolyRace {
    struct Race {
        uint256 id;
        address token1;
        address token2;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPool;
        mapping(address => Bet) bets;
    }

    struct Bet {
        uint8 choice; // 1 or 2
        uint256 amount;
        uint256 timestamp;
    }

    // 核心功能
    function createRace(address token1, address token2, uint256 duration) external;
    function placeBet(uint256 raceId, uint8 choice) external payable;
    function settleRace(uint256 raceId, uint8 winner) external;
    function claimReward(uint256 raceId) external;
}
```

### 3.3 实时通信架构

#### 3.3.1 WebSocket连接管理

```typescript
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private subscribers: Map<string, Function[]> = new Map();

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
  }

  subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  private handleMessage(message: MessageEvent) {
    const data = JSON.parse(message.data);
    const subscribers = this.subscribers.get(data.type) || [];
    subscribers.forEach((callback) => callback(data));
  }

  private handleClose() {
    // 断线重连逻辑
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.url);
    }, 5000);
  }
}
```

## 4. 数据流详解

### 4.1 赛事创建流程

```
管理员 → 创建赛事请求
    ↓
智能合约.createRace()
    ↓
事件: RaceCreated(id, token1, token2, endTime)
    ↓
前端监听事件 → 更新赛事列表
    ↓
开始订阅Polymarket数据流
    ↓
AI开始初始分析
```

### 4.2 用户下注流程

```
用户点击Boost按钮
    ↓
连接钱包签名
    ↓
调用合约.placeBet(raceId, choice, amount)
    ↓
合约验证（时间、金额、重复下注）
    ↓
记录下注 + 更新奖池
    ↓
触发事件: BetPlaced(user, choice, amount)
    ↓
前端更新UI（赔率、总额、用户余额）
    ↓
AI根据新数据更新预测
```

### 4.3 实时更新流程

```
Polymarket WebSocket推送交易
    ↓
前端接收并解析事件
    ↓
┌──────────────┴──────────────┐
│                              │
▼                              ▼
更新赛道位置动画            发送给AI分析
    │                              │
    │                              ▼
    │                     生成新的预测和解说
    │                              │
    └──────────────┬───────────────┘
                   ▼
         合并更新到UI状态
                   ▼
         触发React重新渲染
```

### 4.4 赛事结算流程

```
赛事时间到期
    ↓
后端服务监听区块
    ↓
获取两个代币的最终价格
    ↓
计算涨跌幅度 → 确定胜者
    ↓
调用合约.settleRace(raceId, winner)
    ↓
合约验证并记录结果
    ↓
用户调用.claimReward()领取奖励
    ↓
合约计算分成并转账
```

## 5. 安全性设计

### 5.1 智能合约安全

1. **重入攻击防护**

```solidity
modifier nonReentrant() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}
```

2. **时间锁定**

```solidity
require(block.timestamp < race.endTime, "Race ended");
require(bets[msg.sender].amount == 0, "Already bet");
```

3. **最小下注限制**

```solidity
require(msg.value >= MIN_BET, "Bet too small");
```

### 5.2 前端安全

1. **输入验证**: 所有用户输入严格验证
2. **签名验证**: Web3交易必须通过钱包签名
3. **XSS防护**: 使用React的自动转义

### 5.3 数据验证

1. **链上数据为准**: 所有结算依据链上预言机数据
2. **多源验证**: 交叉验证Polymarket和其他数据源
3. **时间戳验证**: 防止时间篡改攻击

## 6. 性能优化

### 6.1 前端优化

1. **代码分割**: React.lazy() + Suspense
2. **组件懒加载**: 非关键路径延迟加载
3. **虚拟滚动**: 大列表使用react-window
4. **memo优化**: 避免不必要的重新渲染

### 6.2 数据优化

1. **请求合并**: 批量查询减少网络开销
2. **缓存策略**: TanStack Query智能缓存
3. **WebSocket复用**: 单一连接多路复用
4. **数据预加载**: 预判用户行为提前加载

### 6.3 动画优化

1. **GPU加速**: transform和opacity属性
2. **requestAnimationFrame**: 平滑动画
3. **will-change**: 提前通知浏览器优化

## 7. 可扩展性

### 7.1 水平扩展

- 前端: CDN分发静态资源
- API: 无状态设计，可部署多实例
- 数据库: 读写分离，主从复制

### 7.2 功能扩展

- 支持更多代币对
- 多链部署（Ethereum, BSC, Arbitrum）
- NFT奖励系统
- 社交功能（分享、排行榜）

## 8. 监控与维护

### 8.1 监控指标

- **业务指标**: 赛事数量、用户活跃度、交易量
- **性能指标**: 页面加载时间、API响应时间
- **错误监控**: 合约调用失败、WebSocket断连
- **用户体验**: Core Web Vitals (LCP, FID, CLS)

### 8.2 日志系统

```typescript
// 前端日志
logger.info('Race created', { raceId, tokens });
logger.error('Bet failed', { error, user });

// 链上事件日志
event RaceCreated(uint256 indexed raceId, address token1, address token2);
event BetPlaced(uint256 indexed raceId, address indexed user, uint8 choice);
```

## 9. 技术债务与未来优化

### 9.1 当前限制

- AI预测基于单一模型，准确性待验证
- WebSocket断线重连可能丢失部分数据
- 智能合约未经过第三方审计

### 9.2 改进计划

- [ ] 集成多个AI模型进行集成预测
- [ ] 实现事件重放机制保证数据完整性
- [ ] 完成合约安全审计
- [ ] 实现Layer 2方案降低Gas费用
- [ ] 开发移动端原生应用

## 10. 总结

PolyRace系统采用现代化的技术栈和模块化的架构设计，确保了：

- ✅ **可靠性**: 基于链上数据的透明结算
- ✅ **实时性**: WebSocket + AI实时分析
- ✅ **可扩展性**: 组件化设计便于功能扩展
- ✅ **安全性**: 多层次的安全防护机制
- ✅ **用户体验**: 流畅的动画和直观的界面

通过持续优化和迭代，PolyRace将成为区块链预测游戏领域的标杆产品。
