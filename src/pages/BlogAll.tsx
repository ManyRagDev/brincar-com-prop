import { getAllPosts } from "@/lib/mdx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";



const BlogAll = () => {
  const posts = getAllPosts();
  const navigate = useNavigate();

  // Ordenar os posts pela data (mais recentes primeiro)
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">


        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
          Todos os Artigos
        </h1>

        <div className="mb-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-gentle transition-smooth group">

              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="h-48 bg-gradient-card" />
              )}
              <div className="p-6">

                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">

                  <span className="bg-primary-soft text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.formattedDate}
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

                <Link to={`/blog/${post.slug}`} state={{ from: "/blog" }}>
                  <Button variant="ghost" className="group-hover:bg-primary-soft transition-smooth p-0">
                    Ler mais
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogAll;
