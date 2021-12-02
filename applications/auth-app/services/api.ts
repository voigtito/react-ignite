import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

let isRefreshing = false;
let failedRequestQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  });

  // 1 params is if it a success
  // 2 param is if it an error
  api.interceptors.response.use(response => response, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        // Renew token
        cookies = parseCookies();
        const { 'nextauth.refreshToken': refreshToken } = cookies;
        // Get all config from the error request
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api.post('/refresh', {
            refreshToken,
          }).then(response => {

            const { token } = response.data;

            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });

            setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            // Call all request that were stopped because of the token refresh.
            failedRequestQueue.forEach(request => request.onSuccess(token));
            // Reset the queue.
            failedRequestQueue = [];
          }).catch(err => {
            // Set error if there was some error during the refreshing.
            failedRequestQueue.forEach(request => request.onFailure(err));
            // Reset the queue.
            failedRequestQueue = [];

            // Execute only in client side.
            if (process.browser) {
              signOut();
            }
          }).finally(() => {
            isRefreshing = false;
          });
        }

        // Axios does not support async
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              // Set the new token
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
              // Call resolve method with axios configs from error
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        });

      } else {
        // Execute only in client side.
        if (process.browser) {
          signOut();
        }
      }
    }

    return Promise.reject(error);
  });

  return api;
}
