import express from 'express';
import { Op } from 'sequelize';
import { Product, Category, Banner, User, Order, Wallet } from '../models/index.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(admin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { Wallet } = await import('../models/index.js');
    
    const [
      totalProducts,
      totalCategories,
      totalBanners,
      totalUsers,
      totalOrders,
      recentOrders,
      lowStockProducts,
      recentUsers,
      productStats,
      walletStats
    ] = await Promise.all([
      Product.count(),
      Category.count(),
      Banner.count(),
      User.count(),
      Order.count(),
      Order.findAll({
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['id', 'orderNumber', 'total', 'status', 'createdAt']
      }),
      Product.findAll({
        where: {
          stock: { [Op.lte]: 10 }
        },
        limit: 10,
        order: [['stock', 'ASC']],
        attributes: ['id', 'name', 'stock', 'price']
      }),
      User.findAll({
        include: [{
          model: Wallet,
          attributes: ['balance', 'loyaltyPoints']
        }],
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt']
      }),
      Product.findAll({
        attributes: [
          [Product.sequelize.fn('AVG', Product.sequelize.col('price')), 'avgPrice'],
          [Product.sequelize.fn('SUM', Product.sequelize.literal('price * stock')), 'totalValue']
        ],
        raw: true
      }),
      Wallet.findAll({
        attributes: [
          [Wallet.sequelize.fn('SUM', Wallet.sequelize.col('balance')), 'totalBalance'],
          [Wallet.sequelize.fn('SUM', Wallet.sequelize.col('loyaltyPoints')), 'totalPoints'],
          [Wallet.sequelize.fn('AVG', Wallet.sequelize.col('loyaltyPoints')), 'avgPoints']
        ],
        raw: true
      })
    ]);

    // Calculate revenue (sum of completed orders)
    const revenueResult = await Order.sum('total', {
      where: {
        status: ['delivered']
      }
    });

    const revenue = revenueResult || 0;
    const verifiedUsers = await User.count({ where: { isVerified: true } });
    
    // Extract calculated values
    const avgProductPrice = parseFloat(productStats[0]?.avgPrice || 0);
    const totalProductValue = parseFloat(productStats[0]?.totalValue || 0);
    const totalWalletBalance = parseFloat(walletStats[0]?.totalBalance || 0);
    const totalLoyaltyPoints = parseInt(walletStats[0]?.totalPoints || 0);
    const avgLoyaltyPoints = parseFloat(walletStats[0]?.avgPoints || 0);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalBanners,
          totalUsers,
          totalOrders,
          revenue,
          stockAlerts: lowStockProducts.length,
          verifiedUsers: verifiedUsers || 0,
          totalLoyaltyPoints,
          totalWalletBalance,
          avgLoyaltyPoints,
          totalProductValue,
          avgProductPrice
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          User: order.User
        })),
        lowStockProducts,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all categories for admin
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Admin categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    
    // Generate unique SKU if not provided
    if (!req.body.sku) {
      req.body.sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    const product = await Product.create(req.body);
    console.log('Product created successfully:', product.id);
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists. Please use a different SKU.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.update(req.body);
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.destroy();
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;