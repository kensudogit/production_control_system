#!/bin/bash
# コミット履歴からAPIキーを削除するスクリプト

echo "=========================================="
echo "コミット履歴からAPIキーを削除します"
echo "=========================================="
echo ""

# 現在のブランチを確認
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "現在のブランチ: $CURRENT_BRANCH"
echo ""

# 警告
echo "警告: この操作はコミット履歴を書き換えます。"
echo "続行する前に、リポジトリのバックアップを推奨します。"
echo ""

read -p "続行しますか？ (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "操作をキャンセルしました。"
    exit 1
fi

echo ""
echo "コミット履歴を修正しています..."

# git filter-branchを使用してAPIキーを含むファイルの履歴を修正
git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" \
    --prune-empty --tag-name-filter cat -- --all

if [ $? -eq 0 ]; then
    echo ""
    echo "コミット履歴の修正が完了しました。"
    echo ""
    echo "次のステップ:"
    echo "1. git push origin --force --all"
    echo "2. git push origin --force --tags"
    echo ""
    echo "注意: 強制プッシュは履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください。"
else
    echo ""
    echo "エラーが発生しました。"
    exit 1
fi
