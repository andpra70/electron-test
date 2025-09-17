import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BookOpen, Users, Award, Target, Scale, Building2 } from "lucide-react";

export function AboutSection() {
  const stats = [
    { icon: BookOpen, label: "Pubblicazioni", value: "500+" },
    { icon: Users, label: "Clienti Soddisfatti", value: "10.000+" },
    { icon: Award, label: "Anni di Esperienza", value: "45+" },
    { icon: Scale, label: "Settori Legali", value: "15+" }
  ];

  const team = [
    {
      name: "Prof. Marco Civile",
      role: "Direttore Editoriale",
      description: "Professore di Diritto Civile presso l'Università Statale, autore di numerose pubblicazioni specialistiche.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dott.ssa Laura Famiglia",
      role: "Responsabile Diritto di Famiglia",
      description: "Avvocato specializzato in diritto di famiglia con 20 anni di esperienza forense.",
      image: "https://images.unsplash.com/photo-1594736797933-d0a3ba6a69c8?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Notaio Giuseppe Atti",
      role: "Consulente Notarile",
      description: "Notaio di lunga esperienza, specialista in contratti e atti di stato civile.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const milestones = [
    {
      year: "1978",
      title: "Fondazione",
      description: "Nasce Lo Stato Civile Italiano come casa editrice specializzata nel diritto civile."
    },
    {
      year: "1985",
      title: "Prima Rivista",
      description: "Lancio della rivista 'Diritto Civile Oggi', ancora oggi punto di riferimento del settore."
    },
    {
      year: "1995",
      title: "Digitalizzazione",
      description: "Primi passi verso la digitalizzazione con l'introduzione di supporti informatici."
    },
    {
      year: "2010",
      title: "Piattaforma Online",
      description: "Lancio della piattaforma digitale per la consultazione e il download dei documenti."
    },
    {
      year: "2023",
      title: "Innovazione AI",
      description: "Integrazione di tecnologie AI per migliorare la ricerca e l'indicizzazione dei contenuti."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Chi Siamo</Badge>
          <h1 className="mb-6">La Nostra Storia</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Dal 1978 siamo il punto di riferimento per professionisti del diritto, 
            offrendo pubblicazioni specialistiche di alta qualità e sempre aggiornate.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-slate-600" />
                <h2>La Nostra Missione</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Fornire ai professionisti del diritto strumenti di lavoro affidabili, 
                sempre aggiornati e di facile consultazione, contribuendo così 
                all'eccellenza della giustizia italiana.
              </p>
              <p className="text-slate-600">
                Crediamo che l'accesso a informazioni giuridiche di qualità sia 
                fondamentale per garantire un sistema legale equo ed efficiente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-slate-600" />
                <h2>La Nostra Visione</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Essere il leader indiscusso nell'editoria giuridica italiana, 
                anticipando le esigenze del mercato attraverso l'innovazione 
                tecnologica e la qualità dei contenuti.
              </p>
              <p className="text-slate-600">
                Puntiamo a digitalizzare completamente l'accesso alla 
                documentazione legale, mantenendo sempre i più alti standard qualitativi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="mb-4">Il Nostro Team</h2>
            <p className="text-slate-600">
              Un gruppo di esperti dedicati all'eccellenza nel diritto civile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-slate-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-12">
            <h2 className="mb-4">La Nostra Storia</h2>
            <p className="text-slate-600">
              45 anni di dedizione al servizio del diritto civile italiano
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-slate-200"></div>

              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative flex items-center mb-12">
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'order-2 pl-8'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <Badge className="mb-2">{milestone.year}</Badge>
                        <h3 className="mb-2">{milestone.title}</h3>
                        <p className="text-slate-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-800 rounded-full border-4 border-white z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20 bg-slate-50 rounded-2xl p-12">
          <div className="text-center mb-8">
            <h2 className="mb-4">I Nostri Valori</h2>
            <p className="text-slate-600">
              I principi che guidano il nostro lavoro quotidiano
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Precisione</h3>
              <p className="text-sm text-slate-600">
                Ogni pubblicazione è controllata minuziosamente per garantire 
                accuratezza e conformità normativa.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Qualità</h3>
              <p className="text-sm text-slate-600">
                Manteniamo i più alti standard qualitativi in ogni aspetto 
                del nostro lavoro editoriale.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Servizio</h3>
              <p className="text-sm text-slate-600">
                Il nostro obiettivo è fornire il miglior servizio possibile 
                ai professionisti del settore legale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}