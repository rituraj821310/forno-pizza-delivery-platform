import { FiPlus } from 'react-icons/fi'

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="
          absolute
          inset-0
          rounded-full
          bg-cheese/20
          blur-xl
        " />

        <div className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          border
          border-crust/30
          bg-crust-light
          shadow-sm
        ">
          <div className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border-2
            border-char/15
            text-char/55
          ">
            <FiPlus size={22} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* Heading */}
      <h3 className="
        mb-2
        font-display
        text-2xl
        font-semibold
        text-char
      ">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="
          mb-7
          max-w-sm
          text-sm
          leading-relaxed
          text-char/55
        ">
          {message}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
