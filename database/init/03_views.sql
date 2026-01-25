-- ビュー定義（よく使われるクエリの簡略化）

-- ダッシュボード統計ビュー
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM production_plans WHERE status = 'in_progress') as active_plans,
    (SELECT COUNT(*) FROM production_plans WHERE status = 'completed' AND end_date >= CURRENT_DATE - INTERVAL '30 days') as completed_plans_30d,
    (SELECT COUNT(*) FROM inventory WHERE available_quantity < reorder_point AND reorder_point IS NOT NULL) as low_stock_items,
    (SELECT AVG(pass_rate) FROM quality_inspections WHERE inspection_date >= CURRENT_DATE - INTERVAL '30 days') as avg_quality_rate_30d,
    (SELECT SUM(total_cost) FROM cost_calculations WHERE calculation_date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_total_cost;

-- 生産計画詳細ビュー
CREATE OR REPLACE VIEW production_plan_details AS
SELECT 
    pp.id,
    pp.plan_code,
    pp.name,
    pp.quantity,
    pp.start_date,
    pp.end_date,
    pp.status,
    pp.priority,
    pp.progress,
    p.code as product_code,
    p.name as product_name,
    u1.full_name as created_by_name,
    u2.full_name as updated_by_name,
    pp.created_at,
    pp.updated_at,
    CASE 
        WHEN pp.status = 'completed' THEN 0
        WHEN pp.end_date < CURRENT_DATE THEN EXTRACT(DAY FROM (CURRENT_DATE - pp.end_date))
        ELSE NULL
    END as days_overdue
FROM production_plans pp
LEFT JOIN products p ON pp.product_id = p.id
LEFT JOIN users u1 ON pp.created_by = u1.id
LEFT JOIN users u2 ON pp.updated_by = u2.id;

-- 在庫サマリービュー
CREATE OR REPLACE VIEW inventory_summary AS
SELECT 
    i.id,
    i.item_type,
    i.item_id,
    i.warehouse_location,
    i.quantity,
    i.reserved_quantity,
    i.available_quantity,
    i.min_stock_level,
    i.max_stock_level,
    i.reorder_point,
    CASE 
        WHEN i.item_type = 'product' THEN p.code
        WHEN i.item_type = 'material' THEN m.code
        ELSE NULL
    END as item_code,
    CASE 
        WHEN i.item_type = 'product' THEN p.name
        WHEN i.item_type = 'material' THEN m.name
        ELSE NULL
    END as item_name,
    CASE 
        WHEN i.reorder_point IS NOT NULL AND i.available_quantity <= i.reorder_point THEN 'low'
        WHEN i.max_stock_level IS NOT NULL AND i.available_quantity >= i.max_stock_level THEN 'high'
        ELSE 'normal'
    END as stock_status
FROM inventory i
LEFT JOIN products p ON i.item_type = 'product' AND i.item_id = p.id
LEFT JOIN materials m ON i.item_type = 'material' AND i.item_id = m.id;

-- 品質サマリービュー
CREATE OR REPLACE VIEW quality_summary AS
SELECT 
    qi.id,
    qi.plan_id,
    qi.inspection_type,
    qi.product_id,
    p.code as product_code,
    p.name as product_name,
    qi.inspected_quantity,
    qi.passed_quantity,
    qi.failed_quantity,
    qi.rework_quantity,
    qi.pass_rate,
    qi.inspection_date,
    u.full_name as inspector_name,
    qi.status,
    (SELECT COUNT(*) FROM quality_defects qd WHERE qd.inspection_id = qi.id) as defect_count
FROM quality_inspections qi
LEFT JOIN products p ON qi.product_id = p.id
LEFT JOIN users u ON qi.inspector_id = u.id;

-- 原価サマリービュー
CREATE OR REPLACE VIEW cost_summary AS
SELECT 
    cc.id,
    cc.plan_id,
    pp.plan_code,
    pp.name as plan_name,
    cc.calculation_date,
    cc.material_cost,
    cc.labor_cost,
    cc.overhead_cost,
    cc.other_cost,
    cc.total_cost,
    cc.unit_cost,
    cc.budget_amount,
    cc.variance,
    CASE 
        WHEN cc.budget_amount > 0 THEN 
            ROUND((cc.total_cost / cc.budget_amount - 1) * 100, 2)
        ELSE NULL
    END as variance_percentage
FROM cost_calculations cc
LEFT JOIN production_plans pp ON cc.plan_id = pp.id;
