const { Storage } = require('@google-cloud/storage');

// Configuração do Firebase Storage
const storage = new Storage({
  projectId: 'site-imobiliaria-72d48',
  keyFilename: 'firebase-service-account.json' // Você precisa baixar este arquivo do Firebase
});

const bucketName = 'site-imobiliaria-72d48.appspot.com';

async function configureCors() {
  try {
    const bucket = storage.bucket(bucketName);
    
    const cors = [
      {
        origin: ['https://noximobiliaria.com.br', 'https://www.noximobiliaria.com.br'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        maxAgeSeconds: 3600
      }
    ];

    await bucket.setCorsConfiguration(cors);
    console.log('CORS configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar CORS:', error);
  }
}

configureCors();
