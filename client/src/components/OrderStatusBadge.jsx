import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../utils/constants.js'
import { classNames } from '../utils/classNames.js'

const STATUS_STYLES = {
  [ORDER_STATUS.PLACED]: 'bg-char/10 text-char',
  [ORDER_STATUS.CONFIRMED]: 'bg-crust/20 text-crust-dark',
  [ORDER_STATUS.PREPARING]: 'bg-cheese/20 text-char',
  [ORDER_STATUS.BAKING]: 'bg-tomato/15 text-tomato-dark',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-basil/15 text-basil-dark',
  [ORDER_STATUS.DELIVERED]: 'bg-basil text-flour',
  [ORDER_STATUS.CANCELLED]: 'bg-char/10 text-char/50 line-through',
}

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        STATUS_STYLES[status] || 'bg-char/10 text-char'
      )}
    >
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  )
}
