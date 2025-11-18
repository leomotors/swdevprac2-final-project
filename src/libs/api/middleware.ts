import { Middleware } from "openapi-fetch";

import { accessTokenKey } from "../constants";

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Always read fresh token from localStorage to avoid stale cache
    const token = localStorage.getItem(accessTokenKey);

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  },
  async onResponse({ request, response }) {
    const { status } = response;
    if (status === 401) {
      localStorage.removeItem(accessTokenKey);

      if (!request.url.includes("/auth")) {
        window.location.href = "/login";
      }
    }
    return response;
  },
};
