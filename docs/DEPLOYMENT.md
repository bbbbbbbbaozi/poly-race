# 运行与部署指南

## 1. 环境准备

### 1.1 系统要求

- **操作系统**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Node.js**: >= 18.0.0 (推荐 LTS 版本)
- **包管理器**: npm >= 9.0.0 或 pnpm >= 8.0.0 或 bun >= 1.0.0
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Web3钱包**: MetaMask, WalletConnect 兼容钱包

### 1.2 开发工具（推荐）

- **IDE**: VS Code + 以下扩展
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
- **Git**: >= 2.30.0
- **终端**: 支持彩色输出的现代终端

### 1.3 账号与密钥准备

#### Polymarket API

1. 访问 [Polymarket开发者平台](https://docs.polymarket.com/)
2. 注册开发者账号
3. 创建API密钥
4. 记录API Key和WebSocket URL

#### Google Gemini API

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录Google账号
3. 创建API密钥
4. 注意免费配额限制

#### Web3相关

1. 安装MetaMask浏览器扩展
2. 创建或导入钱包
3. 切换到Polygon网络
4. 获取测试网MATIC代币（用于测试）

## 2. 本地开发环境搭建

### 2.1 克隆项目

```bash
# 通过HTTPS克隆
git clone https://github.com/your-username/poly-race.git

# 或通过SSH克隆
git clone git@github.com:your-username/poly-race.git

# 进入项目目录
cd poly-race
```

### 2.2 安装依赖

#### 使用Bun（推荐，最快）

```bash
# 安装Bun（如果还没有安装）
curl -fsSL https://bun.sh/install | bash

# 安装项目依赖
bun install
```

#### 使用pnpm（推荐）

```bash
# 安装pnpm（如果还没有安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

#### 使用npm

```bash
npm install
```

### 2.3 环境变量配置

在项目根目录创建 `.env` 文件：

```bash
# 复制模板文件
cp .env.example .env
```

编辑 `.env` 文件，填入实际配置：

```env
# ===========================================
# Polymarket API配置
# ===========================================
# API密钥
VITE_POLYMARKET_API_KEY=your_polymarket_api_key_here

# WebSocket地址
VITE_POLYMARKET_WS_URL=wss://ws-subscriptions-clob.polymarket.com/ws/market

# REST API地址
VITE_POLYMARKET_API_URL=https://clob.polymarket.com/

# ===========================================
# AI配置 (Google Gemini)
# ===========================================
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash

# ===========================================
# 区块链配置
# ===========================================
# 智能合约地址（部署后填写）
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# 链ID (137=Polygon主网, 80001=Mumbai测试网)
VITE_CHAIN_ID=137

# RPC节点
VITE_RPC_URL=https://polygon-rpc.com

# ===========================================
# 应用配置
# ===========================================
# 应用环境
VITE_APP_ENV=development

# API超时时间（毫秒）
VITE_API_TIMEOUT=30000

# 是否启用调试模式
VITE_DEBUG=true
```

### 2.4 启动开发服务器

```bash
# 使用Bun
bun run dev

# 或使用pnpm
pnpm dev

# 或使用npm
npm run dev
```

成功启动后，控制台会显示：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h + enter to show help
```

访问 http://localhost:5173 查看应用。

### 2.5 开发调试

#### 热重载

Vite支持热模块替换（HMR），修改代码后会自动刷新：

```bash
# 监听文件变化
bun run dev
```

#### 类型检查

```bash
# 运行TypeScript类型检查
bun run type-check

# 或
npx tsc --noEmit
```

#### 代码检查

```bash
# 运行ESLint
bun run lint

# 自动修复
bun run lint --fix
```

#### 单元测试

```bash
# 运行测试
bun run test

# 监听模式
bun run test:watch

# 生成覆盖率报告
bun run test:coverage
```

## 3. 生产环境部署

### 3.1 构建生产版本

#### 3.1.1 配置生产环境变量

创建 `.env.production` 文件：

```env
VITE_POLYMARKET_API_KEY=prod_api_key
VITE_GEMINI_API_KEY=prod_gemini_key
VITE_CONTRACT_ADDRESS=0xYourProductionContractAddress
VITE_CHAIN_ID=137
VITE_APP_ENV=production
VITE_DEBUG=false
```

#### 3.1.2 执行构建

```bash
# 构建生产版本
bun run build

# 或指定环境
bun run build --mode production
```

构建完成后，产物位于 `dist/` 目录：

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

#### 3.1.3 本地预览

```bash
# 预览构建结果
bun run preview
```

访问 http://localhost:4173 测试生产版本。

### 3.2 部署到Vercel（推荐）

#### 3.2.1 通过Git自动部署

1. **推送代码到GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **连接Vercel**

- 访问 [Vercel](https://vercel.com)
- 使用GitHub账号登录
- 点击 "Import Project"
- 选择 `poly-race` 仓库

3. **配置环境变量**

在Vercel项目设置中添加环境变量：

- `VITE_POLYMARKET_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_CONTRACT_ADDRESS`
- 其他所需变量

4. **部署**

点击 "Deploy"，Vercel会自动：

- 安装依赖
- 运行构建命令
- 部署到全球CDN

#### 3.2.2 通过CLI部署

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 3.3 部署到Netlify

#### 3.3.1 配置netlify.toml

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3.3.2 部署

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

### 3.4 部署到自有服务器（Nginx）

#### 3.4.1 构建项目

```bash
bun run build
```

#### 3.4.2 配置Nginx

创建 `/etc/nginx/sites-available/polyrace` 文件：

```nginx
server {
    listen 80;
    server_name polyrace.example.com;

    root /var/www/polyrace/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

启用站点：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/polyrace /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx
```

#### 3.4.3 HTTPS配置（Let's Encrypt）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d polyrace.example.com

# 自动续期
sudo certbot renew --dry-run
```

### 3.5 Docker部署

#### 3.5.1 创建Dockerfile

```dockerfile
# Build阶段
FROM oven/bun:1 as builder

WORKDIR /app

# 复制依赖文件
COPY package.json bun.lockb ./

# 安装依赖
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN bun run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3.5.2 创建nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3.5.3 构建和运行

```bash
# 构建镜像
docker build -t polyrace:latest .

# 运行容器
docker run -d -p 80:80 --name polyrace polyrace:latest

# 查看日志
docker logs -f polyrace
```

#### 3.5.4 使用Docker Compose

创建 `docker-compose.yml`：

```yaml
version: "3.8"

services:
  polyrace:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

## 4. 智能合约部署

### 4.1 准备工作

#### 安装Hardhat

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

#### 初始化Hardhat项目

```bash
npx hardhat init
```

### 4.2 编写部署脚本

创建 `scripts/deploy.js`：

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying PolyRace contract...");

  const PolyRace = await hre.ethers.getContractFactory("PolyRace");
  const polyRace = await PolyRace.deploy();

  await polyRace.deployed();

  console.log("PolyRace deployed to:", polyRace.address);

  // 验证合约（可选）
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await polyRace.deployTransaction.wait(6);

    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: polyRace.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 4.3 配置hardhat.config.js

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonMumbai: {
      url: process.env.POLYGON_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
    },
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
```

### 4.4 部署到测试网

```bash
# 部署到Mumbai测试网
npx hardhat run scripts/deploy.js --network polygonMumbai
```

### 4.5 部署到主网

```bash
# 部署到Polygon主网
npx hardhat run scripts/deploy.js --network polygon
```

记录合约地址，并更新 `.env` 文件中的 `VITE_CONTRACT_ADDRESS`。

## 5. 持续集成/持续部署（CI/CD）

### 5.1 GitHub Actions配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run tests
        run: bun run test

      - name: Run linter
        run: bun run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build
        env:
          VITE_POLYMARKET_API_KEY: ${{ secrets.POLYMARKET_API_KEY }}
          VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          VITE_CONTRACT_ADDRESS: ${{ secrets.CONTRACT_ADDRESS }}

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

### 5.2 配置GitHub Secrets

在GitHub仓库设置中添加以下secrets：

- `POLYMARKET_API_KEY`
- `GEMINI_API_KEY`
- `CONTRACT_ADDRESS`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 6. 监控与维护

### 6.1 性能监控

#### 集成Google Analytics

```typescript
// src/lib/analytics.ts
export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};
```

#### 集成Sentry错误监控

```bash
bun add @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
});
```

### 6.2 日志管理

```typescript
// src/lib/logger.ts
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // 发送到日志服务
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // 发送到Sentry
  },
};
```

### 6.3 健康检查

创建 `public/health.json`：

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 6.4 备份策略

- **代码备份**: Git仓库（GitHub）
- **配置备份**: 环境变量使用密钥管理服务
- **数据库备份**: 如使用数据库，设置自动备份

## 7. 故障排除

### 7.1 常见问题

#### 依赖安装失败

```bash
# 清除缓存
rm -rf node_modules bun.lockb
bun install
```

#### 构建错误

```bash
# 检查类型错误
bun run type-check

# 检查环境变量
echo $VITE_POLYMARKET_API_KEY
```

#### WebSocket连接失败

- 检查防火墙设置
- 验证API密钥是否正确
- 查看浏览器控制台错误信息

#### 合约交互失败

- 确认钱包已连接
- 检查网络是否正确（主网/测试网）
- 验证合约地址是否正确
- 查看交易失败原因

### 7.2 调试技巧

#### 启用详细日志

```env
VITE_DEBUG=true
```

#### 使用浏览器开发工具

- Network面板：查看API请求
- Console面板：查看日志输出
- Application面板：查看本地存储
- Performance面板：分析性能瓶颈

#### 使用React DevTools

安装React DevTools浏览器扩展，检查组件状态和props。

## 8. 升级与回滚

### 8.1 版本升级

```bash
# 更新依赖
bun update

# 测试
bun run test

# 构建
bun run build

# 部署
vercel --prod
```

### 8.2 回滚策略

#### Vercel回滚

在Vercel Dashboard中选择之前的部署版本，点击"Promote to Production"。

#### Git回滚

```bash
# 查看提交历史
git log

# 回滚到指定版本
git revert <commit-hash>
git push origin main
```

## 9. 安全检查清单

部署前确认：

- [ ] 所有敏感信息已配置为环境变量
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] HTTPS已启用
- [ ] 安全响应头已配置
- [ ] 依赖包已更新到最新版本
- [ ] 已进行安全审计（`npm audit`）
- [ ] 智能合约已通过审计
- [ ] 已设置速率限制
- [ ] 已配置CORS策略

## 10. 性能优化检查清单

- [ ] 启用Gzip/Brotli压缩
- [ ] 静态资源使用CDN
- [ ] 配置长期缓存策略
- [ ] 实现代码分割
- [ ] 优化图片（WebP格式）
- [ ] 懒加载非关键资源
- [ ] 预加载关键资源
- [ ] 使用Service Worker缓存

## 11. 总结

按照本指南，你可以：

✅ 搭建完整的开发环境  
✅ 配置必要的API密钥和环境变量  
✅ 在本地运行和调试应用  
✅ 构建生产版本  
✅ 部署到多种平台  
✅ 配置CI/CD自动化流程  
✅ 监控和维护应用

如遇到问题，请参考[故障排除](#7-故障排除)章节或提交Issue到GitHub仓库。
