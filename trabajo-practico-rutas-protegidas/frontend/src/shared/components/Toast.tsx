import { useNotificationStore } from "@/store/notificationStore"

export function Toast() {
  const { message, type, isVisible, hideNotification } = useNotificationStore()

  if (!isVisible || !message) return null

  const typeStyles = {
    success: "bg-emerald-600 text-white border-emerald-700",
    error: "bg-rose-600 text-white border-rose-700",
    info: "bg-blue-600 text-white border-blue-700",
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-in">
      <div
        className={`flex items-center justify-between p-4 rounded-xl shadow-2xl border ${typeStyles[type]} text-sm font-medium`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-base font-bold">
            {type === "success" && "✓"}
            {type === "error" && "✕"}
            {type === "info" && "ℹ"}
          </span>
          <span>{message}</span>
        </div>
        <button
          onClick={hideNotification}
          className="ml-3 text-white/80 hover:text-white text-base leading-none focus:outline-hidden"
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  )
}

