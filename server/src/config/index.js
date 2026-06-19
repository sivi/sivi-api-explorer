import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  siviApiUrl: process.env.SIVI_API_URL,
  siviApiKey: process.env.SIVI_API_KEY,
  ngrok: {
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: process.env.NGROK_DOMAIN,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

if (!config.siviApiUrl) {
  console.warn('Warning: SIVI_API_URL is not set in environment variables');
}
if (!config.siviApiKey) {
  console.warn('Warning: SIVI_API_KEY is not set in environment variables');
}

export default config;
