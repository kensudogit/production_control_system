#!/bin/bash

# 生産管理システム テスト実行スクリプト
# Vitestを使用した高性能テスト環境

echo "🚀 生産管理システム テスト実行開始"
echo "=================================="

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

# 依存関係の確認
check_dependencies() {
    print_status "依存関係を確認中..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js がインストールされていません"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm がインストールされていません"
        exit 1
    fi
    
    print_success "依存関係の確認完了"
}

# パッケージのインストール
install_packages() {
    print_status "パッケージをインストール中..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        if [ $? -eq 0 ]; then
            print_success "パッケージのインストール完了"
        else
            print_error "パッケージのインストールに失敗しました"
            exit 1
        fi
    else
        print_status "パッケージは既にインストール済みです"
    fi
}

# テストの実行
run_tests() {
    local test_type=$1
    
    case $test_type in
        "unit")
            print_status "ユニットテストを実行中..."
            npm run test:run
            ;;
        "watch")
            print_status "ウォッチモードでテストを実行中..."
            npm run test:watch
            ;;
        "ui")
            print_status "テストUIを起動中..."
            npm run test:ui
            ;;
        "coverage")
            print_status "カバレッジテストを実行中..."
            npm run test:coverage
            ;;
        "bench")
            print_status "ベンチマークテストを実行中..."
            npm run test -- --bench
            ;;
        "all")
            print_status "全テストを実行中..."
            npm run test:run
            npm run test:coverage
            ;;
        *)
            print_error "不明なテストタイプ: $test_type"
            print_status "使用可能なオプション: unit, watch, ui, coverage, bench, all"
            exit 1
            ;;
    esac
}

# テスト結果の分析
analyze_results() {
    print_status "テスト結果を分析中..."
    
    if [ -f "test-results/results.json" ]; then
        local total_tests=$(cat test-results/results.json | jq '.numTotalTests')
        local passed_tests=$(cat test-results/results.json | jq '.numPassedTests')
        local failed_tests=$(cat test-results/results.json | jq '.numFailedTests')
        
        echo "📊 テスト結果サマリー:"
        echo "   総テスト数: $total_tests"
        echo "   成功: $passed_tests"
        echo "   失敗: $failed_tests"
        
        if [ "$failed_tests" -gt 0 ]; then
            print_warning "一部のテストが失敗しました"
        else
            print_success "すべてのテストが成功しました"
        fi
    fi
}

# パフォーマンスレポートの生成
generate_performance_report() {
    print_status "パフォーマンスレポートを生成中..."
    
    if [ -f "test-results/benchmark.json" ]; then
        echo "⚡ パフォーマンスレポート:"
        cat test-results/benchmark.json | jq '.results[] | {name: .name, duration: .duration}'
    fi
}

# メイン処理
main() {
    local test_type=${1:-"unit"}
    
    echo "テストタイプ: $test_type"
    echo ""
    
    # 依存関係の確認
    check_dependencies
    
    # パッケージのインストール
    install_packages
    
    # テストの実行
    run_tests $test_type
    
    # テスト結果の分析
    analyze_results
    
    # パフォーマンスレポートの生成
    generate_performance_report
    
    print_success "テスト実行完了"
}

# ヘルプの表示
show_help() {
    echo "生産管理システム テスト実行スクリプト"
    echo ""
    echo "使用方法:"
    echo "  ./test.sh [オプション]"
    echo ""
    echo "オプション:"
    echo "  unit     ユニットテストを実行 (デフォルト)"
    echo "  watch    ウォッチモードでテストを実行"
    echo "  ui       テストUIを起動"
    echo "  coverage カバレッジテストを実行"
    echo "  bench    ベンチマークテストを実行"
    echo "  all      全テストを実行"
    echo "  help     このヘルプを表示"
    echo ""
    echo "例:"
    echo "  ./test.sh unit"
    echo "  ./test.sh coverage"
    echo "  ./test.sh ui"
}

# スクリプトの実行
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
else
    main $1
fi

