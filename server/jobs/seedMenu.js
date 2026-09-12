import connectDB from '../config/db.js'
import mongoose from 'mongoose'
import MenuItem from '../models/MenuItem.js'
import User from '../models/User.js'

const MENU_ITEMS = [
  // =========================
  // CLASSIC PIZZAS
  // =========================

  {
    name: 'Margherita',
    description: 'San Marzano tomato, mozzarella, fresh basil, olive oil.',
    basePrice: 299,
    category: 'Classic',
    tags: ['Vegetarian'],
    image: '/images/pizzas/margherita.jpg',
  },
  {
    name: 'Marinara',
    description: 'Tomato, garlic, oregano, olive oil — no cheese.',
    basePrice: 249,
    category: 'Classic',
    tags: ['Vegan'],
    image: '/images/pizzas/marinara.jpg',
  },
  {
    name: 'Farmhouse',
    description: 'Onion, capsicum, tomato, mushroom and mozzarella.',
    basePrice: 349,
    category: 'Classic',
    tags: ['Vegetarian'],
    image: '/images/pizzas/farmhouse.jpg',
  },
  {
    name: 'Cheese & Corn',
    description: 'Sweet corn, mozzarella and creamy cheese sauce.',
    basePrice: 329,
    category: 'Classic',
    tags: ['Vegetarian'],
    image: '/images/pizzas/cheese-corn.jpg',
  },

  // =========================
  // SPECIALTY PIZZAS
  // =========================

  {
    name: 'Diavola',
    description: 'Spicy soppressata, chili honey and mozzarella.',
    basePrice: 399,
    category: 'Specialty',
    tags: ['Spicy'],
    image: '/images/pizzas/diavola.jpg',
  },
  {
    name: 'Funghi e Tartufo',
    description: 'Wild mushroom, truffle cream, thyme and parmesan.',
    basePrice: 449,
    category: 'Specialty',
    tags: ['Vegetarian'],
    image: '/images/pizzas/funghi-tartufo.jpg',
  },
  {
    name: 'Prosciutto e Rucola',
    description: 'San Daniele prosciutto, arugula and shaved parmesan.',
    basePrice: 499,
    category: 'Specialty',
    tags: [],
    image: '/images/pizzas/prosciutto-rucola.jpg',
  },
  {
    name: 'Pepperoni Feast',
    description: 'Loaded pepperoni, mozzarella and rich tomato sauce.',
    basePrice: 429,
    category: 'Specialty',
    tags: [],
    image: '/images/pizzas/pepperoni-feast.jpg',
  },
  {
    name: 'BBQ Chicken',
    description: 'Grilled chicken, BBQ sauce, onion and mozzarella.',
    basePrice: 449,
    category: 'Specialty',
    tags: [],
    image: '/images/pizzas/bbq-chicken.jpg',
  },
  {
    name: 'Spicy Chicken',
    description: 'Spiced chicken, jalapeños, onion and mozzarella.',
    basePrice: 459,
    category: 'Specialty',
    tags: ['Spicy'],
    image: '/images/pizzas/spicy-chicken.jpg',
  },

  // =========================
  // VEGETARIAN PIZZAS
  // =========================

  {
    name: 'Quattro Formaggi',
    description: 'Mozzarella, gorgonzola, fontina and parmesan.',
    basePrice: 429,
    category: 'Vegetarian',
    tags: ['Vegetarian'],
    image: '/images/pizzas/quattro-formaggi.jpg',
  },
  {
    name: 'Paneer Tikka',
    description: 'Tandoori paneer, onion, capsicum and mozzarella.',
    basePrice: 399,
    category: 'Vegetarian',
    tags: ['Vegetarian', 'Spicy'],
    image: '/images/pizzas/paneer-tikka.jpg',
  },
  {
    name: 'Garden Fresh',
    description: 'Bell peppers, onion, olives, mushrooms and tomato.',
    basePrice: 379,
    category: 'Vegetarian',
    tags: ['Vegetarian'],
    image: '/images/pizzas/garden-fresh.jpg',
  },
  {
    name: 'Pesto Veggie',
    description: 'Basil pesto, cherry tomato, spinach and mozzarella.',
    basePrice: 389,
    category: 'Vegetarian',
    tags: ['Vegetarian'],
    image: '/images/pizzas/pesto-veggie.jpg',
  },

  // =========================
  // SIDES
  // =========================

  {
    name: 'Garlic Knots',
    description: 'Six knots with roasted garlic butter and parsley.',
    basePrice: 149,
    category: 'Sides',
    tags: ['Vegetarian'],
    image: '/images/sides/garlic-knots.jpg',
  },
  {
    name: 'Cheesy Garlic Bread',
    description: 'Toasted garlic bread topped with melted mozzarella.',
    basePrice: 179,
    category: 'Sides',
    tags: ['Vegetarian'],
    image: '/images/sides/cheesy-garlic-bread.jpg',
  },
  {
    name: 'Potato Wedges',
    description: 'Crispy seasoned potato wedges with a creamy dip.',
    basePrice: 159,
    category: 'Sides',
    tags: ['Vegetarian'],
    image: '/images/sides/potato-wedges.jpg',
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy chicken wings tossed in your choice of sauce.',
    basePrice: 249,
    category: 'Sides',
    tags: [],
    image: '/images/sides/chicken-wings.jpg',
  },
  {
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone.',
    basePrice: 199,
    category: 'Sides',
    tags: ['Vegetarian'],
    image: '/images/sides/tiramisu.jpg',
  },

  // =========================
  // DRINKS
  // =========================

  {
    name: 'Coca-Cola',
    description: 'Chilled Coca-Cola, 500ml.',
    basePrice: 60,
    category: 'Drinks',
    tags: [],
    image: '/images/drinks/coca-cola.jpg',
  },
  {
    name: 'Pepsi',
    description: 'Chilled Pepsi, 500ml.',
    basePrice: 60,
    category: 'Drinks',
    tags: [],
    image: '/images/drinks/pepsi.jpg',
  },
  {
    name: 'Sprite',
    description: 'Chilled lemon-lime soft drink, 500ml.',
    basePrice: 60,
    category: 'Drinks',
    tags: [],
    image: '/images/drinks/sprite.jpg',
  },
  {
    name: 'Fresh Lemonade',
    description: 'Freshly prepared lemon juice with a refreshing finish.',
    basePrice: 99,
    category: 'Drinks',
    tags: ['Vegetarian'],
    image: '/images/drinks/lemonade.jpg',
  },
  {
    name: 'Iced Tea',
    description: 'Refreshing chilled lemon iced tea.',
    basePrice: 89,
    category: 'Drinks',
    tags: ['Vegetarian'],
    image: '/images/drinks/iced-tea.jpg',
  },
  {
    name: 'Mineral Water',
    description: 'Packaged drinking water, 1 litre.',
    basePrice: 40,
    category: 'Drinks',
    tags: [],
    image: '/images/drinks/mineral-water.jpg',
  },
  {
    name: 'Mango Cooler',
    description: 'Chilled mango-based fruit cooler.',
    basePrice: 119,
    category: 'Drinks',
    tags: ['Vegetarian'],
    image: '/images/drinks/mango-cooler.jpg',
  },
]

async function seed() {
  try {
    await connectDB()

    await MenuItem.deleteMany({})

    await MenuItem.insertMany(MENU_ITEMS)

    console.log(
      `[seed] inserted ${MENU_ITEMS.length} menu items`
    )

    const adminEmail = 'admin@forno.example'

    const existingAdmin = await User.findOne({
      email: adminEmail,
    })

    if (!existingAdmin) {
      await User.create({
        name: 'Forno Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      })

      console.log(
        `[seed] created admin account: ${adminEmail} / admin123`
      )
    } else {
      console.log(
        '[seed] admin account already exists, skipping'
      )
    }

    await mongoose.disconnect()

    console.log('[seed] done')
  } catch (error) {
    console.error('[seed] failed:', error)
    process.exit(1)
  }
}

seed()