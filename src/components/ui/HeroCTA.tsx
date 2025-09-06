export function HeroCTA() {
  return (
    <div className="mt-3 flex w-full justify-between gap-3">
      <a
        href="#solucoes-sono"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Ver soluções que ajudam no sono
      </a>
      <a
        href="/guia-brinquedos-por-idade"
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
        onClick={() => window?.gtag?.("event", "CTA_Guia_Top")}
      >
        Baixar guia por idade (gratuito)
      </a>
    </div>
  );
}
