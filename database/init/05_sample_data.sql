-- 顧客プレゼン用の豊富なサンプルデータ
-- デモンストレーション用の現実的なデータセット

-- ============================================
-- ユーザーデータ（拡張）
-- ============================================

-- 管理者ユーザー（既存）
-- admin, manager, operator は既に01_schema.sqlで作成済み

-- 追加のマネージャー
INSERT INTO users (username, email, password_hash, full_name, role, department, is_active) VALUES
('tanaka_manager', 'tanaka@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '田中 一郎', 'manager', '生産管理部', true),
('suzuki_manager', 'suzuki@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '鈴木 花子', 'manager', '品質管理部', true),
('yamada_manager', 'yamada@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '山田 次郎', 'manager', '在庫管理部', true);

-- オペレーター（複数）
INSERT INTO users (username, email, password_hash, full_name, role, department, is_active) VALUES
('sato_operator', 'sato@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '佐藤 三郎', 'operator', '製造部', true),
('watanabe_operator', 'watanabe@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '渡辺 四郎', 'operator', '製造部', true),
('ito_operator', 'ito@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '伊藤 五郎', 'operator', '製造部', true),
('kobayashi_operator', 'kobayashi@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '小林 六郎', 'operator', '品質管理部', true),
('kato_operator', 'kato@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '加藤 七郎', 'operator', '在庫管理部', true);

-- ビューアー（閲覧専用）
INSERT INTO users (username, email, password_hash, full_name, role, department, is_active) VALUES
('yoshida_viewer', 'yoshida@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '吉田 八郎', 'viewer', '経営企画部', true),
('hayashi_viewer', 'hayashi@production-control.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '林 九郎', 'viewer', '経営企画部', true);

-- ============================================
-- 仕入先マスタ（拡張）
-- ============================================

INSERT INTO suppliers (code, name, contact_person, email, phone, address, is_active) VALUES
('SUP-001', '株式会社 材料供給', '材料 太郎', 'contact@material-supply.co.jp', '03-1234-5678', '東京都千代田区1-1-1', true),
('SUP-002', '電子部品工業株式会社', '部品 花子', 'info@electronic-parts.co.jp', '03-2345-6789', '東京都港区2-2-2', true),
('SUP-003', '金属材料株式会社', '金属 次郎', 'sales@metal-materials.co.jp', '03-3456-7890', '大阪府大阪市3-3-3', true),
('SUP-004', 'プラスチック素材株式会社', 'プラ 三郎', 'contact@plastic-materials.co.jp', '06-4567-8901', '愛知県名古屋市4-4-4', true),
('SUP-005', '包装材料株式会社', '包装 四郎', 'info@packaging-materials.co.jp', '03-5678-9012', '神奈川県横浜市5-5-5', true);

-- ============================================
-- 製品マスタ（拡張）
-- ============================================

INSERT INTO products (code, name, description, category, unit_price, unit_of_measure, standard_lead_time, is_active) VALUES
-- スマートフォンシリーズ
('PROD-001', 'スマートフォン Pro Max', '最新の高性能スマートフォン、5G対応、256GBストレージ', 'Electronics', 120000.00, '台', 14, true),
('PROD-002', 'スマートフォン Pro', '高性能スマートフォン、5G対応、128GBストレージ', 'Electronics', 98000.00, '台', 12, true),
('PROD-003', 'スマートフォン Standard', '標準仕様のスマートフォン、4G対応、64GBストレージ', 'Electronics', 65000.00, '台', 10, true),
('PROD-004', 'スマートフォン Mini', 'コンパクトなスマートフォン、4G対応、32GBストレージ', 'Electronics', 45000.00, '台', 8, true),

-- ノートPCシリーズ
('PROD-005', 'ノートPC ビジネス', '高性能ビジネスノートPC、Intel Core i7、16GB RAM、512GB SSD', 'Electronics', 150000.00, '台', 10, true),
('PROD-006', 'ノートPC スタンダード', '標準仕様ノートPC、Intel Core i5、8GB RAM、256GB SSD', 'Electronics', 85000.00, '台', 8, true),
('PROD-007', 'ノートPC エントリー', 'エントリーモデルノートPC、Intel Core i3、4GB RAM、128GB SSD', 'Electronics', 55000.00, '台', 7, true),

-- タブレットシリーズ
('PROD-008', 'タブレット Pro', '高性能タブレット、12.9インチ、256GB', 'Electronics', 120000.00, '台', 9, true),
('PROD-009', 'タブレット Standard', '標準タブレット、10.2インチ、128GB', 'Electronics', 55000.00, '台', 7, true),
('PROD-010', 'タブレット Mini', 'コンパクトタブレット、7.9インチ、64GB', 'Electronics', 35000.00, '台', 6, true),

-- イヤホン・オーディオ
('PROD-011', 'ワイヤレスイヤホン Pro', 'ノイズキャンセリング対応ワイヤレスイヤホン', 'Audio', 35000.00, '個', 5, true),
('PROD-012', 'ワイヤレスイヤホン Standard', '標準ワイヤレスイヤホン', 'Audio', 15000.00, '個', 4, true),
('PROD-013', '有線イヤホン', '高音質有線イヤホン', 'Audio', 5000.00, '個', 3, true),

-- スマートウォッチ
('PROD-014', 'スマートウォッチ Pro', '健康管理機能付きスマートウォッチ', 'Wearables', 45000.00, '個', 7, true),
('PROD-015', 'スマートウォッチ Standard', '標準機能スマートウォッチ', 'Wearables', 25000.00, '個', 5, true),

-- アクセサリー
('PROD-016', '充電器 USB-C', '高速充電対応USB-C充電器', 'Accessories', 3000.00, '個', 2, true),
('PROD-017', 'ケース シリコン', 'シリコン製保護ケース', 'Accessories', 2000.00, '個', 2, true),
('PROD-018', 'ケース レザー', '本革製高級ケース', 'Accessories', 8000.00, '個', 3, true);

-- ============================================
-- 原材料マスタ（拡張）
-- ============================================

INSERT INTO materials (code, name, description, category, unit_of_measure, standard_cost, supplier_id, is_active) VALUES
-- 電子部品
('MAT-001', 'CPU 高性能', '最新世代CPU、8コア16スレッド', 'Component', '個', 25000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-002', 'CPU 標準', '標準CPU、4コア8スレッド', 'Component', '個', 12000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-003', 'メモリ 16GB', 'DDR4 16GB RAM', 'Component', '個', 8000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-004', 'メモリ 8GB', 'DDR4 8GB RAM', 'Component', '個', 4000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-005', 'ストレージ SSD 512GB', '高速SSD 512GB', 'Component', '個', 15000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-006', 'ストレージ SSD 256GB', '高速SSD 256GB', 'Component', '個', 8000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-007', 'バッテリー 大容量', '5000mAhリチウムイオンバッテリー', 'Component', '個', 5000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-008', 'バッテリー 標準', '3000mAhリチウムイオンバッテリー', 'Component', '個', 3000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-009', 'ディスプレイ OLED', '6.7インチOLEDディスプレイ', 'Component', '個', 20000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),
('MAT-010', 'ディスプレイ LCD', '6.1インチLCDディスプレイ', 'Component', '個', 8000.00, (SELECT id FROM suppliers WHERE code = 'SUP-002'), true),

-- 金属材料
('MAT-011', 'アルミニウム板', '高品質アルミニウム板', 'Raw Material', 'kg', 500.00, (SELECT id FROM suppliers WHERE code = 'SUP-003'), true),
('MAT-012', 'ステンレス鋼板', 'ステンレス鋼板', 'Raw Material', 'kg', 800.00, (SELECT id FROM suppliers WHERE code = 'SUP-003'), true),
('MAT-013', '銅線', '高純度銅線', 'Raw Material', 'kg', 1200.00, (SELECT id FROM suppliers WHERE code = 'SUP-003'), true),

-- プラスチック材料
('MAT-014', 'ABS樹脂', '高強度ABS樹脂', 'Raw Material', 'kg', 300.00, (SELECT id FROM suppliers WHERE code = 'SUP-004'), true),
('MAT-015', 'ポリカーボネート', '透明ポリカーボネート', 'Raw Material', 'kg', 500.00, (SELECT id FROM suppliers WHERE code = 'SUP-004'), true),
('MAT-016', 'シリコンゴム', '柔軟性のあるシリコンゴム', 'Raw Material', 'kg', 800.00, (SELECT id FROM suppliers WHERE code = 'SUP-004'), true),

-- 包装材料
('MAT-017', '段ボール箱 大', '大型製品用段ボール箱', 'Packaging', '個', 200.00, (SELECT id FROM suppliers WHERE code = 'SUP-005'), true),
('MAT-018', '段ボール箱 中', '中型製品用段ボール箱', 'Packaging', '個', 150.00, (SELECT id FROM suppliers WHERE code = 'SUP-005'), true),
('MAT-019', '段ボール箱 小', '小型製品用段ボール箱', 'Packaging', '個', 100.00, (SELECT id FROM suppliers WHERE code = 'SUP-005'), true),
('MAT-020', '緩衝材 エアキャップ', '製品保護用エアキャップ', 'Packaging', 'm', 50.00, (SELECT id FROM suppliers WHERE code = 'SUP-005'), true);

-- ============================================
-- 製品-原材料関連（BOM: Bill of Materials）
-- ============================================

-- スマートフォン Pro Max のBOM
INSERT INTO product_materials (product_id, material_id, quantity, unit_of_measure) VALUES
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-001'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-003'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-005'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-007'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-009'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-011'), 0.5, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-014'), 0.3, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-001'), (SELECT id FROM materials WHERE code = 'MAT-017'), 1, '個');

-- スマートフォン Pro のBOM
INSERT INTO product_materials (product_id, material_id, quantity, unit_of_measure) VALUES
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-001'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-004'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-006'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-007'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-010'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-011'), 0.4, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-014'), 0.25, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-002'), (SELECT id FROM materials WHERE code = 'MAT-017'), 1, '個');

-- ノートPC ビジネス のBOM
INSERT INTO product_materials (product_id, material_id, quantity, unit_of_measure) VALUES
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-001'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-003'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-005'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-009'), 1, '個'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-011'), 2.0, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-014'), 1.5, 'kg'),
((SELECT id FROM products WHERE code = 'PROD-005'), (SELECT id FROM materials WHERE code = 'MAT-017'), 1, '個');

-- ============================================
-- 工程マスタ（拡張）
-- ============================================

INSERT INTO processes (code, name, description, standard_time_minutes, is_active) VALUES
('PROC-001', '受入検査', '原材料・部品の受入検査', 30, true),
('PROC-002', '準備工程', '生産準備とセットアップ', 45, true),
('PROC-003', '基板実装', 'プリント基板への部品実装', 120, true),
('PROC-004', '組立工程', '製品の組立作業', 180, true),
('PROC-005', 'ソフトウェア書き込み', 'ファームウェア・OSの書き込み', 60, true),
('PROC-006', '機能テスト', '基本機能の動作確認', 90, true),
('PROC-007', '品質検査', '詳細な品質検査', 120, true),
('PROC-008', '外観検査', '外観・塗装の検査', 45, true),
('PROC-009', '梱包工程', '製品の梱包作業', 30, true),
('PROC-010', '出荷検査', '最終出荷前検査', 30, true);

-- ============================================
-- 生産計画（豊富なサンプル）
-- ============================================

-- 進行中の生産計画
INSERT INTO production_plans (plan_code, name, product_id, quantity, start_date, end_date, status, priority, progress, actual_start_date, created_by) VALUES
('PLAN-2024-001', 'スマートフォン Pro Max 1月生産', (SELECT id FROM products WHERE code = 'PROD-001'), 5000, '2024-01-01', '2024-01-31', 'in_progress', 'high', 65, '2024-01-02', (SELECT id FROM users WHERE username = 'admin')),
('PLAN-2024-002', 'ノートPC ビジネス 1月生産', (SELECT id FROM products WHERE code = 'PROD-005'), 2000, '2024-01-05', '2024-01-25', 'in_progress', 'high', 45, '2024-01-06', (SELECT id FROM users WHERE username = 'manager')),
('PLAN-2024-003', 'ワイヤレスイヤホン Pro 1月生産', (SELECT id FROM products WHERE code = 'PROD-011'), 10000, '2024-01-10', '2024-01-20', 'in_progress', 'medium', 80, '2024-01-11', (SELECT id FROM users WHERE username = 'tanaka_manager')),
('PLAN-2024-004', 'タブレット Standard 1月生産', (SELECT id FROM products WHERE code = 'PROD-009'), 3000, '2024-01-15', '2024-01-30', 'in_progress', 'medium', 30, '2024-01-16', (SELECT id FROM users WHERE username = 'suzuki_manager')),

-- 計画中の生産計画
('PLAN-2024-005', 'スマートフォン Pro 2月生産', (SELECT id FROM products WHERE code = 'PROD-002'), 8000, '2024-02-01', '2024-02-28', 'planned', 'high', 0, NULL, (SELECT id FROM users WHERE username = 'admin')),
('PLAN-2024-006', 'ノートPC スタンダード 2月生産', (SELECT id FROM products WHERE code = 'PROD-006'), 5000, '2024-02-05', '2024-02-25', 'planned', 'medium', 0, NULL, (SELECT id FROM users WHERE username = 'manager')),
('PLAN-2024-007', 'スマートウォッチ Pro 2月生産', (SELECT id FROM products WHERE code = 'PROD-014'), 15000, '2024-02-10', '2024-02-20', 'planned', 'medium', 0, NULL, (SELECT id FROM users WHERE username = 'yamada_manager')),
('PLAN-2024-008', 'タブレット Pro 2月生産', (SELECT id FROM products WHERE code = 'PROD-008'), 2000, '2024-02-15', '2024-02-29', 'planned', 'high', 0, NULL, (SELECT id FROM users WHERE username = 'tanaka_manager')),

-- 完了した生産計画
('PLAN-2023-120', 'スマートフォン Standard 12月生産', (SELECT id FROM products WHERE code = 'PROD-003'), 10000, '2023-12-01', '2023-12-20', 'completed', 'high', 100, '2023-12-02', '2023-12-18', (SELECT id FROM users WHERE username = 'admin')),
('PLAN-2023-121', 'ワイヤレスイヤホン Standard 12月生産', (SELECT id FROM products WHERE code = 'PROD-012'), 20000, '2023-12-05', '2023-12-15', 'completed', 'medium', 100, '2023-12-06', '2023-12-14', (SELECT id FROM users WHERE username = 'manager')),
('PLAN-2023-122', 'スマートウォッチ Standard 12月生産', (SELECT id FROM products WHERE code = 'PROD-015'), 15000, '2023-12-10', '2023-12-25', 'completed', 'medium', 100, '2023-12-11', '2023-12-23', (SELECT id FROM users WHERE username = 'suzuki_manager')),

-- 保留中の生産計画
('PLAN-2024-009', 'ノートPC エントリー 2月生産', (SELECT id FROM products WHERE code = 'PROD-007'), 3000, '2024-02-20', '2024-03-10', 'on_hold', 'low', 0, NULL, (SELECT id FROM users WHERE username = 'manager'));

-- 生産計画進捗履歴（サンプル）
INSERT INTO production_plan_progress (plan_id, progress_percentage, produced_quantity, notes, recorded_by, recorded_at) VALUES
-- PLAN-2024-001の進捗
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 10, 500, '初期進捗', (SELECT id FROM users WHERE username = 'sato_operator'), '2024-01-05 10:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 25, 1250, '順調に進行中', (SELECT id FROM users WHERE username = 'watanabe_operator'), '2024-01-10 14:30:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 45, 2250, '品質問題なし', (SELECT id FROM users WHERE username = 'ito_operator'), '2024-01-15 16:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 65, 3250, '現在の進捗', (SELECT id FROM users WHERE username = 'sato_operator'), '2024-01-20 11:00:00+09'),

-- PLAN-2024-002の進捗
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), 15, 300, '開始', (SELECT id FROM users WHERE username = 'watanabe_operator'), '2024-01-08 09:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), 30, 600, '順調', (SELECT id FROM users WHERE username = 'ito_operator'), '2024-01-12 13:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), 45, 900, '現在の進捗', (SELECT id FROM users WHERE username = 'kobayashi_operator'), '2024-01-18 15:30:00+09'),

