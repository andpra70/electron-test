import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-slate-900 text-sm">SC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg">Lo Stato Civile</span>
                <span className="text-xs text-slate-400 -mt-1">Italiano</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              La tua casa editrice di riferimento per pubblicazioni specializzate 
              in diritto civile, con oltre 40 anni di esperienza nel settore giuridico.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white">Link Rapidi</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#documents" className="hover:text-white transition-colors">Documenti</a></li>
              <li><a href="#magazines" className="hover:text-white transition-colors">Riviste</a></li>
              <li><a href="#books" className="hover:text-white transition-colors">Libri</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Abbonamenti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Catalogo PDF</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Novità Editoriali</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white">Servizi</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Account Personale</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spedizioni</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resi e Rimborsi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Supporto Clienti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termini di Servizio</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white">Contatti</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Via Roma 123</p>
                  <p>00100 Roma, Italia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+39 06 1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@statocivileit.com</span>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="text-white text-sm mb-2">Orari di Servizio</h4>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Lun - Ven: 9:00 - 18:00</p>
                <p>Sab: 9:00 - 13:00</p>
                <p>Dom: Chiuso</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-xs text-slate-400">
            © 2025 Lo Stato Civile Italiano. Tutti i diritti riservati.
          </div>
          <div className="flex space-x-6 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}