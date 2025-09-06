import React from "react";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-screen-md bg-white/90 backdrop-blur md:hidden">
      <div className="flex gap-2 p-3">
        <a href="#solucoes-sono" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-center font-medium">
          Ver Soluções
        </a>
        <a
          href="/guia-brinquedos-por-idade"
          className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-center font-medium text-white"
          onClick={() => window?.gtag?.("event", "CTA_Guia_Click")}
        >
          Baixar Guia
        </a>
      </div>
    </div>
  );
}
