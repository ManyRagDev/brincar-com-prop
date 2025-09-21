export type Produto = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  categories: string[];
  image: string;
  link: string;
  price?: string;
  featured?: boolean;
  source?: string;
};

// Carrega todos os JSON de /content/produtos
//const modules = import.meta.glob("/src/content/produtos/*.json", { eager: true });

export async function fetchAllProdutos(): Promise<Produto[]> {
  const res = await fetch("/src/content/produtos/index.json");
  return res.json();
}

const cache: Produto[] = Object.values(modules).map(
  (m: any) => m.default ?? m
) as Produto[];

export function getAllProdutos(): Produto[] {
  return [...cache]
    .filter((p) => p && p.title) // garante que só entra quem tem title
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}


export function getProdutoBySlug(slug: string): Produto | undefined {
  return cache.find((p) => p.slug === slug);
}

export function getProdutosByCategoria(slug: string): Produto[] {
  return cache.filter((p) => p.categories?.includes(slug));
}

export function getCategoriasComContagem(): { slug: string; count: number }[] {
  const map = new Map<string, number>();
  cache.forEach((p) =>
    (p.categories || []).forEach((c) =>
      map.set(c, (map.get(c) || 0) + 1)
    )
  );
  return Array.from(map.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getDestaques(limit = 6): Produto[] {
  return cache.filter((p) => p.featured).slice(0, limit);
}

// Anexa UTM aos links de afiliado
export function buildAffiliateLink(url?: string, campaign = "geral") {
  if (!url) return "#"; // fallback para evitar erro
  const hasQuery = url.includes("?");
  const utm = `utm_source=loja&utm_medium=afiliado&utm_campaign=${encodeURIComponent(
    campaign
  )}`;
  return hasQuery ? `${url}&${utm}` : `${url}?${utm}`;
}
