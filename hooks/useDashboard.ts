'use client'
import { useState, useEffect } from 'react'
import type { DashboardSummary, AIRecommendation } from '@/types'

export function useDashboard() {
  const [summary,  setSummary]  = useState<DashboardSummary | null>(null)
  const [recs,     setRecs]     = useState<AIRecommendation[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, r] = await Promise.all([
          fetch('/api/dashboard/summary').then(r => r.json()),
          fetch('/api/dashboard/recommendations').then(r => r.json()),
        ])
        if (s.data)  setSummary(s.data)
        if (r.data)  setRecs(r.data)
      } catch (e) {
        setError('Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return { summary, recs, loading, error }
}