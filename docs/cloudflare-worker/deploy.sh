#!/bin/bash

# Cloudflare Worker 部署脚本 (Linux/Mac)
# 小米 Mimo API 代理

echo "========================================"
echo "  Cloudflare Worker 部署脚本"
echo "  小米 Mimo API 代理"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Wrangler
echo -e "${YELLOW}[1/4]${NC} 检查 Wrangler 是否安装..."
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ 未找到 Wrangler${NC}"
    echo "请先安装: npm install -g wrangler"
    exit 1
fi
echo -e "${GREEN}✅ Wrangler 已安装${NC}"
echo ""

# 检查登录状态
echo -e "${YELLOW}[2/4]${NC} 检查登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ 未登录 Cloudflare${NC}"
    echo "请运行: wrangler login"
    exit 1
fi
echo -e "${GREEN}✅ 已登录 Cloudflare${NC}"
echo ""

# 部署
echo -e "${YELLOW}[3/4]${NC} 部署 Worker..."
echo "正在部署到 Cloudflare..."
if wrangler deploy; then
    echo -e "${GREEN}✅ 部署成功！${NC}"
else
    echo -e "${RED}❌ 部署失败${NC}"
    exit 1
fi
echo ""

# 获取 URL
echo -e "${YELLOW}[4/4]${NC} 获取 Worker URL..."
echo ""
echo "========================================"
echo "  ✅ 部署完成！"
echo "========================================"
echo ""
echo "请查看上面的输出，找到类似这样的 URL:"
echo "  https://xiaomimimo-proxy.your-subdomain.workers.dev"
echo ""
echo "然后在 Mark2Web 设置中使用此 URL 作为 Proxy URL"
echo ""
echo "========================================"
echo ""
echo "下一步："
echo "  1. 复制上面的 Worker URL"
echo "  2. 打开 Mark2Web"
echo "  3. 进入 设置 → 模型服务商 → 小米 Mimo"
echo "  4. 粘贴 URL 到 Proxy URL 字段"
echo "  5. 填写 API Key"
echo "  6. 测试连接"
echo ""
