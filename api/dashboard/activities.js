// Vercel Serverless API - 最近のアクティビティ
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
    const activities = [
      {
        id: 1,
        type: 'success',
        title: '生産計画 #P-2024-001 完了',
        description: 'スマートフォン生産計画が予定通り完了しました',
        time: '2分前'
      },
      {
        id: 2,
        type: 'warning',
        title: '在庫アラート',
        description: '液晶ディスプレイの在庫が最低レベルを下回りました',
        time: '15分前'
      },
      {
        id: 3,
        type: 'info',
        title: '品質検査開始',
        description: 'バッチ #Q-2024-003 の品質検査が開始されました',
        time: '1時間前'
      },
      {
        id: 4,
        type: 'error',
        title: '工程遅延',
        description: '組み立て工程で30分の遅延が発生しています',
        time: '2時間前'
      },
      {
        id: 5,
        type: 'success',
        title: '原価分析完了',
        description: '今月の原価分析レポートが生成されました',
        time: '3時間前'
      }
    ]

    // キャッシュヘッダー設定
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30')
    
    res.status(200).json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

