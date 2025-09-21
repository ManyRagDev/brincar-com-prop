export const CATEGORIAS: Record<string, { titulo: string; descricao?: string }> = {
  montessori: { titulo: "Montessori" },
  sensorial: { titulo: "Sensorial" },
  livro: { titulo: "Livros" },
  "primeira-infancia": { titulo: "Primeira infância" },
  acessorios: { titulo: "Acessórios" },
  alimentacao: { titulo: "Alimentação" },
  tapetes: { titulo: "Tapetes" },
  educativos: { titulo: "Educativos" },
  eletronicos: { titulo: "Eletrônicos" },
  construcao: { titulo: "Construção" },
  "bem-estar": { titulo: "Bem-estar" },
  rotina: { titulo: "Rotina" }
};

export function nomeCategoria(slug: string) {
  const cat = CATEGORIAS[slug];
  if (!cat) {
    console.warn("⚠️ Categoria não encontrada no mapa:", slug);
  } else {
    console.log("✅ Categoria encontrada:", slug, "→", cat.titulo);
  }
  return cat?.titulo ?? slug;
}
