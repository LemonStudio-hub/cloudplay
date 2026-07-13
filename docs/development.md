# Development Guide

This guide covers setting up the development environment and contributing to CloudPlay.

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 18 | JavaScript runtime |
| [pnpm](https://pnpm.io/) | >= 8 | Package manager |
| [Rust](https://www.rust-lang.org/) | >= 1.70 | Desktop client backend |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Latest | Cloudflare CLI |
| [Git](https://git-scm.com/) | Latest | Version control |

### Optional Software

| Software | Purpose |
|----------|---------|
| [VS Code](https://code.visualstudio.com/) | Recommended IDE |
| [Docker](https://www.docker.com/) | Containerized development |
| [Postman](https://www.postman.com/) | API testing |

### VS Code Extensions

Recommended extensions for development:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue.js support
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) - Tauri support
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) - Rust support
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript linting
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatting
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind support

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/cloudplay/cloudplay.git
cd cloudplay
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Or install per project
cd cloudplay-backend && pnpm install
cd ../cloudplay-app && pnpm install
cd ../cloudplay-website && pnpm install
```

### 3. Configure Environment

#### Backend Worker

```bash
cd cloudplay-backend

# Create local environment file
cp .dev.vars.example .dev.vars

# Edit with your values
# ACCOUNT_ID=your_account_id
# TUNNEL_ID=your_tunnel_id
# CLOUDFLARE_API_TOKEN=your_api_token
```

#### Desktop Client

No additional configuration needed for development.

### 4. Start Development Servers

#### Option A: Start All Services

```bash
# From project root
pnpm run dev:all
```

#### Option B: Start Individual Services

```bash
# Terminal 1: Backend Worker
cd cloudplay-backend
pnpm run dev

# Terminal 2: Desktop Client
cd cloudplay-app
pnpm run tauri dev

# Terminal 3: Website
cd cloudplay-website
pnpm run dev
```

## Development Workflow

### Branch Strategy

```
main (production)
├── develop (development)
│   ├── feature/xxx
│   ├── fix/xxx
│   └── docs/xxx
└── release/x.x.x
```

### Creating a Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ...

# Commit changes
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Refactoring
- `perf`: Performance
- `test`: Tests
- `build`: Build system
- `ci`: CI/CD
- `chore`: Other

Examples:
```bash
git commit -m "feat(app): add dark mode"
git commit -m "fix(backend): resolve token expiration"
git commit -m "docs: update API documentation"
```

## Project Structure

### Backend Worker (`cloudplay-backend/`)

```
cloudplay-backend/
├── src/
│   ├── index.ts           # Main entry point
│   ├── routes/
│   │   └── token.ts       # Token routes
│   └── middleware/
│       └── rate-limiter.ts # Rate limiting
├── wrangler.toml          # Cloudflare config
├── tsconfig.json          # TypeScript config
└── package.json
```

### Desktop Client (`cloudplay-app/`)

```
cloudplay-app/
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   ├── lib.rs         # Tauri config
│   │   ├── commands/      # Tauri commands
│   │   ├── services/      # Business logic
│   │   └── models/        # Data structures
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── pages/             # Pages
│   ├── services/          # API services
│   ├── store/             # State management
│   └── styles/            # CSS
├── package.json
└── vite.config.ts
```

### Website (`cloudplay-website/`)

```
cloudplay-website/
├── src/
│   ├── components/        # Vue components
│   ├── App.vue            # Root component
│   ├── main.ts            # Entry point
│   └── style.css          # Global styles
├── public/                # Static assets
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Common Tasks

### Adding a New API Endpoint

1. **Create Route Handler**

```typescript
// src/routes/health.ts
import { Hono } from 'hono';

export const healthRoutes = new Hono();

healthRoutes.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
```

2. **Register Route**

```typescript
// src/index.ts
import { healthRoutes } from './routes/health';

app.route('/api', healthRoutes);
```

3. **Add Tests**

```typescript
// src/routes/health.test.ts
import { healthRoutes } from './health';

describe('Health Routes', () => {
  it('should return ok', async () => {
    const res = await healthRoutes.request('/health');
    const data = await res.json();
    expect(data.status).toBe('ok');
  });
});
```

### Adding a New Tauri Command

1. **Create Command**

```rust
// src-tauri/src/commands/my_command.rs
use tauri::command;

#[command]
pub async fn my_command(param: String) -> Result<String, String> {
    Ok(format!("Hello, {}!", param))
}
```

2. **Register Command**

```rust
// src-tauri/src/lib.rs
mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::my_command::my_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

3. **Call from Frontend**

```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke<string>('my_command', { param: 'World' });
console.log(result); // "Hello, World!"
```

### Adding a New Vue Component

1. **Create Component**

```vue
<!-- src/components/MyComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

const handleClick = () => {
  emit('update', props.count + 1);
};
</script>

<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>

<style scoped>
.my-component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
```

2. **Use Component**

```vue
<script setup lang="ts">
import MyComponent from './components/MyComponent.vue';
</script>

<template>
  <MyComponent title="Hello" @update="handleUpdate" />
</template>
```

## Testing

### Unit Tests

```bash
# Backend tests
cd cloudplay-backend
pnpm run test

# Frontend tests
cd cloudplay-app
pnpm run test

# Website tests
cd cloudplay-website
pnpm run test
```

### Integration Tests

```bash
# Run all integration tests
pnpm run test:integration
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm run test:e2e
```

### Test Coverage

```bash
# Generate coverage report
pnpm run test:coverage
```

## Debugging

### Backend Worker

```bash
# Start with debug logging
cd cloudplay-backend
pnpm run dev -- --log-level debug

# View logs
wrangler tail
```

### Desktop Client

```bash
# Start with debug logging
cd cloudplay-app
RUST_LOG=debug pnpm run tauri dev

# View Rust logs
# Logs appear in the terminal where you ran tauri dev
```

### Website

```bash
# Start with Vue DevTools
cd cloudplay-website
pnpm run dev

# Open browser DevTools
# Vue DevTools will be available as a tab
```

## Code Quality

### Linting

```bash
# Lint all code
pnpm run lint

# Lint specific project
cd cloudplay-backend
pnpm run lint
```

### Formatting

```bash
# Format all code
pnpm run format

# Format specific project
cd cloudplay-backend
pnpm run format
```

### Type Checking

```bash
# Type check all code
pnpm run type-check

# Type check specific project
cd cloudplay-backend
pnpm run type-check
```

## Performance Profiling

### Backend Worker

```bash
# Enable CPU profiling
cd cloudplay-backend
pnpm run dev -- --cpu-prof

# Analyze profile
# Use Chrome DevTools or VS Code to open .cpuprofile
```

### Desktop Client

```bash
# Enable Rust profiling
cd cloudplay-app
cargo instruments -t time pnpm run tauri dev
```

## Troubleshooting

### Common Issues

#### Port already in use

```bash
# Find process using port
lsof -i :8787

# Kill process
kill -9 <PID>
```

#### Module not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Rust compilation errors

```bash
# Clean build
cargo clean

# Update dependencies
cargo update
```

#### Tauri build fails

```bash
# Install system dependencies (Linux)
sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev

# Install system dependencies (macOS)
xcode-select --install
```

## Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Join our community chat
- **Email**: dev@cloudplay.app
- **Documentation**: Check the docs/ directory
