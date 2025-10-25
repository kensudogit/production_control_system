#!/bin/bash

# 生産管理システム Vercelデプロイスクリプト
# Vercelサーバーへの完全公開デプロイ

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 関数定義
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vercel CLIの確認
check_vercel_cli() {
    print_status "Vercel CLIを確認中..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI がインストールされていません"
        print_status "インストール中..."
        npm install -g vercel
    fi
    
    print_success "Vercel CLI の確認完了"
}

# プロジェクトの準備
prepare_project() {
    print_status "プロジェクトを準備中..."
    
    # フロントエンドのビルド
    cd frontend
    print_status "フロントエンドをビルド中..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "フロントエンドのビルドが完了しました"
    else
        print_error "フロントエンドのビルドに失敗しました"
        exit 1
    fi
    
    cd ..
}

# Vercelプロジェクトの初期化
init_vercel_project() {
    print_status "Vercelプロジェクトを初期化中..."
    
    # 既存のプロジェクトがあるかチェック
    if [ -f ".vercel/project.json" ]; then
        print_status "既存のVercelプロジェクトが見つかりました"
        return 0
    fi
    
    # 新しいプロジェクトを作成
    vercel --yes
    
    if [ $? -eq 0 ]; then
        print_success "Vercelプロジェクトの初期化が完了しました"
    else
        print_error "Vercelプロジェクトの初期化に失敗しました"
        exit 1
    fi
}

# 環境変数の設定
setup_environment_variables() {
    print_status "環境変数を設定中..."
    
    # 環境変数ファイルが存在するかチェック
    if [ -f "vercel.env" ]; then
        print_status "環境変数ファイルから設定を読み込み中..."
        
        # 環境変数を設定
        while IFS='=' read -r key value; do
            if [[ ! $key =~ ^#.*$ ]] && [[ -n $key ]]; then
                vercel env add $key production <<< $value
            fi
        done < vercel.env
        
        print_success "環境変数の設定が完了しました"
    else
        print_warning "環境変数ファイルが見つかりません"
    fi
}

# ドメインの設定
setup_domain() {
    local domain=$1
    
    if [ -n "$domain" ]; then
        print_status "カスタムドメインを設定中: $domain"
        
        vercel domains add $domain
        
        if [ $? -eq 0 ]; then
            print_success "カスタムドメインの設定が完了しました"
        else
            print_warning "カスタムドメインの設定に失敗しました"
        fi
    fi
}

# デプロイの実行
deploy_to_vercel() {
    local environment=$1
    
    print_status "Vercelにデプロイ中... (環境: $environment)"
    
    case $environment in
        "preview")
            vercel --prod=false
            ;;
        "production")
            vercel --prod
            ;;
        *)
            vercel
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        print_success "デプロイが完了しました"
        show_deployment_info
    else
        print_error "デプロイに失敗しました"
        exit 1
    fi
}

# デプロイ情報の表示
show_deployment_info() {
    print_status "デプロイ情報:"
    echo ""
    
    # デプロイURLを取得
    local deployment_url=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null)
    
    if [ -n "$deployment_url" ]; then
        echo "🌐 デプロイURL: https://$deployment_url"
        echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
        echo "📈 Analytics: https://vercel.com/analytics"
        echo ""
        
        # ブラウザで開く
        if command -v open &> /dev/null; then
            open "https://$deployment_url"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://$deployment_url"
        fi
    fi
}

# パフォーマンステスト
run_performance_test() {
    local url=$1
    
    if [ -n "$url" ]; then
        print_status "パフォーマンステストを実行中..."
        
        # Lighthouse CI を使用したパフォーマンステスト
        if command -v lhci &> /dev/null; then
            lhci autorun --upload.target=temporary-public-storage --collect.url=$url
        else
            print_warning "Lighthouse CI がインストールされていません"
        fi
    fi
}

# 監視の設定
setup_monitoring() {
    print_status "監視を設定中..."
    
    # Vercel Analytics の有効化
    vercel analytics enable
    
    # エラー監視の設定（Sentry等）
    if [ -n "$SENTRY_DSN" ]; then
        print_status "Sentry エラー監視を設定中..."
        # Sentry設定の実装
    fi
    
    print_success "監視の設定が完了しました"
}

# クリーンアップ
cleanup() {
    print_status "クリーンアップを実行中..."
    
    # 一時ファイルの削除
    rm -rf .vercel/tmp
    
    # ビルドキャッシュのクリア
    cd frontend
    rm -rf node_modules/.cache
    cd ..
    
    print_success "クリーンアップが完了しました"
}

# メイン処理
main() {
    local command=$1
    local option=$2
    
    case $command in
        "deploy")
            check_vercel_cli
            prepare_project
            init_vercel_project
            setup_environment_variables
            deploy_to_vercel $option
            setup_monitoring
            ;;
        "preview")
            check_vercel_cli
            prepare_project
            deploy_to_vercel "preview"
            ;;
        "production")
            check_vercel_cli
            prepare_project
            init_vercel_project
            setup_environment_variables
            deploy_to_vercel "production"
            setup_monitoring
            ;;
        "domain")
            setup_domain $option
            ;;
        "env")
            setup_environment_variables
            ;;
        "monitoring")
            setup_monitoring
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "不明なコマンド: $command"
            show_help
            exit 1
            ;;
    esac
}

# ヘルプの表示
show_help() {
    echo "生産管理システム Vercelデプロイスクリプト"
    echo ""
    echo "使用方法:"
    echo "  ./vercel-deploy.sh [コマンド] [オプション]"
    echo ""
    echo "コマンド:"
    echo "  deploy [env]     デプロイを実行 (preview/production)"
    echo "  preview          プレビューデプロイ"
    echo "  production       本番デプロイ"
    echo "  domain [name]    カスタムドメインを設定"
    echo "  env              環境変数を設定"
    echo "  monitoring       監視を設定"
    echo "  cleanup          クリーンアップを実行"
    echo "  help             このヘルプを表示"
    echo ""
    echo "例:"
    echo "  ./vercel-deploy.sh deploy preview"
    echo "  ./vercel-deploy.sh production"
    echo "  ./vercel-deploy.sh domain myapp.com"
    echo ""
    echo "前提条件:"
    echo "  - Vercel CLI がインストールされていること"
    echo "  - Vercel アカウントにログインしていること"
    echo "  - プロジェクトがGitリポジトリにコミットされていること"
}

# スクリプトの実行
if [ $# -eq 0 ]; then
    show_help
else
    main $1 $2
fi

