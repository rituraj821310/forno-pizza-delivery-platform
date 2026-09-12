import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS, ORDER_STATUS } from '../utils/constants.js'
import { classNames } from '../utils/classNames.js'

export default function OrderProgress({ status }) {
  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="rounded-2xl bg-char/5 px-5 py-4 text-sm font-medium text-char/60">
        This order was cancelled.
      </div>
    )
  }

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status)

  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
      {ORDER_STATUS_SEQUENCE.map((step, index) => {
        const done = index <= currentIndex
        const isLast = index === ORDER_STATUS_SEQUENCE.length - 1
        return (
          <li key={step} className="flex sm:flex-1 items-center gap-3">
            <div className="flex flex-col items-center sm:flex-1">
              <div className="flex items-center w-full">
                <span
                  className={classNames(
                    'h-3 w-3 rounded-full shrink-0 border-2',
                    done ? 'bg-tomato border-tomato' : 'bg-transparent border-char/20'
                  )}
                />
                {!isLast && (
                  <span
                    className={classNames(
                      'hidden sm:block h-0.5 flex-1 mx-2',
                      index < currentIndex ? 'bg-tomato' : 'bg-char/15'
                    )}
                  />
                )}
              </div>
              <span
                className={classNames(
                  'mt-2 text-xs font-medium text-center sm:w-full',
                  done ? 'text-char' : 'text-char/40'
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
