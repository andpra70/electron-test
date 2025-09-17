import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { CartItem, User } from "../services/ApiService";

interface CheckoutProps {
  user: User | null;
  onBack: () => void;
  onSuccess: () => void;
}

export function Checkout({ user, onBack, onSuccess }: CheckoutProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'billing' | 'payment' | 'success'>('billing');
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Italia'
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (user) {
      loadCartItems();
      setBillingData(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email
      }));
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

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate billing data
    if (!billingData.firstName || !billingData.lastName || !billingData.email || 
        !billingData.address || !billingData.city || !billingData.postalCode) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    setPaymentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment data
    if (!paymentData.cardNumber || !paymentData.expiryDate || 
        !paymentData.cvv || !paymentData.cardName) {
      toast.error("Compila tutti i dati della carta");
      return;
    }

    setProcessing(true);

    try {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create payment intent
      const paymentIntentResponse = await apiService.createPaymentIntent(total);
      
      if (!paymentIntentResponse.success || !paymentIntentResponse.data) {
        throw new Error(paymentIntentResponse.error || "Errore nella creazione del pagamento");
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm payment
      const confirmResponse = await apiService.confirmPayment(paymentIntentResponse.data.id);
      
      if (!confirmResponse.success) {
        throw new Error(confirmResponse.error || "Errore nella conferma del pagamento");
      }

      toast.success("Pagamento completato con successo!");
      setPaymentStep('success');
      
      // Redirect to success after delay
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Errore durante il pagamento");
    } finally {
      setProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="mb-4">Accesso richiesto</h2>
          <p className="text-slate-600">Effettua il login per completare l'acquisto.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-slate-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="mb-4">Carrello vuoto</h2>
          <p className="text-slate-600 mb-6">Non ci sono articoli nel carrello.</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al Carrello
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h1 className="mb-4">Ordine Completato!</h1>
          <p className="text-slate-600 mb-6">
            Grazie per il tuo acquisto. Riceverai una conferma via email a breve.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="mb-2">Riepilogo Ordine</h3>
            <p className="text-slate-600 mb-2">{itemCount} articoli ordinati</p>
            <p className="text-slate-600">Totale: €{total.toFixed(2)}</p>
          </div>
          <Button onClick={onSuccess}>
            Continua
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al Carrello
          </Button>
          <div>
            <h1>Checkout</h1>
            <p className="text-slate-600">Completa il tuo ordine</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${paymentStep === 'billing' ? 'text-slate-800' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentStep === 'billing' ? 'bg-slate-800 text-white' : 'bg-green-600 text-white'
              }`}>
                {paymentStep === 'billing' ? '1' : '✓'}
              </div>
              <span>Dati di Fatturazione</span>
            </div>
            
            <div className="w-8 h-px bg-slate-300"></div>
            
            <div className={`flex items-center gap-2 ${
              paymentStep === 'payment' ? 'text-slate-800' : 
              paymentStep === 'success' ? 'text-green-600' : 'text-slate-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentStep === 'payment' ? 'bg-slate-800 text-white' :
                paymentStep === 'success' ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {paymentStep === 'success' ? '✓' : '2'}
              </div>
              <span>Pagamento</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {paymentStep === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Dati di Fatturazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBillingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nome *</Label>
                        <Input
                          id="firstName"
                          value={billingData.firstName}
                          onChange={(e) => setBillingData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Cognome *</Label>
                        <Input
                          id="lastName"
                          value={billingData.lastName}
                          onChange={(e) => setBillingData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={billingData.email}
                        onChange={(e) => setBillingData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Indirizzo *</Label>
                      <Input
                        id="address"
                        value={billingData.address}
                        onChange={(e) => setBillingData(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Città *</Label>
                        <Input
                          id="city"
                          value={billingData.city}
                          onChange={(e) => setBillingData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">CAP *</Label>
                        <Input
                          id="postalCode"
                          value={billingData.postalCode}
                          onChange={(e) => setBillingData(prev => ({ ...prev, postalCode: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900">
                      Continua al Pagamento
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {paymentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Dettagli Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Nome sulla Carta *</Label>
                      <Input
                        id="cardName"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                        placeholder="Mario Rossi"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Numero Carta *</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Scadenza *</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Pagamento sicuro con Stripe</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Le tue informazioni di pagamento sono protette con crittografia SSL
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setPaymentStep('billing')}
                        className="flex-1"
                      >
                        Torna Indietro
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-slate-800 hover:bg-slate-900"
                        disabled={processing}
                      >
                        {processing ? 'Elaborazione...' : `Paga €${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Riepilogo Ordine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span>{item.title}</span>
                        <span className="text-slate-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotale</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spedizione</span>
                    <span className="text-green-600">Gratuita</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (22%)</span>
                    <span>€{(total * 0.22).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Totale</span>
                    <span>€{(total * 1.22).toFixed(2)}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="w-full justify-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Checkout Sicuro
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}