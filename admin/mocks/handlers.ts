import { http, HttpResponse } from 'msw';
import {
  getMockProgramInfo,
  getMockTokens,
  getMockTransactions,
  getMockProgramInfoQuery,
} from './data';

export const handlers = [
  // tokens
  http.get(new RegExp('/api/tokens'), ({ request }) => {
    console.log('✅ MSW CAUGHT THE TOKENS REQUEST:', request.url);

    return HttpResponse.json(getMockTokens());
  }),

  // transactions
  http.get('*/api/transactions', ({ request }) => {
    return HttpResponse.json(getMockTransactions());
  }),

  // campaign info
  http.get('*/api/program', ({ request }) => {
    return HttpResponse.json(getMockProgramInfo());
  }),

  // program info
  http.get('*/api/programs/:programId', ({ request, params }) => {
    const url = new URL(request.url);
    console.log('[MSW] Intercepted /api/programs/:programId', {
      programId: params.programId,
      id: url.searchParams.get('id'),
      url: request.url,
    });
    return HttpResponse.json(getMockProgramInfoQuery());
  }),

  // programs list
  http.get('*/api/programs', ({ request }) => {
    const url = new URL(request.url);
    console.log('[MSW] Intercepted /api/programs', { url: request.url });
    return HttpResponse.json(getMockProgramInfo());
  }),
];
