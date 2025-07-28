const postModules = import.meta.glob('/src/content/posts/*.mdx', { eager: true });

export function getAllPosts() {
  return Object.entries(postModules).map(([path, module]: any) => {
    const slug = path
      .split('/')
      .pop()
      ?.replace(/\.mdx$/, '') || '';

    return {
      ...(module.frontmatter || {}),
      slug,
    };
  });
}