-- PLAN-2024-003の進捗
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 20, 2000, '開始', (SELECT id FROM users WHERE username = 'sato_operator'), '2024-01-12 08:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 50, 5000, '順調に進行', (SELECT id FROM users WHERE username = 'watanabe_operator'), '2024-01-15 12:00:00+09'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 80, 8000, 'ほぼ完了', (SELECT id FROM users WHERE username = 'ito_operator'), '2024-01-18 17:00:00+09');

-- ============================================
-- 在庫データ（豊富なサンプル）
-- ============================================

-- 製品在庫
INSERT INTO inventory (item_type, item_id, warehouse_location, quantity, reserved_quantity, unit_of_measure, min_stock_level, max_stock_level, reorder_point, updated_by) VALUES
-- スマートフォンシリーズ
('product', (SELECT id FROM products WHERE code = 'PROD-001'), '倉庫A-1', 1250.00, 500.00, '台', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-002'), '倉庫A-2', 3200.00, 800.00, '台', 1000.00, 8000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-003'), '倉庫A-3', 8500.00, 1000.00, '台', 2000.00, 15000.00, 3000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-004'), '倉庫A-4', 1200.00, 200.00, '台', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- ノートPCシリーズ
('product', (SELECT id FROM products WHERE code = 'PROD-005'), '倉庫B-1', 800.00, 200.00, '台', 200.00, 3000.00, 500.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-006'), '倉庫B-2', 2500.00, 500.00, '台', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-007'), '倉庫B-3', 1800.00, 300.00, '台', 300.00, 3000.00, 600.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- タブレットシリーズ
('product', (SELECT id FROM products WHERE code = 'PROD-008'), '倉庫C-1', 600.00, 200.00, '台', 200.00, 2000.00, 400.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-009'), '倉庫C-2', 1500.00, 300.00, '台', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-010'), '倉庫C-3', 2200.00, 400.00, '台', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- イヤホン・オーディオ
('product', (SELECT id FROM products WHERE code = 'PROD-011'), '倉庫D-1', 8500.00, 2000.00, '個', 2000.00, 20000.00, 4000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-012'), '倉庫D-2', 12000.00, 3000.00, '個', 3000.00, 30000.00, 6000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-013'), '倉庫D-3', 25000.00, 5000.00, '個', 5000.00, 50000.00, 10000.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- スマートウォッチ
('product', (SELECT id FROM products WHERE code = 'PROD-014'), '倉庫E-1', 3500.00, 1500.00, '個', 1000.00, 15000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-015'), '倉庫E-2', 8000.00, 2000.00, '個', 2000.00, 20000.00, 4000.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- アクセサリー
('product', (SELECT id FROM products WHERE code = 'PROD-016'), '倉庫F-1', 15000.00, 3000.00, '個', 3000.00, 50000.00, 6000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-017'), '倉庫F-2', 20000.00, 5000.00, '個', 5000.00, 100000.00, 10000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('product', (SELECT id FROM products WHERE code = 'PROD-018'), '倉庫F-3', 5000.00, 1000.00, '個', 1000.00, 20000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator'));

