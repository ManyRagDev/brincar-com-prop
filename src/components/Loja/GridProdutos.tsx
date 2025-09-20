import CardProduto from "./CardProduto";
import { Produto } from "@/lib/produtos";

export default function GridProdutos({ produtos }: { produtos: Produto[] }) {
  if (!produtos?.length) return <p className="text-center text-gray-500">Nenhum produto encontrado.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {produtos.map((p) => (
        <CardProduto key={p.id} produto={p} />
      ))}
    </div>
  );
}
