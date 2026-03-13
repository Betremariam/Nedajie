import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "./ui/Button"
import { useTheme } from "./ThemeProvider"

export function ModeToggle({ variant = "outline" }) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="cursor-pointer mode-toggle-button relative overflow-hidden"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
