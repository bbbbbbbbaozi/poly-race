# 智能合约交互文档

## 1. 合约概述

PolyRace智能合约是系统的核心组件，负责管理赛事、处理下注、分配奖励等关键功能。合约部署在Polygon网络上，确保低Gas费用和快速确认。

### 1.1 合约信息

- **合约名称**: PolyRace
- **编译器版本**: Solidity ^0.8.20
- **网络**: Polygon Mainnet (ChainID: 137)
- **合约地址**: `0x...` (部署后填写)
- **开源验证**: Polygonscan已验证
- **审计状态**: 待审计

### 1.2 核心功能

- ✅ 创建和管理赛事
- ✅ 处理用户下注
- ✅ 自动结算奖池
- ✅ 安全的奖励分配
- ✅ 防重入保护
- ✅ 管理员权限管理

## 2. 合约架构

### 2.1 合约结构

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract PolyRace is ReentrancyGuard, Ownable, Pausable {
    // 状态变量
    // 映射关系
    // 事件定义
    // 修饰符
    // 核心函数
}
```

### 2.2 数据结构

#### Race（赛事）

```solidity
struct Race {
    uint256 id;                    // 赛事ID
    address token1;                // 代币1地址
    address token2;                // 代币2地址
    string symbol1;                // 代币1符号
    string symbol2;                // 代币2符号
    uint256 startTime;             // 开始时间
    uint256 endTime;               // 结束时间
    uint256 totalPool;             // 总奖池金额
    uint256 token1Pool;            // 代币1方的下注总额
    uint256 token2Pool;            // 代币2方的下注总额
    uint8 winner;                  // 获胜方 (0=未结算, 1=token1, 2=token2)
    RaceStatus status;             // 赛事状态
    address creator;               // 创建者
    uint256 platformFee;           // 平台手续费 (基点, 如500=5%)
}

