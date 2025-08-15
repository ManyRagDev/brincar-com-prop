import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * BE – Console de Temas
 * ------------------------------------------------------------
 * Página única para gerenciar temas de posts do projeto Brincar Educando.
 *
 * Requisitos atendidos:
 * - Textbox para inserir o tema
 * - Botão para enviar o tema ao n8n (via webhook)
 * - Armazenamento local (localStorage) de dois JSONs: "usados" e "a usar"
 * - Verificação se o tema já foi usado ao tentar enviar
 * - Visualização como listas dos dois JSONs
 * - Ações utilitárias: mover, excluir, copiar, exportar JSON
 *
 * Como usar:
 * 1) Coloque este componente em src/pages/BeThemeConsole.jsx (ou onde preferir) e crie uma rota para ele.
 * 2) Crie um .env.local (ou .env) com VITE_N8N_WEBHOOK_URL="https://SEU-HOST/webhook/rota".
 * 3) Rode o projeto (Vite) e acesse a página para gerenciar.
 *
 * Observações:
 * - Mantemos a fonte de verdade em localStorage para simplicidade de front-end puro.
 * - Botões "Exportar JSON" permitem baixar os arquivos atualizados e comitar no repo se desejar.
 */

const LS_USED_KEY = "be_used_themes_v1";
const LS_QUEUE_KEY = "be_queue_themes_v1";




function useLocalJsonArray(key, initial = [], fallbackImport) {
  const [value, setValue] = useState(initial);

  // carregar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setValue(arr);
          return; // já carregou do localStorage
        }
      }

      // se não achou no localStorage, tenta carregar do JSON do projeto
      if (fallbackImport && Array.isArray(fallbackImport)) {
        setValue(fallbackImport);
      } else {
        // caso nem exista, cria array vazio
        setValue([]);
      }
    } catch (e) {
      console.warn("Falha ao carregar dados", key, e);
      setValue([]);
    }
  }, [key, fallbackImport]);

  // persistir
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Falha ao salvar localStorage", key, e);
    }
  }, [key, value]);

  return [value, setValue];
}


function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

