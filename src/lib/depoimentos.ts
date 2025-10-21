import { useState, useEffect } from 'react'
import { getDepoimentos, type Depoimento } from './depoimentos-data'

export function useDepoimentos() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        setLoading(true)
        const data = await getDepoimentos()
        setDepoimentos(data)
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar depoimentos:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setDepoimentos([])
      } finally {
        setLoading(false)
      }
    }

    fetchDepoimentos()
  }, [])

  return { depoimentos, loading, error, refreshDepoimentos: fetchDepoimentos }
}
