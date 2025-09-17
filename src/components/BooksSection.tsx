import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, ShoppingCart, Heart, BookOpen } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { Book } from "../services/ApiService";

const mockBooks = [
  {
    id: 1,
    title: "Manuale di Diritto Civile",
    subtitle: "Teoria e Pratica - Edizione 2025",
    author: "Prof. Mario Rossi",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 89.90,
    originalPrice: 99.90,
    pages: 1240,
    isbn: "978-88-123-4567-8",
    rating: 4.8,
    reviews: 127,
    bestseller: true,
    description: "Il manuale più completo per lo studio e la pratica del diritto civile italiano, aggiornato con le ultime riforme.",
    inStock: true,
    category: "Manuali"
  },
  {
    id: 2,
    title: "Diritto di Famiglia Commentato",
    subtitle: "Codice Civile con Giurisprudenza",
    author: "Dott.ssa Laura Bianchi",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 65.00,
    originalPrice: null,
    pages: 890,
    isbn: "978-88-123-4568-5",
    rating: 4.6,
    reviews: 89,
    bestseller: false,
    description: "Commentario articolo per articolo del diritto di famiglia con riferimenti giurisprudenziali aggiornati.",
    inStock: true,
    category: "Commentari"
  },
  {
    id: 3,
    title: "Formulario Notarile Pratico",
    subtitle: "Atti e Contratti Tipici",
    author: "Notaio Giuseppe Verdi",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 120.00,
    originalPrice: 135.00,
    pages: 1560,
    isbn: "978-88-123-4569-2",
    rating: 4.9,
    reviews: 156,
    bestseller: true,
    description: "La raccolta più completa di formulari notarili per ogni tipo di atto e contratto.",
    inStock: true,
    category: "Formulari"
  },
  {
    id: 4,
    title: "Diritto delle Successioni",
    subtitle: "Aspetti Teorici e Pratici",
    author: "Avv. Francesco Neri",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 75.50,
    originalPrice: null,
    pages: 678,
    isbn: "978-88-123-4570-8",
    rating: 4.5,
    reviews: 67,
    bestseller: false,
    description: "Guida completa al diritto successorio con casi pratici e modelli operativi.",
    inStock: false,
    category: "Specialistici"
  },
  {
    id: 5,
    title: "Responsabilità Civile e Risarcimento",
    subtitle: "Dottrina e Giurisprudenza",
    author: "Prof. Anna Viola",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 58.00,
    originalPrice: null,
    pages: 456,
    isbn: "978-88-123-4571-5",
    rating: 4.7,
    reviews: 92,
    bestseller: false,
    description: "Trattazione completa della responsabilità civile con focus sul danno e il risarcimento.",
    inStock: true,
    category: "Specialistici"
  },
  {
    id: 6,
    title: "Contratti Commerciali Moderni",
    subtitle: "Clausole e Strategie Negoziali",
    author: "Avv. Roberto Blu",
    coverImage: "https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 95.00,
    originalPrice: 110.00,
    pages: 1120,
    isbn: "978-88-123-4572-2",
    rating: 4.6,
    reviews: 74,
    bestseller: false,
    description: "Guida pratica per la redazione di contratti commerciali nell'era digitale.",
    inStock: true,
    category: "Commerciale"
  }
];

const categories = ["Tutti", "Manuali", "Commentari", "Formulari", "Specialistici", "Commerciale"];

export function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const apiService = ApiService.getInstance();

  useEffect(() => {
    loadBooks();
  }, [selectedCategory]);

  const loadBooks = async () => {
    try {
      const response = await apiService.getBooks(selectedCategory);
      if (response.success && response.data) {
        setBooks(response.data);
      } else {
        toast.error(response.error || "Errore nel caricamento dei libri");
        setBooks(mockBooks);
      }
    } catch (error) {
      toast.error("Errore nel caricamento dei libri");
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (bookId: number, bookTitle: string) => {
    try {
      const response = await apiService.addToCart(bookId);
      if (response.success) {
        toast.success(response.data?.message || `"${bookTitle}" aggiunto al carrello`);
      } else {
        toast.error(response.error || "Errore durante l'aggiunta al carrello");
      }
    } catch (error) {
      toast.error("Errore durante l'aggiunta al carrello");
    }
  };

  if (loading) {
    return (
      <section id="books" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-600">Caricamento libri...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-slate-900 mb-4">Libri Specializzati</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            La nostra collezione di libri giuridici copre tutti gli aspetti del diritto civile. 
            Ordina online e ricevi direttamente a casa o in ufficio.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={category === selectedCategory ? "default" : "outline"}
              className="cursor-pointer hover:bg-slate-100 px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <ImageWithFallback
                    src={book.coverImage}
                    alt={`Copertina ${book.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {book.bestseller && (
                    <Badge className="bg-red-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                  {book.originalPrice && (
                    <Badge className="bg-green-500 text-white">
                      Offerta
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>

                {/* Stock Status */}
                {!book.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-white">
                      Esaurito
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-slate-600">
                  {book.subtitle}
                </p>
                <p className="text-xs text-slate-500">
                  di {book.author}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(book.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {book.rating} ({book.reviews} recensioni)
                  </span>
                </div>

                {/* Book Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {book.pages} pagine
                  </div>
                  <div>
                    ISBN: {book.isbn}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl text-slate-900">
                      €{book.price.toFixed(2)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        €{book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {book.originalPrice && (
                    <Badge variant="destructive" className="text-xs">
                      -{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-slate-800 hover:bg-slate-900" 
                    disabled={!book.inStock}
                    onClick={() => handleAddToCart(book.id, book.title)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {book.inStock ? "Aggiungi al Carrello" : "Non Disponibile"}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Anteprima Gratuita
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carica Altri Libri
          </Button>
        </div>
      </div>
    </section>
  );
}