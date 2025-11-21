import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

interface LoaderProps {
  className?: string
  size?: number
}

export const Loader = ({ className, size = 24 }: LoaderProps) => {
  return (
    <div className={cn("flex justify-center items-center p-2", className)}>
       <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  )
}

