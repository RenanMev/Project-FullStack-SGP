import react, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import '../styleComponents/notification.css'

const Notification = ({ variant, title, description, onClose }: {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
  onClose: () => void
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 6000)
    return () => clearTimeout(timer)
  }, [onClose])

  return ReactDOM.createPortal(
    <div
      className="fixed right-4 top-[calc(100vh-80vh)] z-50 transition-transform transform translate-x-full opacity-0 animate-slide-in min-w-64"

    >
      <Alert variant={variant} className="transition-transform transform translate-x-0 opacity-100 animate-slide-in p-4 rounded-xl ">
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </Alert>
    </div>,
    document.body
  )
}

export default Notification
