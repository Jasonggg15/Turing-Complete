# 用户数据存储方案

## 当前方案：localStorage
- 简单、同步、零依赖
- 容量限制 ~5-10MB（足够存所有关卡存档）
- 不跨浏览器/设备、清缓存会丢失

## 短期改进：多存档系统

### 设计
```
localStorage keys:
  tc_profiles          → ["Jason", "Guest", ...]
  tc_active_profile    → "Jason"
  tc_save_Jason        → { completedLevels, circuits, settings }
  tc_save_Guest        → { completedLevels, circuits, settings }
```

### 功能
- 最多 5 个存档槽位
- 新建/删除/切换存档
- 每个存档独立的进度和电路数据
- 主页 Options → Save Management

### 存档数据结构
```typescript
interface SaveProfile {
  name: string;
  createdAt: number;
  lastPlayedAt: number;
  completedLevels: string[];
  circuits: Record<string, SerializedCircuit>;
  settings: {
    volume: number;
    showGrid: boolean;
    wireColorDefault: string;
  };
  stats: {
    totalPlayTime: number;  // 秒
    levelsAttempted: number;
    totalGatesUsed: number;
  };
}
```

## 中期改进：导出/导入存档

### 设计
- **导出**：把存档序列化为 JSON 文件下载
- **导入**：上传 JSON 文件恢复存档
- 这样可以跨浏览器/设备迁移，不需要后端

### 使用场景
- 换电脑时迁移存档
- 分享电路给朋友
- 备份数据

## 长期改进：云同步（需要后端）

### 方案 A：Supabase（推荐）
- 免费层：500MB 数据库、1GB 存储、50K MAU
- 内置 Auth（GitHub/Google 登录）
- PostgreSQL + Realtime
- 代码量少，SDK 好用

### 方案 B：Firebase
- 免费层：1GB Firestore、10GB 带宽
- Auth + Firestore + Hosting
- Google 生态，文档多

### 方案 C：自建后端
- 不推荐，维护成本高
- 除非有特殊需求

## 推荐路线图
1. **v0.1（现在）**：localStorage 单存档 ✅
2. **v0.2**：多存档 + 导出/导入
3. **v0.3**：部署 Vercel + 分享链接
4. **v1.0**：云同步（Supabase）+ 用户账号

## 技术注意事项
- localStorage 是同步的，大量数据写入会阻塞主线程
- 考虑用 `requestIdleCallback` 延迟存档写入
- 或迁移到 IndexedDB（异步、容量更大）
- 序列化格式要版本化，方便未来迁移