-- 原材料在庫
INSERT INTO inventory (item_type, item_id, warehouse_location, quantity, reserved_quantity, unit_of_measure, min_stock_level, max_stock_level, reorder_point, updated_by) VALUES
-- 電子部品
('material', (SELECT id FROM materials WHERE code = 'MAT-001'), '部品倉庫-1', 2500.00, 500.00, '個', 500.00, 5000.00, 1000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-002'), '部品倉庫-1', 5000.00, 1000.00, '個', 1000.00, 10000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-003'), '部品倉庫-2', 8000.00, 2000.00, '個', 2000.00, 20000.00, 4000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-004'), '部品倉庫-2', 15000.00, 3000.00, '個', 3000.00, 30000.00, 6000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-005'), '部品倉庫-3', 4000.00, 800.00, '個', 800.00, 10000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-006'), '部品倉庫-3', 8000.00, 1500.00, '個', 1500.00, 20000.00, 3000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-007'), '部品倉庫-4', 12000.00, 3000.00, '個', 3000.00, 30000.00, 6000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-008'), '部品倉庫-4', 20000.00, 5000.00, '個', 5000.00, 50000.00, 10000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-009'), '部品倉庫-5', 3000.00, 600.00, '個', 600.00, 8000.00, 1500.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-010'), '部品倉庫-5', 6000.00, 1200.00, '個', 1200.00, 15000.00, 3000.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- 金属材料
('material', (SELECT id FROM materials WHERE code = 'MAT-011'), '材料倉庫-1', 5000.00, 1000.00, 'kg', 1000.00, 20000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-012'), '材料倉庫-1', 3000.00, 600.00, 'kg', 600.00, 10000.00, 1200.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-013'), '材料倉庫-2', 2000.00, 400.00, 'kg', 400.00, 5000.00, 800.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- プラスチック材料
('material', (SELECT id FROM materials WHERE code = 'MAT-014'), '材料倉庫-3', 8000.00, 2000.00, 'kg', 2000.00, 30000.00, 4000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-015'), '材料倉庫-3', 4000.00, 800.00, 'kg', 800.00, 15000.00, 1600.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-016'), '材料倉庫-4', 3000.00, 600.00, 'kg', 600.00, 10000.00, 1200.00, (SELECT id FROM users WHERE username = 'kato_operator')),

