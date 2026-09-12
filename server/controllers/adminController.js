import Order from '../models/Order.js'
import User from '../models/User.js'
import MenuItem from '../models/MenuItem.js'

export async function getDashboardStats(req, res) {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalMenuItems,
      activeOrders,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),

      User.countDocuments({
        role: 'customer',
      }),

      MenuItem.countDocuments(),

      Order.countDocuments({
        status: {
          $in: [
            'placed',
            'confirmed',
            'preparing',
            'baking',
            'out_for_delivery',
          ],
        },
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            status: {
              $ne: 'cancelled',
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$total',
            },
          },
        },
      ]),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          'customerName items total status paymentStatus createdAt'
        )
        .lean(),
    ])

    const totalRevenue = revenueResult[0]?.total || 0

    res.json({
      stats: {
        totalOrders,
        totalCustomers,
        totalMenuItems,
        activeOrders,
        totalRevenue,
      },
      recentOrders,
    })
  } catch (error) {
    console.error('[admin] dashboard stats error:', error)

    res.status(500).json({
      message: 'Failed to load dashboard statistics.',
    })
  }
}