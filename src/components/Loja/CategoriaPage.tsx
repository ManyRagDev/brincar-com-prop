import { getCategoriasComContagem } from "@/lib/produtos";
import { nomeCategoria } from "@/lib/categorias";
import { Shapes } from "lucide-react";

const ICONES: Record<string, JSX.Element> = {
  // seus ícones aqui...
};

export default function SecaoCategorias({
  categoriaAtiva,
  onSelect,
}: {
  categoriaAtiva: string | null;
  onSelect: (slug: string) => void;
}) {
  const categorias = getCategoriasComContagem();

  return (
    <section id="categorias" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Categorias
          </h2>
          <p className="mt-2 text-gray-600">
            Explore nossa curadoria de brinquedos e produtos por tema.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((c) => {
            const ativa = categoriaAtiva === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => onSelect(c.slug)}
                className={`flex flex-col items-center rounded-xl border p-4 shadow-sm transition
                  ${ativa
                    ? "bg-blue-600 text-white border-blue-700 shadow-md"
                    : "bg-white text-gray-800 hover:shadow-md hover:border-blue-300"}`}
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {ICONES[c.slug] ?? <Shapes className="h-5 w-5" />}
                </div>
                <span className="mt-2 font-medium">
                  {nomeCategoria(c.slug)}
                </span>
                <span className="text-sm">
                  {c.count} itens
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
