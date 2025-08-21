// src/components/SocialShare.tsx
import { Facebook, Linkedin, MessageCircle, Copy, X as XIconLucide } from "lucide-react";
import { useState } from "react";

function ThreadsIcon({ size = 20 }: { size?: number }) {
  // SVG simples do logo Threads (monocromático)
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M128 20C69.2 20 20 69.2 20 128s49.2 108 108 108 108-49.2 108-108S186.8 20 128 20zm45.6 116.7c-1.4 26-19.8 44.5-48.8 47.4-14 1.4-26.9-1.3-36.9-7.8-4-2.6-5.1-8-2.5-12s8-5.1 12-2.5c7.4 4.8 16.9 6.6 27.8 5.5 19.9-2 31.4-13.5 32.5-32.9-6 3.1-13.5 4.9-22.3 5.4-14.1.8-25.7-2.1-34.4-8.7-9.5-7.2-14.4-17.9-14-31.6.5-17.7 10.4-29.7 28.2-33.8 15-3.4 28.3-.7 38.5 7.7 9.9 8.2 15.6 20.5 16.9 36.6l.4 5.2.6 10.9zm-29.5-23.6c-1.8-19.2-13.1-28.5-29.7-25-9.4 2.1-14.1 7.9-14.3 17.9-.2 7.7 2.3 13.1 7.8 17 6.1 4.5 14.9 6.5 26 5.9 4.1-.2 7.7-.8 10.2-1.8l-.1-14z" />
    </svg>
  );
}

function BlueskyIcon({ size = 20 }: { size?: number }) {
  // SVG simples do logo Bluesky (monocromático)
  return (
    <svg viewBox="0 0 600 600" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M300 280c70-110 190-200 240-200 0 150-70 210-150 260 100 40 130 110 130 200-60 0-130-40-220-150-90 110-160 150-220 150 0-90 30-160 130-200-80-50-150-110-150-260 50 0 170 90 240 200z"/>
    </svg>
  );
}

export default function SocialShare() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Encontrei este conteúdo no Brincar Educando!";
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Erro ao copiar link", e);
    }
  };

  return (
    <div className="mt-12 border-t pt-6">
      <p className="text-lg font-medium mb-4">Compartilhe este post</p>
      <div className="flex flex-wrap gap-3">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
          aria-label="Compartilhar no WhatsApp"
        >
          <MessageCircle size={20} />
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          aria-label="Compartilhar no Facebook"
        >
          <Facebook size={20} />
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-black text-white hover:bg-neutral-800"
          aria-label="Compartilhar no X"
        >
          <XIconLucide size={18} />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900"
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin size={20} />
        </a>

        {/* Threads (Web Intent) */}
        <a
          href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
          aria-label="Compartilhar no Threads"
        >
          <ThreadsIcon size={18} />
        </a>

        {/* Bluesky (Action Intent) — inclui o link dentro do text */}
        <a
          href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700"
          aria-label="Compartilhar no Bluesky"
        >
          <BlueskyIcon size={18} />
        </a>

        {/* Copiar link (para Instagram Stories/DM etc.) */}
        <button
          onClick={copyLink}
          className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600"
          aria-label="Copiar link"
        >
          <Copy size={20} />
        </button>
      </div>

      {copied && (
        <p className="text-sm text-green-600 mt-2">
          Link copiado! Abra o Instagram e cole no seu Story (sticker de link) ou envie por DM. 📲
        </p>
      )}
    </div>
  );
}
