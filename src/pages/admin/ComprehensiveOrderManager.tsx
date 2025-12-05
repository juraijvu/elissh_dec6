import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Printer, Truck, Clock, CheckCircle, AlertCircle, Search, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OrderReceipt from '@/components/OrderReceipt';

const ComprehensiveOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Transform the data to match the expected format
        const transformedOrders = data.orders.map(order => ({
          id: order.orderNumber,
          orderId: order.id,
          date: order.createdAt,
          customerName: `${order.User?.firstName || ''} ${order.User?.lastName || ''}`.trim() || order.User?.name || 'N/A',
          customerEmail: order.User?.email || 'N/A',
          phone: order.shippingAddress?.phone || 'N/A',
          total: parseFloat(order.total),
          status: order.status,
          paymentMethod: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
          paymentStatus: order.paymentStatus || 'pending',
          shippingAddress: {
            name: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
            address: order.shippingAddress?.street || '',
            city: order.shippingAddress?.city || '',
            emirate: order.shippingAddress?.state || '',
            country: 'United Arab Emirates',
            phone: order.shippingAddress?.phone || ''
          },
          items: order.items?.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            image: '/api/placeholder/60/60'
          })) || [],
          timeline: order.statusHistory?.map(status => ({
            status: status.status,
            time: new Date(status.timestamp).toLocaleString(),
            completed: true
          })) || [
            { status: 'placed', time: new Date(order.createdAt).toLocaleString(), completed: true }
          ],
          trackingNumber: order.trackingNumber || null
        }));
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({ title: 'Failed to fetch orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // Status filtering is now done in the API call
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${order.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Status updated to ${newStatus} by admin`
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast({ title: 'Order status updated successfully!' });
      } else {
        toast({ title: data.message || 'Failed to update order status', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({ title: 'Failed to update order status', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      placed: 'bg-blue-500',
      processing: 'bg-yellow-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
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

  const handleShowReceipt = (order: any) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  return (
    <div className="p-8 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Comprehensive order tracking and management</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Cards */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading orders...</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('en-AE')}</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Customer:</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment:</p>
                      <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
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
                    <Button size="sm" variant="outline" onClick={() => handleShowReceipt(order)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.print()}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print Order
                    </Button>
                    {order.trackingNumber && (
                      <Button size="sm" variant="outline">
                        <Truck className="w-4 h-4 mr-2" />
                        Track: {order.trackingNumber}
                      </Button>
                    )}
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t bg-muted/50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Timeline */}
                      <div>
                        <h4 className="font-semibold mb-4">Order Timeline</h4>
                        <div className="space-y-3">
                          {order.timeline.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-muted'}`}>
                                {getStatusIcon(step.status)}
                              </div>
                              <div>
                                <p className="text-sm font-medium capitalize">{step.status}</p>
                                <p className="text-xs text-muted-foreground">{step.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div>
                        <h4 className="font-semibold mb-4">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-background rounded">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                <div>
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-sm font-medium">AED {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Details */}
                      <div>
                        <h4 className="font-semibold mb-4">Shipping Details</h4>
                        <div className="p-3 bg-background rounded">
                          <p className="text-sm font-medium mb-1">Delivery Address</p>
                          <p className="text-xs text-muted-foreground">
                            {order.shippingAddress.name}<br />
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.emirate}<br />
                            {order.shippingAddress.country}<br />
                            {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <OrderReceipt
          order={selectedOrder}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default ComprehensiveOrderManager;
