import { H3Event } from 'h3';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { serverErrors, createErrorResponse } from './server-errors';
import { getEnvironmentInfo } from './environment';

export async function apiHandler<
  DefaultT = unknown,
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  T = DefaultT,
  R extends NitroFetchRequest = DefaultR,
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>,
>(event: H3Event, url: R, options: O, hasBearerToken?: boolean): Promise<T> {
  try {
    console.log('-------------------------------------------------------------------------------');
    console.log('url:', url);

    const clientIP = getRequestIP(event, { xForwardedFor: true }) || '';

    const { apiUrl, host, isStaging } = await getEnvironmentInfo(event);

    console.log('Host: ', host);
    console.log('IsStaging: ', isStaging);
    console.log('ClientIP: ', clientIP);
    console.log('BaseURL: ', apiUrl);

    const baseURL = apiUrl;

    let token = '';
    let campaignId = '';
    const parsedUrl = new URL(baseURL + url.toString());
    campaignId =
      parsedUrl.searchParams.get('id') ||
      (options.body && (options.body as Record<string, any>).bearerId) ||
      (options.body && (options.body as Record<string, any>).id);

    console.log('campaign id:', campaignId);

    if (hasBearerToken) {
      const authToken = getCookie(event, 't-' + campaignId);
      if (authToken) {
        token = authToken;
      } else {
        createErrorResponse(serverErrors['InternalServerError']);
      }
    }

    console.log('HasBearerToken:', hasBearerToken);
    console.log('Token:', token);
    console.log('Body', options.body);

    const response = await $fetch<T>(url, {
      baseURL,
      ...options,
      headers: {
        ...options.headers,
        'X-Forwarded-For': clientIP,
        ...(hasBearerToken
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });

    return response as T;
  } catch (error: any) {
    console.error('API Handler Error:', error);
    if (error?.response?.status === 401) {
      // Clear the token cookie
      // setCookie(event, `t-${campaignId}`, '', {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/',
      //   maxAge: 0,
      // });

      return createErrorResponse(serverErrors['Unauthorized']);
    } else if (error?.response?.status === 403) {
      return createErrorResponse(serverErrors['Forbidden']);
    }

    return createErrorResponse(serverErrors['InternalServerError']);
  }
}
