import { useState, useEffect } from 'react'

interface Corretor {
  id: string
  nome: string
  cargo: string
  creci: string
  telefone: string
  instagram?: string
  email: string
  foto: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export function useCorretores() {
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCorretores = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/corretores')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar corretores')
        }
        
        const data = await response.json()
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
