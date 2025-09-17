import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { CartItem, User } from "../services/ApiService";

interface CartProps {
  user: User | null;
  onCheckout: () => void;
}

export function Cart({ user, onCheckout }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (user) {
      loadCartItems();
    }
  }, [user]);

  const loadCartItems = async () => {
    try {
      const response = await apiService.getCartItems();
      if (response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      toast.error("Errore nel caricamento del carrello");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const response = await apiService.updateCartItemQuantity(itemId, newQuantity);
      if (response.success) {
        await loadCartItems();
        toast.success(response.data?.message);
      } else {
        toast.error(response.error || "Errore nell'aggiornamento");
      }
    } catch (error) {
      toast.error("Errore nell'aggiornamento della quantità");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await apiService.removeFromCart(itemId);
      if (response.success) {
        await loadCartItems();
        toast.success(response.data?.message);
      } else {
        toast.error(response.error || "Errore nella rimozione");
      }
    } catch (error) {
      toast.error("Errore nella rimozione dell'articolo");
    }
  };

  const clearCart = async () => {
    try {
      const response = await apiService.clearCart();
      if (response.success) {
        setCartItems([]);
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nello svuotamento del carrello");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="mb-4">Accedi per visualizzare il carrello</h2>
          <p className="text-slate-600">Effettua il login per vedere i tuoi articoli nel carrello.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-slate-600">Caricamento carrello...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="mb-4">Il tuo carrello è vuoto</h2>
          <p className="text-slate-600 mb-6">Aggiungi alcuni libri al carrello per iniziare!</p>
          <Button onClick={() => window.location.hash = '#books'}>
            Esplora i Libri
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Carrello</h1>
            <p className="text-slate-600">
              {itemCount} {itemCount === 1 ? 'articolo' : 'articoli'} nel carrello
            </p>
          </div>
          {cartItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Svuota Carrello
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-28 flex-shrink-0">
                      <ImageWithFallback
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="mb-1">{item.title}</h3>
                      <p className="text-slate-600 mb-3">{item.author}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="px-3 py-1 bg-slate-100 rounded text-sm">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-lg">€{(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Riepilogo Ordine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotale</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spedizione</span>
                    <span className="text-green-600">Gratuita</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Totale</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-800 hover:bg-slate-900"
                  onClick={onCheckout}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Procedi al Pagamento
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  Pagamento sicuro con Stripe
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}