export default function BeThemeConsole() {
  console.log(">>> VITE_N8N_WEBHOOK_URL:", import.meta.env.VITE_N8N_WEBHOOK_URL); //<<<<<<<<<<<<<---------- inserido aqui
  const [input, setInput] = useState("");
  const [queue, setQueue] = useLocalJsonArray(LS_QUEUE_KEY, []);
  const [used, setUsed] = useLocalJsonArray(LS_USED_KEY, []);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
  console.log("Webhook URL:", import.meta.env.VITE_N8N_WEBHOOK_URL);
  const normalizedUsed = useMemo(
    () => new Set(used.map((s) => s.trim().toLowerCase())),
    [used]
  );

  function toast(msg, variant = "info") {
    setMessage({ msg, variant });
    setTimeout(() => setMessage(null), 3500);
  }

  function addToQueue() {
    const theme = input.trim();
    if (!theme) return toast("Digite um tema antes de adicionar.", "warn");

    const alreadyInQueue = queue
      .map((s) => s.trim().toLowerCase())
      .includes(theme.toLowerCase());
    const alreadyUsed = normalizedUsed.has(theme.toLowerCase());

    if (alreadyInQueue) return toast("Tema já está na lista de 'A usar'.", "warn");
    if (alreadyUsed) return toast("Tema já foi usado em um post.", "warn");

    setQueue((prev) => [theme, ...prev]);
    setInput("");
    inputRef.current?.focus();
    toast("Tema adicionado à lista 'A usar'.", "ok");
  }

  function deleteFromQueue(idx) {
    setQueue((prev) => prev.filter((_, i) => i !== idx));
  }

  function deleteFromUsed(idx) {
    setUsed((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveQueueToUsed(idx) {
    const theme = queue[idx];
    if (!theme) return;
    if (normalizedUsed.has(theme.trim().toLowerCase())) {
      // já existe em usados
      setQueue((prev) => prev.filter((_, i) => i !== idx));
      return toast("Tema já constava em 'Usados'. Removido da fila.", "warn");
    }
    setUsed((prev) => [theme, ...prev]);
    setQueue((prev) => prev.filter((_, i) => i !== idx));
    toast("Tema movido para 'Usados'.", "ok");
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => toast("Copiado!", "ok"));
  }

  function exportJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function triggerN8n(theme) {
    console.log(">>> Disparando triggerN8n com tema:", theme);
    if (!webhookUrl) {
      return toast(
        "Configure VITE_N8N_WEBHOOK_URL no seu .env para enviar ao n8n.",
        "warn"
      );
    }
    if (normalizedUsed.has(theme.trim().toLowerCase())) {
      // ok – já foi usado; podemos enviar
    } else {
      // garantir que não está duplicando: mover p/ usados automaticamente
      setUsed((prev) => [theme, ...prev]);
      setQueue((prev) => prev.filter((t) => t !== theme));
    }

    try {
      setIsSending(true);
      const payload = {
        theme,
        // Campo exato exigido no seu fluxo do n8n:
        // use chave string para suportar espaço no nome
        // eslint-disable-next-line no-useless-computed-key
        ["edit fields1"]: theme,
        // Extras úteis para rastreio
        source: "be-theme-console",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(webhookUrl, {
              
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        
      });
      console.log(">>> Enviando para n8n:", webhookUrl, payload);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Webhook falhou: ${res.status} – ${text}`);
      }

      toast("Enviado ao n8n com sucesso.", "ok");
    } catch (err) {
      console.error(err);
      toast(`Erro ao enviar ao n8n: ${err.message}`, "error");
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addToQueue();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Brincar Educando · Console de Temas
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie os temas do blog (fila e já publicados) e dispare o fluxo no n8n.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportJson("be-queue-themes.json", queue)}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-100 text-sm"
              title="Exportar JSON com a fila de temas"
            >
              Exportar "A usar"
            </button>
            <button
              onClick={() => exportJson("be-used-themes.json", used)}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-100 text-sm"
              title="Exportar JSON com os temas usados"
            >
              Exportar "Usados"
            </button>
          </div>
        </header>

        {/* Formulário de inclusão */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-8"
        >
          <label className="block text-sm font-medium mb-2">Novo tema</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex.: Introdução alimentar BLW vs. papinhas"
              className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                Adicionar à fila
              </button>
              <button
                type="button"
                onClick={() => input.trim() && triggerN8n(input.trim())}
                disabled={isSending || !input.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                title="Envia diretamente ao n8n (também marca como usado se ainda não estiver)"
              >
                {isSending ? "Enviando..." : "Enviar ao n8n"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Antes de enviar, verificamos automaticamente se o tema já está em "Usados".
          </p>
        </form>

        {/* Listas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A usar */}
          <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Temas – A usar</h2>
              <span className="text-xs text-gray-500">{queue.length} itens</span>
            </div>

            {queue.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum tema na fila. Adicione acima.</p>) : (
              <ul className="space-y-2">
                {queue.map((t, i) => (
                  <li
                    key={`${t}-${i}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border p-3 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm leading-snug">{t}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                      <button
                        onClick={() => copyText(t)}
                        className="text-xs px-2 py-1 rounded-lg border"
                        title="Copiar"
                      >
                        Copiar
                      </button>
                      <button
                        onClick={() => triggerN8n(t)}
                        className="text-xs px-2 py-1 rounded-lg border bg-emerald-50 hover:bg-emerald-100"
                        title="Enviar ao n8n"
                      >
                        Enviar
                      </button>
                      <button
                        onClick={() => moveQueueToUsed(i)}
                        className="text-xs px-2 py-1 rounded-lg border bg-indigo-50 hover:bg-indigo-100"
                        title="Marcar como usado"
                      >
                        Usado
                      </button>
                      <button
                        onClick={() => deleteFromQueue(i)}
                        className="text-xs px-2 py-1 rounded-lg border bg-rose-50 hover:bg-rose-100"
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Usados */}
          <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Temas – Usados</h2>
              <span className="text-xs text-gray-500">{used.length} itens</span>
            </div>

            {used.length === 0 ? (
              <p className="text-sm text-gray-500">Ainda não há temas usados.</p>) : (
              <ul className="space-y-2">
                {used.map((t, i) => (
                  <li
                    key={`${t}-${i}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border p-3 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm leading-snug">{t}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                      <button
                        onClick={() => copyText(t)}
                        className="text-xs px-2 py-1 rounded-lg border"
                        title="Copiar"
                      >
                        Copiar
                      </button>
                      <button
                        onClick={() => setQueue((prev) => [t, ...prev])}
                        className="text-xs px-2 py-1 rounded-lg border bg-amber-50 hover:bg-amber-100"
                        title="Reenfileirar"
                      >
                        Reenfileirar
                      </button>
                      <button
                        onClick={() => deleteFromUsed(i)}
                        className="text-xs px-2 py-1 rounded-lg border bg-rose-50 hover:bg-rose-100"
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Toast mínimo */}
        {message && (
          <div
            className={classNames(
              "fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg border backdrop-blur",
              message.variant === "ok" && "bg-emerald-50 border-emerald-200",
              message.variant === "warn" && "bg-amber-50 border-amber-200",
              message.variant === "error" && "bg-rose-50 border-rose-200",
              message.variant === "info" && "bg-white border-gray-200"
            )}
          >
            <span className="text-sm">{message.msg}</span>
          </div>
        )}

        {/* Rodapé de ajuda */}
        <footer className="mt-10 text-xs text-gray-500">
          <p>
            Dica: para manter os JSONs no repo, use os botões de exportação e
            substitua manualmente os arquivos em <code>src/data</code> (se desejar),
            comite e publique.
          </p>
        </footer>
      </div>
    </div>
  );
}
