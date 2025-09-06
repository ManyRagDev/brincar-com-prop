// src/pages/landings/[slug].tsx
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { getAllLandings } from "@/lib/landings"; // <- libs (com S)
import { Image } from "@/components/ui/image";
import { Info, Tip, Checklist, Callout, Warning } from "@/components/ui/blocks";
import StickyCTA from "@/components/ui/StickyCTA";

const components = { img: Image, Info, Tip, Checklist, Callout, Warning, StickyCTA };

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const landings = getAllLandings();

  const page = landings.find((p: any) => (p.frontmatter?.slug ?? p.slug) === slug);

  if (!page) {
    const found = landings.map((p: any) => p.frontmatter?.slug ?? p.slug).filter(Boolean);
    return (
      <div className="py-16 text-center">
        Landing não encontrada.
        <div className="mt-4 text-sm opacity-70">
          Slugs disponíveis: {found.length ? found.join(', ') : '(nenhum MDX encontrado)'}
        </div>
      </div>
    );
  }

  const fm = page.frontmatter ?? page;
  const MDX = page.default;

  return (
    <article className="prose prose-lg dark:prose-invert mx-auto max-w-2xl px-6 pt-8 pb-24">
      {fm.noindex && <meta name="robots" content="noindex,nofollow" />}
      {fm.showTitle && <h1>{fm.title}</h1>}
      <MDXProvider components={components}>
        <MDX />
      </MDXProvider>
    </article>
  );
}
