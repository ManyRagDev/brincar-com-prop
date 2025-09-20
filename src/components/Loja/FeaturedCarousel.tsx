import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProdutos } from "@/lib/produtos";
import CardProduto from "@/components/Loja/CardProduto";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedCarousel = () => {
  const produtos = getAllProdutos().filter((p) => p.featured); // só featured
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = direita, -1 = esquerda

  const itemsPerPage = 3;

  const next = () => {
    setDirection(1);
    setStartIndex((prev) =>
      prev + itemsPerPage >= produtos.length ? 0 : prev + itemsPerPage
    );
  };

  const prev = () => {
    setDirection(-1);
    setStartIndex((prev) =>
      prev - itemsPerPage < 0 ? Math.max(produtos.length - itemsPerPage, 0) : prev - itemsPerPage
    );
  };

  // autoplay a cada 5s
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [produtos.length]);

  // Pega os 3 produtos atuais
  const current = produtos.slice(startIndex, startIndex + itemsPerPage);

  // Variantes de animação
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    }),
  };

  return (
    <section className="py-10 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          ⭐ Top Recomendações
        </h2>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={startIndex} // força re-render a cada troca
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {current.map((produto) => (
                <CardProduto key={produto.id} produto={produto} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Botões de navegação */}
          <button
            onClick={prev}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
