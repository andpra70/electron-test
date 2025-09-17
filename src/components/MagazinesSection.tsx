import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, Eye, Download, Star } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ApiService, { Magazine } from "../services/ApiService";

const mockMagazines = [
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

export function MagazinesSection() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const apiService = ApiService.getInstance();

  useEffect(() => {
    loadMagazines();
  }, []);

  const loadMagazines = async () => {
    try {
      const response = await apiService.getMagazines();
      if (response.success && response.data) {
        setMagazines(response.data);
      } else {
        toast.error(response.error || "Errore nel caricamento delle riviste");
        setMagazines(mockMagazines);
      }
    } catch (error) {
      toast.error("Errore nel caricamento delle riviste");
      setMagazines(mockMagazines);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (magId: number, magTitle: string) => {
    try {
      const response = await apiService.downloadMagazine(magId);
      if (response.success) {
        toast.success(`Download di "${magTitle}" avviato`);
      } else {
        toast.error(response.error || "Errore durante il download");
      }
    } catch (error) {
      toast.error("Errore durante il download");
    }
  };

  if (loading) {
    return (
      <section id="magazines" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-600">Caricamento riviste...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="magazines" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-slate-900 mb-4">Riviste Specializzate</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Le nostre pubblicazioni periodiche offrono analisi approfondite, 
            commenti alla giurisprudenza e aggiornamenti normativi costanti.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {magazines.map((magazine) => (
            <Card key={magazine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* Cover Image */}
                <div className="md:w-48 h-64 md:h-auto relative flex-shrink-0">
                  <ImageWithFallback
                    src={magazine.coverImage}
                    alt={`Copertina ${magazine.title}`}
                    className="w-full h-full object-cover"
                  />
                  {magazine.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Star className="w-3 h-3 mr-1" />
                        In Evidenza
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {magazine.issue}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(magazine.publishDate).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-900 mb-1">
                      {magazine.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600 italic">
                      {magazine.subtitle}
                    </p>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {magazine.description}
                    </p>

                    <div>
                      <h4 className="text-sm text-slate-900 mb-2">Articoli principali:</h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {magazine.articles.map((article, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {article}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                      <span>{magazine.pages} pagine</span>
                      <span>PDF Disponibile</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Sfoglia
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-slate-800 hover:bg-slate-900"
                        onClick={() => handleDownload(magazine.id, magazine.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Scarica
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Archivio Completo Riviste
          </Button>
        </div>
      </div>
    </section>
  );
}