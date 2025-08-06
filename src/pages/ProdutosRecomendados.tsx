import { useEffect, useState } from "react";
import produtosData from "@/content/products.json";
import { Link } from "react-router-dom";
import bgImage from "@/assets/brinquedos-fundo.png";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  categoria: string;
  idade: string;
  genero: string;
  imagem: string;
  linkAfiliado: string;
}

export default function ProdutosRecomendados() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [idadeFiltro, setIdadeFiltro] = useState("");

  useEffect(() => {
    setProdutos(produtosData);
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const categoriaOk = categoriaFiltro ? produto.categoria.includes(categoriaFiltro) : true;

    const idadeNormalizada = produto.idade.toLowerCase();
    const idadeOk = idadeFiltro
      ? idadeFiltro === "0 a 12 meses"
        ? ["0 a 12 meses", "6 meses", "3 meses", "1 mês"].includes(idadeNormalizada)
        : idadeNormalizada === idadeFiltro.toLowerCase()
      : true;

    return categoriaOk && idadeOk;
  });

  const limparFiltros = () => {
    setCategoriaFiltro("");
    setIdadeFiltro("");
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="text-blue-600 underline hover:text-blue-800"
          >
            ← Voltar para a página inicial
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 text-foreground">
          Brinquedos Recomendados
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 && "s"} encontrado{produtosFiltrados.length !== 1 && "s"}
        </p>

        {/* Filtros com cabeçalhos para maior clareza */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Categoria</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="p-3 rounded-md border border-gray-300 w-full"
            >
              <option value="">Todas as categorias</option>
              <option value="montessori">Montessori</option>
              <option value="sensorial">Sensorial</option>
              <option value="tapetes">Tapetes</option>
              <option value="educativos">Educativos</option>
              <option value="livros">Livros</option>
              <option value="organizacao">Organização</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Idade</label>
            <select
              value={idadeFiltro}
              onChange={(e) => setIdadeFiltro(e.target.value)}
              className="p-3 rounded-md border border-gray-300 w-full"
            >
              <option value="">Todas as idades</option>
              <option value="0 a 12 meses">0 a 12 meses</option>
              <option value="1 ano">1 ano</option>
              <option value="2 anos">2 anos</option>
              <option value="3 anos">3 anos</option>
              <option value="todas">Todas</option>
            </select>
          </div>
        </div>

        <div className="mb-12 text-center">
          <button
            onClick={limparFiltros}
            className="text-sm text-gray-600 underline hover:text-gray-800"
          >
            Limpar filtros
          </button>
        </div>

        <hr className="border-gray-300 mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="flex flex-col bg-white/90 backdrop-blur shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-64 object-cover"
              />
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-primary">
                    {produto.nome}
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {produto.descricao}
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href={produto.linkAfiliado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Ver no Mercado Livre
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
