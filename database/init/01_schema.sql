-- 生産管理システム データベーススキーマ
-- PostgreSQL 15+

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 全文検索用

-- ============================================
-- ユーザー・認証関連
-- ============================================

-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'operator', 'viewer')),
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- リフレッシュトークンテーブル
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- マスターデータ
-- ============================================

-- 製品マスタ
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_price DECIMAL(12, 2),
    unit_of_measure VARCHAR(20) DEFAULT '個',
    standard_lead_time INTEGER, -- 日数
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- 原材料マスタ
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_of_measure VARCHAR(20) DEFAULT 'kg',
    standard_cost DECIMAL(12, 2),
    supplier_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_materials_code ON materials(code);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_active ON materials(is_active);

-- 仕入先マスタ
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

-- 製品-原材料関連テーブル（BOM: Bill of Materials）
CREATE TABLE product_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 3) NOT NULL CHECK (quantity > 0),
    unit_of_measure VARCHAR(20),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, material_id, version)
);

CREATE INDEX idx_product_materials_product_id ON product_materials(product_id);
CREATE INDEX idx_product_materials_material_id ON product_materials(material_id);

-- ============================================
-- 生産計画管理
-- ============================================

-- 生産計画テーブル
CREATE TABLE production_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    actual_start_date DATE,
    actual_end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    CHECK (end_date >= start_date)
);

CREATE INDEX idx_production_plans_code ON production_plans(plan_code);
CREATE INDEX idx_production_plans_product_id ON production_plans(product_id);
CREATE INDEX idx_production_plans_status ON production_plans(status);
CREATE INDEX idx_production_plans_dates ON production_plans(start_date, end_date);
CREATE INDEX idx_production_plans_priority ON production_plans(priority);

-- 生産計画進捗履歴
CREATE TABLE production_plan_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES production_plans(id) ON DELETE CASCADE,
    progress_percentage INTEGER NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    produced_quantity INTEGER DEFAULT 0,
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recorded_by UUID REFERENCES users(id)
);

CREATE INDEX idx_production_plan_progress_plan_id ON production_plan_progress(plan_id);
CREATE INDEX idx_production_plan_progress_recorded_at ON production_plan_progress(recorded_at);

-- ============================================
-- 在庫管理
-- ============================================

-- 在庫テーブル
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('product', 'material', 'component')),
    item_id UUID NOT NULL, -- products.id or materials.id
    warehouse_location VARCHAR(100),
    quantity DECIMAL(12, 3) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity DECIMAL(12, 3) DEFAULT 0 CHECK (reserved_quantity >= 0),
    available_quantity DECIMAL(12, 3) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    unit_of_measure VARCHAR(20),
    min_stock_level DECIMAL(12, 3) DEFAULT 0,
    max_stock_level DECIMAL(12, 3),
    reorder_point DECIMAL(12, 3),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    UNIQUE(item_type, item_id, warehouse_location)
);

CREATE INDEX idx_inventory_item ON inventory(item_type, item_id);
CREATE INDEX idx_inventory_location ON inventory(warehouse_location);
CREATE INDEX idx_inventory_available ON inventory(available_quantity);
CREATE INDEX idx_inventory_reorder ON inventory(reorder_point) WHERE reorder_point IS NOT NULL;

-- 在庫トランザクション履歴
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer', 'reservation', 'release')),
    quantity DECIMAL(12, 3) NOT NULL,
    quantity_before DECIMAL(12, 3) NOT NULL,
    quantity_after DECIMAL(12, 3) NOT NULL,
    reference_type VARCHAR(50), -- 'production_plan', 'purchase_order', etc.
    reference_id UUID,
    notes TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_inventory_transactions_reference ON inventory_transactions(reference_type, reference_id);

-- ============================================
-- 工程管理
-- ============================================

-- 工程マスタ
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    standard_time_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_processes_code ON processes(code);
CREATE INDEX idx_processes_active ON processes(is_active);

-- 生産計画-工程関連
CREATE TABLE production_plan_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES production_plans(id) ON DELETE CASCADE,
    process_id UUID NOT NULL REFERENCES processes(id),
    sequence_order INTEGER NOT NULL,
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_production_plan_processes_plan_id ON production_plan_processes(plan_id);
CREATE INDEX idx_production_plan_processes_process_id ON production_plan_processes(process_id);
CREATE INDEX idx_production_plan_processes_status ON production_plan_processes(status);

-- ============================================
-- 品質管理
-- ============================================

-- 品質検査テーブル
CREATE TABLE quality_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES production_plans(id),
    inspection_type VARCHAR(50) NOT NULL CHECK (inspection_type IN ('incoming', 'in_process', 'final', 'random')),
    product_id UUID REFERENCES products(id),
    batch_number VARCHAR(50),
    inspected_quantity INTEGER NOT NULL,
    passed_quantity INTEGER DEFAULT 0 CHECK (passed_quantity >= 0),
    failed_quantity INTEGER DEFAULT 0 CHECK (failed_quantity >= 0),
    rework_quantity INTEGER DEFAULT 0 CHECK (rework_quantity >= 0),
    pass_rate DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN inspected_quantity > 0 
        THEN (passed_quantity::DECIMAL / inspected_quantity::DECIMAL * 100)
        ELSE 0 END
    ) STORED,
    inspection_date DATE NOT NULL,
    inspector_id UUID REFERENCES users(id),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quality_inspections_plan_id ON quality_inspections(plan_id);
