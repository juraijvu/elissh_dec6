const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  return fetch(url, config);
};

export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await response.json() };
  },
  
  register: async (data: any) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await response.json() };
  }
};

export const bannerAPI = {
  getBanners: async (area: string) => {
    try {
      const url = `${API_BASE}/banner/${area}?t=${Date.now()}`;
      console.log(`🔍 Fetching banners for ${area} from:`, url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`❌ Banner API error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      console.log(`✅ Banners loaded for ${area}:`, data.banners?.length || 0, 'banners');
      return data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { success: false, banners: [] };
    }
  },
  trackClick: async (bannerId: number) => {
    try {
      const response = await fetch(`${API_BASE}/banner/${bannerId}/click`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.error('Error tracking banner click:', error);
      return { success: false };
    }
  }
};

export const categoriesAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, categories: [] };
    }
  },
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, categories: [] };
    }
  }
};

export const productsAPI = {
  getAll: async (params?: any) => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, products: [] };
    }
  },
  getProducts: async (params?: any) => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, products: [] };
    }
  },
  getFeatured: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/featured/list`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { success: false, products: [] };
    }
  },
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/featured/list`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { success: false, products: [] };
    }
  },
  getSale: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/sale/list`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sale products:', error);
      return { success: false, products: [] };
    }
  },
  getSaleProducts: async () => {
    try {
      const response = await fetch(`${API_BASE}/products/sale/list`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sale products:', error);
      return { success: false, products: [] };
    }
  },
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, product: null };
    }
  },
  getRelated: async (categoryId: string) => {
    try {
      const response = await fetch(`${API_BASE}/products?category=${categoryId}&limit=4`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching related products:', error);
      return { success: false, products: [] };
    }
  }
};

export const cartAPI = {
  add: async (data: { productId: number; quantity: number; variant?: any }) => {
    const response = await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  get: async () => {
    const response = await apiCall('/cart');
    return await response.json();
  }
};

export const wishlistAPI = {
  add: async (productId: number) => {
    const response = await apiCall(`/wishlist/add/${productId}`, {
      method: 'POST'
    });
    return await response.json();
  },
  remove: async (productId: number) => {
    const response = await apiCall(`/wishlist/remove/${productId}`, {
      method: 'DELETE'
    });
    return await response.json();
  },
  get: async () => {
    const response = await apiCall('/wishlist');
    return await response.json();
  }
};

export const seoAPI = {
  getByEntity: async (entityType: string, entityId: number) => {
    const response = await apiCall(`/seo/${entityType}/${entityId}`);
    return await response.json();
  },
  getBySlug: async (slug: string) => {
    const response = await apiCall(`/seo/slug/${slug}`);
    return await response.json();
  },
  create: async (data: any) => {
    const response = await apiCall('/seo', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  update: async (id: number, data: any) => {
    const response = await apiCall(`/seo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  generateSuggestions: async (entityType: string, entityId: number) => {
    const response = await apiCall(`/seo/generate/${entityType}/${entityId}`, {
      method: 'POST'
    });
    return await response.json();
  },
  getSchema: async (entityType: string, entityId: number) => {
    const response = await apiCall(`/seo/schema/${entityType}/${entityId}`);
    return await response.json();
  }
};

export const reviewsAPI = {
  createReview: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw { response: { data: error } };
    }
    return await response.json();
  },
  getProductReviews: async (productId: string) => {
    const response = await fetch(`${API_BASE}/reviews/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  },
  uploadGalleryImage: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reviews/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw { response: { data: error } };
    }
    return await response.json();
  },
  getProductGallery: async (productId: string) => {
    const response = await fetch(`${API_BASE}/reviews/gallery/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch gallery');
    return await response.json();
  },
  // Admin endpoints
  getPendingReviews: async () => {
    const response = await apiCall('/reviews/admin/pending');
    return await response.json();
  },
  getPendingGallery: async () => {
    const response = await apiCall('/reviews/admin/gallery/pending');
    return await response.json();
  },
  approveReview: async (id: number, data: { isApproved: boolean; adminNotes?: string }) => {
    const response = await apiCall(`/reviews/admin/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  },
  approveGalleryImage: async (id: number, data: { isApproved: boolean; adminNotes?: string }) => {
    const response = await apiCall(`/reviews/admin/gallery/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  }
};

const api = {
  apiCall,
  authAPI,
  bannerAPI,
  categoriesAPI,
  productsAPI,
  cartAPI,
  wishlistAPI,
  seoAPI,
  reviewsAPI,
  
  // HTTP methods
  get: async (endpoint: string) => {
    return apiCall(endpoint);
  },
  
  post: async (endpoint: string, data?: any, options?: RequestInit) => {
    const isFormData = data instanceof FormData;
    return apiCall(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options?.headers
      }
    });
  },
  
  put: async (endpoint: string, data?: any) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (endpoint: string) => {
    return apiCall(endpoint, {
      method: 'DELETE'
    });
  }
};

export default api;