import { FiMinus, FiPlus } from 'react-icons/fi'

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const increase = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div
      className="
        inline-flex
        h-11
        items-center
        rounded-full
        border
        border-char/10
        bg-white
        p-1
        shadow-sm
      "
    >
      {/* Decrease */}
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-char/60
          transition-all
          duration-200
          hover:bg-char/5
          hover:text-char
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-25
        "
      >
        <FiMinus size={15} strokeWidth={2.5} />
      </button>

      {/* Quantity */}
      <span
        className="
          flex
          w-9
          items-center
          justify-center
          text-sm
          font-bold
          tabular-nums
          text-char
        "
        aria-live="polite"
      >
        {value}
      </span>

      {/* Increase */}
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-char
          text-flour
          transition-all
          duration-200
          hover:bg-tomato
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-25
        "
      >
        <FiPlus size={15} strokeWidth={2.5} />
      </button>
    </div>
  )
}