-- 包装材料
('material', (SELECT id FROM materials WHERE code = 'MAT-017'), '包装倉庫-1', 10000.00, 2000.00, '個', 2000.00, 50000.00, 4000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-018'), '包装倉庫-1', 15000.00, 3000.00, '個', 3000.00, 80000.00, 6000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-019'), '包装倉庫-2', 20000.00, 5000.00, '個', 5000.00, 100000.00, 10000.00, (SELECT id FROM users WHERE username = 'kato_operator')),
('material', (SELECT id FROM materials WHERE code = 'MAT-020'), '包装倉庫-2', 5000.00, 1000.00, 'm', 1000.00, 20000.00, 2000.00, (SELECT id FROM users WHERE username = 'kato_operator'));

-- 在庫トランザクション履歴（サンプル）
INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, quantity_before, quantity_after, reference_type, reference_id, notes, created_by, transaction_date) VALUES
-- 入荷トランザクション
((SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-001')), 'in', 5000.00, 0.00, 5000.00, 'purchase_order', NULL, '新規入荷', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-01 10:00:00+09'),
((SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-002')), 'in', 8000.00, 0.00, 8000.00, 'purchase_order', NULL, '新規入荷', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-02 11:00:00+09'),
((SELECT id FROM inventory WHERE item_type = 'material' AND item_id = (SELECT id FROM materials WHERE code = 'MAT-001')), 'in', 5000.00, 0.00, 5000.00, 'purchase_order', NULL, '原材料入荷', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-03 09:00:00+09'),

-- 出荷トランザクション
((SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-001')), 'out', 3750.00, 5000.00, 1250.00, 'production_plan', (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '生産計画による出荷', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-05 14:00:00+09'),
((SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-005')), 'out', 1200.00, 2000.00, 800.00, 'production_plan', (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), '生産計画による出荷', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-06 15:00:00+09'),

-- 調整トランザクション
((SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-003')), 'adjustment', 8500.00, 10000.00, 8500.00, NULL, NULL, '在庫棚卸による調整', (SELECT id FROM users WHERE username = 'kato_operator'), '2024-01-10 16:00:00+09');

-- ============================================
-- 生産計画-工程関連（サンプル）
-- ============================================

-- PLAN-2024-001の工程
INSERT INTO production_plan_processes (plan_id, process_id, sequence_order, planned_start_date, planned_end_date, actual_start_date, actual_end_date, status, notes) VALUES
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-001'), 1, '2024-01-02', '2024-01-02', '2024-01-02', '2024-01-02', 'completed', '受入検査完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-002'), 2, '2024-01-03', '2024-01-03', '2024-01-03', '2024-01-03', 'completed', '準備完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-003'), 3, '2024-01-04', '2024-01-10', '2024-01-04', NULL, 'in_progress', '基板実装中'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-004'), 4, '2024-01-11', '2024-01-20', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-005'), 5, '2024-01-21', '2024-01-22', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-006'), 6, '2024-01-23', '2024-01-25', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-007'), 7, '2024-01-26', '2024-01-28', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-008'), 8, '2024-01-29', '2024-01-29', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-009'), 9, '2024-01-30', '2024-01-30', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), (SELECT id FROM processes WHERE code = 'PROC-010'), 10, '2024-01-31', '2024-01-31', NULL, NULL, 'pending', NULL);

-- PLAN-2024-002の工程
INSERT INTO production_plan_processes (plan_id, process_id, sequence_order, planned_start_date, planned_end_date, actual_start_date, actual_end_date, status, notes) VALUES
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-001'), 1, '2024-01-06', '2024-01-06', '2024-01-06', '2024-01-06', 'completed', '受入検査完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-002'), 2, '2024-01-07', '2024-01-07', '2024-01-07', '2024-01-07', 'completed', '準備完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-003'), 3, '2024-01-08', '2024-01-12', '2024-01-08', NULL, 'in_progress', '基板実装中'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-004'), 4, '2024-01-13', '2024-01-18', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-005'), 5, '2024-01-19', '2024-01-19', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-006'), 6, '2024-01-20', '2024-01-21', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-007'), 7, '2024-01-22', '2024-01-23', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-008'), 8, '2024-01-24', '2024-01-24', NULL, NULL, 'pending', NULL),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), (SELECT id FROM processes WHERE code = 'PROC-009'), 9, '2024-01-25', '2024-01-25', NULL, NULL, 'pending', NULL);

