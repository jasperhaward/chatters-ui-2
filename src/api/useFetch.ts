import config from "@/config";

export interface UseFetchRequestInit extends Omit<RequestInit, "body"> {
  method: "GET" | "POST" | "DELETE";
  body?: object;
}

export type UseFetch = <T>(
  path: string,
  init: UseFetchRequestInit
) => Promise<T>;

export function useFetch(): UseFetch {
  return async (path, init) => {
    const url = config.httpApiUrl + path;

    const headers = new Headers(init.headers);

    if (init.body) {
      headers.append("Content-Type", "application/json");
    }

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        body: JSON.stringify(init.body),
      });

      if (response.status === 401) {
        throw new UnauthorizedApiResponseError();
      }

      if (response.status === 204) {
        return null;
      }

      const json = await response.json();

      if (!response.ok) {
        if (isApiErrorResponse(json)) {
          throw new ApiResponseError(json);
        } else {
          throw new InvalidApiResponseError(
            "Response does not match error response schema."
          );
        }
      }

      return json;
    } catch (error) {
      if (
        error instanceof UnauthorizedApiResponseError ||
        error instanceof ApiResponseError ||
        error instanceof InvalidApiResponseError
      ) {
        throw error;
      } else if (error instanceof SyntaxError) {
        throw new InvalidApiResponseError("Response is not valid JSON.");
      } else {
        throw new InvalidApiResponseError("Unknown response error.", {
          cause: error,
        });
      }
    }
  };
}

export class ApiResponseError extends Error {
  reponse: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.reponse = response;
  }
}

export class InvalidApiResponseError extends Error {}

export class UnauthorizedApiResponseError extends Error {
  constructor() {
    super("Invalid credentials.");
  }
}

interface ApiErrorResponse {
  statusCode: number;
  code: string;
  error: string;
  message: string;
}

function isApiErrorResponse(json: unknown): json is ApiErrorResponse {
  if (
    typeof json === "object" &&
    json !== null &&
    "statusCode" in json &&
    typeof json.statusCode === "number" &&
    "code" in json &&
    typeof json.code === "string" &&
    "error" in json &&
    typeof json.error === "string" &&
    "message" in json &&
    typeof json.message === "string"
  ) {
    return true;
  }

  return false;
}
