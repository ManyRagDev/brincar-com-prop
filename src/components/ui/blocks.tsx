import * as React from "react";
import {
  AlertTriangle,
  Info as InfoIcon,
  Lightbulb,
  Feather,
  Home,
  Calendar,
  Stethoscope,
  Moon,
  Sun,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

type IconName =
  | "info"
  | "lightbulb"
  | "feather"
  | "warning"
  | "home"
  | "calendar"
  | "stethoscope"
  | "moon"
  | "sun"
  | "check";

const ICONS: Record<IconName, LucideIcon> = {
  info: InfoIcon,
  lightbulb: Lightbulb,
  feather: Feather,
  warning: AlertTriangle,
  home: Home,
  calendar: Calendar,
  stethoscope: Stethoscope,
  moon: Moon,
  sun: Sun,
  check: CheckCircle2,
};

function pickIcon(name?: string): LucideIcon {
  if (!name) return InfoIcon;
  const key = name.toLowerCase() as IconName;
  return ICONS[key] ?? InfoIcon;
}

type BaseProps = {
  icon?: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

function clsx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function BaseCallout({
  children,
  title,
  icon,
  className,
  tone = "neutral",
}: BaseProps & { tone?: "neutral" | "info" | "success" | "warning" | "accent" }) {
  const Icon = pickIcon(icon);

  const toneClasses: Record<typeof tone, { wrap: string; icon: string; title: string }> = {
    neutral: {
      wrap: "border-slate-300 bg-white",
      icon: "text-slate-600",
      title: "text-slate-900",
    },
    info: {
      wrap: "border-blue-300 bg-blue-50/60",
      icon: "text-blue-600",
      title: "text-blue-900",
    },
    success: {
      wrap: "border-emerald-300 bg-emerald-50/60",
      icon: "text-emerald-600",
      title: "text-emerald-900",
    },
    warning: {
      wrap: "border-amber-300 bg-amber-50/60",
      icon: "text-amber-700",
      title: "text-amber-900",
    },
    accent: {
      wrap: "border-violet-300 bg-violet-50/60",
      icon: "text-violet-700",
      title: "text-violet-900",
    },
  } as const;

  const t = toneClasses[tone];

  return (
    <div
      className={clsx(
        "rounded-2xl border px-4 py-3 md:px-5 md:py-4 shadow-sm",
        "not-prose",
        t.wrap,
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-2 flex items-center gap-2">
          {icon && <Icon className={clsx("h-5 w-5", t.icon)} aria-hidden="true" />}
          {title && <h3 className={clsx("font-semibold leading-none", t.title)}>{title}</h3>}
        </div>
      )}
      <div className="prose prose-slate max-w-none text-slate-800">{children}</div>
    </div>
  );
}

/** Caixinha informativa azul (usa <Info /> no MDX) */
export function Info(props: BaseProps) {
  return <BaseCallout tone="info" {...props} />;
}

/** Dica/Tip verdinha (usa <Tip /> no MDX) */
export function Tip(props: BaseProps) {
  // se não vier icon, usamos "lightbulb"
  return <BaseCallout tone="success" icon={props.icon ?? "lightbulb"} {...props} />;
}

/** Aviso/Warning âmbar (usa <Warning /> no MDX) */
export function Warning(props: BaseProps) {
  return <BaseCallout tone="warning" icon={props.icon ?? "warning"} {...props} />;
}

/** Callout roxinho “destaque” (usa <Callout /> no MDX) */
export function Callout(props: BaseProps) {
  return <BaseCallout tone="accent" {...props} />;
}

/** Checklist com visual de lista marcada (usa <Checklist /> no MDX) */
export function Checklist({ children, title, icon, className }: BaseProps) {
  const Icon = pickIcon(icon ?? "check");
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-300 bg-white px-4 py-3 md:px-5 md:py-4 shadow-sm not-prose",
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-2 flex items-center gap-2">
          <Icon className="h-5 w-5 text-slate-700" aria-hidden="true" />
          {title && <h3 className="font-semibold leading-none text-slate-900">{title}</h3>}
        </div>
      )}
      {/* Estiliza bullets do conteúdo interno */}
      <div className="prose prose-slate max-w-none">
        {/* Se o autor usar <ol> ou <ul> dentro do children, deixamos bonito */}
        <div className="[&>ul>li]:pl-1 [&>ul]:list-disc [&>ol]:list-decimal [&>ol>li]:pl-1">
          {children}
        </div>
      </div>
    </div>
  );
}
