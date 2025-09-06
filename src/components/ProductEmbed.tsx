import { Button } from "@/components/ui/button";

type ProductEmbedProps = {
  /** Link do Mercado Livre (afiliado). Opcional */
  urlML?: string;
  /** Link da Amazon (afiliado). Opcional */
  urlAmazon?: string;
  /** Nome do produto */
  title: string;
  /** Imagem do produto (local ou URL) */
  image: string;
  /** Bullets com benefícios/destaques */
  highlights?: string[];
  /** Observação (ex.: aviso de afiliado) */
  note?: string;
  /** Texto do botão ML */
  ctaLabelML?: string;
  /** Texto do botão Amazon */
  ctaLabelAmazon?: string;
  /** Heading acima do card */
  heading?: string;
};

export default function ProductEmbed({
  urlML,
  urlAmazon,
  title,
  image,
  highlights = [],
  note = "* Compre pelo nosso link de afiliado: você não paga nada a mais e nos ajuda muito!",
  ctaLabelML = "Ver no Mercado Livre",
  ctaLabelAmazon = "Ver na Amazon",
  heading = "✨ Temos uma sugestão de produto para você:",
}: ProductEmbedProps) {
  return (
    <aside className="my-8">
      {/* Cabeçalho opcional */}
      {heading && (
        <h4 className="mb-3 text-base md:text-lg font-medium text-primary">
          {heading}
        </h4>
      )}

      {/* Card do produto */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <img
            src={image}
            alt={title}
            className="w-full h-56 md:h-full object-cover md:col-span-1"
            loading="lazy"
          />
          <div className="p-5 md:col-span-2 flex flex-col gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>

            {highlights.length > 0 && (
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}

            {note && <p className="text-xs text-muted-foreground">{note}</p>}

            <div className="mt-2 flex flex-wrap gap-3">
              {urlML && (
                <a
                  href={urlML}
                  target="_blank"
                  rel="noopener nofollow sponsored"
                  aria-label="Ver oferta no Mercado Livre"
                >
                  <Button variant="mercadolivre">🛒 {ctaLabelML}</Button>
                </a>
              )}
              {urlAmazon && (
                <a
                  href={urlAmazon}
                  target="_blank"
                  rel="noopener nofollow sponsored"
                  aria-label="Ver oferta na Amazon"
                >
                  <Button variant="amazon">🛒 {ctaLabelAmazon}</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
