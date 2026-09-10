# 记账 app

一个桌面记账应用，运行在 Windows 和 Mac 电脑上，帮你记录每一笔人民币的收入和支出。

## 功能

- **记一笔**：快速记录一笔收入或支出，选择分类（一级大类 + 二级小类）
- **账单**：按时间查看所有流水
- **统计**：直观看到收入、支出的分布情况

## 技术栈

- [Electron](https://www.electronjs.org/) —— 桌面应用框架
- [Vue 3](https://vuejs.org/) —— 界面
- [electron-vite](https://electron-vite.org/) —— 构建工具
- 数据本地保存为 JSON 文件（纯文本，好备份、好查看）

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 18 及以上版本

### 安装依赖

```bash
npm install
```

### 开发模式（改代码自动刷新）

```bash
npm run dev
```

> 注意：如果通过 Claude Code 启动，需要取消 `ELECTRON_RUN_AS_NODE` 变量并关闭沙箱，详见 `CLAUDE.md`。

## 打包

- Windows 安装包：

  ```bash
  npm run build:win
  ```

- Mac 安装包（需在 Mac 电脑上执行）：

  ```bash
  npm run build:mac
  ```

打包结果输出在 `dist/` 目录。

## 数据存储

所有记账数据保存在本地系统「用户数据目录」下的 `data.json` 文件中（不是放在代码里），方便你随时备份。数据文件位置可通过应用内「获取数据路径」功能查看。

## 项目结构

```
├── src/
│   ├── main/            # 主进程（Electron 后端）
│   │   ├── index.js     # 窗口创建、IPC 通信
│   │   └── store.js     # 数据读写（JSON）
│   ├── preload/         # 预加载脚本
│   └── renderer/        # 界面（Vue 3）
│       └── src/
│           ├── components/
│           │   ├── AddRecord.vue   # 记一笔
│           │   ├── BillList.vue    # 账单
│           │   └── Stats.vue       # 统计
│           └── categories.js       # 分类体系
├── scripts/             # 图标生成等脚本
├── docs/                # 产品文档、界面设计
└── build/               # 应用图标等构建资源
```

## 相关文档

- [产品文档](docs/产品文档.md)
- [界面设计](docs/界面设计.md)
