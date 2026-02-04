#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "git 未安装，请先安装 git。"
  exit 1
fi

if [ ! -f package.json ]; then
  echo "未找到 package.json，请在项目根目录执行。"
  exit 1
fi

REMOTE_URL="${1:-}"
if [ -z "$REMOTE_URL" ]; then
  read -rp "请输入 GitHub 仓库 URL (https://github.com/<user>/<repo>.git): " REMOTE_URL
fi

if [ -z "$REMOTE_URL" ]; then
  echo "需要提供仓库 URL。"
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

git branch -M main

git add .
if ! git diff --cached --quiet; then
  git commit -m "deploy: pokemon td demo"
else
  echo "暂无变更可提交。"
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git push -u origin main

echo "\n已推送到远程仓库：$REMOTE_URL"

if command -v vercel >/dev/null 2>&1; then
  echo "检测到 Vercel CLI，开始部署..."
  vercel --prod
else
  echo "未检测到 Vercel CLI。"
  echo "请打开 https://vercel.com/new 并导入该仓库完成部署。"
fi
