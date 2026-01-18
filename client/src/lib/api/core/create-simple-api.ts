import axios from "axios";
import type { Method, RawAxiosRequestHeaders } from "axios";
import { fillEndpointTemplate } from "./fill-endpoint-template";
import { camelCase, snakeCase } from "@/lib/commons";

interface APIOptions {
  isRefreshToken?: boolean;
}

export const customHeaders: Record<string, string> = {};

const convertKeysToCamelCase = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item)) as T;
  }

  if (typeof data === "object" && data !== null) {
    const converted = {} as T;

    Object.keys(data).forEach((key) => {
      const camelCaseKey = camelCase(key);

      converted[camelCaseKey as keyof T] = convertKeysToCamelCase(
        data[key as keyof T],
      );
    });

    return converted;
  }

  return data;
};

const convertKeysToSnakeCase = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToSnakeCase(item)) as T;
  }

  if (typeof data === "object" && data !== null) {
    const converted = {} as T;

    Object.keys(data).forEach((key) => {
      const snakeCaseKey = snakeCase(key);

      converted[snakeCaseKey as keyof T] = convertKeysToSnakeCase(
        data[key as keyof T],
      );
    });

    return converted;
  }

  return data;
};

export const createSimpleApi = (baseURL: string) => {
  return function createEndpoint<R = unknown, P = unknown, RP = unknown>(
    method: string,
    httpMethod: Method = "GET",
    headers?: RawAxiosRequestHeaders,
    options?: APIOptions,
  ) {
    const sendParamsInBody = ["POST", "PUT", "PATCH"].includes(httpMethod);

    if (method.indexOf("/") === 0) {
      console.error("Api calls can't start with /", { method });
    }

    return async (
      params: P = {} as P,
      routeParams: RP = {} as RP,
      callHeaders?: RawAxiosRequestHeaders,
    ): Promise<R> => {
      const convertedParams =
        params instanceof FormData ? params : convertKeysToSnakeCase(params);

      const token = localStorage.getItem("token");

      const axiosResponse = await axios.request<R>({
        method: httpMethod,
        url: `${baseURL}/${fillEndpointTemplate(
          method,
          routeParams as Record<string, unknown>,
        )}`,
        data: sendParamsInBody ? convertedParams : undefined,
        params: sendParamsInBody ? undefined : convertedParams,
        ...(params instanceof FormData
          ? { transformRequest: () => params }
          : {}),
        headers: token
          ? {
              Authorization: `Bearer ${
                options && options.isRefreshToken
                  ? localStorage.getItem("refreshToken")
                  : token
              }`,
              "Content-Type": "application/json",
              ...headers,
              ...callHeaders,
              ...customHeaders,
            }
          : { ...headers, ...callHeaders, ...customHeaders },
      });

      return convertKeysToCamelCase<R>(axiosResponse.data);
    };
  };
};
