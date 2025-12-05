import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, CreditCard, MapPin } from 'lucide-react';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const orderId = searchParams.get('orderId');
  const paymentSuccess = searchParams.get('payment');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber || orderId) {
      fetchOrderDetails();
    }
  }, [orderNumber, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // If coming from mock payment success, update order status first
      if (orderId && paymentSuccess === 'success') {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/payment-success`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paymentMethod: 'vault' })
          });
        } catch (error) {
          console.error('Failed to update payment status:', error);
        }
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success && data.orders) {
        let foundOrder;
        if (orderNumber) {
          foundOrder = data.orders.find(o => o.orderNumber === orderNumber);
        } else if (orderId) {
          foundOrder = data.orders.find(o => o.id == orderId);
        }
        setOrder(foundOrder);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading order details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Package className="h-5 w-5" />
                  Order #{order.orderNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="font-semibold">Order Date:</p>
                    <p className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Total Amount:</p>
                    <p className="text-2xl font-bold text-primary">
                      AED {parseFloat(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">
                    Payment Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                  </span>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="text-left p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">Shipping Address:</span>
                    </div>
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="text-left">
                  <h3 className="font-semibold mb-3">Order Items:</h3>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">AED {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">
                    {order.paymentMethod === 'cod' 
                      ? 'Your order will be delivered in 2-3 business days. Payment on delivery.'
                      : 'Your order will be processed and delivered in 2-3 business days.'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/orders">View My Orders</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-left space-y-1">
              <li>• You will receive an email confirmation shortly</li>
              <li>• We will process your order within 24 hours</li>
              <li>• You'll get tracking information once your order ships</li>
              <li>• For any questions, contact us at support@elisshbeauty.ae</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
