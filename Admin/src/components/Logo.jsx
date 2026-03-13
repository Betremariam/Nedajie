import * as React from "react"

import mkd_black from "../assets/black_logo.png"
import mkd_white from "../assets/mkd_logo.png"
import { useTheme } from "./ThemeProvider"

export function Logo({ size = 24, className, ...props }) {
  const { theme } = useTheme()
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = theme === "dark" || (theme === "system" && prefersDark)

  return (
    <img
      src={isDark ? mkd_white : mkd_black}
      alt="Mekina Kiray Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      {...props}
    />
  )
}
