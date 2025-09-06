import React from "react";

type Props = {
  title: string;
  image: string;
  children?: React.ReactNode; // descrição curta
  href: string; // link afiliado
};

export default function ProductCard({ title, image, children, href }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <img src={image} alt={title} className="mb-3 aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      {children && <p className="mb-4 text-sm text-slate-700">{children}</p>}
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener"
        onClick={() => window?.gtag?.("event", "AffiliateClick", { item_name: title })}
        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Ver na Amazon/ML
      </a>
    </div>
  );
}