enum RaceStatus {
    PENDING,      // 0: 准备中
    ACTIVE,       // 1: 进行中
    ENDED,        // 2: 已结束(等待结算)
    SETTLED,      // 3: 已结算
    CANCELLED     // 4: 已取消
}
```

#### Bet（下注）

```solidity
struct Bet {
    address user;          // 用户地址
    uint256 raceId;        // 赛事ID
    uint8 choice;          // 选择 (1=token1, 2=token2)
    uint256 amount;        // 下注金额
    uint256 timestamp;     // 下注时间
    bool claimed;          // 是否已领取奖励
}
```

#### UserStats（用户统计）

```solidity
struct UserStats {
    uint256 totalBets;      // 总下注次数
    uint256 totalAmount;    // 总下注金额
    uint256 totalWon;       // 总获胜次数
    uint256 totalRewards;   // 总奖励金额
    uint256 winRate;        // 胜率 (基点)
}
```

## 3. 核心函数详解

### 3.1 创建赛事

#### 函数签名

```solidity
function createRace(
    address _token1,
    address _token2,
    string memory _symbol1,
    string memory _symbol2,
    uint256 _duration
) external onlyOwner returns (uint256 raceId)
```

#### 参数说明

| 参数        | 类型    | 说明                        |
| ----------- | ------- | --------------------------- |
| `_token1`   | address | 第一个代币的合约地址        |
| `_token2`   | address | 第二个代币的合约地址        |
| `_symbol1`  | string  | 第一个代币的符号（如"BTC"） |
| `_symbol2`  | string  | 第二个代币的符号（如"ETH"） |
| `_duration` | uint256 | 赛事持续时间（秒）          |

#### 返回值

- `raceId`: 新创建的赛事ID

#### 使用示例

```typescript
// 使用ethers.js
const tx = await contract.createRace(
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // WBTC on Polygon
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH on Polygon
  "BTC",
  "ETH",
  7200, // 2小时
);
await tx.wait();
const receipt = await tx.wait();
const event = receipt.events?.find((e) => e.event === "RaceCreated");
const raceId = event?.args?.raceId;
```

#### 触发事件

```solidity
event RaceCreated(
    uint256 indexed raceId,
    address token1,
    address token2,
    uint256 startTime,
    uint256 endTime
);
```

### 3.2 用户下注

#### 函数签名

```solidity
function placeBet(
    uint256 _raceId,
    uint8 _choice
) external payable nonReentrant whenNotPaused
```

#### 参数说明

| 参数        | 类型    | 说明                       |
| ----------- | ------- | -------------------------- |
| `_raceId`   | uint256 | 赛事ID                     |
| `_choice`   | uint8   | 选择（1=token1, 2=token2） |
| `msg.value` | uint256 | 下注金额（自动传入）       |

#### 前置条件

- 赛事状态为ACTIVE
- 当前时间 < 赛事结束时间
- 用户未在该赛事下注过
- 下注金额 >= 最小下注额（0.01 ETH）
- 下注金额 <= 最大下注额（10 ETH）

#### 使用示例

```typescript
// 用户下注0.5 ETH支持BTC (choice=1)
const tx = await contract.placeBet(
  1, // raceId
  1, // choice (1=token1)
  {
    value: ethers.utils.parseEther("0.5"),
  },
);
await tx.wait();
```

#### 触发事件

```solidity
event BetPlaced(
    uint256 indexed raceId,
    address indexed user,
    uint8 choice,
    uint256 amount,
    uint256 timestamp
);
```

### 3.3 结算赛事

#### 函数签名

```solidity
function settleRace(
    uint256 _raceId,
    uint8 _winner,
    uint256 _token1Price,
    uint256 _token2Price
) external onlyOwner
```

#### 参数说明

| 参数           | 类型    | 说明                         |
| -------------- | ------- | ---------------------------- |
| `_raceId`      | uint256 | 赛事ID                       |
| `_winner`      | uint8   | 获胜方（1=token1, 2=token2） |
| `_token1Price` | uint256 | Token1最终价格（用于验证）   |
| `_token2Price` | uint256 | Token2最终价格（用于验证）   |

#### 前置条件

- 赛事状态为ENDED
- 当前时间 >= 赛事结束时间
- 赛事未被结算过

#### 结算逻辑

1. 验证赛事状态和时间
2. 记录获胜方
3. 计算平台手续费（5%）
4. 更新赛事状态为SETTLED
5. 触发事件

#### 使用示例

```typescript
const tx = await contract.settleRace(
  1, // raceId
  1, // winner (1=token1获胜)
  50000, // token1最终价格
  3000, // token2最终价格
);
await tx.wait();
```

#### 触发事件

```solidity
event RaceSettled(
    uint256 indexed raceId,
    uint8 winner,
    uint256 totalPool,
    uint256 winnerPool,
    uint256 platformFee
);
```

### 3.4 领取奖励

#### 函数签名

```solidity
function claimReward(uint256 _raceId) external nonReentrant
```

#### 参数说明

| 参数      | 类型    | 说明   |
| --------- | ------- | ------ |
| `_raceId` | uint256 | 赛事ID |

#### 前置条件

- 赛事已结算（status = SETTLED）
- 用户在该赛事有下注
- 用户下注的是获胜方
- 用户未领取过奖励

#### 奖励计算

```
用户奖励 = (用户下注额 / 获胜方总下注额) × 奖池总额 × (1 - 平台手续费)
```

#### 使用示例

```typescript
const tx = await contract.claimReward(1); // 领取赛事1的奖励
await tx.wait();
```

#### 触发事件

```solidity
event RewardClaimed(
    uint256 indexed raceId,
    address indexed user,
    uint256 reward
);
```

## 4. 查询函数

### 4.1 获取赛事信息

```solidity
function getRace(uint256 _raceId)
    external
    view
    returns (Race memory)
```

### 4.2 获取用户下注

```solidity
function getUserBet(uint256 _raceId, address _user)
    external
    view
    returns (Bet memory)
```

### 4.3 获取用户统计

```solidity
function getUserStats(address _user)
    external
    view
    returns (UserStats memory)
```

### 4.4 获取赔率

```solidity
function getOdds(uint256 _raceId)
    external
    view
    returns (uint256 odds1, uint256 odds2)
```

计算公式：

```
odds1 = (token2Pool / totalPool) × 100
odds2 = (token1Pool / totalPool) × 100
```

### 4.5 计算潜在奖励

```solidity
function calculatePotentialReward(
    uint256 _raceId,
    uint8 _choice,
    uint256 _amount
) external view returns (uint256)
```

## 5. 管理员函数

### 5.1 暂停/恢复合约

```solidity
function pause() external onlyOwner
function unpause() external onlyOwner
```

### 5.2 设置参数

```solidity
// 设置最小下注额
function setMinBet(uint256 _minBet) external onlyOwner

