import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiStar,
  FiTruck,
} from 'react-icons/fi'

import { fetchMenu } from '../../services/menuService.js'
import { SERVER_BASE_URL } from '../../utils/constants.js'

const highlights = [
  {
    icon: FiClock,
    number: '72h',
    title: 'Slow-fermented dough',
    body: 'A long fermentation creates a light, airy crust with beautifully blistered edges.',
  },
  {
    icon: FiStar,
    number: '900°F',
    title: 'Wood-fired in seconds',
    body: 'Our oven runs hot enough to create that unmistakable Neapolitan char.',
  },
  {
    icon: FiTruck,
    number: '40 min',
    title: 'Hot to your door',
    body: 'Follow your order live from our kitchen all the way to your doorstep.',
  },
]

const ingredients = [
  'Fresh mozzarella',
  'San Marzano tomatoes',
  'Extra virgin olive oil',
  'Fresh basil',
]

const featuredNames = [
  'Margherita',
  'Pepperoni Feast',
  'Farmhouse',
  'Diavola',
  'Quattro Formaggi',
  'Paneer Tikka',
]

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadMenu() {
      try {
        setLoading(true)
        setError('')

        const data = await fetchMenu()
        const items = data?.items ?? data?.menuItems ?? data ?? []

        if (mounted) {
          setMenuItems(Array.isArray(items) ? items : [])
        }
      } catch {
        if (mounted) {
          setError('Unable to load our featured pizzas right now.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMenu()

    return () => {
      mounted = false
    }
  }, [])

  const featuredItems = useMemo(() => {
    if (!menuItems.length) return []

    const pizzas = menuItems.filter(
      (item) =>
        item.category === 'Classic' ||
        item.category === 'Specialty' ||
        item.category === 'Vegetarian'
    )

    const selected = featuredNames
      .map((name) =>
        pizzas.find(
          (item) => item.name?.toLowerCase() === name.toLowerCase()
        )
      )
      .filter(Boolean)

    return selected.length ? selected.slice(0, 6) : pizzas.slice(0, 6)
  }, [menuItems])

  return (
    <main className="overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center">

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-tomato/5 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-crust/10 blur-3xl" />

          <div
            className="
              absolute inset-0
              opacity-[0.025]
              bg-[radial-gradient(#241C15_1px,transparent_1px)]
              [background-size:24px_24px]
            "
          />
        </div>

        <div className="page-container w-full py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">

            {/* LEFT */}
            <div className="max-w-2xl">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-tomato" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-tomato">
                  Wood-fired • Delivered hot
                </span>
              </div>

              <h1
                className="
                  text-balance
                  font-display
                  text-5xl font-semibold
                  leading-[0.98]
                  tracking-tight
                  text-char
                  sm:text-6xl
                  lg:text-7xl
                  xl:text-[5.4rem]
                "
              >
                Pizza made
                <span className="block">
                  with{' '}
                  <span className="relative inline-block text-tomato">
                    obsession.
                    <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-crust/50" />
                  </span>
                </span>
              </h1>

              <p
                className="
                  mt-7
                  max-w-xl
                  text-base
                  leading-7
                  text-char/60
                  sm:text-lg
                  sm:leading-8
                "
              >
                Hand-stretched dough, real mozzarella, San Marzano tomatoes,
                and a wood-fired oven. Crafted your way and delivered while
                it's still beautifully hot.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/menu"
                  className="btn-primary group !px-7 !py-3.5"
                >
                  Explore the menu

                  <FiArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/orders"
                  className="btn-secondary !border-char/15 !px-7 !py-3.5"
                >
                  <FiMapPin size={17} />
                  Track your order
                </Link>

              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <span className="h-7 w-7 rounded-full border-2 border-flour bg-crust" />
                    <span className="h-7 w-7 rounded-full border-2 border-flour bg-tomato" />
                    <span className="h-7 w-7 rounded-full border-2 border-flour bg-basil" />
                  </div>

                  <span className="text-xs font-semibold text-char/60">
                    Loved by pizza people
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-char/60">
                  <FiStar className="fill-cheese text-cheese" size={14} />
                  4.9 rating
                </div>

              </div>
            </div>

            {/* REAL PIZZA IMAGE */}
            <div className="relative mx-auto w-full max-w-[560px]">

              <div className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crust/20 blur-3xl" />

              <div className="absolute inset-[4%] rounded-full border border-crust/30" />

              <div className="absolute inset-[9%] rounded-full border border-dashed border-tomato/20" />

              <div className="relative aspect-square rounded-full bg-gradient-to-br from-[#F0C982] via-[#D8A24A] to-[#B9812F] p-[6%] shadow-[0_35px_80px_rgba(36,28,21,0.18)]">

                <div className="h-full w-full overflow-hidden rounded-full border-[10px] border-[#C58A32] bg-char shadow-2xl sm:border-[14px]">

                  <img
                    src={`${SERVER_BASE_URL}/images/pizzas/margherita.jpg`}
                    alt="Forno Margherita pizza"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      hover:scale-105
                    "
                  />

                </div>
              </div>

              {/* Ingredient badge */}
              <div
                className="
                  absolute
                  -bottom-3
                  left-0
                  hidden
                  rounded-2xl
                  border
                  border-char/10
                  bg-white/90
                  p-4
                  shadow-xl
                  backdrop-blur-xl
                  sm:block
                "
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tomato/10 text-xl">
                    🍅
                  </span>

                  <div>
                    <p className="text-xs font-bold text-char">
                      Fresh ingredients
                    </p>

                    <p className="mt-0.5 text-[11px] text-char/50">
                      Every single day
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery badge */}
              <div
                className="
                  absolute
                  -right-2
                  top-8
                  rounded-2xl
                  border
                  border-char/10
                  bg-white/90
                  p-4
                  shadow-xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil/10 text-basil">
                    <FiTruck size={18} />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-char">
                      Live delivery
                    </p>

                    <p className="mt-0.5 text-[11px] text-char/50">
                      Track every order
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PIZZAS
      ===================================================== */}
      <section className="border-y border-char/10 bg-[#F7F2EA] py-20 sm:py-24">

        <div className="page-container">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>
              <p className="section-label">
                From our oven
              </p>

              <h2 className="section-title mt-3">
                Popular <span className="gradient-text">picks.</span>
              </h2>

              <p className="section-description mt-4 max-w-xl">
                Customer favourites, made fresh and ready to disappear from
                the box.
              </p>
            </div>

            <Link
              to="/menu"
              className="
                inline-flex
                shrink-0
                items-center
                gap-2
                text-sm
                font-bold
                text-tomato
                transition-all
                hover:gap-3
              "
            >
              View full menu
              <FiArrowRight size={16} />
            </Link>

          </div>

          {loading && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[390px] animate-pulse rounded-[1.5rem] bg-char/5"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-10 rounded-2xl border border-tomato/20 bg-tomato/5 px-5 py-4 text-sm font-medium text-tomato">
              {error}
            </div>
          )}

          {!loading && !error && featuredItems.length > 0 && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {featuredItems.map((item) => (
                <HomePizzaCard
                  key={item._id}
                  item={item}
                />
              ))}

            </div>
          )}

          {!loading && !error && featuredItems.length === 0 && (
            <div className="mt-12 rounded-2xl border border-char/10 bg-white p-8 text-center">
              <p className="font-display text-xl font-semibold text-char">
                Our pizzas are getting ready.
              </p>

              <Link
                to="/menu"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-tomato"
              >
                Explore the menu
                <FiArrowRight size={16} />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          WHY FORNO
      ===================================================== */}
      <section className="border-y border-char/10 bg-char py-16 text-flour">

        <div className="page-container">

          <div className="mb-12 max-w-xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-crust-light">
              Why Forno
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Simple ingredients.
              <span className="text-crust-light"> Serious pizza.</span>
            </h2>

          </div>

          <div className="grid gap-10 md:grid-cols-3">

            {highlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="
                    group
                    border-t
                    border-flour/10
                    pt-6
                    transition-transform
                    duration-300
                    hover:-translate-y-1
                  "
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tomato text-white">
                      <Icon size={19} />
                    </div>

                    <span className="font-display text-2xl font-semibold text-crust-light">
                      {item.number}
                    </span>

                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-flour/55">
                    {item.body}
                  </p>

                </div>
              )
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          INGREDIENT SECTION
      ===================================================== */}
      <section className="relative overflow-hidden py-20 sm:py-28">

        <div className="page-container">

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

            {/* Visual */}
            <div className="relative order-2 lg:order-1">

              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-crust/15">

                <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-tomato/10" />

                <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-basil/10" />

                <img
                  src={`${SERVER_BASE_URL}/images/pizzas/farmhouse.jpg`}
                  alt="Freshly prepared Forno pizza"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    opacity-90
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-char/60 via-transparent to-transparent" />

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    rounded-xl
                    bg-char
                    px-4
                    py-3
                    text-flour
                    shadow-xl
                  "
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-crust-light">
                    Made fresh
                  </p>

                  <p className="mt-0.5 text-sm font-semibold">
                    Every order
                  </p>
                </div>

              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">

              <p className="section-label">
                Nothing unnecessary
              </p>

              <h2 className="section-title mt-4">
                Great pizza starts with{' '}
                <span className="gradient-text">
                  great ingredients.
                </span>
              </h2>

              <p className="section-description mt-6">
                We don't hide behind complicated recipes. We start with
                exceptional ingredients, give them time, and let the oven do
                the rest.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">

                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-char/10
                      bg-white/60
                      px-3
                      py-3
                    "
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-tomato" />

                    <span className="text-xs font-semibold text-char/70">
                      {ingredient}
                    </span>
                  </div>
                ))}

              </div>

              <Link
                to="/menu"
                className="
                  mt-9
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-tomato
                  transition-all
                  hover:gap-3
                "
              >
                Discover our menu
                <FiArrowRight size={16} />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          SIDES + DRINKS PROMO
      ===================================================== */}
      <section className="pb-20 sm:pb-28">

        <div className="page-container">

          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              bg-[#E8D4B4]
              px-6
              py-12
              sm:px-12
              sm:py-16
            "
          >

            <div className="relative z-10 max-w-xl">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tomato">
                Complete the feast
              </p>

              <h2 className="mt-3 font-display text-4xl font-semibold text-char sm:text-5xl">
                Pizza tastes better with sides.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-char/60 sm:text-base">
                Add crispy sides, refreshing drinks, or something sweet to
                finish your Forno order.
              </p>

              <Link
                to="/menu"
                className="btn-primary group mt-8 !px-7 !py-3.5"
              >
                Build your feast

                <FiArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

            </div>

            <div className="pointer-events-none absolute -right-8 -top-8 text-[9rem] leading-none sm:right-8 sm:text-[12rem]">
              🍕
            </div>

            <div className="pointer-events-none absolute bottom-4 right-28 text-5xl opacity-80 sm:right-52">
              🥤
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">

        <div
          className="
            page-container
            relative
            overflow-hidden
            rounded-[2rem]
            bg-char
            px-6
            py-16
            text-center
            sm:px-12
            sm:py-20
          "
        >

          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-tomato/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-crust/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tomato/15 text-tomato">
              <FiHeart size={24} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-crust-light">
              Your next pizza is waiting
            </p>

            <h2 className="mt-3 font-display text-4xl font-semibold text-flour sm:text-5xl">
              Hungry yet?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-flour/55 sm:text-base">
              Pick your favourite, build your own masterpiece, and we'll get
              it into the oven.
            </p>

            <Link
              to="/menu"
              className="btn-primary group mt-8 !px-7 !py-3.5"
            >
              Start your order

              <FiArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </section>

    </main>
  )
}

