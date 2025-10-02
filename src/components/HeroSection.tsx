import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Baby } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";




const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 md:pt-16">
      {/* Background com overlay suave */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-primary-soft/30" />

      {/* Conteúdo principal */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Ícones decorativos */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="p-3 bg-primary-soft rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="p-3 bg-secondary-soft rounded-full">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <div className="p-3 bg-mint rounded-full">
              <Baby className="h-6 w-6 text-mint-foreground" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
            Brincar é cuidar
          </h1>

          {/* Descrição */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              <strong>Este é um espaço para pais, mães e cuidadores que querem entender mais sobre como o brincar pode estimular, ensinar e fortalecer vínculos.</strong>
            </p>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              <strong>Análises, resenhas e dicas com base no que</strong> <strong className="text-indigo-700 px-1 py-0.5 rounded-md">realmente</strong> <strong>faz a diferença no desenvolvimento.</strong>
            </p>
          </div>

          {/* Frase de destaque */}
          <div className="max-w-3xl mx-auto mb-8 space-y-4">
            <p className="font-lilita text-2xl tracking-widest">
              Brincar. Desenvolver. Amar.
            </p>
          </div>



          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="./auxiliares/EBOOK-guia-completo-do-sono[Brincar-Educando].pdf">
              <Button variant="hero" size="xl">
                Baixe o Guia Completo do Sono (E-Book)
              </Button>
            </a>


            <Link to="/blog">
              <Button variant="soft" size="xl">
                Ler nossos artigos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 left-10 opacity-20">
        <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
      </div>
      <div className="absolute bottom-32 right-16 opacity-20">
        <div className="w-6 h-6 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute top-40 right-20 opacity-20">
        <div className="w-4 h-4 bg-mint rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};

export default HeroSection;