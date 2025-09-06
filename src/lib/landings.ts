// src/lib/landings.ts
// Use caminho POSIX ("/"), mesmo no Windows.

const modules = import.meta.glob(
  '/src/pages/landings/*.mdx', // <- AQUI bate com o local do seu MDX
  { eager: true }
) as Record<string, any>;

/** Retorna os módulos MDX normalizados com frontmatter + componente default */
export function getAllLandings() {
  const pages = Object.values(modules).map((m: any) => {
    const fm = m.frontmatter ?? m.frontMatter ?? {};
    return {
      ...m,            // mantém .default (componente MDX)
      frontmatter: fm, // normaliza a chave
      ...fm,           // expõe title, slug, flags no nível de cima (conveniência)
    };
  });

  // DEBUG opcional: veja no console os slugs carregados
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.table(pages.map((p: any) => ({
      slug: p.frontmatter?.slug ?? p.slug, file: '(src/pages/landings)'
    })));
  }

  return pages;
}
