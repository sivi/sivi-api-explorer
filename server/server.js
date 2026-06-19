import app from './src/app.js';
import config from './src/config/index.js';
import ngrok from '@ngrok/ngrok';

const PORT = config.port;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  if (config.ngrok.authtoken) {
    try {
      const listener = await ngrok.forward({
        addr: PORT,
        authtoken: config.ngrok.authtoken,
        ...(config.ngrok.domain ? { domain: config.ngrok.domain } : {}),
      });
      const publicUrl = listener.url();
      console.log(`\n ngrok tunnel active`);
      console.log(` Public URL : ${publicUrl}`);
      console.log(` Webhook receiver: ${publicUrl}/webhook/receive\n`);
    } catch (err) {
      console.error('ngrok failed to start:', err.message);
    }
  } else {
    console.log('NGROK_AUTHTOKEN not set — skipping ngrok tunnel. See NGROK_SETUP.md.');
  }
});