-- ============================================
-- 品質検査データ（豊富なサンプル）
-- ============================================

INSERT INTO quality_inspections (plan_id, inspection_type, product_id, batch_number, inspected_quantity, passed_quantity, failed_quantity, rework_quantity, inspection_date, inspector_id, status, notes) VALUES
-- PLAN-2024-001の品質検査
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-001'), 'BATCH-2024-001-001', 1000, 980, 15, 5, '2024-01-10', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '初期ロット検査完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-001'), 'BATCH-2024-001-002', 1500, 1485, 10, 5, '2024-01-15', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '第2ロット検査完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), 'final', (SELECT id FROM products WHERE code = 'PROD-001'), 'BATCH-2024-001-003', 750, 745, 3, 2, '2024-01-20', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '最終検査完了'),

-- PLAN-2024-002の品質検査
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-005'), 'BATCH-2024-002-001', 500, 495, 4, 1, '2024-01-12', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '初期ロット検査'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-005'), 'BATCH-2024-002-002', 400, 395, 3, 2, '2024-01-18', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'in_progress', '第2ロット検査中'),

-- PLAN-2024-003の品質検査
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-011'), 'BATCH-2024-003-001', 2000, 1990, 8, 2, '2024-01-13', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '初期ロット検査'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 'in_process', (SELECT id FROM products WHERE code = 'PROD-011'), 'BATCH-2024-003-002', 3000, 2985, 12, 3, '2024-01-16', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '第2ロット検査'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), 'final', (SELECT id FROM products WHERE code = 'PROD-011'), 'BATCH-2024-003-003', 3000, 2995, 4, 1, '2024-01-18', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '最終検査完了'),