// 设置最大下注额
function setMaxBet(uint256 _maxBet) external onlyOwner

// 设置平台手续费
function setPlatformFee(uint256 _feeInBasisPoints) external onlyOwner
```

### 5.3 取消赛事

```solidity
function cancelRace(uint256 _raceId) external onlyOwner
```

取消赛事后，用户可以退回全部下注金额。

### 5.4 提取平台收益

```solidity
function withdrawPlatformFees() external onlyOwner
```

## 6. 事件列表

```solidity
// 赛事相关事件
event RaceCreated(uint256 indexed raceId, address token1, address token2, uint256 startTime, uint256 endTime);
event RaceStarted(uint256 indexed raceId);
event RaceEnded(uint256 indexed raceId);
event RaceSettled(uint256 indexed raceId, uint8 winner, uint256 totalPool, uint256 winnerPool, uint256 platformFee);
event RaceCancelled(uint256 indexed raceId);

// 下注相关事件
event BetPlaced(uint256 indexed raceId, address indexed user, uint8 choice, uint256 amount, uint256 timestamp);
event RewardClaimed(uint256 indexed raceId, address indexed user, uint256 reward);
event BetRefunded(uint256 indexed raceId, address indexed user, uint256 amount);

// 管理相关事件
event MinBetUpdated(uint256 oldMinBet, uint256 newMinBet);
event MaxBetUpdated(uint256 oldMaxBet, uint256 newMaxBet);
event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
event PlatformFeesWithdrawn(address indexed to, uint256 amount);
```

## 7. 错误码

```solidity
error RaceNotActive();
error RaceAlreadySettled();
error InvalidChoice();
error AlreadyBet();
error BetTooSmall();
error BetTooLarge();
error NotWinner();
error AlreadyClaimed();
error RaceNotSettled();
error InvalidRaceId();
error Unauthorized();
```

## 8. 前端集成指南

### 8.1 环境配置

```typescript
import { ethers } from "ethers";

// 合约ABI (从编译产物获取)
import PolyRaceABI from "./PolyRace.json";

// 合约地址
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;

// 连接到Polygon网络
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// 创建合约实例
const contract = new ethers.Contract(CONTRACT_ADDRESS, PolyRaceABI, signer);
```

### 8.2 连接钱包

```typescript
async function connectWallet() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await provider.listAccounts();
    return accounts[0];
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}
```

### 8.3 切换到Polygon网络

```typescript
async function switchToPolygon() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }], // 137 in hex
    });
  } catch (error: any) {
    // 如果网络未添加，添加Polygon网络
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      });
    }
  }
}
```

### 8.4 监听事件

```typescript
// 监听下注事件
contract.on("BetPlaced", (raceId, user, choice, amount, timestamp) => {
  console.log(
    `New bet: User ${user} bet ${ethers.utils.formatEther(amount)} on choice ${choice}`,
  );
  // 更新UI
  updateUI(raceId);
});

// 监听结算事件
contract.on(
  "RaceSettled",
  (raceId, winner, totalPool, winnerPool, platformFee) => {
    console.log(`Race ${raceId} settled. Winner: ${winner}`);
    // 显示结果
    showRaceResult(raceId, winner);
  },
);
```

### 8.5 查询赛事列表

```typescript
async function getActiveRaces() {
  const totalRaces = await contract.raceCounter();
  const races = [];

  for (let i = 1; i <= totalRaces; i++) {
    const race = await contract.getRace(i);
    if (race.status === 1) {
      // ACTIVE
      races.push({
        id: race.id.toNumber(),
        token1: race.symbol1,
        token2: race.symbol2,
        endTime: new Date(race.endTime.toNumber() * 1000),
        totalPool: ethers.utils.formatEther(race.totalPool),
      });
    }
  }

  return races;
}
```

### 8.6 下注

```typescript
async function placeBet(raceId: number, choice: number, amount: string) {
  try {
    const tx = await contract.placeBet(raceId, choice, {
      value: ethers.utils.parseEther(amount),
    });

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("Bet placed successfully!", receipt);
    return receipt;
  } catch (error: any) {
    if (error.code === "ACTION_REJECTED") {
      console.log("User rejected transaction");
    } else {
      console.error("Failed to place bet:", error);
    }
    throw error;
  }
}
```

### 8.7 领取奖励

```typescript
async function claimReward(raceId: number) {
  try {
    const tx = await contract.claimReward(raceId);
    const receipt = await tx.wait();

    // 从事件中获取奖励金额
    const event = receipt.events?.find((e) => e.event === "RewardClaimed");
    const reward = event?.args?.reward;

    console.log("Claimed reward:", ethers.utils.formatEther(reward));
    return reward;
  } catch (error) {
    console.error("Failed to claim reward:", error);
    throw error;
  }
}
```

## 9. Gas优化建议

### 9.1 批量查询

使用Multicall合约批量查询，减少RPC调用次数：

```typescript
import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";

