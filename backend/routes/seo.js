import express from 'express';
import { SEO } from '../models/index.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get SEO data for a specific page (public)
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    
    const seoData = await SEO.findOne({
      where: { 
        page: page,
        isActive: true 
      }
    });

    if (!seoData) {
      return res.status(404).json({
        success: false,
        message: 'SEO data not found for this page'
      });
    }

    res.json({
      success: true,
      seo: seoData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all SEO pages (admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const seoPages = await SEO.findAll({
      order: [['page', 'ASC']]
    });

    res.json({
      success: true,
      pages: seoPages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create or update SEO data (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page, ...seoData } = req.body;

    const [seo, created] = await SEO.findOrCreate({
      where: { page },
      defaults: { page, ...seoData }
    });

    if (!created) {
      await seo.update(seoData);
    }

    res.json({
      success: true,
      seo,
      message: created ? 'SEO data created successfully' : 'SEO data updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete SEO data (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const seo = await SEO.findByPk(req.params.id);
    
    if (!seo) {
      return res.status(404).json({
        success: false,
        message: 'SEO data not found'
      });
    }

    await seo.destroy();

    res.json({
      success: true,
      message: 'SEO data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;