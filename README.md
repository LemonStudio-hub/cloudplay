<div align="center">

#  CloudPlay 云玩

**为局域网游戏提供的免费、高性能远程联机服务平台**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Release](https://img.shields.io/github/v/release/cloudplay/cloudplay?color=green)](https://github.com/cloudplay/cloudplay/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cloudplay/cloudplay/ci.yml?branch=main)](https://github.com/cloudplay/cloudplay/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.96-orange.svg)](https://www.rust-lang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-green.svg)](https://vuejs.org/)

[功能特性](#-功能特性) •
[快速开始](#-快速开始) •
[文档](#-文档) •
[贡献](#-贡献) •
[许可证](#-许可证)

</div>

---

##  简介

CloudPlay（云玩）是一个开源的远程联机服务平台，专为局域网游戏设计。它基于 Cloudflare 全球网络，提供零配置、低延迟的远程联机体验。

### 为什么选择 CloudPlay？

- ** 专为游戏优化** - 低延迟、高带宽的游戏流量传输
- ** 云端架构** - 基于 Cloudflare 全球 300+ 边缘节点
- ** 安全可靠** - 端到端加密，Token 安全存储
- ** 完全免费** - 利用 Cloudflare 免费套餐，零成本运营
- ** 极致轻量** - 基于 Tauri + Rust，安装包 < 20MB
- ** 开箱即用** - 图形化界面，无需技术背景

##  功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
|  **一键开服** | 输入房间 ID，自动生成专属地址 |
|  **一键连接** | 输入地址即可加入游戏 |
|  **全球加速** | Cloudflare 边缘网络智能路由 |
|  **安全存储** | 操作系统级 Keychain 存储 Token |
|  **实时日志** | 隧道状态实时反馈 |
|  **端口检测** | 自动检测并分配可用端口 |

### 技术特性

| 特性 | 技术实现 |
|------|----------|
| **跨平台** | Tauri v2 支持 Windows、macOS、Linux |
| **原生性能** | Rust 后端，内存占用低，启动速度快 |
| **现代 UI** | React + TailwindCSS，响应式设计 |
| **边缘计算** | Cloudflare Workers，API 就近处理 |
| **泛域名** | 动态子域名分配，无需手动配置 |

##  架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      用户端 (Tauri)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   GUI 前端    │  │  Rust 后端   │  │ cloudflared 进程  │  │
│  │  React + TS   │←→│   Tokio     │←→│   隧道管理       │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Cloudflare 边缘网络                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Workers    │  │     KV       │  │     Tunnel       │  │
│  │  Token 颁发   │  │  速率限制    │  │    流量转发       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

##  项目结构

```
cloudplay/
├── cloudplay-backend/          # Cloudflare Worker 后端
│   ├── src/
│   │   ├── index.ts           # 主入口，Hono 路由
│   │   └── middleware/
│   │       └── rate-limiter.ts # 速率限制中间件
│   ├── wrangler.toml          # Cloudflare 配置
│   └── package.json
│
├── cloudplay-app/              # Tauri 桌面客户端
│   ├── src-tauri/             # Rust 后端
│   │   ├── src/
│   │   │   ├── main.rs        # 应用入口
│   │   │   ├── lib.rs         # Tauri 配置
│   │   │   ├── commands/      # Tauri 命令
│   │   │   ├── services/      # 核心服务
│   │   │   └── models/        # 数据模型
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── src/                   # Vue 前端
│   │   ├── components/        # UI 组件
│   │   ├── pages/             # 页面
│   │   ├── services/          # API 服务
│   │   └── store/             # 状态管理
│   └── package.json
│
├── cloudplay-website/          # 官网下载页
│   ├── src/
│   │   ├── components/        # Vue 组件
│   │   └── App.vue
│   └── package.json
│
├── docs/                       # 文档
├── .github/                    # GitHub 配置
├── LICENSE                     # AGPL-3.0 许可证
├── CONTRIBUTING.md             # 贡献指南
├── CODE_OF_CONDUCT.md          # 行为准则
├── CHANGELOG.md                # 更新日志
└── SECURITY.md                 # 安全政策
```

##  快速开始

### 前置要求

- **Node.js** >= 18
- **pnpm** >= 8
- **Rust** >= 1.70 (用于 Tauri 客户端)

### 1. 克隆项目

```bash
git clone https://github.com/cloudplay/cloudplay.git
cd cloudplay
```

### 2. 启动后端 Worker

```bash
cd cloudplay-backend
pnpm install
pnpm run dev
```

Worker 将在 `http://localhost:8787` 启动。

### 3. 启动桌面客户端

```bash
cd cloudplay-app
pnpm install
pnpm run tauri dev
```

### 4. 启动官网

```bash
cd cloudplay-website
pnpm install
pnpm run dev
```

官网将在 `http://localhost:5173` 启动。

##  文档

### 核心文档

| 文档 | 描述 |
|------|------|
| [技术设计文档](docs/architecture.md) | 系统架构详细设计 |
| [API 文档](docs/api.md) | Worker API 接口说明 |
| [部署指南](docs/deployment.md) | 生产环境部署指南 |
| [开发指南](docs/development.md) | 本地开发环境搭建 |

### 平台文档

| 文档 | 描述 |
|------|------|
| [Windows 构建](docs/platforms/windows.md) | Windows 平台构建指南 |
| [macOS 构建](docs/platforms/macos.md) | macOS 平台构建指南 |
| [Linux 构建](docs/platforms/linux.md) | Linux 平台构建指南 |

### 参考文档

| 文档 | 描述 |
|------|------|
| [常见问题](docs/faq.md) | 常见问题解答 |
| [故障排除](docs/troubleshooting.md) | 问题排查指南 |
| [更新日志](CHANGELOG.md) | 版本更新记录 |

##  技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| [Vue.js](https://vuejs.org/) | 3.5 | 官网框架 |
| [React](https://react.dev/) | 18.3 | 客户端 UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | 类型安全 |
| [TailwindCSS](https://tailwindcss.com/) | 3.4 | 样式框架 |
| [Vite](https://vitejs.dev/) | 6.4 | 构建工具 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | 状态管理 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| [Rust](https://www.rust-lang.org/) | 1.96 | 客户端后端 |
| [Tauri](https://tauri.app/) | 2.x | 桌面应用框架 |
| [Tokio](https://tokio.rs/) | 1.x | 异步运行时 |
| [Hono](https://hono.dev/) | 4.x | Worker 框架 |
| [Cloudflare Workers](https://workers.cloudflare.com/) | - | 边缘计算 |
| [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | - | 隧道服务 |

### 工具链

| 工具 | 用途 |
|------|------|
| [pnpm](https://pnpm.io/) | 包管理器 |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Cloudflare CLI |
| [Cargo](https://doc.rust-lang.org/cargo/) | Rust 包管理器 |
| [ESLint](https://eslint.org/) | 代码检查 |
| [Prettier](https://prettier.io/) | 代码格式化 |

##  配置说明

### 环境变量

#### Worker 后端

在 `cloudplay-backend/wrangler.toml` 中配置：

```toml
[vars]
ACCOUNT_ID = "your_cloudflare_account_id"
TUNNEL_ID = "your_tunnel_uuid"
```

敏感变量通过 Wrangler Secret 注入：

```bash
wrangler secret put CLOUDFLARE_API_TOKEN
```

#### 桌面客户端

在 `cloudplay-app/src-tauri/src/lib.rs` 中配置 API 地址：

```rust
let api_client = ApiClient::new("https://api.cloudplay.lat".to_string());
```

### Cloudflare 配置

1. **注册域名**：在 Cloudflare 注册 `cloudplay.lat`
2. **创建 Tunnel**：在 Zero Trust Dashboard 创建持久隧道
3. **配置 DNS**：添加泛域名解析 `*.cloudplay.lat`
4. **创建 KV**：用于速率限制计数

##  测试

### 运行单元测试

```bash
# 后端测试
cd cloudplay-backend
pnpm run test

# 客户端测试
cd cloudplay-app
cargo test

# 官网测试
cd cloudplay-website
pnpm run test
```

### 运行集成测试

```bash
# 启动本地开发环境
pnpm run dev:all

# 运行端到端测试
pnpm run test:e2e
```

##  构建

### 构建后端 Worker

```bash
cd cloudplay-backend
pnpm run deploy
```

### 构建桌面客户端

```bash
cd cloudplay-app

# 开发模式
pnpm run tauri dev

# 生产构建
pnpm run tauri build

# 构建 MSI (Windows)
cargo wix
```

### 构建官网

```bash
cd cloudplay-website
pnpm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name cloudplay-website
```

##  部署

### 生产环境部署

#### 1. 部署 Worker

```bash
cd cloudplay-backend

# 配置生产环境变量
wrangler secret put CLOUDFLARE_API_TOKEN

# 部署
pnpm run deploy
```

#### 2. 部署官网

```bash
cd cloudplay-website

# 构建
pnpm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name cloudplay-website
```

#### 3. 构建客户端

```bash
cd cloudplay-app

# 构建所有平台
pnpm run tauri build

# 代码签名 (macOS)
codesign --force --deep --sign "Developer ID Application: Your Name" src-tauri/target/release/bundle/macos/CloudPlay.app

# 公证 (macOS)
xcrun notarytool submit src-tauri/target/release/bundle/macos/CloudPlay.dmg --apple-id your@apple.id --team-id TEAM_ID
```

##  贡献

我们欢迎所有形式的贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解详情。

### 贡献方式

-  **报告 Bug**：[提交 Issue](https://github.com/cloudplay/cloudplay/issues/new?template=bug_report.yml)
-  **功能建议**：[提交 Issue](https://github.com/cloudplay/cloudplay/issues/new?template=feature_request.yml)
-  **改进文档**：提交 PR
-  **代码贡献**：提交 PR

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

##  许可证

本项目采用 [GNU Affero General Public License v3.0](LICENSE) 许可证。

这意味着：
-  你可以自由使用、修改和分发本软件
-  你可以将本软件用于商业用途
-  你必须公开所有修改后的源代码
-  如果你通过网络提供本软件的服务，必须公开服务端源代码
-  你不能将本软件用于闭源项目

详见 [LICENSE](LICENSE) 文件。

##  致谢

感谢以下开源项目：

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [Cloudflare](https://www.cloudflare.com/) - 全球网络服务
- [Hono](https://hono.dev/) - 轻量级 Web 框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [React](https://react.dev/) - 用户界面库
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

##  联系我们

- **官网**：[cloudplay.lat](https://cloudplay.lat)
- **GitHub**：[github.com/cloudplay](https://github.com/cloudplay)
- **邮箱**：support@cloudplay.lat
- **Discord**：[加入社区](https://discord.gg/cloudplay)

##  Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cloudplay/cloudplay&type=Date)](https://star-history.com/#cloudplay/cloudplay&Date)

---

<div align="center">

**[⬆ 回到顶部](#-cloudplay-云玩)**

Made with ❤️ by CloudPlay Team

</div>
