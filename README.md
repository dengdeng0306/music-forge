# Music Forge

让音乐爱好者像搭积木一样，通过拖拽可视化乐器、AI 辅助谱曲和作词，完成原创音乐创作的一站式平台。

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **状态管理**: Zustand
- **音频引擎**: Tone.js + Web Audio API
- **拖拽**: @dnd-kit/core
- **样式**: Tailwind CSS 4
- **存储**: IndexedDB (idb-keyval)
- **路由**: React Router 7

## 项目结构

```
src/
├── app/            # App 入口
├── audio/          # 音频引擎核心
│   ├── engine.ts   # AudioContext 管理
│   ├── instruments.ts  # 乐器音源管理
│   ├── transport.ts    # 播放传输控制
│   └── export.ts       # WAV/MIDI 导出
├── features/
│   ├── band/       # 乐器组合（拖拽可视化）
│   ├── composer/   # 谱曲（钢琴卷帘 + 和弦）
│   ├── lyrics/     # 作词编辑器
│   └── templates/  # 风格模板
├── pages/          # 路由页面
├── shared/
│   ├── components/ # 通用 UI 组件
│   ├── hooks/      # 自定义 Hooks
│   ├── types/      # 共享类型定义
│   └── utils/      # 工具函数
└── styles/         # 全局样式
```

## 快速开始

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

## MVP 功能

- [x] 拖拽乐器卡片组建虚拟乐队（16 种乐器，8 个类别）
- [x] 6 套风格模板（流行/民谣/电子/嘻哈/摇滚/R&B）
- [x] 钢琴卷帘谱曲 + 智能和弦推荐
- [x] 歌词编辑器
- [x] 工程自动保存（IndexedDB）
- [x] WAV/MIDI 导出
- [ ] 用户手势启动 AudioContext
- [ ] 音节-旋律对齐
- [ ] AI 歌词生成
- [ ] 分享链接
- [ ] 移动端适配
