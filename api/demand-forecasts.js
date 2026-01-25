// Vercel Serverless Function for Demand Forecasts API
// 需要予測データを取得するAPIエンドポイント

// モックデータ（DB接続が設定されていない場合のフォールバック）
const mockForecasts = [
  {
    id: 'fc-001',
    productId: 'prod-001',
    productCode: 'PROD-001',
    productName: 'スマートフォン Pro Max',
    productCategory: 'Electronics',
    forecastDate: '2024-03-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 6000,
    confidenceLevel: 88.5,
    forecastMethod: 'ml_model',
    actualQuantity: null,
    accuracy: null,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-002',
    productId: 'prod-002',
    productCode: 'PROD-002',
    productName: 'スマートフォン Pro',
    productCategory: 'Electronics',
    forecastDate: '2024-03-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 9000,
    confidenceLevel: 85.8,
    forecastMethod: 'moving_average',
    actualQuantity: null,
    accuracy: null,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-003',
    productId: 'prod-001',
    productCode: 'PROD-001',
    productName: 'スマートフォン Pro Max',
    productCategory: 'Electronics',
    forecastDate: '2024-02-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 5500,
    confidenceLevel: 87.2,
    forecastMethod: 'ml_model',
    actualQuantity: 5600,
    accuracy: 98.2,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-004',
    productId: 'prod-002',
    productCode: 'PROD-002',
    productName: 'スマートフォン Pro',
    productCategory: 'Electronics',
    forecastDate: '2024-02-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 8500,
    confidenceLevel: 84.5,
    forecastMethod: 'moving_average',
    actualQuantity: 8400,
    accuracy: 98.8,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-005',
    productId: 'prod-001',
    productCode: 'PROD-001',
    productName: 'スマートフォン Pro Max',
    productCategory: 'Electronics',
    forecastDate: '2024-01-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 5000,
    confidenceLevel: 85.5,
    forecastMethod: 'ml_model',
    actualQuantity: 5200,
    accuracy: 96.2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-006',
    productId: 'prod-002',
    productCode: 'PROD-002',
    productName: 'スマートフォン Pro',
    productCategory: 'Electronics',
    forecastDate: '2024-01-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 8000,
    confidenceLevel: 82.3,
    forecastMethod: 'moving_average',
    actualQuantity: 7800,
    accuracy: 97.5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-007',
    productId: 'prod-005',
    productCode: 'PROD-005',
    productName: 'ノートPC ビジネス',
    productCategory: 'Electronics',
    forecastDate: '2024-01-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 2000,
    confidenceLevel: 88.7,
    forecastMethod: 'ml_model',
    actualQuantity: 2100,
    accuracy: 95.2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  },
  {
    id: 'fc-008',
    productId: 'prod-011',
    productCode: 'PROD-011',
    productName: 'ワイヤレスイヤホン Pro',
    productCategory: 'Audio',
    forecastDate: '2024-01-01',
    forecastPeriod: 'monthly',
    forecastedQuantity: 10000,
    confidenceLevel: 90.1,
    forecastMethod: 'exponential_smoothing',
    actualQuantity: 10200,
    accuracy: 98.0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: { username: 'manager', name: 'Manager' }
  }
]

