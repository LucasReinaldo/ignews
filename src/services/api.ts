import axios, { AxiosError } from 'axios';
import { AuthTokenError } from 'errors/AuthTokenError';
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPI(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['ignews:token']}`
    }
  });

  api.interceptors.response.use(response => response, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response?.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);

        const { 'ignews:refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;
          api.post('/refresh', { refreshToken }).then(({ data }) => {
            const { token, refreshToken: newRefreshToken } = data;

            setCookie(ctx, "ignews:token", token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/",
            });
            setCookie(ctx, "ignews:refreshToken", newRefreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/",
            });

            api.defaults.headers.Authorization = `Bearer ${token}`;

            failedRequestsQueue.forEach(request => request.onSuccess(token));
            failedRequestsQueue = [];
          }).catch(error => {
            failedRequestsQueue.forEach(request => request.onFailure(error));
            failedRequestsQueue = [];

            if (process.browser) {
              destroyCookie(ctx, 'ignews:token');
              destroyCookie(ctx, 'ignews:refreshToken');
              Router.push("/");
            }
          }).finally(() => { isRefreshing = false });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            }
          })
        })
      } else {
        if (process.browser) {
          destroyCookie(ctx, 'ignews:token');
          destroyCookie(ctx, 'ignews:refreshToken');
          Router.push("/");
        } else {          
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error);
  })

  return api;
}