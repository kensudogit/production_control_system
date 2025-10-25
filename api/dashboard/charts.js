// Vercel Serverless API - チャートデータ
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
    const chartData = {
      production: [
        { name: '1月', value: 400 },
        { name: '2月', value: 300 },
        { name: '3月', value: 500 },
        { name: '4月', value: 450 },
        { name: '5月', value: 600 },
        { name: '6月', value: 550 }
      ],
      quality: [
        { name: '合格', value: 85, color: '#22c55e' },
        { name: '不合格', value: 10, color: '#ef4444' },
        { name: '再検査', value: 5, color: '#f59e0b' }
      ]
    }

    // キャッシュヘッダー設定
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    
    res.status(200).json(chartData)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

