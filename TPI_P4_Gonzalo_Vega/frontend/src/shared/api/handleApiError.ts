import axios from "axios";

interface FastApiValidationError {
  loc?: unknown[];
  msg?: string;
}

export function handleApiError(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const detail = (data as { detail?: unknown }).detail;
      if (typeof detail === "string") {
        return detail;
      }
      if (Array.isArray(detail)) {
        return detail
          .map((item: FastApiValidationError) => {
            if (item && typeof item === "object" && item.msg) {
              const field = Array.isArray(item.loc)
                ? item.loc.filter((part) => part !== "body").join(".")
                : "";
              return field ? `${field}: ${item.msg}` : item.msg;
            }
            return JSON.stringify(item);
          })
          .join(", ");
      }
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

