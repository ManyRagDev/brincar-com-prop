import { useParams } from "react-router-dom";
import { getAllPosts } from "@/lib/mdx";
import { MDXProvider } from "@mdx-js/react";
import { Image } from "@/components/ui/image";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react"; // ícone opcional




const components = {
    img: Image,
};

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) return <div className="text-center py-16">Post não encontrado.</div>;

    const PostComponent = post.default;

    if (!PostComponent) return <div className="text-center py-16">Erro ao carregar o conteúdo do post.</div>;

    return (
        <article className="prose prose-lg dark:prose-invert mx-auto px-6 pt-8 pb-20 max-w-2xl">
            <Link to="/">
                <Button variant="outline" className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o blog
                </Button>
            </Link>


            <h1>{post.title}</h1>
            <p className="text-muted-foreground mb-8 text-base">
                {post.date} • {post.readTime}
            </p>

            <MDXProvider components={components}>
                <PostComponent />
            </MDXProvider>
        </article>


    );
}
