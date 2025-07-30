import { useState } from "react";

const NewPostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: "",
    excerpt: "",
    category: "",
    readTime: "",
    thumbnail: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateMDX = () => {
    const {
      title,
      slug,
      date,
      excerpt,
      category,
      readTime,
      thumbnail,
      content,
    } = formData;

    return `---
title: "${title}"
slug: "${slug}"
date: ${date}
excerpt: "${excerpt}"
category: "${category}"
readTime: "${readTime}"
thumbnail: "${thumbnail}"
---

${content}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMDX());
    alert("Conteúdo copiado para a área de transferência!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Gerador de Post MDX</h1>
      <div className="grid gap-4">
        {[
          ["title", "Título"],
          ["slug", "Slug"],
          ["date", "Data (YYYY-MM-DD)"],
          ["excerpt", "Resumo (excerpt)"],
          ["category", "Categoria"],
          ["readTime", "Tempo de leitura"],
          ["thumbnail", "URL da imagem (thumbnail)"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              name={key}
              type="text"
              value={formData[key]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Conteúdo do Post (Markdown/MDX)</label>
          <textarea
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <button
          onClick={handleCopy}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Copiar MDX Gerado
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Preview do Arquivo MDX:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
            {generateMDX()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
