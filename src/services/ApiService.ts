// Types
export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  format: string;
  pages: number;
  size: string;
}

export interface Magazine {
  id: number;
  title: string;
  subtitle: string;
  issue: string;
  coverImage: string;
  publishDate: string;
  pages: number;
  featured: boolean;
  description: string;
  articles: string[];
}

export interface Book {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice: number | null;
  pages: number;
  isbn: string;
  rating: number;
  reviews: number;
  bestseller: boolean;
  description: string;
  inStock: boolean;
  category: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverImage: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  paymentIntentId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private static instance: ApiService;
  
  // Simulate API delay
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock data
  private mockDocuments: Document[] = [
    {
      id: 1,
      title: "Codice Civile Italiano 2025",
      description: "Versione aggiornata con le ultime modifiche legislative",
      category: "Codici",
      date: "2025-01-15",
      format: "PDF",
      pages: 2847,
      size: "12.5 MB"
    },
    {
      id: 2,
      title: "Giurisprudenza di Cassazione - Diritto di Famiglia",
      description: "Raccolta delle sentenze più rilevanti dell'ultimo anno",
      category: "Giurisprudenza",
      date: "2024-12-20",
      format: "PDF",
      pages: 456,
      size: "8.2 MB"
    },
    {
      id: 3,
      title: "Modulistica Stato Civile Aggiornata",
      description: "Tutti i moduli ufficiali per gli atti di stato civile",
      category: "Modulistica",
      date: "2024-11-30",
      format: "DOCX/PDF",
      pages: 125,
      size: "3.1 MB"
    },
    {
      id: 4,
      title: "Decreti Attuativi - Riforma del Diritto di Famiglia",
      description: "Analisi completa dei recenti decreti ministeriali",
      category: "Normativa",
      date: "2024-10-15",
      format: "PDF",
      pages: 89,
      size: "2.8 MB"
    },
    {
      id: 5,
      title: "Circolari Ministeriali 2024",
      description: "Raccolta delle circolari interpretative del Ministero",
      category: "Circolari",
      date: "2024-09-08",
      format: "PDF",
      pages: 267,
      size: "5.4 MB"
    },
    {
      id: 6,
      title: "Formulario per Atti Notarili",
      description: "Modelli e formule per la redazione di atti notarili",
      category: "Formulari",
      date: "2024-08-22",
      format: "DOCX",
      pages: 334,
      size: "4.7 MB"
    }
  ];

  private mockMagazines: Magazine[] = [
    {
      id: 1,
      title: "Diritto Civile Oggi",
      subtitle: "Rivista Mensile di Dottrina e Giurisprudenza",
      issue: "Anno 45, N. 3 - Marzo 2025",
      coverImage: "https://images.unsplash.com/photo-1680538993040-63e1dbc523b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3OTkyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishDate: "2025-03-01",
      pages: 128,
      featured: true,
      description: "Focus speciale sulla nuova riforma del diritto di famiglia e le sue implicazioni pratiche",
      articles: [
        "La riforma del diritto di famiglia: aspetti pratici",
        "Giurisprudenza recente in materia di successioni",
        "Il nuovo regime patrimoniale dei coniugi"
      ]
    },
    {
      id: 2,
      title: "Stato Civile e Anagrafe",
      subtitle: "Quadrimestrale Specializzato",
      issue: "Anno 32, N. 1 - Gennaio 2025",
      coverImage: "https://images.unsplash.com/photo-1680538993040-63e1dbc523b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3OTkyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishDate: "2025-01-15",
      pages: 96,
      featured: false,
      description: "Aggiornamenti normativi e procedure operative per gli ufficiali di stato civile",
      articles: [
        "Digitalizzazione degli atti di stato civile",
        "Procedure per cittadinanze straniere",
        "Casi pratici di correzione errori"
      ]
    },
    {
      id: 3,
      title: "Giurisprudenza Civile",
      subtitle: "Rassegna Trimestrale",
      issue: "Anno 28, N. 4 - Dicembre 2024",
      coverImage: "https://images.unsplash.com/photo-1680538993040-63e1dbc523b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3OTkyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishDate: "2024-12-15",
      pages: 156,
      featured: false,
      description: "Commenti alle sentenze più significative della Cassazione civile",
      articles: [
        "Responsabilità contrattuale ed extracontrattuale",
        "Diritti reali e proprietà immobiliare",
        "Contratti atipici nella giurisprudenza"
      ]
    },
    {
      id: 4,
      title: "Diritto di Famiglia",
      subtitle: "Rivista Bimestrale Specializzata",
      issue: "Anno 15, N. 6 - Novembre 2024",
      coverImage: "https://images.unsplash.com/photo-1680538993040-63e1dbc523b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3OTkyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishDate: "2024-11-01",
      pages: 112,
      featured: true,
      description: "Approfondimenti su separazioni, divorzi e tutela dei minori",
      articles: [
        "Affidamento condiviso: novità legislative",
        "Violenza domestica e misure cautelari",
        "Mantenimento e criteri di calcolo"
      ]
    }
  ];

