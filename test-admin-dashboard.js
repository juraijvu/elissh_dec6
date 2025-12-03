import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const testAdminDashboard = async () => {
  try {
    console.log('🧪 Testing Admin Dashboard API...\n');

    // Step 1: Login as admin
    console.log('1. Admin Authentication...');
    let token;
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@elisshbeauty.ae',
        password: 'admin123'
      });
      
      if (loginResponse.data.success && loginResponse.data.token) {
        token = loginResponse.data.token;
        console.log('✅ Admin login successful');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Test dashboard endpoint
    console.log('\n2. Testing Dashboard Endpoint...');
    try {
      const dashboardResponse = await axios.get(`${API_BASE}/admin/dashboard`, { headers });
      
      if (dashboardResponse.data.success) {
        console.log('✅ Dashboard API working');
        const stats = dashboardResponse.data.data.stats;
        console.log('📊 Dashboard Stats:');
        console.log(`   Products: ${stats.totalProducts}`);
        console.log(`   Users: ${stats.totalUsers}`);
        console.log(`   Orders: ${stats.totalOrders}`);
        console.log(`   Categories: ${stats.totalCategories}`);
        console.log(`   Revenue: AED ${stats.revenue}`);
        console.log(`   Stock Alerts: ${stats.stockAlerts}`);
        console.log(`   Loyalty Points: ${stats.totalLoyaltyPoints}`);
        console.log(`   Wallet Balance: AED ${stats.totalWalletBalance}`);
        
        console.log(`\n📋 Recent Data:`);
        console.log(`   Recent Orders: ${dashboardResponse.data.data.recentOrders?.length || 0}`);
        console.log(`   Recent Users: ${dashboardResponse.data.data.recentUsers?.length || 0}`);
        console.log(`   Low Stock Products: ${dashboardResponse.data.data.lowStockProducts?.length || 0}`);
      } else {
        console.log('❌ Dashboard API failed:', dashboardResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Dashboard API failed:', error.response?.data?.message || error.message);
      if (error.response?.status === 500) {
        console.log('   This might be due to missing database tables or data');
        console.log('   Try running: npm run seed');
      }
    }

    console.log('\n🎉 Admin Dashboard API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAdminDashboard();