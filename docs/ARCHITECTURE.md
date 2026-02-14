# Turing Complete — 架构设计文档

## 概述

一个浏览器端的教育型解谜游戏，玩家从基础逻辑门开始，逐步搭建更复杂的数字电路，最终构建一台完整的计算机。

## 技术栈

- **语言**: TypeScript
- **UI 框架**: React 18+
- **渲染**: HTML5 Canvas (电路编辑器)
- **构建工具**: Vite
- **包管理**: pnpm
- **测试**: Vitest
- **代码风格**: ESLint + Prettier

## 核心模块

### 1. Circuit Engine（电路仿真引擎）

核心中的核心——纯逻辑层，无 UI 依赖。

```
src/engine/
├── Gate.ts          # 逻辑门基类 + 具体实现（NAND, AND, OR, NOT, XOR）
├── Wire.ts          # 连线（连接门的输入/输出）
├── Circuit.ts       # 电路容器（管理所有门和连线）
├── Simulator.ts     # 仿真器（信号传播、稳态检测）
└── types.ts         # 共享类型定义
```

**关键设计：**
- 每个 Gate 有 `inputs: Pin[]` 和 `outputs: Pin[]`
- Wire 连接一个 output Pin 到一个 input Pin
- Simulator 用拓扑排序做信号传播（组合电路无需时钟）
- 支持环路检测（防止无限循环）

### 2. Circuit Editor（电路编辑器 UI）

Canvas 上的可视化编辑体验。

```
src/editor/
├── Canvas.tsx       # 主画布组件
├── GateRenderer.ts  # 门的绘制逻辑
├── WireRenderer.ts  # 连线绘制（贝塞尔曲线）
├── Interaction.ts   # 拖拽、连线、选择等交互
├── Toolbar.tsx      # 工具栏（选择门类型）
└── Grid.ts          # 网格对齐系统
```

**关键设计：**
- 使用 Canvas 2D API 绘制，React 管状态
- 门和线的位置信息存在 Circuit 模型中
- 交互层处理鼠标事件，映射到 Circuit 操作

### 3. Level System（关卡系统）

```
src/levels/
├── Level.ts         # 关卡定义接口
├── LevelRunner.ts   # 关卡运行器（注入输入、验证输出）
├── levels/          # 具体关卡定义
│   ├── 01-not.ts
│   ├── 02-and.ts
│   ├── 03-or.ts
│   ├── ...
│   └── index.ts
└── LevelSelect.tsx  # 关卡选择界面
```

**关卡定义格式：**
```typescript
interface Level {
  id: string;
  name: string;
  description: string;
  availableGates: GateType[];     // 本关可用的门
  inputs: PinDefinition[];         // 输入引脚
  outputs: PinDefinition[];        // 期望输出引脚
  truthTable: TruthTableEntry[];   // 验证用的真值表
  hints?: string[];                // 可选提示
  unlocks?: string[];              // 通关后解锁的关卡
}
```

### 4. Save System（存档系统）

```
src/save/
├── SaveManager.ts   # 存档管理（序列化/反序列化）
└── Storage.ts       # localStorage 适配器
```

MVP 阶段用 localStorage，数据结构：
```typescript
interface SaveData {
  version: number;
  completedLevels: string[];
  circuits: Record<string, SerializedCircuit>;  // 每关的玩家方案
  settings: UserSettings;
}
```

### 5. App Shell（应用外壳）

```
src/
├── App.tsx          # 主应用路由
├── main.tsx         # 入口
├── pages/
│   ├── Home.tsx     # 首页
│   ├── Play.tsx     # 游戏主界面（编辑器 + 关卡信息）
│   └── LevelSelect.tsx
└── components/      # 共享 UI 组件
```

## 数据流

```
用户操作 → Interaction 层 → Circuit 模型更新 → Canvas 重绘
                                    ↓
                            Simulator 运行
                                    ↓
                          LevelRunner 验证 → 通过/失败反馈
```

## MVP 关卡规划

| # | 名称 | 目标 | 可用门 |
|---|------|------|--------|
| 1 | NOT | 实现非门 | NAND |
| 2 | AND | 实现与门 | NAND |
| 3 | OR | 实现或门 | NAND, NOT |
| 4 | XOR | 实现异或门 | NAND, AND, OR, NOT |
| 5 | Half Adder | 半加器 | 所有基础门 |
| 6 | Full Adder | 全加器 | 所有基础门 + Half Adder |
| 7 | 2-bit Adder | 2位加法器 | 所有 + Full Adder |

前几关只给 NAND 门，强迫玩家理解 NAND 是万能门——这是 Turing Complete 原版的核心教学理念。

## 开发顺序

1. **Phase 1**: Circuit Engine（纯逻辑，带测试）
2. **Phase 2**: Canvas 渲染 + 基础交互
3. **Phase 3**: 关卡系统 + 前 3 关
4. **Phase 4**: 存档 + 更多关卡 + 打磨
