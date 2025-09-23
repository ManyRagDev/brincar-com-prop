import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-D3XFPZ2X5H";

// 🔹 Exporta como componente invisível
export function PageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Inicializa só uma vez
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Dispara um pageview a cada troca de rota
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    console.log("📊 GA4 Pageview:", location.pathname + location.search);
  }, [location]);

  return null; // não renderiza nada na tela
}
