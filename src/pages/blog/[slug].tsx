import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAllPosts } from "@/lib/mdx";
import { MDXProvider } from "@mdx-js/react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SocialShare from "@/components/SocialShare";
import { Info, Tip, Checklist, Callout, Warning } from "@/components/ui/blocks";

const components = { img: Image, Info, Tip, Checklist, Callout, Warning };

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const posts = getAllPosts();
  const post = posts.find((p: any) => (p.slug ?? p.frontmatter?.slug) === slug);

  if (!post) return <div className="text-center py-16">Post não encontrado.</div>;

  const fm = post.frontmatter ?? post;
  const PostComponent = post.default;
  if (!PostComponent) return <div className="text-center py-16">Erro ao carregar o conteúdo do post.</div>;

  const wrapperClass = fm.landing ? "landing-page" : "";

  return (
    <article className={`prose prose-lg dark:prose-invert mx-auto px-6 pt-8 pb-20 max-w-2xl ${wrapperClass}`}>
      {/* noindex: só se você quiser permitir isso em posts normais */}
      {fm.noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Voltar */}
      {!fm.hideBack && (
        <Button
          onClick={() => navigate(from)}
          className="mt-8 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          <ArrowLeft className="inline-block mr-2" /> Voltar
        </Button>
      )}

      <h1>{fm.title}</h1>

      {/* Esconde meta em landing ou com hideMeta */}
      {!(fm.landing || fm.hideMeta) && (
        <p className="text-muted-foreground mb-8 text-base">
          {fm.date}{fm.readTime ? ` • ${fm.readTime}` : ""}
        </p>
      )}

      {/* Compartilhar */}
      {!fm.hideShare && (
        <p>
          <SocialShare />
        </p>
      )}

      <MDXProvider components={components}>
        <PostComponent />
      </MDXProvider>

      {!fm.hideShare && <SocialShare />}
    </article>
  );
}
