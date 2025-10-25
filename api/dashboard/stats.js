// Vercel Serverless API - ダッシュボード統計
export default async function handler(req, res) {
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // モックデータ（実際の実装では外部APIやデータベースから取得）
    const stats = {
      productionPlans: 24,
      productionPlansChange: 12,
      inventoryLevel: 1234,
      inventoryChange: -5,
      qualityRate: 98.5,
      qualityChange: 2.1,
      costEfficiency: 45230,
      costChange: 8
    }

    // キャッシュヘッダー設定
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
    
    res.status(200).json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

