import createFetchClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";

import { authMiddleware } from "./middleware";
import { paths } from "./schema";

export const client = createFetchClient<paths>({
  baseUrl: "http://localhost:5003/api/v1",
});

client.use(authMiddleware);

const $api = createQueryClient(client);
export const useQuery = $api.useQuery;
export const useMutation = $api.useMutation;
