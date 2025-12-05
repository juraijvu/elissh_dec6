import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Eye, Truck, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${import.meta.env.VITE_API_URL}/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'outline';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
            <Button onClick={() => window.location.href = '/login'}>
              Login
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading your orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Order #{order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-lg font-bold text-primary mt-1">
                          AED {parseFloat(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      <Dialog open={isDetailOpen && selectedOrder?.id === order.id} onOpenChange={setIsDetailOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - #{order.orderNumber}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Order Status */}
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold">Status</p>
                                  <Badge variant={getStatusColor(selectedOrder.status)}>
                                    {getStatusText(selectedOrder.status)}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">Total</p>
                                  <p className="text-2xl font-bold text-primary">
                                    AED {parseFloat(selectedOrder.total).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Payment & Delivery Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold mb-2">Payment Method</p>
                                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <CreditCard className="h-4 w-4" />
                                    <span>{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-semibold mb-2">Order Date</p>
                                  <p className="p-2 bg-muted rounded">
                                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* Shipping Address */}
                              {selectedOrder.shippingAddress && (
                                <div>
                                  <p className="font-semibold mb-2 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Shipping Address
                                  </p>
                                  <div className="p-3 border rounded">
                                    <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                    <p>{selectedOrder.shippingAddress.street}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                                    <p>{selectedOrder.shippingAddress.phone}</p>
                                  </div>
                                </div>
                              )}

                              {/* Order Items */}
                              <div>
                                <p className="font-semibold mb-3">Order Items</p>
                                <div className="space-y-2">
                                  {selectedOrder.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Quantity: {item.quantity} × AED {parseFloat(item.price).toFixed(2)}
                                        </p>
                                      </div>
                                      <p className="font-semibold">
                                        AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Price Breakdown */}
                              <div className="border-t pt-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>AED {parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>AED {parseFloat(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>VAT (5%):</span>
                                    <span>AED {parseFloat(selectedOrder.tax || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span className="text-primary">AED {parseFloat(selectedOrder.total).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Status History */}
                              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                                <div>
                                  <p className="font-semibold mb-3">Order Timeline</p>
                                  <div className="space-y-2">
                                    {selectedOrder.statusHistory.map((status, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                                        <div>
                                          <span className="font-medium capitalize">{status.status}</span>
                                          {status.note && <span className="ml-2 text-muted-foreground">- {status.note}</span>}
                                        </div>
                                        <span className="text-muted-foreground">
                                          {new Date(status.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
