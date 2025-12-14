import { Search, Heart, ShoppingBag, User, LogOut, Home, Grid3X3, Tag, Package, X, Palette, Sparkles, Scissors, Flower2, Watch, Brush, Circle, Eye, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchCounts = async () => {
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch cart count
      const cartResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:/api'}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cartData = await cartResponse.json();
      if (cartData.success) {
        setCartCount(cartData.cart.totalItems || 0);
      }

      // Fetch wishlist count
      const wishlistResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:/api'}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const wishlistData = await wishlistResponse.json();
      if (wishlistData.success) {
        setWishlistCount(wishlistData.wishlist.items?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => fetchCounts();
    const handleWishlistUpdate = () => fetchCounts();

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  const categories = [
    { name: 'Makeup', path: '/category/makeup', icon: Palette },
    { name: 'Skincare', path: '/category/skincare', icon: Sparkles },
    { name: 'Haircare', path: '/category/haircare', icon: Scissors },
    { name: 'Fragrance', path: '/category/fragrance', icon: Flower2 },
    { name: 'Accessories', path: '/category/accessories', icon: Watch },
    { name: 'Tools', path: '/category/tools', icon: Brush },
    { name: 'Lips', path: '/category/lips', icon: Circle },
    { name: 'Eyes', path: '/category/eyes', icon: Eye },
    { name: 'Face', path: '/category/face', icon: Smile }
  ];

  const handleCategoryClick = (path) => {
    setShowCategoryPopup(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Promotional Bar - Not Sticky */}
      <div className="bg-gradient-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
        🎉 Eid Sale: Up to 50% Off + Free Gift on Orders Over 200 AED | Cash on Delivery Available
      </div>

      {/* Main Header - Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 border-b border-border shadow-elevated backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/src/assets/elissh_logo.png" 
                alt="Elissh Beauty" 
                className="h-8 lg:h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'block';
                }}
              />
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent" style={{display: 'none'}}>
                Elissh Beauty
              </h1>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products, brands, or categories..."
                  className="pl-10 pr-4 py-6 rounded-full border-2 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile Actions - Only essential items */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search Icon - Mobile */}
              <Button variant="ghost" size="icon" className="lg:hidden touch-target hover:bg-secondary/80" onClick={() => navigate('/search')}>
                <Search className="h-4 w-4" />
              </Button>

              {/* Wishlist */}
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative touch-target hover:bg-secondary/80">
                  <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-semibold text-[10px] lg:text-xs">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative touch-target hover:bg-secondary/80">
                  <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-semibold text-[10px] lg:text-xs">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Profile */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4 lg:h-5 lg:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">My Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-8 pb-4 text-sm font-medium">
            <Link to="/category/makeup" className="hover:text-primary transition-colors">Makeup</Link>
            <Link to="/category/skincare" className="hover:text-primary transition-colors">Skincare</Link>
            <Link to="/category/haircare" className="hover:text-primary transition-colors">Haircare</Link>
            <Link to="/category/fragrance" className="hover:text-primary transition-colors">Fragrance</Link>
            <Link to="/category/accessories" className="hover:text-primary transition-colors">Accessories</Link>
            <Link to="/brands" className="hover:text-primary transition-colors">Brands</Link>
            <Link to="/sale" className="text-primary font-semibold">Sale 🔥</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Sticky */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 border-t border-border shadow-elevated backdrop-blur-md">
        <div className="grid grid-cols-5 h-16">
          <Link to="/" className="flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <button 
            onClick={() => setShowCategoryPopup(true)}
            className="flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
          >
            <Grid3X3 className="h-5 w-5" />
            <span>Categories</span>
          </button>
          <Link to="/brands" className="flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors">
            <Tag className="h-5 w-5" />
            <span>Brands</span>
          </Link>
          <Link to="/sale" className="flex flex-col items-center justify-center gap-1 text-xs text-primary font-semibold">
            <Package className="h-5 w-5" />
            <span>Sale</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors">
            <Package className="h-5 w-5" />
            <span>Orders</span>
          </Link>
        </div>
      </nav>

      {/* Category Popup Modal */}
      {showCategoryPopup && (
        <div 
          className="lg:hidden fixed inset-0 z-[60]  flex items-center justify-center p-4"
          onClick={() => setShowCategoryPopup(false)}
        >
          <div 
            className="w-full max-w-xs bg-background/98 rounded-2xl p-4 shadow-elevated backdrop-blur-md border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Categories</h2>
              <button 
                onClick={() => setShowCategoryPopup(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.path)}
                    className="flex flex-col items-center p-3 bg-gradient-card rounded-lg border border-border hover:border-primary transition-all hover:shadow-soft"
                  >
                    <div className="h-8 w-8 bg-primary/10 rounded-full mb-2 flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};