import nodemailer from 'nodemailer'

// Função para criar transporter (criado dinamicamente para garantir que as env vars estão carregadas)
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'imoveisnox@gmail.com'
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD

  if (!emailPassword) {
    console.error('❌ EMAIL_PASSWORD não configurado! Configure no Netlify.')
    throw new Error('EMAIL_PASSWORD não configurado')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = createTransporter()
    
    const emailUser = process.env.EMAIL_USER || 'imoveisnox@gmail.com'
    
    console.log('📧 Tentando enviar email para:', to)
    console.log('📧 De:', emailUser)
    
    const info = await transporter.sendMail({
      from: `"Nox Imóveis" <${emailUser}>`,
      to,
      subject,
      html,
    })
    
    console.log('✅ Email enviado com sucesso!')
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Resposta:', info.response)
    
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('❌ Erro ao enviar email:')
    console.error('❌ Tipo:', error.name)
    console.error('❌ Mensagem:', error.message)
    console.error('❌ Código:', error.code)
    console.error('❌ Stack:', error.stack)
    
    // Mensagens de erro mais amigáveis
    if (error.code === 'EAUTH') {
      console.error('❌ Erro de autenticação! Verifique EMAIL_USER e EMAIL_PASSWORD no Netlify.')
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ Erro de conexão! Verifique sua conexão com a internet.')
    }
    
    return { success: false, error: error.message }
  }
}

export function formatFormularioAnunciarEmail(dados: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Novo Formulário: Anunciar Imóvel</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Telefone:</strong> ${dados.telefone}</p>
        <p><strong>Email:</strong> ${dados.email}</p>
        <p><strong>Tipo:</strong> ${dados.tipo === 'vender' ? 'Vender' : 'Alugar'}</p>
        <p><strong>Tipo do Imóvel:</strong> ${dados.tipoImovel || 'Não informado'}</p>
        <p><strong>Cidade:</strong> ${dados.cidade || 'Não informado'}</p>
        <p><strong>Bairro:</strong> ${dados.bairro || 'Não informado'}</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  `
}

export function formatFormularioEncontreImovelEmail(dados: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Novo Formulário: Encontre seu Imóvel</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Telefone:</strong> ${dados.telefone}</p>
        <p><strong>Email:</strong> ${dados.email}</p>
        <p><strong>Tipo do Imóvel:</strong> ${dados.tipoImovel || 'Não informado'}</p>
        <p><strong>Quartos:</strong> ${dados.quartos || 'Não informado'}</p>
        <p><strong>Vagas:</strong> ${dados.vagas || 'Não informado'}</p>
        <p><strong>Cidade:</strong> ${dados.cidade || 'Não informado'}</p>
        <p><strong>Bairro:</strong> ${dados.bairro || 'Não informado'}</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  `
}

export function formatFormularioContatoEmail(dados: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Novo Formulário: Contato</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Telefone:</strong> ${dados.telefone}</p>
        <p><strong>Email:</strong> ${dados.email}</p>
        <p><strong>Departamento:</strong> ${dados.departamento || 'Não informado'}</p>
        <p><strong>Contato por WhatsApp:</strong> ${dados.contatoWhatsApp ? 'Sim' : 'Não'}</p>
        <p><strong>Contato por Telefone:</strong> ${dados.contatoTelefone ? 'Sim' : 'Não'}</p>
        ${dados.mensagem ? `<p><strong>Mensagem:</strong><br>${dados.mensagem}</p>` : ''}
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  `
}

export function formatFormularioTrabalheConoscoEmail(dados: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Novo Formulário: Trabalhe Conosco</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Telefone:</strong> ${dados.telefone}</p>
        <p><strong>Email:</strong> ${dados.email}</p>
        <p><strong>Instagram:</strong> ${dados.instagram || 'Não informado'}</p>
        ${dados.informacoes ? `<p><strong>Informações:</strong><br>${dados.informacoes}</p>` : ''}
        ${dados.arquivos && dados.arquivos.length > 0 ? `<p><strong>Arquivos:</strong> ${dados.arquivos.join(', ')}</p>` : ''}
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  `
}

