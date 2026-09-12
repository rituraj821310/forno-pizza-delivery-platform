import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        'Classic',
        'Specialty',
        'Vegetarian',
        'Sides',
        'Drinks',
      ],
      default: 'Classic',
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: '',
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
)

menuItemSchema.index({
  name: 'text',
  description: 'text',
})

const MenuItem = mongoose.model(
  'MenuItem',
  menuItemSchema
)

export default MenuItem