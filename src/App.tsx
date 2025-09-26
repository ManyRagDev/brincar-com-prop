import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPostPage from "./pages/blog/[slug]";
import BlogAll from "./pages/BlogAll";
import PostForm from "./pages/admin/PostForm";
import ProdutosRecomendados from "./pages/ProdutosRecomendados";
import ExtratorProduto from "./components/ExtratorProduto";
import Sobre from "@/pages/Sobre";
import BeThemeConsole from "./pages/BeThemeConsole";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";
import LandingPage from "@/pages/landings/[slug]";
import ScrollManager from "./components/ScrollManager";
import ProductForm from "./components/ProductForm";
import TermosDeUso from "./pages/TermosDeUso";

// LOJA
import LojaHome from "@/components/Loja/LojaHome";
import CategoriaPage from "@/components/Loja/CategoriaPage";
import ProdutoPage from "@/components/Loja/ProdutoPage";
import SobreLoja from "@/components/Loja/SobreLoja";
import PoliticaAfiliados from "@/components/Loja/PoliticaAfiliados";
import ContatoLoja from "@/components/Loja/ContatoLoja";

// 📊 Componente de rastreamento
import { PageTracking } from "@/hooks/usePageTracking";

const queryClient = new QueryClient();

const App = () => {
  const isLojaSubdomain = window.location.hostname
    .toLowerCase()
    .startsWith("loja.");

  const basename = isLojaSubdomain ? "/" : "/";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <ScrollManager />

          {/* 📊 GA4 Page Tracking dentro do Router */}
          <PageTracking />

          <Routes>
            {/* —— SITE PRINCIPAL —— */}
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/extrator" element={<ExtratorProduto />} />
            <Route path="/admin/novo-post" element={<PostForm />} />
            <Route path="/blog" element={<BlogAll />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/produtos" element={<ProdutosRecomendados />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos" element={<TermosDeUso />} />
            <Route path="/console-temas" element={<BeThemeConsole />} />
            <Route path="/cadastrar" element={<ProductForm />} />

            {/* rota dinâmica das LPs */}
            <Route path="/landings/:slug" element={<LandingPage />} />

            {/* —— LOJA —— */}
            <Route path="/loja" element={<LojaHome />} />
            <Route path="/loja/categoria/:slug" element={<CategoriaPage categoriaAtiva="" onSelect={() => {}} />} />
            <Route path="/loja/produto/:slug" element={<ProdutoPage />} />
            <Route path="/loja/sobre" element={<SobreLoja />} />
            <Route path="/loja/politica" element={<PoliticaAfiliados />} />
            <Route path="/loja/contato" element={<ContatoLoja />} />

            {/* 404 sempre por último */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
