# CloudPlay 云玩 - 项目交付报告

##  项目概述

CloudPlay（云玩）是一个基于 Tauri (Rust) + Cloudflare Workers (TypeScript) 的 局域网游戏远程联机服务平台。

##  项目结构

```
cloudplay/
├── cloudplay-backend/              # Cloudflare Worker 后端
│   ├── src/
│   │   ├── index.ts           # 主入口，Hono 路由
│   │   └── middleware/
│   │       └── rate-limiter.ts # 速率限制中间件
│   ├── wrangler.toml          # Cloudflare 配置
│   ├── tsconfig.json
│   └── package.json
│
├── cloudplay-app/                  # Tauri 桌面客户端
│   ├── src-tauri/             # Rust 后端
│   │   ├── src/
│   │   │   ├── main.rs        # 应用入口
│   │   │   ├── lib.rs         # Tauri 配置
│   │   │   ├── commands/      # Tauri 命令
│   │   │   │   ├── tunnel.rs  # 隧道管理命令
│   │   │   │   └── port.rs    # 端口检测命令
│   │   │   ├── services/      # 核心服务
│   │   │   │   ├── cloudflared.rs   # 进程管理
│   │   │   │   ├── api_client.rs    # API 客户端
│   │   │   │   ├── credential.rs    # 安全存储
│   │   │   │   └── port_scanner.rs  # 端口扫描
│   │   │   └── models/        # 数据模型
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── src/                   # React 前端
│   │   ├── App.tsx            # 主应用组件
│   │   ├── main.tsx           # 入口文件
│   │   ├── components/        # UI 组件
│   │   │   ├── Header.tsx     # 头部导航
│   │   │   └── StatusBar.tsx  # 状态栏
│   │   ├── pages/             # 页面组件
│   │   │   ├── HostPage.tsx   # 开服者页面
│   │   │   └── ClientPage.tsx # 联机者页面
│   │   ├── services/          # API 服务
│   │   │   ├── api.ts         # Worker API 调用
│   │   │   └── tauri.ts       # Tauri IPC 调用
│   │   ├── store/             # 状态管理
│   │   └── styles/            # 样式文件
│   └── package.json
│
├── cloudplay-website/              # 官网下载页
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── Download.tsx
│   │       └── Footer.tsx
│   └── package.json
│
├── plan.md                    # 技术设计文档
└── README.md                  # 项目说明
```

##  已完成内容

### 1. Cloudflare Worker 后端

- **Token 颁发 API** (`POST /api/token`)
  - 输入验证（房间 ID 格式）
  - 调用 Cloudflare API 生成隧道令牌
  - 返回主机名和令牌

- **速率限制中间件**
  - 基于 IP 的滑动窗口限流
  - 每分钟最多 10 次请求
  - 使用 KV 存储计数

- **健康检查** (`GET /api/health`)

### 2. Tauri 桌面客户端

#### Rust 后端模块

- **TunnelManager** - cloudflared 进程管理
  - 启动/停止隧道
  - 日志读取和转发
  - 进程状态监控

- **ApiClient** - Worker API 调用
  - 请求令牌
  - 健康检查

- **credential** - 安全存储
  - 使用操作系统 Keychain
  - 存储/读取/删除令牌

- **port_scanner** - 端口检测
  - 检查端口可用性
  - 查找可用端口

#### React 前端

- **开服者界面** (HostPage)
  - 房间 ID 输入
  - 本地端口配置
  - 一键启动隧道
  - 复制分享地址

- **联机者界面** (ClientPage)
  - 服务器地址输入
  - 本地代理端口
  - 一键连接

- **状态管理** (Zustand)
  - 隧道状态
  - 应用模式切换

### 3. 官网下载页

- 产品介绍 Hero 区域
- 功能特性展示
- 多平台下载卡片
- 响应式设计

##  构建说明

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Rust >= 1.70
- 系统依赖（Linux）：
  ```bash
  sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
  ```

### 后端 Worker

```bash
cd cloudplay-backend
pnpm install
pnpm run dev          # 本地开发
pnpm run deploy       # 部署到 Cloudflare
```

### 桌面客户端

```bash
cd cloudplay-app
pnpm install
pnpm run tauri dev    # 开发模式
pnpm run tauri build  # 构建安装包
```

### 官网

```bash
cd cloudplay-website
pnpm install
pnpm run dev          # 本地开发
pnpm run build        # 构建生产版本
```

##  部署前配置

### 1. Cloudflare 配置

1. 注册 `cloudplay.lat` 域名
2. 创建 Cloudflare Tunnel
3. 配置泛域名解析 `*.cloudplay.lat`
4. 创建 KV 命名空间
5. 获取 API Token

### 2. 更新配置文件

**cloudplay-backend/wrangler.toml**
```toml
[vars]
ACCOUNT_ID = "你的账户ID"
TUNNEL_ID = "你的隧道ID"
```

**cloudplay-app/src-tauri/src/lib.rs**
```rust
let api_client = ApiClient::new("https://api.cloudplay.lat".to_string());
```

### 3. 部署

```bash
# 部署 Worker
cd cloudplay-backend
npx wrangler secret put CLOUDFLARE_API_TOKEN
pnpm run deploy

# 构建桌面客户端
cd cloudplay-app
pnpm run tauri build

# 部署官网（连接 GitHub 到 Cloudflare Pages）
```

##  核心功能

1. **一键开服** - 输入房间 ID，自动生成专属域名
2. **一键连接** - 输入地址，自动建立隧道
3. **安全存储** - Token 存储于操作系统安全区域
4. **端口检测** - 自动检测端口可用性
5. **实时日志** - 隧道状态实时反馈

##  技术栈

| 组件 | 技术 |
|------|------|
| 后端 API | Cloudflare Workers + Hono + TypeScript |
| 桌面客户端 | Tauri v2 + Rust + React + TypeScript |
| UI 框架 | TailwindCSS + Lucide Icons |
| 状态管理 | Zustand |
| 官网 | React + Vite + TailwindCSS |

##  安全特性

- 全 HTTPS 通信
- Token 有效期 1 小时
- 操作系统级安全存储
- 速率限制防护
- 输入验证

##  后续优化

1. 添加用户认证系统
2. 实现房间持久化
3. 添加流量统计
4. 支持更多游戏
5. 添加自动更新功能

---

**项目状态**:  代码开发完成，待部署
