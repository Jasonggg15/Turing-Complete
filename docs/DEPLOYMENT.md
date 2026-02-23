# 部署方案

## 推荐：Vercel（首选）

### 为什么选 Vercel
- **零配置部署**：连接 GitHub 仓库，push 即部署
- **免费额度充足**：Hobby plan 每月 100GB 带宽，足够朋友游玩
- **全球 CDN**：边缘节点分布广，亚洲访问速度好
- **自动 HTTPS**：免费 SSL 证书
- **Preview Deployments**：每个 PR 自动生成预览链接
- **Vite 原生支持**：自动检测 Vite 项目，零配置

### 部署步骤
1. 访问 [vercel.com](https://vercel.com)，用 GitHub 登录
2. Import `Jasonggg15/Turing-Complete` 仓库
3. Framework Preset 选 `Vite`
4. 点击 Deploy
5. 完成！访问 `https://turing-complete-xxx.vercel.app`

### 自定义域名（可选）
- 免费绑定自定义域名（如 `turingcomplete.jasonggg.com`）
- Vercel 自动配置 DNS + SSL

---

## 备选方案

### Netlify
- 类似 Vercel，也是零配置
- 免费额度：100GB/月带宽，300分钟构建/月
- 优势：表单处理、Identity（如果未来要登录）
- 劣势：亚洲节点不如 Vercel 多

### GitHub Pages
- 完全免费，无带宽限制
- 需要配置 `vite.config.ts` 的 `base` 路径
- 不支持 SPA 路由（需要 404.html hack）
- 适合简单静态站，对我们的 SPA 不太理想

### Cloudflare Pages
- 免费额度无限带宽
- 全球 CDN 性能极好
- 支持 SPA，零配置
- 也是一个很好的选择

---

## 部署配置

### vite.config.ts 调整（如果需要）
```typescript
export default defineConfig({
  // Vercel 不需要特殊配置
  // GitHub Pages 需要: base: '/Turing-Complete/'
  plugins: [react()],
})
```

### 环境变量
当前项目是纯前端，不需要环境变量。

### 构建命令
```bash
pnpm install
pnpm build
# 输出目录: dist/
```

---

## 推荐行动
1. **立即**：部署到 Vercel，获得一个可分享的链接
2. **之后**：考虑自定义域名
3. **未来**：如果需要后端（用户账号、云存档），Vercel 也支持 Serverless Functions
