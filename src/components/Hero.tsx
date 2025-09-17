import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { BookOpen, FileText, Newspaper } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl text-slate-900 leading-tight">
                La tua fonte autorevole per il
                <span className="block text-slate-700 italic">Diritto Civile Italiano</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Specializzati in pubblicazioni giuridiche di alta qualità, offriamo una vasta collezione di 
                libri, riviste e documenti per professionisti legali, studenti e ricercatori.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-900">
                Esplora il Catalogo
              </Button>
              <Button variant="outline" size="lg">
                Chi Siamo
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-slate-900">Documenti</h3>
                  <p className="text-sm text-slate-600">Legali aggiornati</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-slate-900">Riviste</h3>
                  <p className="text-sm text-slate-600">Specializzate</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-slate-900">Libri</h3>
                  <p className="text-sm text-slate-600">Ordinabili online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1619771833572-325fa5664609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzU4MTAwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Libreria di diritto civile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-slate-800">500+</div>
                <div className="text-xs text-slate-600">Pubblicazioni</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}