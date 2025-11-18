import createClient from "openapi-fetch";

import { paths } from "./schema";

/**
 * Server-side API client (without authentication middleware)
 * Used for public API calls in Server Components
 */
export const serverClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  cache: "no-store", // Ensures fresh data on each request
});
