import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="Forno home"
      className={`
        group
        inline-flex
        items-center
        gap-2.5
        ${className}
      `}
    >
      {/* Logo mark */}
      <span
        className="
          relative
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          bg-tomato
          font-display
          text-xl
          font-semibold
          text-flour
          shadow-sm
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:shadow-md
        "
      >
        {/* F */}
        <span className="relative z-10">F</span>

        {/* Inner highlight */}
        <span
          className="
            absolute
            -right-2
            -top-2
            h-7
            w-7
            rounded-full
            bg-tomato-light/40
            blur-sm
            transition-transform
            duration-500
            group-hover:scale-150
          "
        />

        {/* Cheese-colored ring */}
        <span
          className="
            absolute
            inset-0
            rounded-full
            border-2
            border-cheese/0
            scale-90
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:border-cheese/80
          "
        />
      </span>

      {/* Brand name */}
      <span className="flex items-center gap-1">

        <span
          className="
            font-display
            text-[1.35rem]
            font-semibold
            tracking-tight
            text-char
            transition-colors
            duration-200
            group-hover:text-tomato
          "
        >
          Forno
        </span>

        <FiArrowUpRight
          size={13}
          className="
            -ml-0.5
            mt-[-8px]
            text-tomato
            opacity-0
            transition-all
            duration-200
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
            group-hover:opacity-100
          "
        />

      </span>
    </Link>
  )
}