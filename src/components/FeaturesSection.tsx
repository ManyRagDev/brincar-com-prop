import { BookOpen, Brain, Target, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo com base científica",
      description: "Selecionamos brinquedos com embasamento pedagógico real",
      color: "text-primary",
      bgColor: "bg-primary-soft"
    },
    {
      icon: Brain,
      title: "Estímulos certos na hora certa",
      description: "Cada fase do bebê exige diferentes formas de brincar",
      color: "text-secondary",
      bgColor: "bg-secondary-soft"
    },
    {
      icon: Target,
      title: "Curadoria inteligente",
      description: "Reunimos apenas o que realmente faz diferença",
      color: "text-mint-foreground",
      bgColor: "bg-mint"
    },
    {
      icon: MessageCircle,
      title: "Resenhas honestas",
      description: "Opiniões sinceras de pais e especialistas",
      color: "text-rose-foreground",
      bgColor: "bg-rose"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Por que confiar em nós?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nosso compromisso é oferecer informação de qualidade para que você tome as melhores decisões para seu bebê
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-gentle transition-smooth group">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;