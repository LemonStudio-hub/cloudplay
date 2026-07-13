# 贡献指南

感谢你对 CloudPlay 项目的关注！我们欢迎所有形式的贡献，无论是报告 Bug、提出功能建议、改进文档还是提交代码。

##  目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
  - [报告 Bug](#报告-bug)
  - [功能建议](#功能建议)
  - [代码贡献](#代码贡献)
  - [文档改进](#文档改进)
- [开发环境](#开发环境)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [版本发布](#版本发布)

## 行为准则

本项目采用 [Contributor Covenant 行为准则](CODE_OF_CONDUCT.md)。参与本项目即表示你同意遵守该准则。

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [Issue Tracker](https://github.com/cloudplay/cloudplay/issues/new?template=bug_report.yml) 报告。

**报告 Bug 时，请包含：**

1. **清晰的标题**：简明扼要地描述问题
2. **环境信息**：
   - 操作系统及版本
   - 应用版本
   - 相关依赖版本
3. **重现步骤**：
   - 详细的操作步骤
   - 预期行为
   - 实际行为
4. **截图或日志**：如果可能，提供截图或错误日志
5. **额外信息**：任何你认为有帮助的信息

**示例：**

```
标题：Windows 11 上启动隧道失败

环境：
- OS: Windows 11 23H2
- App: v1.0.0
- Rust: 1.96.0

重现步骤：
1. 打开应用
2. 输入房间 ID "test123"
3. 点击"启动隧道"
4. 看到错误提示 "Failed to spawn cloudflared"

预期行为：隧道成功启动
实际行为：显示错误信息

日志：
[ERROR] Failed to spawn cloudflared: 系统找不到指定的文件。

补充信息：cloudflared 已安装在 PATH 中。
```

### 功能建议

如果你有功能建议，请通过 [Feature Request](https://github.com/cloudplay/cloudplay/issues/new?template=feature_request.yml) 提交。

**功能建议应包含：**

1. **问题描述**：这个功能解决什么问题？
2. **解决方案**：你期望的解决方案是什么？
3. **替代方案**：你考虑过哪些替代方案？
4. **额外信息**：任何相关的上下文、截图或参考

### 代码贡献

#### 贡献流程

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 Fork 项目
   git clone https://github.com/YOUR_USERNAME/cloudplay.git
   cd cloudplay
   git remote add upstream https://github.com/cloudplay/cloudplay.git
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **开发**
   - 遵循代码规范
   - 编写测试
   - 更新文档

4. **测试**
   ```bash
   # 运行测试
   pnpm run test
   
   # 运行 lint
   pnpm run lint
   
   # 运行类型检查
   pnpm run type-check
   ```

5. **提交**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **推送**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**

#### 贡献类型

- **Bug 修复**：`fix/` 前缀
- **新功能**：`feat/` 前缀
- **文档更新**：`docs/` 前缀
- **代码重构**：`refactor/` 前缀
- **性能优化**：`perf/` 前缀
- **测试**：`test/` 前缀
- **构建**：`build/` 前缀
- **CI**：`ci/` 前缀
- **其他**：`chore/` 前缀

### 文档改进

文档改进同样重要！你可以：

- 修复拼写错误
- 改进现有文档
- 添加示例代码
- 翻译文档
- 添加 FAQ

## 开发环境

### 前置要求

```bash
# Node.js (>= 18)
node --version

# pnpm (>= 8)
pnpm --version

# Rust (>= 1.70) - 用于 Tauri 客户端
rustc --version
cargo --version

# Wrangler - Cloudflare CLI
npm install -g wrangler
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/cloudplay/cloudplay.git
cd cloudplay

# 安装依赖
pnpm install

# 启动所有服务
pnpm run dev:all
```

### 单独启动服务

```bash
# 启动后端 Worker
cd cloudplay-backend
pnpm run dev

# 启动桌面客户端
cd cloudplay-app
pnpm run tauri dev

# 启动官网
cd cloudplay-website
pnpm run dev
```

## 代码规范

### TypeScript / JavaScript

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 TypeScript 严格模式

```bash
# 检查代码
pnpm run lint

# 格式化代码
pnpm run format

# 类型检查
pnpm run type-check
```

### Rust

- 使用 `rustfmt` 进行代码格式化
- 使用 `clippy` 进行代码检查

```bash
# 格式化代码
cargo fmt

# 代码检查
cargo clippy
```

### Vue / React

- 使用 Composition API (Vue)
- 使用 Hooks (React)
- 组件名使用 PascalCase
- 文件名使用 kebab-case

### CSS

- 使用 TailwindCSS
- 遵循 BEM 命名规范（自定义 CSS）
- 避免使用 `!important`

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 | camelCase | `userName`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| 函数 | camelCase | `getUserById`, `handleClick` |
| 类 | PascalCase | `UserService`, `ApiClient` |
| 接口 | PascalCase | `User`, `ApiResponse` |
| 文件 | kebab-case | `user-service.ts`, `api-client.rs` |

### 注释规范

```typescript
/**
 * 获取用户信息
 * @param userId - 用户 ID
 * @returns 用户信息
 * @throws {ApiError} 当 API 请求失败时抛出
 */
async function getUserById(userId: string): Promise<User> {
  // ...
}
```

```rust
/// 获取用户信息
///
/// # Arguments
///
/// * `user_id` - 用户 ID
///
/// # Returns
///
/// 返回用户信息
///
/// # Errors
///
/// 当 API 请求失败时返回错误
async fn get_user_by_id(user_id: &str) -> Result<User, ApiError> {
    // ...
}
```

## 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型

| 类型 | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user authentication` |
| `fix` | Bug 修复 | `fix: resolve login timeout` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码风格 | `style: format code with prettier` |
| `refactor` | 代码重构 | `refactor: extract auth service` |
| `perf` | 性能优化 | `perf: optimize database queries` |
| `test` | 测试 | `test: add unit tests for user service` |
| `build` | 构建系统 | `build: update vite config` |
| `ci` | CI 配置 | `ci: add GitHub Actions workflow` |
| `chore` | 其他 | `chore: update dependencies` |
| `revert` | 回滚 | `revert: undo changes in v1.0` |

### 范围

可选，用于指定提交影响的范围：

- `backend` - 后端 Worker
- `app` - 桌面客户端
- `website` - 官网
- `docs` - 文档
- `ci` - CI/CD

### 示例

```
feat(app): add dark mode support

- Add dark mode toggle in settings
- Persist user preference
- Update all components to support dark theme

Closes #123
```

```
fix(backend): resolve token expiration issue

The token was not being refreshed correctly when it expired.
This fix ensures the token is refreshed before each request.

Fixes #456
```

## Pull Request 流程

### 1. 创建 PR

- 确保分支是最新的
- 填写 PR 模板
- 关联相关 Issue

### 2. PR 标题

使用与提交相同的格式：

```
feat(app): add dark mode support
```

### 3. PR 描述

```markdown
## 描述

简要描述这个 PR 做了什么。

## 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 代码重构
- [ ] 性能优化
- [ ] 文档更新
- [ ] 其他

## 测试

- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试通过

## 截图

如果适用，添加截图。

## 相关 Issue

Closes #123
```

### 4. 代码审查

- 至少需要 1 个审查者批准
- 所有 CI 检查必须通过
- 解决所有审查意见

### 5. 合并

- 使用 "Squash and Merge" 策略
- 确保提交信息符合规范

## 版本发布

本项目使用 [Semantic Versioning](https://semver.org/) 规范。

### 版本号格式

```
MAJOR.MINOR.PATCH
```

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向下兼容的功能性新增
- **PATCH**：向下兼容的问题修正

### 发布流程

1. 更新 `CHANGELOG.md`
2. 更新版本号
3. 创建 Git Tag
4. 推送到 GitHub
5. CI 自动构建和发布

```bash
# 更新版本号
npm version patch  # 或 minor, major

# 推送
git push && git push --tags
```

## 获取帮助

如果你在贡献过程中遇到问题，可以通过以下方式获取帮助：

- **GitHub Discussions**：[提问](https://github.com/cloudplay/cloudplay/discussions)
- **Discord**：[加入社区](https://discord.gg/cloudplay)
- **Email**：dev@cloudplay.app

## 致谢

感谢所有为 CloudPlay 做出贡献的人！

[![Contributors](https://contrib.rocks/image?repo=cloudplay/cloudplay)](https://github.com/cloudplay/cloudplay/graphs/contributors)
