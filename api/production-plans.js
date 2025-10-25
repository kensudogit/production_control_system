// Vercel Serverless API - 生産計画
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

  const { method, query } = req
  const { page = 0, limit = 20, status = 'all' } = query

  try {
    const mockPlans = [
      {
        id: 'P-2024-001',
        name: 'スマートフォン生産計画',
        product: '高品質スマートフォン',
        quantity: 1000,
        startDate: '2024-01-15',
        endDate: '2024-01-29',
        status: 'in_progress',
        progress: 65,
        priority: 'high'
      },
      {
        id: 'P-2024-002',
        name: 'ノートPC生産計画',
        product: '高性能ノートPC',
        quantity: 500,
        startDate: '2024-01-20',
        endDate: '2024-02-10',
        status: 'planned',
        progress: 0,
        priority: 'medium'
      },
      {
        id: 'P-2024-003',
        name: 'イヤホン生産計画',
        product: 'ワイヤレスイヤホン',
        quantity: 2000,
        startDate: '2024-01-10',
        endDate: '2024-01-17',
        status: 'completed',
        progress: 100,
        priority: 'low'
      }
    ]

    let filteredPlans = mockPlans
    if (status !== 'all') {
      filteredPlans = mockPlans.filter(plan => plan.status === status)
    }

    const startIndex = parseInt(page) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

    const response = {
      data: paginatedPlans,
      hasMore: endIndex < filteredPlans.length,
      total: filteredPlans.length,
      page: parseInt(page),
      limit: parseInt(limit)
    }

    // キャッシュヘッダー設定
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    
    res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching production plans:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

