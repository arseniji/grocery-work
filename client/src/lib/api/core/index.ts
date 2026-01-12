import { createSimpleApi } from "./create-simple-api";

export const createEndpoint = createSimpleApi(import.meta.env.VITE_API_URL);
