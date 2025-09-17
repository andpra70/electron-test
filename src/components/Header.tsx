import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "./ui/navigation-menu";
import { UserCircle, Menu, X, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import ApiService, { CartItem, User } from "../services/ApiService";

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

export function Header({ user, onLogin, onLogout, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    try {
      const response = await apiService.getCartItems();
      if (response.success && response.data) {
        const count = response.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(count);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
              <span className="text-white text-sm">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl text-slate-800">Lo Stato Civile</span>
              <span className="text-xs text-slate-600 -mt-1">Italiano</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('home')}>
                    Home
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('documents')}>
                    Documenti
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('magazines')}>
                    Riviste
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('books')}>
                    Libri
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('catalog')}>
                    Catalogo
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={() => handleNavigation('about')}>
                    Chi Siamo
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {/* Favorites */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('favorites')}
                >
                  <Heart className="w-4 h-4" />
                </Button>

                {/* Cart */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => handleNavigation('cart')}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} className="bg-slate-800 hover:bg-slate-900">
                Accedi con Google
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              <Button variant="ghost" onClick={() => handleNavigation('home')} className="justify-start">
                Home
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation('documents')} className="justify-start">
                Documenti
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation('magazines')} className="justify-start">
                Riviste
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation('books')} className="justify-start">
                Libri
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation('catalog')} className="justify-start">
                Catalogo
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation('about')} className="justify-start">
                Chi Siamo
              </Button>
              
              {user && (
                <>
                  <div className="border-t pt-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleNavigation('favorites')} 
                      className="justify-start w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Preferiti
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleNavigation('cart')} 
                      className="justify-start w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Carrello {cartItemCount > 0 && `(${cartItemCount})`}
                    </Button>
                  </div>
                </>
              )}

              {user ? (
                <div className="pt-3 border-t">
                  <div className="flex items-center space-x-2 mb-3">
                    <UserCircle className="w-5 h-5 text-slate-600" />
                    <span className="text-sm text-slate-700">{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t">
                  <Button onClick={onLogin} className="w-full bg-slate-800 hover:bg-slate-900">
                    Accedi con Google
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}