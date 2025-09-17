import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'document' | 'magazine';
  itemId: number;
}

export function PdfPreview({ isOpen, onClose, title, type, itemId }: PdfPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate PDF content for demo
  const pdfPages = [
    {
      page: 1,
      content: type === 'document' ? 'CODICE CIVILE ITALIANO' : 'DIRITTO CIVILE OGGI',
      subtitle: type === 'document' ? 'Art. 1 - Disposizioni generali' : 'Rivista Mensile di Dottrina e Giurisprudenza'
    },
    {
      page: 2,
      content: 'INDICE GENERALE',
      subtitle: 'Capitoli e Sezioni'
    },
    {
      page: 3,
      content: type === 'document' ? 'LIBRO PRIMO - DELLE PERSONE E DELLA FAMIGLIA' : 'FOCUS SPECIALE',
      subtitle: type === 'document' ? 'Titolo I - Delle persone fisiche' : 'La riforma del diritto di famiglia'
    }
  ];

  const handleDownload = () => {
    toast.success(`Download di "${title}" avviato`);
    // In a real implementation, this would trigger the actual download
  };

  const zoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const zoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const rotate = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <Badge variant="outline" className="mt-1">
                {type === 'document' ? 'Documento' : 'Rivista'} - Anteprima
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={rotate}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Scarica
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4 overflow-auto bg-slate-50">
          <div className="max-w-2xl mx-auto">
            {loading && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400 animate-pulse" />
                <p className="text-slate-600">Caricamento anteprima PDF...</p>
              </div>
            )}

            {/* Simulated PDF Pages */}
            <div className="space-y-6" style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center top'
            }}>
              {pdfPages.map((page) => (
                <div
                  key={page.page}
                  className="bg-white shadow-lg border border-slate-200 rounded-lg p-8 aspect-[210/297]"
                  onLoad={() => setLoading(false)}
                >
                  {/* Page Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl mb-4">{page.content}</h1>
                    <p className="text-xl text-slate-600">{page.subtitle}</p>
                  </div>

                  {/* Sample Content */}
                  <div className="space-y-4 text-sm leading-relaxed">
                    {page.page === 1 && (
                      <>
                        <p>
                          {type === 'document' 
                            ? 'Il presente codice contiene le disposizioni fondamentali del diritto civile italiano, aggiornate con le ultime modifiche legislative.'
                            : 'Questa rivista presenta un\'analisi approfondita delle più recenti evoluzioni del diritto civile italiano.'
                          }
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                        </p>
                      </>
                    )}

                    {page.page === 2 && (
                      <div className="space-y-2">
                        <h3>INDICE</h3>
                        <div className="pl-4 space-y-1">
                          <p>Capitolo I - Disposizioni generali .................... pag. 3</p>
                          <p>Capitolo II - Delle persone fisiche ................. pag. 15</p>
                          <p>Capitolo III - Dei rapporti di famiglia ............. pag. 45</p>
                          <p>Capitolo IV - Delle successioni ..................... pag. 78</p>
                          <p>Capitolo V - Dei contratti .......................... pag. 120</p>
                        </div>
                      </div>
                    )}

                    {page.page === 3 && (
                      <>
                        <h3>{type === 'document' ? 'Art. 1 - Soggetti del rapporto giuridico' : 'Introduzione'}</h3>
                        <p>
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                        </p>
                        <p>
                          Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Page Footer */}
                  <div className="mt-auto pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
                    Pagina {page.page} | {title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Anteprima limitata - Prime 3 pagine</span>
            <span>Per visualizzare il contenuto completo, scarica il documento</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}