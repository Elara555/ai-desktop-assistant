# AI Desktop Assistant

基于 Electron + React + TypeScript 的 AI 桌面助手，使用 Claude API 提供智能对话服务。

## 项目结构
```
ai-desktop-assistant/
├── src/                          # 源代码目录
│   ├── main/                     # Electron 主进程 (仅支持 .js)
│   │   ├── services/
│   │   │   └── DesktopControlMain.js    # 桌面控制实现
│   │   └── ipc/
│   │       └── desktop.js        # IPC 通信处理
│   ├── services/                 # 渲染进程服务
│   │   ├── api.ts               # Claude API 服务
│   │   ├── DesktopControlService.ts  # 桌面控制服务
│   │   ├── MessageStorage.ts    # 消息存储服务
│   │   ├── test-desktop-control.ts  # 桌面控制测试
│   │   └── types.ts               # 类型定义
│   ├── components/              # React 组件
│   │   ├── ChatInput.tsx       # 聊天输入组件
│   │   ├── ChatMessage.tsx     # 消息气泡组件
│   │   └── DateDivider.tsx     # 日期分割线组件
│   ├── styles/                  # 样式文件
│   │   ├── App.css             # 应用样式
│   │   ├── ChatInput.css       # 输入组件样式
│   │   ├── ChatMessage.css     # 消息样式
│   │   ├── DateDivider.css     # 日期分割线样式
│   │   └── global.css          # 全局样式
│   └── App.tsx                  # 主应用组件
├── index.html                   # 主页面 HTML
├── index.js                     # Electron 入口文件
├── renderer.js                  # React 渲染入口
├── .babelrc                     # Babel 配置
├── .env                         # 环境变量
├── .env.example                 # 环境变量示例
├── package.json                 # 项目配置
├── tsconfig.json               # TypeScript 配置
└── webpack.config.js           # Webpack 配置
```

## 核心文件说明

### 主进程 (main/)
- `DesktopControlMain.js`: 实现具体的桌面控制功能
  - 截图、鼠标控制、键盘输入等
  - 只能使用 JavaScript
  - 依赖 @nut-tree/nut-js

- `desktop.js`: 处理 IPC 通信
  - 注册 IPC 处理器
  - 转发渲染进程请求
  - 返回操作结果

### 渲染进程服务 (services/)
- `api.ts`: Claude API 集成
  - 处理 API 请求
  - 消息格式转换
  - 工具调用处理

- `DesktopControlService.ts`: 桌面控制服务
  - 封装 IPC 调用
  - 处理工具请求
  - 格式化返回结果

- `MessageStorage.ts`: 消息管理
  - 本地存储
  - 历史记录
  - 消息格式化

### 入口文件
- `index.js`: Electron 主进程入口
  - 创建主窗口
  - 设置 IPC 通信
  - 配置热重载

- `renderer.js`: React 渲染入口
  - 挂载 React 应用
  - 启动渲染进程

### 配置文件
- `package.json`: 项目配置
  - 依赖管理
  - 启动脚本
  - 开发工具

- `tsconfig.json`: TypeScript 配置
  - 编译选项
  - 路径映射
  - 类型检查

- `webpack.config.js`: Webpack 配置
  - 构建流程
  - 加载器配置
  - 环境变量

- `.babelrc`: Babel 配置
  - 语法转换
  - React 支持
  - TypeScript 支持

### 类型定义 (services/types.ts)
- API 相关类型
  - 请求响应格式
  - 消息结构
  - API 配置

- 桌面控制类型
  - 操作类型
  - 输入参数
  - 返回结果

- 消息类型
  - 存储格式
  - 展示格式
  - 工具响应


## 开发建议
1. 类型定义迁移
   - 按功能拆分类型
   - 统一从 types.ts 导出  

2. 代码组织
   - 主进程代码保持简单
   - 复杂逻辑放在渲染进程
   - 通过 IPC 通信

