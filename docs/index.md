---
hero:
  title: CL Dev Tool
  description: 企业级 React 业务组件库，基于 Ant Design 构建，专注于提供高质量、开箱即用的业务场景组件
  actions:
    - text: 快速开始 →
      link: /guide
      type: primary
    - text: 组件列表
      link: /components/approval-detail-button
features:
  - title: 🎨 设计精美
    description: 基于 Ant Design 5.x 设计规范，提供一致的视觉体验，完美融入企业级应用
  - title: 📦 开箱即用
    description: 精选业务场景组件，无需重复造轮子，安装即可使用，大幅提升开发效率
  - title: 🔧 TypeScript
    description: 使用 TypeScript 编写，提供完整的类型定义文件，智能提示，开发更安全
  - title: 🎯 业务导向
    description: 专注于真实业务场景，经过生产环境验证，解决实际开发痛点
  - title: ⚡️ 性能优异
    description: 优化的包大小，按需加载，Tree-shaking 支持，不影响应用性能
  - title: 🌍 国际化
    description: 内置国际化支持，轻松构建面向全球用户的应用
---

## 💡 为什么选择 CL Dev Tool？

在企业级应用开发中，我们常常需要处理复杂的业务逻辑，如审批流程、数据可视化、权限管理等。**CL Dev Tool** 提供了一系列经过实战检验的业务组件，帮助你：

- ✅ **节省时间**：无需从零开始，直接使用成熟的业务组件
- ✅ **保证质量**：经过严格测试，在生产环境中稳定运行
- ✅ **统一规范**：基于 Ant Design，保持设计和代码的一致性
- ✅ **持续迭代**：活跃的社区支持，快速响应需求和问题

## 🚀 快速开始

### 安装

使用你喜欢的包管理器安装：

```bash
# 使用 npm
npm install cl-dev-tool

# 使用 yarn
yarn add cl-dev-tool

# 使用 pnpm
pnpm add cl-dev-tool
```

### 使用

在你的项目中导入并使用组件：

```ts
import { ApprovalDetailButton } from 'cl-dev-tool';

// 在你的组件中使用
<ApprovalDetailButton
  code="YOUR_APPROVAL_CODE"
  systemCode="YOUR_SYSTEM_CODE"
  systemKey="YOUR_SYSTEM_KEY"
/>
```

## 📊 组件覆盖

目前已提供以下业务组件，更多组件正在开发中：

| 组件分类 | 组件名称             | 说明                           |
| -------- | -------------------- | ------------------------------ |
| 审批流程 | ApprovalDetailButton | 审批详情按钮，展示完整审批流程 |

## 🌐 浏览器支持

现代浏览器和 IE11（需要配置相应的 polyfills）。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Edge                                                                                                                                                                                                 | last 2 versions                                                                                                                                                                                                  | last 2 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                              |

## 🤝 参与贡献

我们欢迎所有形式的贡献，无论是新功能、bug 修复还是文档改进。请阅读我们的[贡献指南](https://github.com/ai520510xyf-del/cl-dev-tool/blob/main/CONTRIBUTING.md)了解更多。

## 📄 开源协议

本项目基于 [MIT](https://github.com/ai520510xyf-del/cl-dev-tool/blob/main/LICENSE) 协议开源。