-- 完了した計画の品質検査
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2023-120'), 'final', (SELECT id FROM products WHERE code = 'PROD-003'), 'BATCH-2023-120-FINAL', 10000, 9950, 40, 10, '2023-12-18', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '最終検査完了'),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2023-121'), 'final', (SELECT id FROM products WHERE code = 'PROD-012'), 'BATCH-2023-121-FINAL', 20000, 19950, 45, 5, '2023-12-14', (SELECT id FROM users WHERE username = 'kobayashi_operator'), 'completed', '最終検査完了');

-- 品質不良詳細
INSERT INTO quality_defects (inspection_id, defect_type, defect_code, quantity, severity, description, root_cause, corrective_action) VALUES
-- PLAN-2024-001の不良
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-001-001'), '画面不良', 'DEF-001', 5, 'major', '画面にキズが発生', '梱包時の取り扱い不良', '梱包プロセスの見直し'),
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-001-001'), '動作不良', 'DEF-002', 10, 'critical', '起動しない', '基板実装不良', '実装プロセスの改善'),
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-001-002'), '外観不良', 'DEF-003', 5, 'minor', '小さなキズ', '製造ラインでの接触', 'ライン改善'),
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-001-002'), '動作不良', 'DEF-002', 5, 'critical', '起動しない', '基板実装不良', '実装プロセスの改善'),

