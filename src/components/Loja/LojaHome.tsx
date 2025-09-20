import { useState } from "react";
import HeroLoja from "@/components/Loja/HeroLoja";
import { getAllProdutos } from "@/lib/produtos";
import { Link } from "react-router-dom";
import SecaoCategorias from "@/components/Loja/CategoriaPage";
import CardProduto from "@/components/Loja/CardProduto";
import FeaturedCarousel from "@/components/Loja/FeaturedCarousel";

export default function LojaHome() {
  const todos = getAllProdutos();
  const [page, setPage] = useState(0);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const perPage = 6;

  // 1) Filtra pelos produtos da categoria selecionada (se houver)
  const filtrados = categoriaAtiva
    ? todos.filter(
        (p) => Array.isArray(p.categories) && p.categories.includes(categoriaAtiva)
      )
    : todos;

  // 2) Pagina os resultados filtrados
  const totalPages = Math.ceil(filtrados.length / perPage);
  const produtosVisiveis = filtrados.slice(page * perPage, page * perPage + perPage);

  // Resetar para página 0 quando trocar a categoria
  function handleSelect(slug: string) {
    setPage(0);
    setCategoriaAtiva((prev) => (prev === slug ? null : slug));
  }

  return (
    <main className="loja-home">
      {/* Hero */}
      <HeroLoja />
      <FeaturedCarousel /> 
      {/* Categorias */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <SecaoCategorias
            categoriaAtiva={categoriaAtiva}
            onSelect={handleSelect}
          />
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 bg-blue-100">
        <div className="container mx-auto px-4">
          <header className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Nossa loja
            </h2>
            <p className="mt-2 text-gray-600">
              {categoriaAtiva
                ? "Exibindo produtos da categoria selecionada"
                : "Explore todos os produtos do Brincar com Propósito"}
            </p>
          </header>

          {/* Grid paginado */}
          {produtosVisiveis.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosVisiveis.map((produto) => (
                  <CardProduto key={produto.id} produto={produto} />
                ))}
              </div>

              {/* Controles de paginação */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-lg bg-white border text-blue-600 disabled:opacity-50"
                  >
                    ← Anterior
                  </button>

                  <span className="text-sm text-gray-700">
                    Página {page + 1} de {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 rounded-lg bg-white border text-blue-600 disabled:opacity-50"
                  >
                    Próximo →
                  </button>
                </div>
              )}

              {/* Atalho para limpar filtro, se ativo */}
              {categoriaAtiva && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => handleSelect(categoriaAtiva)}
                    className="text-sm underline text-blue-700 hover:text-blue-900"
                  >
                    Limpar filtro
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-red-600 font-medium">
              Nenhum produto encontrado
            </p>
          )}
        </div>
      </section>

      {/* Chamada para o blog */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <header className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Quer aprender mais?
            </h2>
            <p className="mt-2 text-gray-600">
              Leia nossos artigos sobre desenvolvimento infantil, brincadeiras e rotina.
            </p>
          </header>
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Ir para o blog
          </Link>
        </div>
      </section>
    </main>
  );
}
