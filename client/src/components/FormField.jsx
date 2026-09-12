export default function FormField({
  label,
  error,
  children,
  htmlFor,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="
          text-sm
          font-semibold
          text-char/75
        "
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="
            flex
            items-center
            gap-1.5
            text-xs
            font-medium
            text-tomato
          "
        >
          <span
            className="
              flex
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-tomato
            "
          />

          {error}
        </p>
      )}
    </div>
  )
}