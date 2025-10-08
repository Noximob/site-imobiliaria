import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // URL do Build Hook do Netlify
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL
    
    if (!buildHookUrl) {
      return NextResponse.json(
        { error: 'Build hook URL não configurada' },
        { status: 500 }
      )
    }

    // Disparar o webhook
    const response = await fetch(buildHookUrl, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Erro ao disparar build hook')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Deploy iniciado com sucesso!' 
    })
  } catch (error) {
    console.error('Erro ao disparar deploy:', error)
    return NextResponse.json(
      { error: 'Erro ao disparar deploy' },
      { status: 500 }
    )
  }
}