-- PLAN-2024-002の不良
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-002-001'), 'キーボード不良', 'DEF-004', 2, 'major', 'キーが反応しない', 'キーボード接続不良', '接続プロセスの確認'),
((SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-002-001'), '画面不良', 'DEF-001', 2, 'major', '画面にキズ', '梱包時の取り扱い不良', '梱包プロセスの見直し');

-- ============================================
-- 原価計算データ（サンプル）
-- ============================================

INSERT INTO cost_calculations (plan_id, calculation_date, material_cost, labor_cost, overhead_cost, other_cost, unit_cost, budget_amount, variance, notes, created_by) VALUES
-- PLAN-2024-001の原価
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '2024-01-15', 450000000.00, 120000000.00, 60000000.00, 30000000.00, 132000.00, 660000000.00, -30000000.00, '材料費が予算内', (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '2024-01-20', 480000000.00, 135000000.00, 65000000.00, 35000000.00, 137000.00, 660000000.00, -5000000.00, '進捗に伴う原価更新', (SELECT id FROM users WHERE username = 'manager')),

-- PLAN-2024-002の原価
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), '2024-01-12', 180000000.00, 45000000.00, 25000000.00, 15000000.00, 132500.00, 265000000.00, 0.00, '予算通り', (SELECT id FROM users WHERE username = 'tanaka_manager')),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-002'), '2024-01-18', 200000000.00, 50000000.00, 28000000.00, 17000000.00, 147500.00, 265000000.00, 10000000.00, '材料費が予算超過', (SELECT id FROM users WHERE username = 'tanaka_manager')),

-- PLAN-2024-003の原価
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-003'), '2024-01-16', 280000000.00, 70000000.00, 35000000.00, 20000000.00, 40500.00, 405000000.00, 0.00, '予算通り', (SELECT id FROM users WHERE username = 'suzuki_manager')),

-- 完了した計画の原価
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2023-120'), '2023-12-18', 520000000.00, 130000000.00, 65000000.00, 35000000.00, 75000.00, 750000000.00, 0.00, '最終原価', (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM production_plans WHERE plan_code = 'PLAN-2023-121'), '2023-12-14', 240000000.00, 60000000.00, 30000000.00, 20000000.00, 17500.00, 350000000.00, 0.00, '最終原価', (SELECT id FROM users WHERE username = 'manager'));