module.exports = async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { method, query } = req

    if (method === 'GET') {
      return await handleGet(req, res, query)
    } else {
      res.setHeader('Allow', ['GET'])
      return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

async function handleGet(req, res, query) {
  try {
    const { productId, period, startDate, endDate, limit = 100 } = query

    // DB接続が利用可能な場合はDBから取得、そうでない場合はモックデータを使用
    let forecasts = mockForecasts

    // 環境変数でDB接続が設定されている場合はDBから取得を試みる
    if (process.env.DATABASE_URL) {
      try {
        const { Pool } = require('pg')
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        })

        let sql = `
          SELECT 
            df.id,
            df.forecast_date,
            df.forecast_period,
            df.forecasted_quantity,
            df.confidence_level,
            df.forecast_method,
            df.actual_quantity,
            df.accuracy,
            df.created_at,
            df.updated_at,
            p.id as product_id,
            p.code as product_code,
            p.name as product_name,
            p.category as product_category,
            u.username as created_by_username,
            u.full_name as created_by_name
          FROM demand_forecasts df
          INNER JOIN products p ON df.product_id = p.id
          LEFT JOIN users u ON df.created_by = u.id
          WHERE 1=1
        `

        const params = []
        let paramIndex = 1

        if (productId) {
          sql += ` AND df.product_id = $${paramIndex}`
          params.push(productId)
          paramIndex++
        }

        if (period) {
          sql += ` AND df.forecast_period = $${paramIndex}`
          params.push(period)
          paramIndex++
        }

        if (startDate) {
          sql += ` AND df.forecast_date >= $${paramIndex}`
          params.push(startDate)
          paramIndex++
        }

        if (endDate) {
          sql += ` AND df.forecast_date <= $${paramIndex}`
          params.push(endDate)
          paramIndex++
        }

        sql += ` ORDER BY df.forecast_date DESC, p.name ASC LIMIT $${paramIndex}`
        params.push(parseInt(limit))

        const result = await pool.query(sql, params)
        await pool.end()

        // データを整形
        forecasts = result.rows.map(row => ({
          id: row.id,
          productId: row.product_id,
          productCode: row.product_code,
          productName: row.product_name,
          productCategory: row.product_category,
          forecastDate: row.forecast_date,
          forecastPeriod: row.forecast_period,
          forecastedQuantity: row.forecasted_quantity,
          confidenceLevel: parseFloat(row.confidence_level) || 0,
          forecastMethod: row.forecast_method,
          actualQuantity: row.actual_quantity,
          accuracy: row.accuracy ? parseFloat(row.accuracy) : null,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          createdBy: {
            username: row.created_by_username,
            name: row.created_by_name
          }
        }))
      } catch (dbError) {
        console.warn('Database connection failed, using mock data:', dbError.message)
        // DB接続に失敗した場合はモックデータを使用
      }
    }

    // フィルタリング（モックデータの場合）
    let filteredForecasts = forecasts
    if (period) {
      filteredForecasts = filteredForecasts.filter(f => f.forecastPeriod === period)
    }
    if (productId) {
      filteredForecasts = filteredForecasts.filter(f => f.productId === productId)
    }
    if (startDate) {
      filteredForecasts = filteredForecasts.filter(f => f.forecastDate >= startDate)
    }
    if (endDate) {
      filteredForecasts = filteredForecasts.filter(f => f.forecastDate <= endDate)
    }

    // リミット適用
    filteredForecasts = filteredForecasts.slice(0, parseInt(limit))

    // 統計情報を計算
    const stats = calculateStats(filteredForecasts)

    // キャッシュヘッダー設定
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

    return res.status(200).json({
      data: filteredForecasts,
      stats,
      total: filteredForecasts.length
    })
  } catch (error) {
    console.error('Error fetching demand forecasts:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch demand forecasts',
      message: error.message 
    })
  }
}

function calculateStats(forecasts) {
  if (forecasts.length === 0) {
    return {
      totalForecasts: 0,
      averageConfidence: 0,
      averageAccuracy: 0,
      totalForecastedQuantity: 0,
      totalActualQuantity: 0
    }
  }

  const withAccuracy = forecasts.filter(f => f.accuracy !== null)
  const withActual = forecasts.filter(f => f.actualQuantity !== null)

  return {
    totalForecasts: forecasts.length,
    averageConfidence: forecasts.reduce((sum, f) => sum + f.confidenceLevel, 0) / forecasts.length,
    averageAccuracy: withAccuracy.length > 0 
      ? withAccuracy.reduce((sum, f) => sum + f.accuracy, 0) / withAccuracy.length 
      : null,
    totalForecastedQuantity: forecasts.reduce((sum, f) => sum + f.forecastedQuantity, 0),
    totalActualQuantity: withActual.length > 0
      ? withActual.reduce((sum, f) => sum + f.actualQuantity, 0)
      : null,
    productsCount: new Set(forecasts.map(f => f.productId)).size,
    periodsCount: new Set(forecasts.map(f => f.forecastPeriod)).size
  }
}
