import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star, Shield, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-soft to-accent">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center shadow-warm">
          <div className="flex justify-center gap-3 mb-6">
            <div className="p-2 bg-primary rounded-full">
              <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="p-2 bg-secondary rounded-full">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="p-2 bg-rose rounded-full">
              <Heart className="h-5 w-5 text-rose-foreground" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Pronto para fazer escolhas mais conscientes?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Acesse nossa seleção curada de brinquedos educativos, todos analisados com base científica e testados por famílias reais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary-soft rounded-full mb-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Avaliação científica</h3>
              <p className="text-sm text-muted-foreground">Cada produto é analisado por critérios pedagógicos</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-3 bg-secondary-soft rounded-full mb-3">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Segurança garantida</h3>
              <p className="text-sm text-muted-foreground">Produtos testados e aprovados para bebês</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-3 bg-rose rounded-full mb-3">
                <Heart className="h-6 w-6 text-rose-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Recomendação honesta</h3>
              <p className="text-sm text-muted-foreground">Sem parcerias que comprometem nossa opinião</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-smooth" />
              Ver brinquedos recomendados
            </Button>
            <Button variant="outline" size="xl">
              Baixar guia gratuito
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            * Alguns links podem ser de afiliados. Sua compra nos ajuda a manter o conteúdo gratuito.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;