import React, { useState, useEffect } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  verifiedUsers: number;
  stockAlerts: number;
  avgProductPrice: number;
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
}

const SimpleDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('${import.meta.env.VITE_API_URL}/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setError('');
      } else {
        setError(data.message || 'Failed to load data');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Dashboard Error</h1>
        <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
        <button 
          onClick={fetchData}
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

  if (!stats) {
    return <div style={{ padding: '24px' }}>No data available</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Products</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            {stats.totalProducts}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            {stats.totalUsers}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Categories</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            {stats.totalCategories}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Verified Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
            {stats.verifiedUsers}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Stock Alerts</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
            {stats.stockAlerts}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Avg Price</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            ${stats.avgProductPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Low Stock Products */}
      {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#dc2626' }}>
            Low Stock Alert ({stats.lowStockProducts.length})
          </h2>
          <div>
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500' }}>{product.name}</p>
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
      )}

      {/* Recent Users */}
      {stats.recentUsers && stats.recentUsers.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Recent Users
          </h2>
          <div>
            {stats.recentUsers.map((user) => (
              <div key={user.id} style={{ 
                padding: '12px', 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500' }}>
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
      )}
    </div>
  );
};

export default SimpleDashboard;