// 使用Multicall3
const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

async function batchGetRaces(raceIds: number[]) {
  const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);

  const calls = raceIds.map((id) => ({
    target: CONTRACT_ADDRESS,
    callData: contract.interface.encodeFunctionData("getRace", [id]),
  }));

  const results = await multicall.callStatic.aggregate3(calls);
  return results.map((r) =>
    contract.interface.decodeFunctionResult("getRace", r.returnData),
  );
}
```

### 9.2 Gas估算

```typescript
async function estimatePlaceBetGas(
  raceId: number,
  choice: number,
  amount: string,
) {
  const gasEstimate = await contract.estimateGas.placeBet(raceId, choice, {
    value: ethers.utils.parseEther(amount),
  });

  console.log("Estimated gas:", gasEstimate.toString());
  return gasEstimate;
}
```

## 10. 安全最佳实践

### 10.1 交易确认

始终等待足够的区块确认：

```typescript
const tx = await contract.placeBet(raceId, choice, { value });
const receipt = await tx.wait(2); // 等待2个区块确认
```

### 10.2 错误处理

```typescript
try {
  await contract.placeBet(raceId, choice, { value });
} catch (error: any) {
  if (error.code === "INSUFFICIENT_FUNDS") {
    alert("余额不足");
  } else if (error.data) {
    // 解析合约revert消息
    const reason = contract.interface.parseError(error.data);
    alert(`交易失败: ${reason.name}`);
  }
}
```

### 10.3 金额验证

```typescript
function validateBetAmount(amount: string) {
  const min = ethers.utils.parseEther("0.01");
  const max = ethers.utils.parseEther("10");
  const value = ethers.utils.parseEther(amount);

  if (value.lt(min)) {
    throw new Error("Bet amount too small");
  }
  if (value.gt(max)) {
    throw new Error("Bet amount too large");
  }
}
```

## 11. 测试指南

### 11.1 本地测试

```bash
# 使用Hardhat
npx hardhat test

# 运行特定测试
npx hardhat test test/PolyRace.test.ts

# 查看覆盖率
npx hardhat coverage
```

### 11.2 测试网部署

```bash
# 部署到Mumbai测试网
npx hardhat run scripts/deploy.ts --network mumbai

# 验证合约
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### 11.3 获取测试代币

- Mumbai MATIC水龙头: https://faucet.polygon.technology/
- 测试ERC20代币: 自行部署或使用现有测试币

## 12. 常见问题

### Q1: 如何处理交易失败？

**A**: 检查以下几点：

- 钱包余额是否充足
- Gas费用是否足够
- 是否满足合约的前置条件
- 网络是否拥堵

### Q2: 如何加速交易？

**A**: 增加Gas价格：

```typescript
const tx = await contract.placeBet(raceId, choice, {
  value,
  gasPrice: ethers.utils.parseUnits("50", "gwei"), // 提高Gas价格
});
```

### Q3: 如何取消待处理的交易？

**A**: 使用相同nonce发送0 ETH交易：

```typescript
const nonce = await signer.getTransactionCount("pending");
await signer.sendTransaction({
  to: await signer.getAddress(),
  value: 0,
  nonce,
  gasPrice: ethers.utils.parseUnits("100", "gwei"), // 更高的Gas
});
```

## 13. 附录

### 13.1 完整合约ABI

见项目文件：`artifacts/contracts/PolyRace.sol/PolyRace.json`

### 13.2 合约源码

见项目文件：`contracts/PolyRace.sol`

### 13.3 相关链接

- Polygon文档: https://docs.polygon.technology/
- Ethers.js文档: https://docs.ethers.org/
- OpenZeppelin合约: https://docs.openzeppelin.com/contracts/
- Hardhat文档: https://hardhat.org/docs

---

**注意**: 本文档基于合约设计规划编写，实际部署后需要更新具体的合约地址和网络信息。
