import createClient from "openapi-fetch";

import { paths } from "./schema";

/**
 * Server-side API client (without authentication middleware)
 * Used for public API calls in Server Components
 */
export const serverClient = createClient<paths>({
  baseUrl: "http://localhost:5003/api/v1",
  cache: "no-store", // Ensures fresh data on each request
});
