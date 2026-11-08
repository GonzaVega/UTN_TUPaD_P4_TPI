import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  darkMode: boolean
  toggleTheme: () => void
  setDarkMode: (val: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () =>
        set((state) => {
          const next = !state.darkMode
          if (next) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
          return { darkMode: next }
        }),
      setDarkMode: (val: boolean) => {
        if (val) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        set({ darkMode: val })
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
    }
  )
)