/* =========================================================
   HOME PIZZA CARD
   ========================================================= */

function HomePizzaCard({ item }) {
  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `${SERVER_BASE_URL}${item.image || ''}`

  return (
    <Link
      to="/menu"
      className="
        group
        overflow-hidden
        rounded-[1.5rem]
        border
        border-char/10
        bg-[#17191A]
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >

      <div className="relative aspect-[4/3] overflow-hidden">

        <img
          src={imageUrl}
          alt={item.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <span
          className="
            absolute
            left-4
            top-4
            rounded-full
            bg-char/90
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-flour
            backdrop-blur
          "
        >
          {item.category}
        </span>

        <div
          className="
            absolute
            bottom-4
            right-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-char/90
            text-flour
            shadow-lg
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          <FiArrowRight size={17} />
        </div>

      </div>

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <h3 className="font-display text-xl font-semibold text-flour">
            {item.name}
          </h3>

          <span className="shrink-0 rounded-full bg-tomato/10 px-3 py-1.5 text-sm font-bold text-tomato">
            ₹{Number(item.basePrice ?? item.price ?? 0).toFixed(2)}
          </span>

        </div>

        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-flour/50">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-flour/45">
          <FiClock size={13} />
          20–30 min
        </div>

      </div>

    </Link>
  )
}