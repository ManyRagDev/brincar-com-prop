import { useParams } from "react-router-dom";
import { getAllPosts } from "@/lib/mdx";
import { MDXProvider } from "@mdx-js/react";
import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react"; // ícone opcional




const components = {
    img: Image,
};

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/";
    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) return <div className="text-center py-16">Post não encontrado.</div>;

    const PostComponent = post.default;

    if (!PostComponent) return <div className="text-center py-16">Erro ao carregar o conteúdo do post.</div>;

    return (
        <article className="prose prose-lg dark:prose-invert mx-auto px-6 pt-8 pb-20 max-w-2xl">
            <Button
                onClick={() => navigate(from)}
                className="mt-8 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
                <ArrowLeft className="inline-block mr-2" /> Voltar
            </Button>



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
