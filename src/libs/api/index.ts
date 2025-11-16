import createClient from "openapi-fetch";

import { authMiddleware } from "./middleware";
import { paths } from "./schema";

export const client = createClient<paths>({
  baseUrl: "http://localhost:5003/api/v1",
});

client.use(authMiddleware);
