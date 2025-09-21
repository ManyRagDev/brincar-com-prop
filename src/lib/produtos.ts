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
const modules = import.meta.glob("/src/content/produtos/*.json", { eager: true });

const cache: Produto[] = Object.values(modules).map(
  (m: any) => m.default ?? m
) as Produto[];

{/*export function getAllProdutos(): Produto[] {
  return [...cache]
    .filter((p) => p && p.title) // garante que só entra quem tem title
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}*/}

export async function getAllProdutos(): Promise<Produto[]> {
  try {
    console.log("📦 Buscando lista de produtos em /produtos/index.json...");
    const req = await fetch("/produtos/index.json");
    console.log("🔎 Resposta do index.json:", req);

    const files: string[] = await req.json();
    console.log("📂 Arquivos listados:", files);

    const produtos: Produto[] = [];
    for (const file of files) {
      console.log(`➡️ Buscando /produtos/${file}...`);
      const resp = await fetch(`/produtos/${file}`);
      const data: Produto = await resp.json();
      console.log("✅ Produto carregado:", data);
      produtos.push(data);
    }

    console.log("🎉 Produtos finais:", produtos);
    return produtos
      .filter((p) => p && p.title)
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } catch (err) {
    console.error("❌ Erro ao carregar produtos:", err);
    return [];
  }
}



export function getProdutoBySlug(slug: string): Produto | undefined {
  return cache.find((p) => p.slug === slug);
}

export async function getProdutosByCategoria(slug: string): Promise<Produto[]> {
  try {
    const produtos = await getAllProdutos();
    const filtrados = produtos.filter((p) => p.categories?.includes(slug));
    console.log(`📂 Produtos encontrados para categoria "${slug}":`, filtrados);
    return filtrados;
  } catch (err) {
    console.error("❌ Erro ao carregar produtos por categoria:", err);
    return [];
  }
}


export async function getCategoriasComContagem(): Promise<{ slug: string; count: number }[]> {
  try {
    const produtos = await getAllProdutos();
    const map = new Map<string, number>();

    produtos.forEach((p) =>
      (p.categories || []).forEach((c) =>
        map.set(c, (map.get(c) || 0) + 1)
      )
    );

    const categorias = Array.from(map.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    console.log("📊 Categorias calculadas:", categorias);
    return categorias;
  } catch (err) {
    console.error("❌ Erro ao calcular categorias:", err);
    return [];
  }
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
