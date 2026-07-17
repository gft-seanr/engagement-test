import { server } from '~admin/mocks/node';

let isListening = false;

export default defineEventHandler(async (event) => {
  const { enable } = await readBody(event);
  if (enable && !isListening) {
    server.listen({ onUnhandledRequest: 'bypass' });
    isListening = true;
    console.log('[MSW] Started');
  } else if (!enable && isListening) {
    server.close();
    isListening = false;
    console.log('[MSW] Stopped');
  }
  return { ok: true };
});
