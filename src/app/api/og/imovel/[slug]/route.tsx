import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import { getFotoPrincipal, formatPrice } from '@/lib/imoveis'

const baseUrl = 'https://noximobiliaria.com.br'

async function getImovelBySlug(slug: string): Promise<any | null> {
  try {
    if (process.env.GITHUB_TOKEN) {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
      const { data } = await octokit.repos.getContent({
        owner: 'Noximob',
        repo: 'site-imobiliaria',
        path: 'public/imoveis/imoveis.json',
      })
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        const imoveis = JSON.parse(content).filter((i: any) => i.publicado === true || i.publicado === 'true')
        return imoveis.find((i: any) => i.slug === slug) || null
      }
    }
    const imoveisPath = path.join(process.cwd(), 'public/imoveis/imoveis.json')
    if (fs.existsSync(imoveisPath)) {
      const data = fs.readFileSync(imoveisPath, 'utf-8')
      const imoveis = JSON.parse(data).filter((i: any) => i.publicado === true || i.publicado === 'true')
      return imoveis.find((i: any) => i.slug === slug) || null
    }
  } catch {}
  return null
}

function toAbsUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const imovel = await getImovelBySlug(slug)

  if (!imovel) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            color: 'white',
            fontSize: 32,
          }}
        >
          Imóvel não encontrado
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const titulo = imovel.titulo || 'Imóvel'
  const preco = imovel.preco ? formatPrice(imovel.preco) : ''
  const end = imovel.endereco
  const enderecoStr = [end?.bairro, end?.cidade, end?.estado].filter(Boolean).join(' - ') || ''
  const fotoUrl = getFotoPrincipal(imovel)
  const imgSrc = fotoUrl ? toAbsUrl(fotoUrl) : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              opacity: 0.9,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '48px 56px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
            {titulo.length > 60 ? titulo.substring(0, 57) + '...' : titulo}
          </div>
          {enderecoStr && (
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>{enderecoStr}</div>
          )}
          {preco && (
            <div style={{ fontSize: 42, fontWeight: 800, color: '#a5b4fc' }}>{preco}</div>
          )}
          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
            Nox Imóveis • Penha, Piçarras e Barra Velha
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
