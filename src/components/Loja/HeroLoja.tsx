import { Link } from "react-router-dom";

export default function HeroLoja() {
  return (
    <section
      className="relative py-20 bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/fundo_loja.png')" }}
    >
      {/* Overlay para melhorar contraste do texto */}
      <div className="absolute inset-0 bg-blue-900/60" />

      <div className="relative container mx-auto px-4 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ textShadow: "0px 2px 6px rgba(0,0,0,0.6)" }}
        >
          Brincar Educando: nossa curadoria de produtos
        </h1>

        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Seleção consciente de itens que apoiam o desenvolvimento infantil. Ao
          comprar pelos nossos links, você apoia o projeto sem custo adicional.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          {/* Rolagem para categorias */}
          <a
            href="#categorias"
            className="px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-gray-100"
          >
            Explorar categorias
          </a>

          {/* Voltar para o blog usando React Router */}
          <Link
            to="/" 
            className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white/10 font-medium"
          >
            Voltar ao blog
          </Link>
        </div>
      </div>
    </section>
  );
}


