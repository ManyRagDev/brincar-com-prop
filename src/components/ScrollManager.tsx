import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function keyFor(pathname: string) {
  return `scroll:${pathname}`;
}

// ajuste aqui quais rotas são "lista/index" e quais são "detalhe/post"
function isIndexRoute(pathname: string) {
  return pathname === "/" || pathname === "/blog";
}
function isPostRoute(pathname: string) {
  return pathname.startsWith("/blog/"); // detalhe do post
}

export default function ScrollManager() {
  const location = useLocation();
  const action = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const prevPathRef = useRef<string>(location.pathname);

  // 1) Sempre que o pathname mudar, salve o scroll do path anterior
  useEffect(() => {
    const prevPath = prevPathRef.current;
    sessionStorage.setItem(keyFor(prevPath), String(window.scrollY));
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // 2) Decida como rolar na chegada da nova rota
  useLayoutEffect(() => {
    // âncora na URL tem prioridade
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    // Se o usuário voltou (POP), tente restaurar posição salva da rota atual
    if (action === "POP") {
      const saved = sessionStorage.getItem(keyFor(location.pathname));
      if (saved !== null) {
        window.scrollTo({ top: Number(saved), left: 0, behavior: "auto" });
        return;
      }
      // sem posição salva → topo
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Navegação normal (PUSH/REPLACE):
    // - em páginas de post: sempre ir ao topo
    if (isPostRoute(location.pathname)) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // - em páginas index/lista: comportamento padrão → topo
    // (a restauração acontecerá quando o usuário voltar com POP)
    if (isIndexRoute(location.pathname)) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // fallback
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash, action]);

  return null;
}
