import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, BookOpen, FileText, Newspaper, ShoppingCart, Download, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { Book, Document, Magazine, User } from "../services/ApiService";

interface FavoritesProps {
  user: User | null;
  onPreview: (type: 'document' | 'magazine', id: number, title: string) => void;
}

export function Favorites({ user, onPreview }: FavoritesProps) {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [favoriteDocuments, setFavoriteDocuments] = useState<Document[]>([]);
  const [favoriteMagazines, setFavoriteMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');

  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll simulate getting favorites
      // In a real app, you would have separate API endpoints for each type
      const [booksResponse, docsResponse, magsResponse] = await Promise.all([
        apiService.getFavoriteBooks(),
        apiService.getDocuments(),
        apiService.getMagazines()
      ]);

      if (booksResponse.success && booksResponse.data) {
        setFavoriteBooks(booksResponse.data);
      }

      // Simulate favorites for documents and magazines (first 2 items)
      if (docsResponse.success && docsResponse.data) {
        setFavoriteDocuments(docsResponse.data.slice(0, 2));
      }

      if (magsResponse.success && magsResponse.data) {
        setFavoriteMagazines(magsResponse.data.slice(0, 1));
      }
    } catch (error) {
      toast.error("Errore nel caricamento dei preferiti");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (type: 'book' | 'document' | 'magazine', itemId: number) => {
    try {
      const response = await apiService.removeFromFavorites(type, itemId);
      if (response.success) {
        // Update local state
        switch (type) {
          case 'book':
            setFavoriteBooks(prev => prev.filter(book => book.id !== itemId));
            break;
          case 'document':
            setFavoriteDocuments(prev => prev.filter(doc => doc.id !== itemId));
            break;
          case 'magazine':
            setFavoriteMagazines(prev => prev.filter(mag => mag.id !== itemId));
            break;
        }
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nella rimozione dai preferiti");
    }
  };

  const addToCart = async (bookId: number, bookTitle: string) => {
    try {
      const response = await apiService.addToCart(bookId);
      if (response.success) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nell'aggiunta al carrello");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="mb-4">Accedi per visualizzare i preferiti</h2>
          <p className="text-slate-600">Effettua il login per vedere i tuoi contenuti preferiti.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-slate-600">Caricamento preferiti...</p>
        </div>
      </div>
    );
  }

  const totalFavorites = favoriteBooks.length + favoriteDocuments.length + favoriteMagazines.length;

  if (totalFavorites === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="mb-4">Nessun preferito</h2>
          <p className="text-slate-600 mb-6">
            Non hai ancora aggiunto contenuti ai preferiti. Inizia a esplorare!
          </p>
          <Button onClick={() => window.location.hash = '#catalog'}>
            Esplora il Catalogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-4">I Miei Preferiti</h1>
          <p className="text-slate-600">
            {totalFavorites} {totalFavorites === 1 ? 'contenuto preferito' : 'contenuti preferiti'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Libri ({favoriteBooks.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documenti ({favoriteDocuments.length})
            </TabsTrigger>
            <TabsTrigger value="magazines" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Riviste ({favoriteMagazines.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.bestseller && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          Bestseller
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => removeFromFavorites('book', book.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-sm mb-1">{book.title}</h3>
                      <p className="text-xs text-slate-600 mb-2">{book.author}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">€{book.price.toFixed(2)}</span>
                        {book.originalPrice && (
                          <span className="text-sm text-slate-500 line-through">
                            €{book.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-slate-800 hover:bg-slate-900"
                        disabled={!book.inStock}
                        onClick={() => addToCart(book.id, book.title)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {book.inStock ? 'Aggiungi al Carrello' : 'Non Disponibile'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-2">{doc.title}</CardTitle>
                        <Badge variant="outline" className="mb-2">{doc.category}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeFromFavorites('document', doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{doc.description}</p>
                    
                    <div className="space-y-2 mb-4 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Formato:</span>
                        <span>{doc.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pagine:</span>
                        <span>{doc.pages}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => onPreview('document', doc.id, doc.title)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Anteprima
                      </Button>
                      <Button size="sm" className="flex-1 bg-slate-800 hover:bg-slate-900">
                        <Download className="w-3 h-3 mr-1" />
                        Scarica
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="magazines" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMagazines.map((mag) => (
                <Card key={mag.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={mag.coverImage}
                        alt={mag.title}
                        className="w-full h-full object-cover"
                      />
                      {mag.featured && (
                        <Badge className="absolute top-2 left-2">
                          In Evidenza
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => removeFromFavorites('magazine', mag.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="mb-1">{mag.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{mag.subtitle}</p>
                      <Badge variant="outline" className="mb-3">{mag.issue}</Badge>
                      
                      <p className="text-sm text-slate-600 mb-4">{mag.description}</p>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => onPreview('magazine', mag.id, mag.title)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Anteprima
                        </Button>
                        <Button size="sm" className="flex-1 bg-slate-800 hover:bg-slate-900">
                          <Download className="w-3 h-3 mr-1" />
                          Scarica
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}