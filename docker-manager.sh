#!/bin/bash

# 生産管理システム Docker管理スクリプト
# Docker環境の構築、起動、停止、管理を行う

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

# Docker環境の確認
check_docker() {
    print_status "Docker環境を確認中..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker がインストールされていません"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose がインストールされていません"
        exit 1
    fi
    
    # Docker デーモンの確認
    if ! docker info &> /dev/null; then
        print_error "Docker デーモンが起動していません"
        exit 1
    fi
    
    print_success "Docker環境の確認完了"
}

# 環境変数ファイルの設定
setup_env() {
    print_status "環境変数ファイルを設定中..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "環境変数ファイルを作成しました"
        else
            print_warning "環境変数ファイルが見つかりません"
        fi
    else
        print_status "環境変数ファイルは既に存在します"
    fi
}

# イメージのビルド
build_images() {
    print_status "Dockerイメージをビルド中..."
    
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        print_success "イメージのビルドが完了しました"
    else
        print_error "イメージのビルドに失敗しました"
        exit 1
    fi
}

# サービスの起動
start_services() {
    local mode=$1
    
    print_status "サービスを起動中... (モード: $mode)"
    
    case $mode in
        "dev")
            docker-compose -f docker-compose.dev.yml up -d
            ;;
        "prod")
            docker-compose up -d
            ;;
        *)
            docker-compose up -d
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        print_success "サービスの起動が完了しました"
        show_services_status
    else
        print_error "サービスの起動に失敗しました"
        exit 1
    fi
}

# サービスの停止
stop_services() {
    print_status "サービスを停止中..."
    
    docker-compose down
    
    if [ $? -eq 0 ]; then
        print_success "サービスの停止が完了しました"
    else
        print_error "サービスの停止に失敗しました"
        exit 1
    fi
}

# サービスの再起動
restart_services() {
    print_status "サービスを再起動中..."
    
    docker-compose restart
    
    if [ $? -eq 0 ]; then
        print_success "サービスの再起動が完了しました"
    else
        print_error "サービスの再起動に失敗しました"
        exit 1
    fi
}

# サービス状態の表示
show_services_status() {
    print_status "サービス状態:"
    echo ""
    docker-compose ps
    echo ""
    
    print_status "アクセス可能なサービス:"
    echo "  🌐 フロントエンド: http://localhost:3000"
    echo "  🔌 API Gateway: http://localhost:8080"
    echo "  📊 Grafana: http://localhost:3001 (admin/admin)"
    echo "  📈 Prometheus: http://localhost:9090"
    echo "  🔍 Kibana: http://localhost:5601"
    echo ""
}

# ログの表示
show_logs() {
    local service=$1
    
    if [ -n "$service" ]; then
        print_status "$service のログを表示中..."
        docker-compose logs -f $service
    else
        print_status "全サービスのログを表示中..."
        docker-compose logs -f
    fi
}

# データベースの初期化
init_database() {
    print_status "データベースを初期化中..."
    
    # PostgreSQLコンテナが起動するまで待機
    docker-compose exec -T postgres pg_isready -U production_user -d production_control
    
    if [ $? -eq 0 ]; then
        print_success "データベースの初期化が完了しました"
    else
        print_error "データベースの初期化に失敗しました"
        exit 1
    fi
}

# クリーンアップ
cleanup() {
    print_status "クリーンアップを実行中..."
    
    # 停止したコンテナの削除
    docker-compose down -v
    
    # 未使用のイメージの削除
    docker image prune -f
    
    # 未使用のボリュームの削除
    docker volume prune -f
    
    print_success "クリーンアップが完了しました"
}

# ヘルスチェック
health_check() {
    print_status "ヘルスチェックを実行中..."
    
    # 各サービスのヘルスチェック
    services=("frontend" "api-gateway" "postgres" "redis")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            print_success "$service: 正常"
        else
            print_error "$service: 異常"
        fi
    done
}

# バックアップ
backup_data() {
    local backup_dir="./backups/$(date +%Y%m%d_%H%M%S)"
    
    print_status "データをバックアップ中... ($backup_dir)"
    
    mkdir -p $backup_dir
    
    # PostgreSQL バックアップ
    docker-compose exec -T postgres pg_dump -U production_user production_control > $backup_dir/postgres_backup.sql
    
    # Redis バックアップ
    docker-compose exec -T redis redis-cli BGSAVE
    docker cp $(docker-compose ps -q redis):/data/dump.rdb $backup_dir/redis_backup.rdb
    
    print_success "バックアップが完了しました: $backup_dir"
}

# メイン処理
main() {
    local command=$1
    local option=$2
    
    case $command in
        "build")
            check_docker
            setup_env
            build_images
            ;;
        "start")
            check_docker
            setup_env
            start_services $option
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_services_status
            ;;
        "logs")
            show_logs $option
            ;;
        "init-db")
            init_database
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            health_check
            ;;
        "backup")
            backup_data
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
    echo "生産管理システム Docker管理スクリプト"
    echo ""
    echo "使用方法:"
    echo "  ./docker-manager.sh [コマンド] [オプション]"
    echo ""
    echo "コマンド:"
    echo "  build            Dockerイメージをビルド"
    echo "  start [mode]     サービスを起動 (dev/prod)"
    echo "  stop             サービスを停止"
    echo "  restart          サービスを再起動"
    echo "  status           サービス状態を表示"
    echo "  logs [service]   ログを表示"
    echo "  init-db          データベースを初期化"
    echo "  cleanup          クリーンアップを実行"
    echo "  health           ヘルスチェックを実行"
    echo "  backup           データをバックアップ"
    echo "  help             このヘルプを表示"
    echo ""
    echo "例:"
    echo "  ./docker-manager.sh build"
    echo "  ./docker-manager.sh start dev"
    echo "  ./docker-manager.sh logs frontend"
    echo "  ./docker-manager.sh status"
}

# スクリプトの実行
if [ $# -eq 0 ]; then
    show_help
else
    main $1 $2
fi

