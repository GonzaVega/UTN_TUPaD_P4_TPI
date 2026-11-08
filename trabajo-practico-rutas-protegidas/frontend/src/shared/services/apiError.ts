export function formatErrorDetail(detail: unknown, fallback: string): string {
  if (!detail) return fallback
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item) {
          const loc = Array.isArray(item.loc)
            ? item.loc.filter((l: unknown) => l !== "body").join(".")
            : ""
          return loc ? `${loc}: ${item.msg}` : String(item.msg)
        }
        return JSON.stringify(item)
      })
      .join(", ")
  }
  return fallback
}

