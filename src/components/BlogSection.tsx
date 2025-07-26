import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      title: "Brinquedos sensoriais: por que são essenciais no primeiro ano",
      excerpt: "Descubra como texturas, sons e cores estimulam o desenvolvimento neurológico do seu bebê de forma natural e divertida.",
      date: "15 de janeiro, 2024",
      readTime: "5 min",
      category: "Desenvolvimento"
    },
    {
      title: "Blocos de montar: guia completo por idade",
      excerpt: "Análise detalhada dos melhores blocos educativos para cada fase, baseada em estudos sobre desenvolvimento motor e cognitivo.",
      date: "10 de janeiro, 2024",
      readTime: "8 min",
      category: "Resenhas"
    },
    {
      title: "Como criar rotinas de brincadeira que fortalecem vínculos",
      excerpt: "Estratégias comprovadas para transformar momentos de brincadeira em oportunidades de conexão e aprendizado mútuo.",
      date: "5 de janeiro, 2024",
      readTime: "6 min",
      category: "Dicas"
    }
  ];

  return (
    <section id="resenhas" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Conteúdo prático e baseado em evidências para ajudar você a fazer escolhas mais conscientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conteúdo prático e baseado em evidências para ajudar você a fazer escolhas mais conscientes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-gentle transition-smooth group">
              <div className="h-48 bg-gradient-card" />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span className="bg-primary-soft text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-smooth">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Button variant="ghost" className="group-hover:bg-primary-soft transition-smooth p-0">
                  Ler mais
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Ver todos os artigos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;