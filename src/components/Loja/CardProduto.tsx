import { Link } from "react-router-dom";
import { buildAffiliateLink, Produto } from "@/lib/produtos";

export default function CardProduto({ produto }: { produto: Produto }) {
  return (
    <article className="rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <Link to={`/loja/produto/${produto.slug}`} className="block">
        <img
          src={produto.image}
          alt={produto.title}
          className="mx-auto h-40 w-auto object-contain p-4"
        />
      </Link>
      <div className="p-4 text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          <Link
            to={`/loja/produto/${produto.slug}`}
            className="hover:text-blue-600"
          >
            {produto.title}
            {/*{produto.id}*/}
          </Link>
        </h3>
        {produto.price && (
          <p className="text-blue-600 font-bold">{produto.price}</p>
        )}
        <div className="flex justify-center gap-2">
          {/*<Link
            to={`/loja/produto/${produto.slug}`}
            className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Detalhes
          </Link>*/}
          <a
            href={buildAffiliateLink(produto.link)}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
