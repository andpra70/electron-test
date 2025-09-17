import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, Eye, Calendar, Heart } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { Document, User } from "../services/ApiService";

interface DocumentsSectionProps {
  user?: User | null;
  onPreview?: (type: 'document' | 'magazine', id: number, title: string) => void;
}

const mockDocuments = [
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

const categories = ["Tutti", "Codici", "Giurisprudenza", "Modulistica", "Normativa", "Circolari", "Formulari"];

export function DocumentsSection({ user, onPreview }: DocumentsSectionProps = {}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const apiService = ApiService.getInstance();

  useEffect(() => {
    loadDocuments();
  }, [selectedCategory]);

  const loadDocuments = async () => {
    try {
      const response = await apiService.getDocuments(selectedCategory);
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        toast.error(response.error || "Errore nel caricamento dei documenti");
        // Fallback to mock data
        setDocuments(mockDocuments);
      }
    } catch (error) {
      toast.error("Errore nel caricamento dei documenti");
      setDocuments(mockDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId: number, docTitle: string) => {
    try {
      const response = await apiService.downloadDocument(docId);
      if (response.success) {
        toast.success(`Download di "${docTitle}" avviato`);
        // In a real app, you would initiate the actual download here
      } else {
        toast.error(response.error || "Errore durante il download");
      }
    } catch (error) {
      toast.error("Errore durante il download");
    }
  };

  const handleAddToFavorites = async (docId: number) => {
    if (!user) {
      toast.error("Effettua il login per aggiungere ai preferiti");
      return;
    }

    try {
      const response = await apiService.addToFavorites('document', docId);
      if (response.success) {
        toast.success(response.data?.message);
      }
    } catch (error) {
      toast.error("Errore nell'aggiunta ai preferiti");
    }
  };

  if (loading) {
    return (
      <section id="documents" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-600">Caricamento documenti...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="documents" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-slate-900 mb-4">Documenti Legali</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Accedi alla nostra raccolta di documenti giuridici sempre aggiornati. 
            Codici, modulistica e normativa per professionisti del diritto.
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

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {doc.category}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(doc.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {doc.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{doc.format}</span>
                  <span>{doc.pages} pagine</span>
                  <span>{doc.size}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Anteprima
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-slate-800 hover:bg-slate-900"
                    onClick={() => handleDownload(doc.id, doc.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Scarica
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carica Altri Documenti
          </Button>
        </div>
      </div>
    </section>
  );
}