import { Heart } from "lucide-react"
import { Link } from "react-router-dom"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              © {currentYear} Mekina Kiray Dotcom. All rights reserved.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Admin dashboard for managing vehicles, bookings, and operations.
          </p>
        </div>
      </div>
    </footer>
  )
}
