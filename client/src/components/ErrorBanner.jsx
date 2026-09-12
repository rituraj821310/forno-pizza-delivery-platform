import { FiAlertCircle, FiX } from 'react-icons/fi'

export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="
        flex
        items-start
        gap-3
        rounded-2xl
        border
        border-tomato/15
        bg-tomato/5
        px-4
        py-3.5
        text-tomato-dark
      "
    >
      {/* Icon */}
      <span
        className="
          mt-0.5
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-tomato/10
        "
      >
        <FiAlertCircle size={17} />
      </span>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-tomato">
          Something went wrong
        </p>

        <p className="mt-0.5 text-sm font-medium leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}