  private mockBooks: Book[] = [
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

  private mockUser: User = {
    id: "123456789",
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  private cartItems: CartItem[] = [];
  private favoriteBooks: number[] = [];
  private favoriteDocuments: number[] = [];
  private favoriteMagazines: number[] = [];

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication APIs
  async loginWithGoogle(): Promise<LoginResponse> {
    await this.delay(1000); // Simulate API call delay
    
    try {
      // Simulate Google OAuth2 flow
      return {
        success: true,
        user: this.mockUser
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore durante l'autenticazione con Google"
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    await this.delay(500);
    
    return {
      success: true,
      data: null
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await this.delay(300);
    
    // Simulate checking current session
    const hasValidSession = Math.random() > 0.5;
    
    return {
      success: true,
      data: hasValidSession ? this.mockUser : null
    };
  }

  // Documents APIs
  async getDocuments(category?: string): Promise<ApiResponse<Document[]>> {
    await this.delay(800);
    
    try {
      let documents = this.mockDocuments;
      
      if (category && category !== "Tutti") {
        documents = documents.filter(doc => doc.category === category);
      }
      
      return {
        success: true,
        data: documents
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nel caricamento dei documenti"
      };
    }
  }

  async getDocumentById(id: number): Promise<ApiResponse<Document | null>> {
    await this.delay(400);
    
    const document = this.mockDocuments.find(doc => doc.id === id);
    
    return {
      success: true,
      data: document || null
    };
  }

  async downloadDocument(id: number): Promise<ApiResponse<string>> {
    await this.delay(1500);
    
    const document = this.mockDocuments.find(doc => doc.id === id);
    
    if (!document) {
      return {
        success: false,
        error: "Documento non trovato"
      };
    }
    
    // Simulate file download URL
    return {
      success: true,
      data: `https://api.statocivileit.com/documents/${id}/download`
    };
  }

  // Magazines APIs
  async getMagazines(): Promise<ApiResponse<Magazine[]>> {
    await this.delay(600);
    
    try {
      return {
        success: true,
        data: this.mockMagazines
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nel caricamento delle riviste"
      };
    }
  }

  async getMagazineById(id: number): Promise<ApiResponse<Magazine | null>> {
    await this.delay(400);
    
    const magazine = this.mockMagazines.find(mag => mag.id === id);
    
    return {
      success: true,
      data: magazine || null
    };
  }

  async downloadMagazine(id: number): Promise<ApiResponse<string>> {
    await this.delay(1200);
    
    const magazine = this.mockMagazines.find(mag => mag.id === id);
    
    if (!magazine) {
      return {
        success: false,
        error: "Rivista non trovata"
      };
    }
    
    return {
      success: true,
      data: `https://api.statocivileit.com/magazines/${id}/download`
    };
  }

  // Books APIs
  async getBooks(category?: string): Promise<ApiResponse<Book[]>> {
    await this.delay(700);
    
    try {
      let books = this.mockBooks;
      
      if (category && category !== "Tutti") {
        books = books.filter(book => book.category === category);
      }
      
      return {
        success: true,
        data: books
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nel caricamento dei libri"
      };
    }
  }

  async getBookById(id: number): Promise<ApiResponse<Book | null>> {
    await this.delay(400);
    
    const book = this.mockBooks.find(book => book.id === id);
    
    return {
      success: true,
      data: book || null
    };
  }

  async addToCart2(bookId: number, quantity: number = 1): Promise<ApiResponse<{ message: string }>> {
    await this.delay(800);
    
    const book = this.mockBooks.find(book => book.id === bookId);
    
    if (!book) {
      return {
        success: false,
        error: "Libro non trovato"
      };
    }
    
    if (!book.inStock) {
      return {
        success: false,
        error: "Libro non disponibile"
      };
    }
    
    return {
      success: true,
      data: { message: `${book.title} aggiunto al carrello` }
    };
  }

  async searchContent(query: string, type?: 'documents' | 'magazines' | 'books'): Promise<ApiResponse<{
    documents: Document[];
    magazines: Magazine[];
    books: Book[];
  }>> {
    await this.delay(1000);
    
    try {
      const searchTerm = query.toLowerCase();
      
      const documents = type === 'documents' || !type 
        ? this.mockDocuments.filter(doc => 
            doc.title.toLowerCase().includes(searchTerm) ||
            doc.description.toLowerCase().includes(searchTerm)
          )
        : [];
      
      const magazines = type === 'magazines' || !type
        ? this.mockMagazines.filter(mag => 
            mag.title.toLowerCase().includes(searchTerm) ||
            mag.description.toLowerCase().includes(searchTerm)
          )
        : [];
      
      const books = type === 'books' || !type
        ? this.mockBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
          )
        : [];
      
      return {
        success: true,
        data: { documents, magazines, books }
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nella ricerca"
      };
    }
  }

  // Cart APIs
  async getCartItems(): Promise<ApiResponse<CartItem[]>> {
    await this.delay(300);
    
    return {
      success: true,
      data: [...this.cartItems]
    };
  }

  async addToCart(bookId: number, quantity: number = 1): Promise<ApiResponse<{ message: string }>> {
    await this.delay(500);
    
    const book = this.mockBooks.find(book => book.id === bookId);
    
    if (!book) {
      return {
        success: false,
        error: "Libro non trovato"
      };
    }
    
    if (!book.inStock) {
      return {
        success: false,
        error: "Libro non disponibile"
      };
    }

    const existingItem = this.cartItems.find(item => item.bookId === bookId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        id: Date.now(),
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity,
        coverImage: book.coverImage
      });
    }
    
    return {
      success: true,
      data: { message: `${book.title} aggiunto al carrello` }
    };
  }

  async updateCartItemQuantity(itemId: number, quantity: number): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);
    
    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: "Articolo non trovato nel carrello"
      };
    }

    if (quantity <= 0) {
      this.cartItems.splice(itemIndex, 1);
      return {
        success: true,
        data: { message: "Articolo rimosso dal carrello" }
      };
    }

    this.cartItems[itemIndex].quantity = quantity;
    
    return {
      success: true,
      data: { message: "Quantità aggiornata" }
    };
  }

  async removeFromCart(itemId: number): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);
    
    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: "Articolo non trovato nel carrello"
      };
    }

    this.cartItems.splice(itemIndex, 1);
    
    return {
      success: true,
      data: { message: "Articolo rimosso dal carrello" }
    };
  }

  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);
    
    this.cartItems = [];
    
    return {
      success: true,
      data: { message: "Carrello svuotato" }
    };
  }

  // Stripe Payment APIs
  async createPaymentIntent(amount: number): Promise<ApiResponse<PaymentIntent>> {
    await this.delay(1000);
    
    try {
      // Simulate Stripe payment intent creation
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount * 100, // Amount in cents
        currency: 'eur'
      };
      
      return {
        success: true,
        data: paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nella creazione del pagamento"
      };
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<Order>> {
    await this.delay(2000);
    
    try {
      const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const order: Order = {
        id: `order_${Date.now()}`,
        userId: this.mockUser.id,
        items: [...this.cartItems],
        total,
        status: 'completed',
        createdAt: new Date().toISOString(),
        paymentIntentId
      };

      // Clear cart after successful payment
      this.cartItems = [];
      
      return {
        success: true,
        data: order
      };
    } catch (error) {
      return {
        success: false,
        error: "Errore nella conferma del pagamento"
      };
    }
  }

  // Favorites APIs
  async getFavoriteBooks(): Promise<ApiResponse<Book[]>> {
    await this.delay(400);
    
    const favoriteBooks = this.mockBooks.filter(book => this.favoriteBooks.includes(book.id));
    
    return {
      success: true,
      data: favoriteBooks
    };
  }

  async addToFavorites(type: 'book' | 'document' | 'magazine', itemId: number): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);
    
    switch (type) {
      case 'book':
        if (!this.favoriteBooks.includes(itemId)) {
          this.favoriteBooks.push(itemId);
        }
        break;
      case 'document':
        if (!this.favoriteDocuments.includes(itemId)) {
          this.favoriteDocuments.push(itemId);
        }
        break;
      case 'magazine':
        if (!this.favoriteMagazines.includes(itemId)) {
          this.favoriteMagazines.push(itemId);
        }
        break;
    }
    
    return {
      success: true,
      data: { message: "Aggiunto ai preferiti" }
    };
  }

  async removeFromFavorites(type: 'book' | 'document' | 'magazine', itemId: number): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);
    
    switch (type) {
      case 'book':
        this.favoriteBooks = this.favoriteBooks.filter(id => id !== itemId);
        break;
      case 'document':
        this.favoriteDocuments = this.favoriteDocuments.filter(id => id !== itemId);
        break;
      case 'magazine':
        this.favoriteMagazines = this.favoriteMagazines.filter(id => id !== itemId);
        break;
    }
    
    return {
      success: true,
      data: { message: "Rimosso dai preferiti" }
    };
  }

  async isFavorite(type: 'book' | 'document' | 'magazine', itemId: number): Promise<boolean> {
    switch (type) {
      case 'book':
        return this.favoriteBooks.includes(itemId);
      case 'document':
        return this.favoriteDocuments.includes(itemId);
      case 'magazine':
        return this.favoriteMagazines.includes(itemId);
      default:
        return false;
    }
  }

  // PDF Preview API
  async getPdfPreview(type: 'document' | 'magazine', itemId: number): Promise<ApiResponse<string>> {
    await this.delay(1000);
    
    // Simulate PDF preview URL
    return {
      success: true,
      data: `https://api.statocivileit.com/${type}s/${itemId}/preview.pdf`
    };
  }

  // Stats APIs
  async getStats(): Promise<ApiResponse<{
    totalDocuments: number;
    totalMagazines: number;
    totalBooks: number;
    featuredMagazines: number;
    bestsellers: number;
  }>> {
    await this.delay(500);
    
    return {
      success: true,
      data: {
        totalDocuments: this.mockDocuments.length,
        totalMagazines: this.mockMagazines.length,
        totalBooks: this.mockBooks.length,
        featuredMagazines: this.mockMagazines.filter(mag => mag.featured).length,
        bestsellers: this.mockBooks.filter(book => book.bestseller).length
      }
    };
  }
}

export default ApiService;