## 开发注意事项 ⚠️
1. 主进程代码限制
   - main/ 目录下只能使用 .js 文件
   - 不支持 TypeScript
   - 需要使用 CommonJS 模块系统

2. 代码修改原则
   - 保持现有稳定功能代码不变
   - 新功能以叠加方式开发
   - 避免大规模重构

3. 类型定义管理
   - 所有类型定义集中在 types.ts
   - 避免在业务代码中直接定义类型

4. IPC 通信
   - 主进程和渲染进程通过 IPC 通信
   - 保持现有 IPC 通道命名规范
   - 避免重复注册 IPC 处理器

5. 日志调试
   - 主进程日志在终端显示
   - 渲染进程日志在浏览器控制台
   - 区分不同进程的日志来源

## 技术栈
- Electron (主进程)
- React + TypeScript (渲染进程)
- @nut-tree/nut-js (桌面控制)
- Claude API (AI 对话)

## 已实现功能
1. 基础架构
   - ✅ 主进程渲染进程分离
   - ✅ IPC 通信架构
   - ✅ 热重载支持

2. 对话功能
   - ✅ Claude API 集成
   - ✅ 消息持久化
   - ✅ 实时响应

3. 桌面控制
   - ✅ 截图功能
   - ✅ 鼠标控制
   - ✅ 键盘输入

...(其他功能可以继续添加)...

## 开发流程

### 1. 环境准备
```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 ANTHROPIC_API_KEY
```

### 2. 开发命令
```bash
# 启动开发环境
npm start  # 同时启动 Electron 和 webpack

# 测试桌面控制
npm run test:desktop
```

### 3. 调试方法
- 主进程日志：终端控制台
- 渲染进程日志：浏览器开发工具 (F12)
- IPC 通信：两端日志对照

### 4. 功能开发流程
1. 确认需求和技术方案
2. 在现有代码基础上叠加功能
3. 保持原有功能稳定性
4. 完善文档和注释

## 当前开发计划

### 1. 截图功能增强 【进行中】
- [x] 基础截图功能
- [x] 截图文件保存
- [ ] 截图 base64 返回给 API
- [ ] 截图预览展示

### 2. 桌面控制优化
- [x] 鼠标移动
- [x] 鼠标点击
- [x] 键盘输入
- [ ] 连续操作支持

### 3. UI/UX 改进
- [ ] 操作反馈优化
- [ ] 加载动画美化
- [ ] 错误提示优化

## 常见问题 (FAQ)

### 1. 主进程报错
- 检查 main/ 目录是否使用 .js 文件
- 确认 IPC 通道注册正确
- 查看 electron-reloader 配置

### 2. 渲染进程报错
- 检查 TypeScript 类型定义
- 确认组件属性传递正确
- 查看 webpack 构建日志

### 3. 桌面控制问题
- 确认系统权限设置
- 检查 @nut-tree/nut-js 版本
- 查看具体错误信息

## 版本历史
- v0.2.0 (2024-11-15)
  - 完整桌面控制功能
  - 优化操作展示
- v0.1.0 (2024-11-11)
  - 项目初始化
  - 基础对话功能

## 测试指南

### 1. 桌面控制测试
```bash
# 运行桌面控制测试
npm run test:desktop
```

测试文件位置：`src/services/test-desktop-control.ts`

主要测试功能：
- 截图功能
- 鼠标移动
- 键盘输入
- 错误处理

测试时注意：
1. 确保应用已经启动
2. 观察控制台输出
3. 检查截图保存位置
4. 注意鼠标移动范围

### 2. 添加新测试
如果要测试新功能，在 `test-desktop-control.ts` 中添加新的测试用例：

## 开发经验总结

### 1. 类型定义管理
- 小型项目使用单一 types.ts
  - 避免复杂依赖
  - 维护成本低
  - 代码更稳定
- 大型项目才考虑拆分
  - 按模块拆分
  - 处理好类型依赖
  - 保持结构清晰