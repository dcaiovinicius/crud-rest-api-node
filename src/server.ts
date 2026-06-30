import { buildApplicationApp } from './app';

async function startApplicationApp() {
  const app = await buildApplicationApp();

  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });
  } catch (err) {
    app.log.error(err);
    app.close();
    process.exit(1);
  }
}

startApplicationApp();
