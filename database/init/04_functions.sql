-- ストアドプロシージャと関数

-- 在庫数量更新関数（トランザクション安全）
CREATE OR REPLACE FUNCTION update_inventory_quantity(
    p_inventory_id UUID,
    p_transaction_type VARCHAR(20),
    p_quantity DECIMAL(12, 3),
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    new_quantity DECIMAL(12, 3)
) AS $$
DECLARE
    v_current_quantity DECIMAL(12, 3);
    v_new_quantity DECIMAL(12, 3);
BEGIN
    -- 現在の数量を取得
    SELECT quantity INTO v_current_quantity
    FROM inventory
    WHERE id = p_inventory_id
    FOR UPDATE; -- ロックを取得
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, '在庫レコードが見つかりません', NULL::DECIMAL;
        RETURN;
    END IF;
    
    -- 数量を計算
    CASE p_transaction_type
        WHEN 'in' THEN
            v_new_quantity := v_current_quantity + p_quantity;
        WHEN 'out' THEN
            v_new_quantity := v_current_quantity - p_quantity;
            IF v_new_quantity < 0 THEN
                RETURN QUERY SELECT false, '在庫数量が不足しています', NULL::DECIMAL;
                RETURN;
            END IF;
        WHEN 'adjustment' THEN
            v_new_quantity := p_quantity;
        ELSE
            RETURN QUERY SELECT false, '無効なトランザクションタイプです', NULL::DECIMAL;
            RETURN;
    END CASE;
    
    -- 在庫を更新
    UPDATE inventory
    SET quantity = v_new_quantity,
        last_updated_at = CURRENT_TIMESTAMP,
        updated_by = p_user_id
    WHERE id = p_inventory_id;
    
    -- トランザクション履歴を記録
    INSERT INTO inventory_transactions (
        inventory_id,
        transaction_type,
        quantity,
        quantity_before,
        quantity_after,
        reference_type,
        reference_id,
        notes,
        created_by
    ) VALUES (
        p_inventory_id,
        p_transaction_type,
        p_quantity,
        v_current_quantity,
        v_new_quantity,
        p_reference_type,
        p_reference_id,
        p_notes,
        p_user_id
    );
    
    RETURN QUERY SELECT true, '在庫数量を更新しました', v_new_quantity;
END;
$$ LANGUAGE plpgsql;

-- 生産計画進捗更新関数
CREATE OR REPLACE FUNCTION update_production_plan_progress(
    p_plan_id UUID,
    p_progress_percentage INTEGER,
    p_produced_quantity INTEGER DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_current_progress INTEGER;
BEGIN
    -- 進捗率の検証
    IF p_progress_percentage < 0 OR p_progress_percentage > 100 THEN
        RETURN QUERY SELECT false, '進捗率は0から100の間で指定してください';
        RETURN;
    END IF;
    
    -- 現在の進捗を取得
    SELECT progress INTO v_current_progress
    FROM production_plans
    WHERE id = p_plan_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, '生産計画が見つかりません';
        RETURN;
    END IF;
    
    -- 生産計画を更新
    UPDATE production_plans
    SET progress = p_progress_percentage,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = p_user_id
    WHERE id = p_plan_id;
    
    -- 進捗が100%の場合は完了に更新
    IF p_progress_percentage = 100 THEN
        UPDATE production_plans
        SET status = 'completed',
            actual_end_date = CURRENT_DATE
        WHERE id = p_plan_id;
    ELSIF p_progress_percentage > 0 AND v_current_progress = 0 THEN
        -- 進捗が0から増えた場合は開始
        UPDATE production_plans
        SET status = 'in_progress',
            actual_start_date = COALESCE(actual_start_date, CURRENT_DATE)
        WHERE id = p_plan_id;
    END IF;
    
    -- 進捗履歴を記録
    INSERT INTO production_plan_progress (
        plan_id,
        progress_percentage,
        produced_quantity,
        notes,
        recorded_by
    ) VALUES (
        p_plan_id,
        p_progress_percentage,
        p_produced_quantity,
        p_notes,
        p_user_id
    );
    
    RETURN QUERY SELECT true, '進捗を更新しました';
END;
$$ LANGUAGE plpgsql;

-- 在庫アラート生成関数
CREATE OR REPLACE FUNCTION check_inventory_alerts()
RETURNS TABLE(
    inventory_id UUID,
    item_code VARCHAR(50),
    item_name VARCHAR(200),
    current_quantity DECIMAL(12, 3),
    reorder_point DECIMAL(12, 3),
    alert_type VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        COALESCE(p.code, m.code) as item_code,
        COALESCE(p.name, m.name) as item_name,
        i.available_quantity,
        i.reorder_point,
        CASE 
            WHEN i.available_quantity <= 0 THEN 'out_of_stock'
            WHEN i.reorder_point IS NOT NULL AND i.available_quantity <= i.reorder_point THEN 'low_stock'
            WHEN i.max_stock_level IS NOT NULL AND i.available_quantity >= i.max_stock_level THEN 'overstock'
            ELSE NULL
        END as alert_type
    FROM inventory i
    LEFT JOIN products p ON i.item_type = 'product' AND i.item_id = p.id
    LEFT JOIN materials m ON i.item_type = 'material' AND i.item_id = m.id
    WHERE 
        (i.available_quantity <= 0)
        OR (i.reorder_point IS NOT NULL AND i.available_quantity <= i.reorder_point)
        OR (i.max_stock_level IS NOT NULL AND i.available_quantity >= i.max_stock_level);
END;
$$ LANGUAGE plpgsql;

-- 品質レート計算関数
CREATE OR REPLACE FUNCTION calculate_quality_rate(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_product_id UUID DEFAULT NULL
)
RETURNS DECIMAL(5, 2) AS $$
DECLARE
    v_total_inspected INTEGER;
    v_total_passed INTEGER;
    v_rate DECIMAL(5, 2);
BEGIN
    SELECT 
        COALESCE(SUM(inspected_quantity), 0),
        COALESCE(SUM(passed_quantity), 0)
    INTO v_total_inspected, v_total_passed
    FROM quality_inspections
    WHERE 
        (p_start_date IS NULL OR inspection_date >= p_start_date)
        AND (p_end_date IS NULL OR inspection_date <= p_end_date)
        AND (p_product_id IS NULL OR product_id = p_product_id)
        AND status = 'completed';
    
    IF v_total_inspected = 0 THEN
        RETURN 0;
    END IF;
    
    v_rate := (v_total_passed::DECIMAL / v_total_inspected::DECIMAL) * 100;
    RETURN ROUND(v_rate, 2);
END;
$$ LANGUAGE plpgsql;
