import React, { useState, useEffect } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  adminUsers: number;
  verifiedUsers: number;
  totalProductValue: number;
  avgProductPrice: number;
  userGrowthRate: string;
  stockAlerts: number;
  lowStockProducts: Array<{
    id: number;
    name: string;
    stock: number;
    price: number;
  }>;
  recentUsers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
  }>;
  categoryStats: Array<{
    id: number;
    name: string;
    productCount: number;
  }>;
  monthlyUsers: Array<{
    month: string;
    count: number;
  }>;
}

const ComprehensiveDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
        <button 
          onClick={fetchDashboardData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '16px'
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center' as const,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center'
  };

  return (
    <div style={{ padding: '24px' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        Admin Dashboard
      </h1>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Products</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalProducts}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalUsers}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Categories</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalCategories}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Verified Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{stats.verifiedUsers}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Stock Alerts</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{stats.stockAlerts}</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Avg Product Price</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            ${stats.avgProductPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Low Stock Products */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#dc2626' }}>
            Low Stock Alert ({stats.lowStockProducts.length})
          </h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{product.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>${product.price}</p>
                </div>
                <span style={{ 
                  padding: '4px 8px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Recent Users
          </h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {stats.recentUsers.map((user) => (
              <div key={user.id} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '2px 6px',
                    backgroundColor: user.role === 'admin' ? '#fee2e2' : '#f3f4f6',
                    color: user.role === 'admin' ? '#dc2626' : '#374151',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {user.role}
                  </span>
                  <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Category Distribution
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {stats.categoryStats.map((category) => (
            <div key={category.id} style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {category.name}
              </h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {category.productCount} products
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Latest Products
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>${product.price}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: product.stock > 10 ? '#dcfce7' : '#fee2e2',
                      color: product.stock > 10 ? '#16a34a' : '#dc2626',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Business Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Product Value</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
              ${stats.totalProductValue.toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>User Verification Rate</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.userGrowthRate}%
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Admin Users</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
              {stats.adminUsers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;