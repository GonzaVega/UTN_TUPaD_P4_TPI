import { create } from "zustand"

export type NotificationType = "success" | "error" | "info"

interface NotificationState {
  message: string | null
  type: NotificationType
  isVisible: boolean
  timerId: ReturnType<typeof setTimeout> | null
  showNotification: (message: string, type?: NotificationType) => void
  hideNotification: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  message: null,
  type: "info",
  isVisible: false,
  timerId: null,
  showNotification: (message: string, type: NotificationType = "info") => {
    const prevTimer = get().timerId
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    const newTimer = setTimeout(() => {
      set({ isVisible: false, message: null, timerId: null })
    }, 3000)
    set({
      message,
      type,
      isVisible: true,
      timerId: newTimer,
    })
  },
  hideNotification: () => {
    const prevTimer = get().timerId
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    set({ isVisible: false, message: null, timerId: null })
  },
}))

