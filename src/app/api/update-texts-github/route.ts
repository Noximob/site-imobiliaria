import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO_OWNER = 'Noximob'
const REPO_NAME = 'site-imobiliaria'

interface TextChange {
  path: string // ex: 'header.telefone'
  value: string
}

export async function POST(request: NextRequest) {
  try {
    const { changes }: { changes: TextChange[] } = await request.json()
    
    console.log('📝 Batch update de textos iniciado:', {
      changesCount: changes.length,
      changes: changes.map(c => ({ path: c.path, valueLength: c.value.length }))
    })
    
    if (!changes || !Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json(
        { error: 'Array de mudanças de textos é obrigatório' },
        { status: 400 }
      )
    }
    
    // Buscar arquivo atual do GitHub
    const filePath = 'public/textos/site.json'
    let currentContent = '{}'
    let sha: string | undefined
    
    try {
      const response = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        ref: 'main'
      })
      
      if ('content' in response.data) {
        currentContent = Buffer.from(response.data.content, 'base64').toString('utf-8')
        sha = response.data.sha
      }
    } catch (error) {
      console.warn('Arquivo não existe, será criado:', error)
    }
    
    // Parse do JSON atual
    let textsData: any
    try {
      textsData = JSON.parse(currentContent)
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error)
      return NextResponse.json(
        { error: 'Erro ao ler arquivo de textos atual' },
        { status: 500 }
      )
    }
    
    // Aplicar mudanças
    const results = []
    
    for (const change of changes) {
      try {
        const keys = change.path.split('.')
        let current = textsData
        
        // Navegar até o penúltimo nível
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {}
          }
          current = current[keys[i]]
        }
        
        // Atualizar o valor final
        const finalKey = keys[keys.length - 1]
        if (current[finalKey] && typeof current[finalKey] === 'object') {
          current[finalKey].value = change.value
          results.push({ path: change.path, success: true })
          console.log(`✅ Texto atualizado: ${change.path}`)
        } else {
          results.push({ 
            path: change.path, 
            success: false, 
            error: 'Estrutura de texto não encontrada' 
          })
          console.error(`❌ Estrutura não encontrada: ${change.path}`)
        }
        
      } catch (error) {
        results.push({ 
          path: change.path, 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        })
        console.error(`❌ Erro ao atualizar ${change.path}:`, error)
      }
    }
    
    // Converter para JSON formatado
    const updatedContent = JSON.stringify(textsData, null, 2)
    
    // Fazer commit no GitHub
    const commitMessage = `Admin: Atualiza ${results.filter(r => r.success).length} texto(s)`
    
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(updatedContent, 'utf-8').toString('base64'),
      branch: 'main',
      ...(sha && { sha })
    })
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    console.log(`🎉 Batch update concluído: ${successCount} sucessos, ${failCount} falhas`)
    
    return NextResponse.json({
      success: true,
      message: `${successCount} texto(s) atualizado(s) em 1 único commit`,
      results
    })
    
  } catch (error) {
    console.error('❌ Erro no batch update de textos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET para buscar textos atuais do GitHub
export async function GET() {
  try {
    const filePath = 'public/textos/site.json'
    
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: 'main'
    })
    
    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
      const textsData = JSON.parse(content)
      
      return NextResponse.json(textsData)
    }
    
    return NextResponse.json({})
    
  } catch (error) {
    console.error('❌ Erro ao buscar textos do GitHub:', error)
    return NextResponse.json({ error: 'Erro ao buscar textos' }, { status: 500 })
  }
}
