import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
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

      api.post('/refresh', {
        refreshToken,
      }).then( response => {

        const {token} = response.data;

        setCookie(undefined, 'nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/'
        });

        setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/'
        });

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

      })

    } else {
      // Logout
    }
  }
});