CREATE INDEX idx_quality_inspections_product_id ON quality_inspections(product_id);
CREATE INDEX idx_quality_inspections_date ON quality_inspections(inspection_date);
CREATE INDEX idx_quality_inspections_type ON quality_inspections(inspection_type);

-- 品質不良詳細
CREATE TABLE quality_defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES quality_inspections(id) ON DELETE CASCADE,
    defect_type VARCHAR(100) NOT NULL,
    defect_code VARCHAR(50),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    severity VARCHAR(20) CHECK (severity IN ('minor', 'major', 'critical')),
    description TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quality_defects_inspection_id ON quality_defects(inspection_id);
CREATE INDEX idx_quality_defects_type ON quality_defects(defect_type);
CREATE INDEX idx_quality_defects_severity ON quality_defects(severity);

-- ============================================
-- 原価管理
-- ============================================

-- 原価計算テーブル
CREATE TABLE cost_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES production_plans(id) ON DELETE CASCADE,
    calculation_date DATE NOT NULL,
    material_cost DECIMAL(12, 2) DEFAULT 0,
    labor_cost DECIMAL(12, 2) DEFAULT 0,
    overhead_cost DECIMAL(12, 2) DEFAULT 0,
    other_cost DECIMAL(12, 2) DEFAULT 0,
    total_cost DECIMAL(12, 2) GENERATED ALWAYS AS (
        material_cost + labor_cost + overhead_cost + other_cost
    ) STORED,
    unit_cost DECIMAL(12, 2),
    budget_amount DECIMAL(12, 2),
    variance DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_cost_calculations_plan_id ON cost_calculations(plan_id);
CREATE INDEX idx_cost_calculations_date ON cost_calculations(calculation_date);

-- ============================================
-- 需要予測
-- ============================================

-- 需要予測テーブル
CREATE TABLE demand_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    forecast_date DATE NOT NULL,
    forecast_period VARCHAR(20) NOT NULL CHECK (forecast_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    forecasted_quantity INTEGER NOT NULL CHECK (forecasted_quantity >= 0),
    confidence_level DECIMAL(5, 2) CHECK (confidence_level >= 0 AND confidence_level <= 100),
    forecast_method VARCHAR(50), -- 'moving_average', 'exponential_smoothing', 'ml_model', etc.
    actual_quantity INTEGER,
    accuracy DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_demand_forecasts_product_id ON demand_forecasts(product_id);
CREATE INDEX idx_demand_forecasts_date ON demand_forecasts(forecast_date);
CREATE INDEX idx_demand_forecasts_period ON demand_forecasts(forecast_period);

-- ============================================
-- システムログ・監査
-- ============================================

-- アクティビティログ
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- トリガー関数（更新日時の自動更新）
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 更新日時自動更新トリガーの設定
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_plans_updated_at BEFORE UPDATE ON production_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_inspections_updated_at BEFORE UPDATE ON quality_inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_calculations_updated_at BEFORE UPDATE ON cost_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demand_forecasts_updated_at BEFORE UPDATE ON demand_forecasts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 初期データ（開発・テスト用）
-- ============================================

-- デフォルト管理者ユーザー（パスワード: admin123 - 本番環境では変更必須）
INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES
('admin', 'admin@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'システム管理者', 'admin', true),
('manager', 'manager@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'マネージャー', 'manager', true),
('operator', 'operator@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'オペレーター', 'operator', true);

-- サンプル製品
INSERT INTO products (code, name, description, category, unit_price, unit_of_measure, standard_lead_time) VALUES
('PROD-001', '製品A', '高品質製品A', 'Electronics', 10000.00, '個', 7),
('PROD-002', '製品B', '高性能製品B', 'Electronics', 15000.00, '個', 10),
('PROD-003', '製品C', '標準製品C', 'Electronics', 8000.00, '個', 5);

-- サンプル原材料
INSERT INTO materials (code, name, description, category, unit_of_measure, standard_cost) VALUES
('MAT-001', '原材料X', '基本原材料', 'Raw Material', 'kg', 500.00),
('MAT-002', '原材料Y', '高品質原材料', 'Raw Material', 'kg', 800.00),
('MAT-003', '部品Z', '電子部品', 'Component', '個', 200.00);

-- サンプル工程
INSERT INTO processes (code, name, description, standard_time_minutes) VALUES
('PROC-001', '準備工程', '生産準備', 30),
('PROC-002', '組立工程', '製品組立', 120),
('PROC-003', '検査工程', '品質検査', 60),
('PROC-004', '梱包工程', '製品梱包', 45);
