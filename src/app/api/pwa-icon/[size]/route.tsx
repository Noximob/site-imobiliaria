import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

const SIZES = [192, 512] as const

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params
  const num = parseInt(size, 10)
  if (!SIZES.includes(num as 192 | 512)) {
    return new Response('Invalid size', { status: 400 })
  }

  const fontSize = num * 0.4
  const borderRadius = num >= 512 ? 96 : 36

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          borderRadius,
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          color: 'white',
          fontSize,
        }}
      >
        Nox
      </div>
    ),
    { width: num, height: num }
  )
}
