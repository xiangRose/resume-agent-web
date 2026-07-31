# 海投简历 Agent（基于腾讯混元 Hy3）

一个面向求职场景的 Web AI 助手，**默认使用腾讯混元 Hy3**（TokenHub OpenAI 兼容接口），帮助求职者完成简历优化、岗位匹配分析和求职信撰写。

> 本项目为「2026 犀牛鸟开源人才培养活动 · Part B：用 Hy3 做一个小作品」的展示样例。  
> 通过真实 Web 产品形态，演示 Hy3 的**复杂推理**、**长文生成**与**多轮对话**能力。

## Hy3 能力展示

| Hy3 能力 | 在本项目中的体现 |
|---------|----------------|
| 复杂推理 | 分析 JD 与简历的匹配度，输出差距清单与优化建议 |
| 长文生成 | 按目标岗位改写简历段落、生成个性化求职信 |
| 长上下文 | 支持粘贴完整简历 + JD，多轮追问细化方案 |
| 多 Agent 角色 | 预置 4 个求职专项 Agent，各有独立 System Prompt |

> **说明**：Hy3 模式为纯文本对话（用户粘贴简历/JD 内容），不访问本地文件系统。  
> 若需 Agent 自动读取本地 PDF/Word 文件，可切换为 CodeBuddy 模式。

## 特性

- 💬 **流式对话** - 实时显示 Hy3 回复
- 📝 **会话管理** - 多会话切换和 SQLite 持久化
- 🤖 **求职专项 Agent** - 海投总助 / 简历优化师 / 求职信生成器 / 岗位匹配官
- 🎨 **主题切换** - 支持深色/浅色主题
- 🔄 **可切换模型** - 默认 Hy3，也可切换 CodeBuddy / DeepSeek

## 技术栈

- **AI（默认）**: 腾讯混元 Hy3（`hy3` / `hy3-preview`，TokenHub OpenAI 兼容接口）
- **后端**: Node.js + Express + TypeScript
- **前端**: React 18 + TypeScript + Vite
- **UI**: TDesign React
- **数据库**: SQLite (better-sqlite3)

## 快速开始（Hy3 模式）

### 1. 获取 API Key

在 [腾讯云 TokenHub 控制台](https://tokenhub.cloud.tencent.com) 创建 API Key。

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
MODEL_PROVIDER=hunyuan
HUNYUAN_API_KEY=你的_API_Key
```

也可在应用「设置」页中直接填入 Key（仅当前进程有效）。

### 3. 安装并启动

```bash
npm install
npm run dev
```

- 前端：http://127.0.0.1:5173
- 后端 API：http://localhost:3001（若 3000 端口被占用）

### 4. 体验示例

1. 选择「岗位匹配官」Agent
2. 粘贴一段简历 + 目标岗位 JD
3. 发送：「请分析匹配度，给出差距清单和 3 条优化建议」

## 模型提供方

通过环境变量 `MODEL_PROVIDER` 切换：

| 提供方 | 值 | 鉴权 | 文件读写 | 说明 |
|--------|------|------|----------|------|
| **腾讯混元 Hy3（默认）** | `hunyuan` | `HUNYUAN_API_KEY` | ❌ | 纯文本对话，演示推理 + 长文生成 |
| CodeBuddy | `codebuddy` | `CODEBUDDY_API_KEY` | ✅ | Agent SDK，可读取本地简历/JD 文件 |
| DeepSeek | `deepseek` | `DEEPSEEK_API_KEY` | ❌ | 纯文本对话 |

## 项目结构

```
resume-agent-web/
├── server/                 # 后端服务
│   ├── index.ts           # Express + Hy3 流式转发
│   └── db.ts              # SQLite 数据层
├── src/                   # React 前端
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── config.ts
├── data/chat.db           # 会话数据库（本地，不提交）
├── README.md
└── package.json
```

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/config` | GET | 当前模型提供方配置 |
| `/api/check-login` | GET | 检查 API Key 配置状态 |
| `/api/models` | GET | 获取可用模型列表 |
| `/api/sessions` | GET/POST | 会话列表 / 创建 |
| `/api/sessions/:id` | GET/PATCH/DELETE | 会话详情 / 更新 / 删除 |
| `/api/chat` | POST | 发送消息（SSE 流式响应） |

## 提交 Part B 清单

- [ ] 配置 `HUNYUAN_API_KEY` 并验证 Hy3 对话正常
- [ ] 录制 ≤1 分钟 Demo 视频
- [ ] 将 Demo 视频链接写入 README
- [ ] 推送至公开 GitHub 仓库
- [ ] 向 `Tencent-Hunyuan/Hy3` 的 `rhinobird2026` 分支提交 PR

## 开发

```bash
npm run dev          # 同时启动前后端
npm run dev:server   # 仅后端
npm run dev:client   # 仅前端
npm run build        # 构建生产版本
```

## 二次开发

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## License

MIT
