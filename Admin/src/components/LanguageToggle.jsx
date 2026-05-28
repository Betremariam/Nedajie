import * as React from "react"
import { Button } from "./ui/Button"
import { useTranslation } from "react-i18next"

export function LanguageToggle({ variant = "outline" }) {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleLanguage}
      className="cursor-pointer relative overflow-hidden font-bold w-9 h-9"
      title={i18n.language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
    >
      <span className="text-sm">{i18n.language === 'am' ? 'AM' : 'EN'}</span>
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