-- ============================================
-- 需要予測データ（サンプル）
-- ============================================

INSERT INTO demand_forecasts (product_id, forecast_date, forecast_period, forecasted_quantity, confidence_level, forecast_method, actual_quantity, accuracy, created_by) VALUES
-- 1月の需要予測
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-01', 'monthly', 5000, 85.5, 'ml_model', 5200, 96.2, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-01', 'monthly', 8000, 82.3, 'moving_average', 7800, 97.5, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-01', 'monthly', 2000, 88.7, 'ml_model', 2100, 95.2, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-01', 'monthly', 10000, 90.1, 'exponential_smoothing', 10200, 98.0, (SELECT id FROM users WHERE username = 'manager')),

-- 2月の需要予測
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-01', 'monthly', 5500, 87.2, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-01', 'monthly', 8500, 84.5, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-02-01', 'monthly', 2200, 89.3, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-02-01', 'monthly', 15000, 91.5, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 四半期予測
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-01', 'quarterly', 16000, 88.0, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-01', 'quarterly', 25000, 85.5, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager'));

-- ============================================
-- アクティビティログ（サンプル）
-- ============================================

INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description, ip_address, created_at) VALUES
-- 生産計画関連
((SELECT id FROM users WHERE username = 'admin'), 'CREATE', 'production_plan', (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '生産計画「PLAN-2024-001」を作成しました', '192.168.1.100', '2024-01-01 09:00:00+09'),
((SELECT id FROM users WHERE username = 'manager'), 'UPDATE', 'production_plan', (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '生産計画「PLAN-2024-001」の進捗を更新しました（65%）', '192.168.1.101', '2024-01-20 11:00:00+09'),
((SELECT id FROM users WHERE username = 'sato_operator'), 'UPDATE', 'production_plan', (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001'), '生産計画「PLAN-2024-001」の進捗を記録しました', '192.168.1.102', '2024-01-20 11:00:00+09'),

-- 在庫関連
((SELECT id FROM users WHERE username = 'kato_operator'), 'UPDATE', 'inventory', (SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-001')), '在庫数量を更新しました（入荷: 5000台）', '192.168.1.103', '2024-01-01 10:00:00+09'),
((SELECT id FROM users WHERE username = 'kato_operator'), 'UPDATE', 'inventory', (SELECT id FROM inventory WHERE item_type = 'product' AND item_id = (SELECT id FROM products WHERE code = 'PROD-001')), '在庫数量を更新しました（出荷: 3750台）', '192.168.1.103', '2024-01-05 14:00:00+09'),

-- 品質検査関連
((SELECT id FROM users WHERE username = 'kobayashi_operator'), 'CREATE', 'quality_inspection', (SELECT id FROM quality_inspections WHERE batch_number = 'BATCH-2024-001-001'), '品質検査を実施しました（合格率: 98%）', '192.168.1.104', '2024-01-10 15:00:00+09'),
((SELECT id FROM users WHERE username = 'kobayashi_operator'), 'CREATE', 'quality_defect', (SELECT id FROM quality_defects WHERE defect_code = 'DEF-001'), '品質不良を記録しました（画面不良: 5件）', '192.168.1.104', '2024-01-10 15:30:00+09'),

-- 原価管理関連
((SELECT id FROM users WHERE username = 'manager'), 'CREATE', 'cost_calculation', (SELECT id FROM cost_calculations WHERE plan_id = (SELECT id FROM production_plans WHERE plan_code = 'PLAN-2024-001')), '原価計算を実施しました', '192.168.1.101', '2024-01-15 16:00:00+09'),

-- ユーザー関連
((SELECT id FROM users WHERE username = 'admin'), 'CREATE', 'user', (SELECT id FROM users WHERE username = 'tanaka_manager'), '新規ユーザー「田中 一郎」を登録しました', '192.168.1.100', '2023-12-20 10:00:00+09'),
((SELECT id FROM users WHERE username = 'admin'), 'LOGIN', 'user', (SELECT id FROM users WHERE username = 'manager'), 'ログインしました', '192.168.1.101', '2024-01-20 08:30:00+09');

-- 統計情報を更新するためのコメント
-- これらのサンプルデータにより、以下のような統計が生成されます：
-- - アクティブな生産計画: 4件
-- - 完了した生産計画: 3件
-- - 計画中の生産計画: 4件
-- - 在庫アラート: 低在庫アイテムが複数
-- - 品質レート: 平均98%以上
-- - 原価効率: 予算内で運営
-- - 需要予測精度: 95%以上
