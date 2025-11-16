import { Middleware } from "openapi-fetch";

import { accessTokenKey } from "../constants";

let accessToken: string | null = null;

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (!accessToken) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        accessToken = token;
      }
    }

    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return request;
  },
  async onResponse({ request, response }) {
    const { status } = response;
    if (status === 401) {
      accessToken = null;
      localStorage.removeItem(accessTokenKey);

      if (!request.url.includes("/auth")) {
        window.location.href = "/login";
      }
    }
    return response;
  },
};
