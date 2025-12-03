import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, DollarSign, Users, TrendingUp, Eye, Download, RefreshCw, Star, Truck, Clock, CheckCircle, AlertCircle, Filter, Search, Calendar } from 'lucide-react';
import LoyaltyWidget from '@/components/LoyaltyWidget';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  verifiedUsers: number;
  stockAlerts: number;
  avgProductPrice: number;
  totalProductValue: number;
  totalOrders: number;
  totalLoyaltyPoints: number;
  totalWalletBalance: number;
  avgLoyaltyPoints: number;
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
    Wallet?: {
      balance: number;
      loyaltyPoints: number;
    };
  }>;
  recentOrders: Array<{
    id: number;
    orderNumber?: string;
    total: number;
    status: string;
    createdAt: string;
    User: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dashboard data received:', data);
      
      if (data.success) {
        setStats({
          ...data.data.stats,
          lowStockProducts: data.data.lowStockProducts || [],
          recentUsers: data.data.recentUsers || [],
          recentOrders: data.data.recentOrders || []
        });
        
        // Generate dynamic notifications based on data
        const dynamicNotifications = [];
        if (data.data.lowStockProducts?.length > 0) {
          dynamicNotifications.push({
            id: 1,
            type: 'stock_alert',
            message: `${data.data.lowStockProducts.length} products are running low on stock`,
            priority: 'high',
            time: 'Now'
          });
        }
        if (data.data.recentOrders?.length > 0) {
          dynamicNotifications.push({
            id: 2,
            type: 'new_order',
            message: `${data.data.recentOrders.length} new orders received recently`,
            priority: 'medium',
            time: '1 hour ago'
          });
        }
        dynamicNotifications.push({
          id: 3,
          type: 'system',
          message: 'Dashboard data updated successfully',
          priority: 'low',
          time: 'Just now'
        });
        
        setNotifications(dynamicNotifications);
      } else {
        console.error('Dashboard API returned error:', data.message);
        // Set default empty stats to prevent crashes
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalCategories: 0,
          verifiedUsers: 0,
          stockAlerts: 0,
          avgProductPrice: 0,
          totalProductValue: 0,
          totalOrders: 0,
          totalLoyaltyPoints: 0,
          totalWalletBalance: 0,
          avgLoyaltyPoints: 0,
          lowStockProducts: [],
          recentUsers: [],
          recentOrders: []
        });
        setNotifications([{
          id: 1,
          type: 'error',
          message: 'Failed to load dashboard data',
          priority: 'high',
          time: 'Now'
        }]);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      // Set default empty stats to prevent crashes
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
        verifiedUsers: 0,
        stockAlerts: 0,
        avgProductPrice: 0,
        totalProductValue: 0,
        totalOrders: 0,
        totalLoyaltyPoints: 0,
        totalWalletBalance: 0,
        avgLoyaltyPoints: 0,
        lowStockProducts: [],
        recentUsers: [],
        recentOrders: []
      });
      setNotifications([{
        id: 1,
        type: 'error',
        message: `Dashboard error: ${error.message}`,
        priority: 'high',
        time: 'Now'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const [activeFilter, setActiveFilter] = useState('all');
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 299.99,
      status: 'delivered',
      items: [
        { name: 'Matte Lipstick', image: '/api/placeholder/60/60', price: 89.99, qty: 1 },
        { name: 'Foundation', image: '/api/placeholder/60/60', price: 149.99, qty: 1 },
        { name: 'Mascara', image: '/api/placeholder/60/60', price: 59.99, qty: 1 }
      ],
      timeline: [
        { status: 'placed', time: '2024-01-15 10:30', completed: true },
        { status: 'processing', time: '2024-01-15 14:20', completed: true },
        { status: 'shipped', time: '2024-01-16 09:15', completed: true },
        { status: 'delivered', time: '2024-01-17 16:45', completed: true }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      total: 189.50,
      status: 'shipped',
      items: [
        { name: 'Serum', image: '/api/placeholder/60/60', price: 129.99, qty: 1 },
        { name: 'Moisturizer', image: '/api/placeholder/60/60', price: 59.51, qty: 1 }
      ],
      timeline: [
        { status: 'placed', time: '2024-01-20 11:00', completed: true },
        { status: 'processing', time: '2024-01-20 15:30', completed: true },
        { status: 'shipped', time: '2024-01-21 08:00', completed: true },
        { status: 'delivered', time: '', completed: false }
      ]
    }
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-500',
      processing: 'bg-yellow-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      placed: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const filterOrders = (filter) => {
    setActiveFilter(filter);
    // Filter logic would be implemented here
  };

  return (
    <div className="p-6 pt-2 space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store performance and metrics</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading dashboard data...</p>
          <p className="text-sm text-muted-foreground mt-2">Fetching real-time statistics and metrics</p>
        </div>
      ) : (
        <>
          {/* Header Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
                    <p className="text-xs text-green-600">Active inventory</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Product Value</p>
                    <p className="text-3xl font-bold">AED {stats?.totalProductValue?.toFixed(0) || 0}</p>
                    <p className="text-xs text-green-600">Total inventory value</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    <p className="text-xs text-green-600">{stats?.verifiedUsers || 0} verified</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
                    <p className="text-xs text-green-600">All time orders</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Loyalty Points</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats?.totalLoyaltyPoints || 0}</p>
                    <p className="text-xs text-yellow-600">Points distributed</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                    <p className="text-3xl font-bold text-green-600">AED {stats?.totalWalletBalance?.toFixed(0) || 0}</p>
                    <p className="text-xs text-green-600">Total user wallets</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stock Alerts</p>
                    <p className="text-3xl font-bold text-red-600">{stats?.stockAlerts || 0}</p>
                    <p className="text-xs text-red-600">Low stock items</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!loading && (
        <>
          {/* Notifications Center */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Center
                <Badge variant="destructive" className="ml-2">{notifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${notification.priority === 'high' ? 'bg-red-500' : notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <span className="text-sm">{notification.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Low Stock Alert
                  <Badge variant="destructive" className="ml-2">{stats.lowStockProducts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.lowStockProducts.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <Badge variant="destructive" className="text-xs">
                          {product.stock} left
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">AED {product.price}</p>
                      <Button size="sm" className="w-full">
                        Restock Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Users with Wallet Info */}
          {stats?.recentUsers && stats.recentUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users & Wallets
                  <Badge className="ml-2">{stats.recentUsers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.Wallet && (
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {user.Wallet.loyaltyPoints} pts
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                AED {user.Wallet.balance}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                          {user.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Recent Orders */}
          {stats?.recentOrders && stats.recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Orders
                  <Badge className="ml-2">{stats.recentOrders.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          #{order.id}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {order.User.firstName} {order.User.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.User.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">AED {order.total}</p>
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : 
                                  order.status === 'shipped' ? 'secondary' : 'outline'}
                          className="text-xs mt-1"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!loading && (
        <>
          {/* Enhanced Loyalty & Wallet Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Loyalty & Wallet System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Loyalty Points</h4>
                  <p className="text-2xl font-bold text-yellow-600">{stats?.totalLoyaltyPoints || 0}</p>
                  <p className="text-sm text-yellow-700">Total points distributed</p>
                  <p className="text-xs text-yellow-600 mt-1">Avg: {stats?.avgLoyaltyPoints || 0} per user</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Wallet Balance</h4>
                  <p className="text-2xl font-bold text-green-600">AED {stats?.totalWalletBalance?.toFixed(0) || 0}</p>
                  <p className="text-sm text-green-700">Total user wallets</p>
                  <p className="text-xs text-green-600 mt-1">Ready for redemption</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Conversion Rate</h4>
                  <p className="text-2xl font-bold text-blue-600">1:0.01</p>
                  <p className="text-sm text-blue-700">Points to AED</p>
                  <p className="text-xs text-blue-600 mt-1">100 pts = AED 1.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order Management
            <div className="flex items-center gap-2">
              <Input placeholder="Search orders..." className="w-64" />
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {['all', 'last30days', 'open', 'delivered', 'cancelled'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                onClick={() => filterOrders(filter)}
                className="capitalize"
              >
                {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Button>
            ))}
          </div>

          {/* Order Cards */}
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">AED {order.total}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                      </div>
                    </div>

                    {/* Status Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        {order.timeline.map((step, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-muted'}`}>
                              {getStatusIcon(step.status)}
                            </div>
                            <span className="text-xs mt-1 capitalize">{step.status}</span>
                          </div>
                        ))}
                      </div>
                      <div className="w-full bg-muted h-2 rounded">
                        <div 
                          className="bg-primary h-2 rounded transition-all duration-500"
                          style={{ width: `${(order.timeline.filter(s => s.completed).length / order.timeline.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Item Preview */}
                    <div className="flex items-center gap-2 mb-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img key={index} src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-muted-foreground">+{order.items.length - 3} more items</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'shipped' && (
                        <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Shipment
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <>
                          <Button size="sm" variant="outline" className="bg-green-50 hover:bg-green-100">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            One-Click Reorder
                          </Button>
                          <Button size="sm" variant="outline" className="bg-yellow-50 hover:bg-yellow-100">
                            <Star className="w-4 h-4 mr-2" />
                            Write Review (+50 pts)
                          </Button>
                          <Button size="sm" variant="outline" className="bg-red-50 hover:bg-red-100">
                            Return/Exchange
                          </Button>
                        </>
                      )}
                      {(order.status === 'placed' || order.status === 'processing') && (
                        <Button size="sm" variant="destructive">
                          Cancel Order
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        PDF Invoice
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t bg-muted/50 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Timeline */}
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Order Timeline
                          </h4>
                          <div className="space-y-4">
                            {order.timeline.map((step, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-muted'}`}>
                                  {getStatusIcon(step.status)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium capitalize">{step.status.replace('_', ' ')}</p>
                                  <p className="text-xs text-muted-foreground">{step.time}</p>
                                  {step.status === 'shipped' && (
                                    <p className="text-xs text-blue-600 mt-1">Tracking: UAE123456789</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Item Breakdown */}
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Items Ordered
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-background rounded">
                                <div className="flex items-center gap-3">
                                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                  <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                                    <Badge variant="outline" className="text-xs mt-1">Shade: Rose Gold</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">AED {item.price}</p>
                                  <Button size="sm" variant="ghost" className="text-xs mt-1">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Reorder
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial & Shipping Details */}
                        <div className="space-y-6">
                          {/* Financial Summary */}
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Financial Summary
                            </h4>
                            <div className="space-y-2 p-4 bg-background rounded">
                              <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>AED {(order.total * 0.85).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Discount:</span>
                                <span className="text-green-600">-AED {(order.total * 0.1).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span>AED 15.00</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>VAT (5%):</span>
                                <span>AED {(order.total * 0.05).toFixed(2)}</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>AED {order.total}</span>
                              </div>
                              <div className="text-xs text-green-600 mt-2">
                                ✓ Points Earned: {Math.floor(order.total)} pts
                              </div>
                            </div>
                          </div>

                          {/* Shipping Details */}
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Shipping Details
                            </h4>
                            <div className="space-y-3">
                              <div className="p-3 bg-background rounded">
                                <p className="text-sm font-medium mb-1">Shipping Address</p>
                                <p className="text-xs text-muted-foreground">
                                  Ahmed Al Mansouri<br />
                                  Apartment 1205, Marina Heights<br />
                                  Dubai Marina, Dubai<br />
                                  United Arab Emirates<br />
                                  Phone: +971 50 123 4567
                                </p>
                              </div>
                              <div className="p-3 bg-background rounded">
                                <p className="text-sm font-medium mb-1">Courier Information</p>
                                <p className="text-xs text-muted-foreground">
                                  Emirates Post<br />
                                  Tracking: <span className="text-blue-600 cursor-pointer">UAE123456789</span><br />
                                  Expected: Jan 22, 2024
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminDashboard;