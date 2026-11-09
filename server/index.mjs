import {createApp} from './app.mjs';

const app = createApp();
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535');
const server = app.listen(port, '0.0.0.0', () => console.log(`SAM listening on ${port}`));
server.requestTimeout = 120000;
server.headersTimeout = 30000;
for (const signal of ['SIGTERM', 'SIGINT']) process.once(signal, () => {
  server.close(() => { app.locals.close(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
});
