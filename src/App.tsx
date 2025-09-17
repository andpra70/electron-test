import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { DocumentsSection } from "./components/DocumentsSection";
import { MagazinesSection } from "./components/MagazinesSection";
import { BooksSection } from "./components/BooksSection";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { PdfPreview } from "./components/PdfPreview";
import { AboutSection } from "./components/AboutSection";
import { CatalogSection } from "./components/CatalogSection";
import { Favorites } from "./components/Favorites";
import { Footer } from "./components/Footer";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import ApiService, { User } from "./services/ApiService";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('home');
  const [pdfPreview, setPdfPreview] = useState<{
    isOpen: boolean;
    type: 'document' | 'magazine';
    id: number;
    title: string;
  }>({
    isOpen: false,
    type: 'document',
    id: 0,
    title: ''
  });
  
  const apiService = ApiService.getInstance();

  // Check for existing user session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle Google OAuth2 login
  const handleLogin = async () => {
    try {
      const response = await apiService.loginWithGoogle();
      if (response.success && response.user) {
        setUser(response.user);
        toast.success(`Benvenuto, ${response.user.name}!`);
      } else {
        toast.error(response.error || "Errore durante il login");
      }
    } catch (error) {
      toast.error("Errore durante l'autenticazione");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await apiService.logout();
      if (response.success) {
        setUser(null);
        setCurrentSection('home');
        toast.success("Logout effettuato con successo");
      }
    } catch (error) {
      toast.error("Errore durante il logout");
    }
  };

  // Handle navigation
  const handleNavigation = (section: string) => {
    setCurrentSection(section);
  };

  // Handle PDF preview
  const handlePdfPreview = (type: 'document' | 'magazine', id: number, title: string) => {
    setPdfPreview({
      isOpen: true,
      type,
      id,
      title
    });
  };

  // Handle checkout flow
  const handleCheckout = () => {
    setCurrentSection('checkout');
  };

  const handleCheckoutSuccess = () => {
    setCurrentSection('home');
    toast.success('Ordine completato con successo!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm">SC</span>
          </div>
          <p className="text-slate-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <Hero />
            <DocumentsSection user={user} onPreview={handlePdfPreview} />
            <MagazinesSection user={user} onPreview={handlePdfPreview} />
            <BooksSection user={user} />
          </>
        );
      case 'documents':
        return <DocumentsSection user={user} onPreview={handlePdfPreview} />;
      case 'magazines':
        return <MagazinesSection user={user} onPreview={handlePdfPreview} />;
      case 'books':
        return <BooksSection user={user} />;
      case 'catalog':
        return <CatalogSection user={user} onPreview={handlePdfPreview} />;
      case 'about':
        return <AboutSection />;
      case 'cart':
        return <Cart user={user} onCheckout={handleCheckout} />;
      case 'checkout':
        return (
          <Checkout 
            user={user} 
            onBack={() => setCurrentSection('cart')} 
            onSuccess={handleCheckoutSuccess} 
          />
        );
      case 'favorites':
        return <Favorites user={user} onPreview={handlePdfPreview} />;
      default:
        return (
          <>
            <Hero />
            <DocumentsSection />
            <MagazinesSection />
            <BooksSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        onNavigate={handleNavigation}
      />
      
      <main>
        {renderCurrentSection()}
      </main>
      
      <Footer />
      
      {/* PDF Preview Modal */}
      <PdfPreview
        isOpen={pdfPreview.isOpen}
        onClose={() => setPdfPreview(prev => ({ ...prev, isOpen: false }))}
        title={pdfPreview.title}
        type={pdfPreview.type}
        itemId={pdfPreview.id}
      />
      
      <Toaster />
    </div>
  );
}