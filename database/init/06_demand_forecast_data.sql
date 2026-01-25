-- 需要予測と予測精度のサンプルデータ
-- 需要予測画面で表示するための豊富なデータセット

-- ============================================
-- 需要予測データ（拡張・詳細版）
-- ============================================

-- 現在日付を基準にした需要予測データ
-- 過去の実績データと将来の予測データを含む

-- 2024年1月の需要予測（実績あり）
INSERT INTO demand_forecasts (product_id, forecast_date, forecast_period, forecasted_quantity, confidence_level, forecast_method, actual_quantity, accuracy, created_by) VALUES
-- 製品A（スマートフォン Pro Max）
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-01', 'monthly', 5000, 85.5, 'ml_model', 5200, 96.2, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-08', 'weekly', 1200, 82.3, 'moving_average', 1250, 95.8, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-15', 'weekly', 1300, 84.1, 'ml_model', 1320, 98.5, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-22', 'weekly', 1250, 83.7, 'exponential_smoothing', 1280, 97.6, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-29', 'weekly', 1250, 85.2, 'ml_model', 1350, 92.3, (SELECT id FROM users WHERE username = 'manager')),

-- 製品B（スマートフォン Pro）
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-01', 'monthly', 8000, 82.3, 'moving_average', 7800, 97.5, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-08', 'weekly', 1900, 80.5, 'moving_average', 1850, 97.4, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-15', 'weekly', 2000, 81.2, 'ml_model', 1950, 97.5, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-22', 'weekly', 2050, 82.8, 'exponential_smoothing', 2000, 97.6, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-29', 'weekly', 1950, 81.9, 'ml_model', 2000, 97.5, (SELECT id FROM users WHERE username = 'manager')),

-- 製品C（タブレット Pro）
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-01', 'monthly', 2000, 88.7, 'ml_model', 2100, 95.2, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-08', 'weekly', 480, 87.3, 'moving_average', 500, 96.0, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-15', 'weekly', 520, 88.1, 'ml_model', 530, 98.1, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-22', 'weekly', 500, 89.2, 'exponential_smoothing', 520, 96.2, (SELECT id FROM products WHERE code = 'PROD-005')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-29', 'weekly', 500, 88.5, 'ml_model', 550, 90.9, (SELECT id FROM users WHERE username = 'manager')),

-- 製品D（ノートPC Pro）
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-01', 'monthly', 10000, 90.1, 'exponential_smoothing', 10200, 98.0, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-08', 'weekly', 2400, 89.5, 'moving_average', 2500, 96.0, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-15', 'weekly', 2550, 90.2, 'ml_model', 2600, 98.1, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-22', 'weekly', 2500, 90.8, 'exponential_smoothing', 2550, 98.0, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-29', 'weekly', 2550, 91.1, 'ml_model', 2650, 96.2, (SELECT id FROM users WHERE username = 'manager')),

-- 2024年2月の需要予測（一部実績あり、一部予測のみ）
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-01', 'monthly', 5500, 87.2, 'ml_model', 5600, 98.2, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-08', 'weekly', 1350, 86.5, 'moving_average', 1400, 96.4, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-15', 'weekly', 1400, 87.8, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-22', 'weekly', 1380, 87.1, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-02-29', 'weekly', 1370, 87.5, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-01', 'monthly', 8500, 84.5, 'moving_average', 8400, 98.8, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-08', 'weekly', 2100, 83.2, 'moving_average', 2050, 97.6, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-15', 'weekly', 2150, 84.8, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-22', 'weekly', 2120, 84.1, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-02-29', 'weekly', 2130, 84.6, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 2024年3月の需要予測（予測のみ）
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-03-01', 'monthly', 6000, 88.5, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-03-08', 'weekly', 1450, 87.2, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-03-15', 'weekly', 1500, 88.5, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-03-22', 'weekly', 1520, 88.8, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-03-29', 'weekly', 1530, 89.1, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

((SELECT id FROM products WHERE code = 'PROD-002'), '2024-03-01', 'monthly', 9000, 85.8, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-03-08', 'weekly', 2200, 84.5, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-03-15', 'weekly', 2250, 85.2, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-03-22', 'weekly', 2270, 85.8, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-03-29', 'weekly', 2280, 86.1, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 製品E（スマートウォッチ）
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-01-01', 'monthly', 15000, 91.5, 'exponential_smoothing', 15200, 98.7, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-02-01', 'monthly', 16000, 92.1, 'ml_model', 16200, 98.8, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-03-01', 'monthly', 17000, 92.8, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 製品F（ワイヤレスイヤホン）
((SELECT id FROM products WHERE code = 'PROD-003'), '2024-01-01', 'monthly', 12000, 89.3, 'moving_average', 11800, 98.3, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-003'), '2024-02-01', 'monthly', 13000, 90.1, 'ml_model', 12800, 98.5, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-003'), '2024-03-01', 'monthly', 14000, 90.8, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 四半期予測
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-01', 'quarterly', 16000, 88.0, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-01', 'quarterly', 25000, 85.5, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-01', 'quarterly', 6000, 89.2, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-01', 'quarterly', 30000, 91.0, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-01-01', 'quarterly', 45000, 92.5, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),

-- 年間予測
((SELECT id FROM products WHERE code = 'PROD-001'), '2024-01-01', 'yearly', 65000, 87.5, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-002'), '2024-01-01', 'yearly', 100000, 85.0, 'moving_average', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-005'), '2024-01-01', 'yearly', 25000, 89.0, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-011'), '2024-01-01', 'yearly', 120000, 90.5, 'exponential_smoothing', NULL, NULL, (SELECT id FROM users WHERE username = 'manager')),
((SELECT id FROM products WHERE code = 'PROD-014'), '2024-01-01', 'yearly', 180000, 92.0, 'ml_model', NULL, NULL, (SELECT id FROM users WHERE username = 'manager'));

-- 統計情報のコメント
-- これらのサンプルデータにより、以下のような統計が生成されます：
-- - 月次予測: 複数製品の月次予測データ
-- - 週次予測: 詳細な週次予測データ
-- - 四半期予測: 四半期単位の予測データ
-- - 年間予測: 年間単位の予測データ
-- - 予測精度: 実績がある場合は精度が計算されている
-- - 信頼度: 各予測に対する信頼度レベル
