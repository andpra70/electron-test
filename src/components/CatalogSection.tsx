import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Search, Filter, BookOpen, FileText, Newspaper, Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { Book, Document, Magazine, User } from "../services/ApiService";

interface CatalogSectionProps {
  user: User | null;
  onPreview: (type: 'document' | 'magazine', id: number, title: string) => void;
}

export function CatalogSection({ user, onPreview }: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'magazines' | 'books'>('all');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    documents: Document[];
    magazines: Magazine[];
    books: Book[];
  }>({ documents: [], magazines: [], books: [] });

  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      loadAllContent();
    }
  }, [searchQuery, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'all' ? undefined : 
                   activeTab === 'documents' ? 'documents' :
                   activeTab === 'magazines' ? 'magazines' : 'books';
      
      const response = await apiService.searchContent(searchQuery, type);
      if (response.success && response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      toast.error("Errore nella ricerca");
    } finally {
      setLoading(false);
    }
  };

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [docsResponse, magsResponse, booksResponse] = await Promise.all([
        apiService.getDocuments(),
        apiService.getMagazines(),
        apiService.getBooks()
      ]);

      setSearchResults({
        documents: docsResponse.success ? docsResponse.data || [] : [],
        magazines: magsResponse.success ? magsResponse.data || [] : [],
        books: booksResponse.success ? booksResponse.data || [] : []
      });
    } catch (error) {
      toast.error("Errore nel caricamento dei contenuti");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (type: 'book' | 'document' | 'magazine', itemId: number) => {
    if (!user) {
      toast.error("Effettua il login per aggiungere ai preferiti");
      return;
    }

    try {
      const response = await apiService.addToFavorites(type, itemId);
      if (response.success) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nell'aggiunta ai preferiti");
    }
  };

  const handleAddToCart = async (bookId: number, bookTitle: string) => {
    if (!user) {
      toast.error("Effettua il login per aggiungere al carrello");
      return;
    }

    try {
      const response = await apiService.addToCart(bookId);
      if (response.success) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nell'aggiunta al carrello");
    }
  };

  const tabs = [
    { id: 'all', label: 'Tutto', icon: Search },
    { id: 'documents', label: 'Documenti', icon: FileText },
    { id: 'magazines', label: 'Riviste', icon: Newspaper },
    { id: 'books', label: 'Libri', icon: BookOpen }
  ];

  const totalResults = searchResults.documents.length + searchResults.magazines.length + searchResults.books.length;

  const filteredDocuments = activeTab === 'all' || activeTab === 'documents' ? searchResults.documents : [];
  const filteredMagazines = activeTab === 'all' || activeTab === 'magazines' ? searchResults.magazines : [];
  const filteredBooks = activeTab === 'all' || activeTab === 'books' ? searchResults.books : [];

  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Catalogo</Badge>
          <h1 className="mb-6">Esplora il Nostro Catalogo</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Cerca tra migliaia di documenti, riviste specializzate e libri di diritto civile
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cerca documenti, riviste, libri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-center mb-8">
            <p className="text-slate-600">
              {loading ? 'Ricerca in corso...' : `${totalResults} risultati trovati per "${searchQuery}"`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Caricamento...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Documents Section */}
            {filteredDocuments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5" />
                  <h2>Documenti ({filteredDocuments.length})</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc) => (
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
                            onClick={() => handleAddToFavorites('document', doc.id)}
                          >
                            <Heart className="w-4 h-4" />
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
                          <div className="flex justify-between">
                            <span>Dimensione:</span>
                            <span>{doc.size}</span>
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
                            <FileText className="w-3 h-3 mr-1" />
                            Scarica
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Magazines Section */}
            {filteredMagazines.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Newspaper className="w-5 h-5" />
                  <h2>Riviste ({filteredMagazines.length})</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMagazines.map((mag) => (
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
                              <Star className="w-3 h-3 mr-1" />
                              In Evidenza
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => handleAddToFavorites('magazine', mag.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="mb-1">{mag.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{mag.subtitle}</p>
                          <Badge variant="outline" className="mb-3">{mag.issue}</Badge>
                          
                          <p className="text-sm text-slate-600 mb-4">{mag.description}</p>
                          
                          <div className="space-y-2 mb-4 text-xs text-slate-500">
                            <div className="flex justify-between">
                              <span>Data:</span>
                              <span>{new Date(mag.publishDate).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pagine:</span>
                              <span>{mag.pages}</span>
                            </div>
                          </div>

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
                              <Newspaper className="w-3 h-3 mr-1" />
                              Scarica
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Books Section */}
            {filteredBooks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5" />
                  <h2>Libri ({filteredBooks.length})</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
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
                              <Star className="w-3 h-3 mr-1" />
                              Bestseller
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => handleAddToFavorites('book', book.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-sm mb-1">{book.title}</h3>
                          <p className="text-xs text-slate-600 mb-2">{book.author}</p>
                          
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(book.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-slate-500 ml-1">({book.reviews})</span>
                          </div>
                          
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
                            onClick={() => handleAddToCart(book.id, book.title)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {book.inStock ? 'Aggiungi' : 'Non Disponibile'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h2 className="mb-4">Nessun risultato trovato</h2>
                <p className="text-slate-600 mb-6">
                  Prova a modificare i termini di ricerca o esplora le categorie.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Cancella Ricerca
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}