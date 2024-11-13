# AI Desktop Assistant

基于 Electron + React + TypeScript 的 AI 桌面助手，使用 Claude API 提供智能对话服务。

## 特性
- 智能对话
- 消息持久化
- 优雅的界面设计
- 实时响应
- 桌面控制功能 【新增】

## 技术栈
- Electron
- React
- TypeScript
- Claude API
- @nut-tree/nut-js 【新增】

## 更新日志

### 2024-03-12
- ✨ 集成桌面控制功能
- 🎨 添加爱心绘制演示
- 🔄 优化 IPC 通信
- 🐛 修复按钮位置重叠问题

### 2024-03-11
- 🎉 项目初始化
- ✨ 基础对话功能
- 💾 消息持久化
- 🎨 界面美化

## 开发说明

1. 基础架构
   - TypeScript 支持
   - Webpack 配置
   - Electron 环境
   - 热重载

2. 核心功能
   - 多行文本输入
   - API 集成
   - 消息展示
   - 加载状态

3. 安全性
   - API Key 环境变量化
   - .env 支持
   - .gitignore 完善

## 待开发功能
1. 性能优化 (P0)
   - 消息列表虚拟滚动
   - 大量消息性能优化
   - 构建优化

2. 用户体验 (P1)
   - 消息发送音效
   - 加载动画优化
   - 表情支持

3. 数据管理 (P1)
   - 消息持久化
   - 历史记录管理
   - 会话管理

## 开发规范
1. 代码规范
   - TypeScript 严格模式
   - 函数式组件
   - React Hooks
   - ESLint + Prettier

2. 样式规范
   - 主色：#007AFF
   - 背景：#f5f5f5
   - Flexbox 布局
   - 响应式设计

3. 安全规范
   - 环境变量管理
   - Electron 安全策略
   - API 访问控制