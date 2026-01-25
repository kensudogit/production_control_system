-- 追加インデックスとパフォーマンス最適化

-- 複合インデックス（よく使われるクエリパターン用）
CREATE INDEX IF NOT EXISTS idx_production_plans_status_dates 
    ON production_plans(status, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date_type 
    ON inventory_transactions(transaction_date DESC, transaction_type);

CREATE INDEX IF NOT EXISTS idx_quality_inspections_plan_date 
    ON quality_inspections(plan_id, inspection_date DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date 
    ON activity_logs(user_id, created_at DESC);

-- 全文検索用インデックス（GIN）
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_materials_name_trgm ON materials USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_production_plans_name_trgm ON production_plans USING gin(name gin_trgm_ops);

-- パーティショニング（大量データ用 - オプション）
-- ログテーブルを月単位でパーティショニングする場合の例
-- CREATE TABLE activity_logs_2024_01 PARTITION OF activity_logs
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
