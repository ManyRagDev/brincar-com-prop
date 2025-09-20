import { useParams, Link } from "react-router-dom";
import { getProdutoBySlug, getProdutosByCategoria, buildAffiliateLink } from "@/lib/produtos";


export default function ProdutoPage() {
const { slug } = useParams();
const produto = getProdutoBySlug(slug!);


if (!produto) {
return (
<main className="produto-page container">
<p>Produto não encontrado.</p>
<Link to="/loja" className="btn">Voltar à loja</Link>
</main>
);
}


// Relacionados: primeiros 4 da primeira categoria
const relacionados = produto.categorias?.length
? getProdutosByCategoria(produto.categorias[0]).filter(p => p.slug !== produto.slug).slice(0, 4)
: [];


return (
<main className="produto-page container">
<nav className="breadcrumb">
<Link to="/loja">Loja</Link> <span>/</span> <span>{produto.nome}</span>
</nav>


<section className="produto-detalhe">
<div className="produto-imagem">
<img src={produto.imagem} alt={produto.nome} />
</div>
<div className="produto-info">
<h1>{produto.nome}</h1>
{produto.preco && <div className="preco">{produto.preco}</div>}
<p>{produto.descricao}</p>


{produto.idade && (
<p><strong>Idade recomendada:</strong> {produto.idade}</p>
)}


<div className="acoes">
<a
href={buildAffiliateLink(produto.linkAfiliado, produto.categorias?.[0] || "produto")}
target="_blank"
rel="nofollow sponsored noopener"
className="btn"
>
Comprar no parceiro
</a>
<Link to="/loja" className="btn btn-ghost">Voltar à loja</Link>
</div>


<p className="disclaimer">
Transparência: usamos links de afiliado. Você não paga nada a mais e apoia nosso projeto.
</p>
</div>
</section>


{relacionados.length > 0 && (
<section className="relacionados">
<h2>Você também pode gostar</h2>
<div className="grid-relacionados">
{relacionados.map((p) => (
<Link key={p.id} to={`/loja/produto/${p.slug}`} className="rel-link">
<img src={p.imagem} alt={p.nome} />
<span>{p.nome}</span>
</Link>
))}
</div>
</section>
)}
</main>
);
}