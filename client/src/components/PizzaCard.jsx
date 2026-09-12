import { motion } from 'framer-motion'
import {
  FiArrowUpRight,
  FiClock,
  FiPlus,
  FiStar,
} from 'react-icons/fi'

import { formatCurrency } from '../utils/formatCurrency.js'
import { SERVER_BASE_URL } from '../utils/constants.js'

export default function PizzaCard({ item, onSelect }) {
  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `${SERVER_BASE_URL}${item.image || ''}`

  const isPizza =
    item.category === 'Classic' ||
    item.category === 'Specialty' ||
    item.category === 'Vegetarian'

  const actionLabel = isPizza
    ? 'Customize pizza'
    : item.category === 'Drinks'
      ? 'Add drink'
      : 'Add to order'

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className="group relative w-full overflow-hidden rounded-3xl border border-char/10 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-char/10 focus:outline-none focus:ring-2 focus:ring-tomato/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-crust-light">
        {item.image ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-crust-light">
            <PizzaGlyph />
          </div>
        )}

        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category */}
        {item.category && (
          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-char shadow-sm backdrop-blur-md">
            {item.category}
          </span>
        )}

        {/* Out of stock */}
        {item.isAvailable === false && (
          <span className="absolute right-4 top-4 rounded-full bg-char/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
            Out of stock
          </span>
        )}

        {/* Quick action */}
        <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white/95 text-char opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <FiArrowUpRight size={18} />
        </span>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-tight text-char transition-colors duration-200 group-hover:text-tomato">
              {item.name}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-xs text-char/45">
              <span className="inline-flex items-center gap-1">
                <FiStar className="text-crust-dark" size={12} />
                Chef's choice
              </span>

              <span className="h-1 w-1 rounded-full bg-char/20" />

              <span className="inline-flex items-center gap-1">
                <FiClock size={12} />
                20–30 min
              </span>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-tomato/10 px-3 py-1.5 text-sm font-bold text-tomato">
            {formatCurrency(item.basePrice)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-char/55">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-basil/15 bg-basil/10 px-2.5 py-1 text-[11px] font-semibold text-basil-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom action */}
        <div className="mt-5 flex items-center justify-between border-t border-char/8 pt-4">
          <span className="text-sm font-semibold text-char/60 transition-colors duration-200 group-hover:text-char">
            {item.isAvailable === false
              ? 'Currently unavailable'
              : actionLabel}
          </span>

          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-flour transition-all duration-300 ${
              item.isAvailable === false
                ? 'bg-char/40'
                : 'bg-char group-hover:bg-tomato group-hover:rotate-90'
            }`}
          >
            <FiPlus size={17} />
          </span>
        </div>
      </div>
    </motion.button>
  )
}

function PizzaGlyph() {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-md"
    >
      <circle cx="55" cy="55" r="48" fill="#E8C081" />
      <circle
        cx="55"
        cy="55"
        r="39"
        fill="#F2B705"
        fillOpacity="0.72"
      />
      <circle cx="55" cy="55" r="35" fill="#F8D66B" />

      <circle cx="38" cy="39" r="5" fill="#C1440E" />
      <circle cx="68" cy="34" r="4.5" fill="#C1440E" />
      <circle cx="73" cy="63" r="5" fill="#C1440E" />
      <circle cx="39" cy="69" r="4.5" fill="#C1440E" />
      <circle cx="55" cy="52" r="4.5" fill="#C1440E" />

      <circle cx="52" cy="34" r="3" fill="#5B7A5A" />
      <circle cx="61" cy="72" r="3" fill="#5B7A5A" />
      <circle cx="31" cy="53" r="2.8" fill="#5B7A5A" />

      <circle
        cx="43"
        cy="27"
        r="5"
        fill="white"
        fillOpacity="0.25"
      />
    </svg>
  )
}