import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ← use só este import (sem duplicar)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPostPage from "./pages/blog/[slug]";
import BlogAll from "./pages/BlogAll";
import PostForm from "./pages/admin/PostForm";
import ProdutosRecomendados from "./pages/ProdutosRecomendados";
import ExtratorProduto from "./components/ExtratorProduto";
import Sobre from "@/pages/Sobre"; // ou "./pages/Sobre" dependendo do seu alias
import BeThemeConsole from "./pages/BeThemeConsole";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />            {/* ← nova rota */}
          <Route path="/extrator" element={<ExtratorProduto />} />
          <Route path="/admin/novo-post" element={<PostForm />} />
          <Route path="/blog" element={<BlogAll />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/produtos" element={<ProdutosRecomendados />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/console-temas" element={<BeThemeConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
