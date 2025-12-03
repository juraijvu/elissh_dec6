import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star, Plus, Minus, ShoppingBag, Truck, RotateCcw, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI, wishlistAPI, productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const DynamicProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id!);
      setProduct(response.product);
    } catch (error) {
      toast({ title: 'Failed to load product', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productsAPI.getProducts({ limit: 4 });
      setRelatedProducts(response.products || []);
    } catch (error) {
      console.error('Failed to fetch related products');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please login to add items to cart", variant: "destructive" });
      return;
    }
    setAddingToCart(true);
    try {
      await cartAPI.add({
        productId: parseInt(id!),
        quantity,
        variant: product?.variants?.length > 0 ? { name: product.variants[selectedVariant]?.type, value: product.variants[selectedVariant]?.name } : null
      });
      toast({ title: "Added to cart successfully!" });
      // Trigger header refresh
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
    setAddingToCart(false);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast({ title: "Please login to add to wishlist", variant: "destructive" });
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(parseInt(id!));
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await wishlistAPI.add(parseInt(id!));
        setIsWishlisted(true);
        toast({ title: "Added to wishlist!" });
      }
      // Trigger header refresh
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    } catch (error) {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => window.location.href = '/'}>Go Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Generate SEO data
  const seoTitle = product.metaTitle || `${product.name} - ${product.brand} | Elissh Beauty`;
  const seoDescription = product.metaDescription || `Shop ${product.name} by ${product.brand}. ${product.shortDescription || product.description.substring(0, 120)}. Free shipping in UAE.`;
  const seoKeywords = product.seoKeywords || [product.name.toLowerCase(), product.brand.toLowerCase(), 'cosmetics uae', 'beauty products'];
  const canonicalUrl = `https://elissh.com/product/${product.slug || product.id}`;
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "description": product.description,
    "sku": product.sku,
    "image": product.images?.map(img => `http://localhost:5001${img}`) || [],
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Elissh Beauty"
      }
    },
    "aggregateRating": product.rating?.count > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.average,
      "reviewCount": product.rating.count
    } : undefined
  };

  const breadcrumbItems = [
    { label: product.category?.name || 'Products', href: `/category/${product.category?.slug || 'products'}` },
    { label: product.name }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
        ogImage={product.images?.[0] ? `http://localhost:5001${product.images[0]}` : undefined}
        ogType="product"
        structuredData={structuredData}
      />
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-elevated mb-4 aspect-square bg-gray-100 flex items-center justify-center">
              {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                <img
                  src={`http://localhost:5001${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('Product image loaded:', product.images[selectedImage])}
                  onError={(e) => {
                    console.error('Product image load error:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center flex-col items-center justify-center">
                  <ShoppingBag className="h-20 w-20 mx-auto mb-4" />
                  <p>No image available</p>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img 
                      src={img.startsWith('http') ? img : `http://localhost:5001${img}`} 
                      alt={`View ${i + 1}`} 
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isFeatured && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  Bestseller
                </Badge>
              )}
              {product.isHalal && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ Halal Certified
                </Badge>
              )}
              {product.isVegan && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  🌱 Vegan
                </Badge>
              )}
              {product.isCrueltyFree && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  🐰 Cruelty Free
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4">{product.brand}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating?.average || 0) ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-muted-foreground">{product.rating?.average || 0} ({product.rating?.count || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold text-primary">AED {product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">AED {product.originalPrice}</span>
                  <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock & Availability */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `In Stock - ${product.stock} left!` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Delivery in {product.deliveryDays || 3} days</span>
              </div>
              {product.codAvailable && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>Available for Cash on Delivery</span>
                </div>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-3">Select Variant: {product.variants[selectedVariant]?.name}</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm flex items-center gap-2 ${
                        selectedVariant === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {variant.type === 'colors' && variant.value.startsWith('#') && (
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: variant.value }}
                        />
                      )}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-bold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-2 border rounded-lg w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 py-6 text-base lg:text-lg font-semibold"
              >
                <ShoppingBag className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="py-6 px-4 lg:px-6 min-w-[48px] h-[60px]"
                onClick={handleWishlist}
                title="Add to Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="py-6 px-4 lg:px-6 min-w-[48px] h-[60px]"
                onClick={handleShare}
                title="Share Product"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="bg-gradient-card">
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="font-medium text-xs">Free Shipping</p>
                </CardContent>
              </Card>
              {product.codAvailable && (
                <Card className="bg-gradient-card">
                  <CardContent className="p-3 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium text-xs">Cash on Delivery</p>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-gradient-card">
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="font-medium text-xs">14-Day Returns</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card">
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="font-medium text-xs">100% Authentic</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="howto">How to Use</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="description" className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                {product.weight && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Product Details:</h4>
                    <p className="text-sm text-muted-foreground">Weight: {product.weight}g</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ingredients" className="space-y-4">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <>
                    <h4 className="font-semibold">Ingredients:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.ingredients.map((ingredient, index) => (
                        <div key={index} className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No ingredients information available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="howto" className="space-y-4">
                {product.howToUse ? (
                  <>
                    <h4 className="font-semibold">How to Use:</h4>
                    <p className="text-muted-foreground">{product.howToUse}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No usage instructions available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-4">
                {product.benefits && product.benefits.length > 0 ? (
                  <>
                    <h4 className="font-semibold">Benefits:</h4>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-muted-foreground">No benefits information available.</p>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DynamicProductDetailPage;