import express from 'express';
import multer from 'multer';
import path from 'path';
import { Review, Product, User, UserGallery } from '../models/index.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/reviews/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create review with images
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const existingReview = await Review.findOne({ 
      where: { userId: req.user.id, productId }
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/reviews/${file.filename}`) : [];

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating: parseInt(rating),
      title,
      comment,
      images
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }]
    });

    res.status(201).json({
      success: true,
      review: reviewWithUser,
      message: 'Review submitted for approval'
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { 
        productId: req.params.productId, 
        isApproved: true 
      },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Get rating summary
    const ratingCounts = await Review.findAll({
      where: { productId: req.params.productId, isApproved: true },
      attributes: [
        'rating',
        [Review.sequelize.fn('COUNT', Review.sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    const ratingSummary = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    ratingCounts.forEach(item => {
      ratingSummary[item.rating] = parseInt(item.count);
    });

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json({
      success: true,
      reviews,
      ratingSummary,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: count,
      pagination: {
        page,
        pages: Math.ceil(count / limit),
        total: count,
        limit
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload user gallery image
router.post('/gallery', protect, upload.single('image'), async (req, res) => {
  try {
    const { productId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const galleryImage = await UserGallery.create({
      userId: req.user.id,
      productId,
      imageUrl: `/uploads/reviews/${req.file.filename}`,
      caption
    });

    res.status(201).json({
      success: true,
      galleryImage,
      message: 'Image submitted for approval'
    });
  } catch (error) {
    console.error('Upload gallery error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get approved user gallery for product
router.get('/gallery/:productId', async (req, res) => {
  try {
    const galleryImages = await UserGallery.findAll({
      where: { 
        productId: req.params.productId, 
        isApproved: true 
      },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      galleryImages
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Get pending reviews
router.get('/admin/pending', protect, admin, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { isApproved: false },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email']
      }, {
        model: Product,
        attributes: ['name', 'brand']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending gallery images
router.get('/admin/gallery/pending', protect, admin, async (req, res) => {
  try {
    const galleryImages = await UserGallery.findAll({
      where: { isApproved: false },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email']
      }, {
        model: Product,
        attributes: ['name', 'brand']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      galleryImages
    });
  } catch (error) {
    console.error('Get pending gallery error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject review
router.put('/admin/:id/approve', protect, admin, async (req, res) => {
  try {
    const { isApproved, adminNotes } = req.body;
    
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ isApproved, adminNotes });

    // Update product rating if approved
    if (isApproved) {
      const approvedReviews = await Review.findAll({
        where: { productId: review.productId, isApproved: true }
      });
      
      const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
      
      await Product.update(
        { 
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount: approvedReviews.length
        },
        { where: { id: review.productId } }
      );
    }

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject gallery image
router.put('/admin/gallery/:id/approve', protect, admin, async (req, res) => {
  try {
    const { isApproved, adminNotes } = req.body;
    
    const galleryImage = await UserGallery.findByPk(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    await galleryImage.update({ isApproved, adminNotes });

    res.json({
      success: true,
      message: `Gallery image ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Approve gallery error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;