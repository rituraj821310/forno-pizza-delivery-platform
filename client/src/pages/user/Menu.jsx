import { useMemo, useState } from 'react'
import { FiSearch, FiSliders, FiArrowDown } from 'react-icons/fi'

import { useFetch } from '../../hooks/useFetch.js'
import { fetchMenu } from '../../services/menuService.js'
import PizzaCard from '../../components/PizzaCard.jsx'
import PizzaCustomizeModal from '../../components/PizzaCustomizeModal.jsx'
import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'

const CATEGORIES = [
  'All',
  'Classic',
  'Specialty',
  'Vegetarian',
  'Sides',
  'Drinks',
]

// Fallback demo data so the menu remains usable before the API is wired up.
const FALLBACK_ITEMS = [
  {
    id: 'margherita',
    name: 'Margherita',
    description:
      'San Marzano tomato, fior di latte, basil, olive oil.',
    basePrice: 13,
    category: 'Classic',
    tags: ['Vegetarian'],
  },
  {
    id: 'diavola',
    name: 'Diavola',
    description:
      'Spicy soppressata, chili honey, mozzarella.',
    basePrice: 16,
    category: 'Specialty',
    tags: ['Spicy'],
  },
  {
    id: 'funghi',
    name: 'Funghi e Tartufo',
    description:
      'Wild mushroom, truffle cream, thyme, parmesan.',
    basePrice: 18,
    category: 'Specialty',
    tags: [],
  },
  {
    id: 'quattro',
    name: 'Quattro Formaggi',
    description:
      'Mozzarella, gorgonzola, fontina, parmesan.',
    basePrice: 17,
    category: 'Vegetarian',
    tags: ['Vegetarian'],
  },
  {
    id: 'garlic-knots',
    name: 'Garlic Knots',
    description:
      'Six knots, roasted garlic butter, parsley.',
    basePrice: 7,
    category: 'Sides',
    tags: [],
  },
  {
    id: 'san-pellegrino',
    name: 'San Pellegrino',
    description:
      'Sparkling mineral water, 750ml.',
    basePrice: 4,
    category: 'Drinks',
    tags: [],
  },
]

export default function Menu() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const debouncedSearch = useDebounce(search, 250)

  const { data, loading, error } = useFetch(
    () =>
      fetchMenu({
        category: category === 'All' ? undefined : category,
        search: debouncedSearch || undefined,
      }),
    [category, debouncedSearch]
  )

  const items = useMemo(() => {
    const source = data?.items ?? data

    if (Array.isArray(source) && source.length > 0) {
      return source
    }

    return FALLBACK_ITEMS.filter((item) => {
      const matchesCategory =
        category === 'All' || item.category === category

      const matchesSearch = item.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [data, category, debouncedSearch])

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-tomato/5 blur-3xl" />
        <div className="absolute -right-40 top-72 h-[30rem] w-[30rem] rounded-full bg-crust/10 blur-3xl" />

        <div
          className="
            absolute inset-0
            opacity-[0.018]
            bg-[radial-gradient(#241C15_1px,transparent_1px)]
            [background-size:24px_24px]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="page-container pt-12 sm:pt-16 lg:pt-20">

        <div className="max-w-3xl">

          {/* Label */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-tomato" />

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-tomato">
              The Forno menu
            </p>
          </div>

          {/* Heading */}
          <h1
            className="
              font-display
              text-4xl
              font-semibold
              leading-[1.05]
              tracking-tight
              text-char
              sm:text-5xl
              lg:text-6xl
            "
          >
            Twelve pizzas.
            <span className="block text-tomato">
              No filler.
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              text-base
              leading-7
              text-char/55
              sm:text-lg
            "
          >
            From timeless classics to bold specialties, every pizza is
            made to order with fresh ingredients and our slow-fermented dough.
          </p>

        </div>

        {/* =================================================
            SEARCH + CATEGORY CONTROLS
        ================================================= */}

        <div className="mt-10">

          {/* Search */}
          <div className="relative max-w-xl">

            <FiSearch
              size={19}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-char/35
              "
            />

            <input
              type="search"
              placeholder="Search pizzas, sides, drinks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-char/10
                bg-white/75
                py-3.5
                pl-11
                pr-4
                text-sm
                font-medium
                text-char
                shadow-sm
                outline-none
                backdrop-blur
                transition-all
                placeholder:text-char/35
                focus:border-tomato/40
                focus:bg-white
                focus:ring-4
                focus:ring-tomato/5
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-full
                  px-2
                  py-1
                  text-xs
                  font-bold
                  text-char/40
                  hover:bg-char/5
                  hover:text-char
                "
              >
                Clear
              </button>
            )}

          </div>

          {/* Category controls */}
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

              <FiSliders
                size={16}
                className="mr-1 shrink-0 text-char/35"
              />

              {CATEGORIES.map((itemCategory) => {
                const active = category === itemCategory

                return (
                  <button
                    key={itemCategory}
                    type="button"
                    onClick={() => setCategory(itemCategory)}
                    className={`
                      shrink-0
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-bold
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'bg-char text-flour shadow-md'
                          : 'border border-char/10 bg-white/60 text-char/60 hover:border-char/20 hover:bg-white hover:text-char'
                      }
                    `}
                  >
                    {itemCategory}
                  </button>
                )
              })}

            </div>

            {/* Result count */}
            {!loading && (
              <p className="shrink-0 text-xs font-semibold text-char/40">
                {items.length}{' '}
                {items.length === 1 ? 'item' : 'items'}
              </p>
            )}

          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-char/10" />

      </section>

      {/* =====================================================
          MENU CONTENT
      ===================================================== */}

      <section className="page-container pb-20 pt-8 sm:pt-10">

        <ErrorBanner
          message={
            error
              ? 'Showing our default menu — live menu is temporarily unavailable.'
              : ''
          }
        />

        {loading ? (
          <div className="py-20">
            <Loader label="Preparing the menu..." />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="Nothing matches your search"
              message="Try another pizza, category, or search term."
            />

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('All')
              }}
              className="
                mx-auto
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-tomato
                transition-all
                hover:gap-3
              "
            >
              Reset filters
              <FiArrowDown
                size={15}
                className="rotate-[-90deg]"
              />
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {items.map((item) => (
              <PizzaCard
                key={item.id || item._id}
                item={item}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        )}

      </section>

      {/* =====================================================
          CUSTOMIZE MODAL
      ===================================================== */}

      {selectedItem && (
        <PizzaCustomizeModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </main>
  )
}