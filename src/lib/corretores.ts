import { useState, useEffect } from 'react'
import { getCorretores, type Corretor } from './corretores-data'

export function useCorretores() {
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCorretores = async () => {
      try {
        setLoading(true)
        const data = await getCorretores()
        setCorretores(data)
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar corretores:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setCorretores([])
      } finally {
        setLoading(false)
      }
    }

    fetchCorretores()
  }, [])

  return { corretores, loading, error }
}
