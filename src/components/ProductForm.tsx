import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const categorias = [
  "Montessori",
  "Brinquedos",
  "Sensorial",
  "Educativos",
  "Tapetes",
  "Primeira infância",
  "Acessórios",
  "Alimentação",
  "Rotina",
  "Cuidados",
  "Eletrônicos",
  "Organização",
  "Móveis infantis",
  "Livros",
  "Presentes",
];

const ProductForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [category1, setCategory1] = useState(categorias[0]);
  const [category2, setCategory2] = useState("");
  const [price, setPrice] = useState("");
  const [bulkJson, setBulkJson] = useState("");

  const toKebabCase = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleGenerateId = (value: string) => {
    setTitle(value);
    const kebab = toKebabCase(value);
    setId(kebab);
  };

  const detectSource = (url: string): string => {
    if (!url) return "Outro";
    if (url.includes("amazon.com") || url.includes("amzn.to")) return "Amazon";
    if (url.includes("mercadolivre.com.br")) return "Mercado Livre";
    return "Outro";
  };

  const resetForm = () => {
    setTitle("");
    setId("");
    setExcerpt("");
    setAffiliateUrl("");
    setFeatured(false);
    setCategory1(categorias[0]);
    setCategory2("");
    setPrice("");
  };

  const handleSave = () => {
    if (category1 && category2 && category1 === category2) {
      alert("As categorias não podem ser iguais!");
      return;
    }

    const product = {
      id,
      title,
      image: `./images/${id}.png`,
      excerpt,
      affiliateUrl,
      featured,
      category: [category1, ...(category2 ? [category2] : [])],
      price,
      source: detectSource(affiliateUrl),
    };

    const blob = new Blob([JSON.stringify(product, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `${id}.json`);
    resetForm();
  };

  // Conversor em massa com ZIP
  const handleBulkConvert = async () => {
    try {
      const data = JSON.parse(bulkJson);

      if (!Array.isArray(data)) {
        alert("O JSON deve ser um array de produtos!");
        return;
      }

      const zip = new JSZip();

      data.forEach((product: any, index: number) => {
        if (!product.id) {
          product.id = `produto-${index + 1}`;
        }
        if (!product.image) {
          product.image = `./images/${product.id}.png`;
        }
        product.source = detectSource(product.affiliateUrl || "");
        if (typeof product.category === "string") {
          product.category = [product.category];
        }

        const jsonContent = JSON.stringify(product, null, 2);
        zip.file(`${product.id}.json`, jsonContent);
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "produtos.zip");
    } catch (error) {
      alert("JSON inválido!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-10">
      {/* Cadastro individual */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cadastro de Produto Individual
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleGenerateId(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="Ex: Tapete Sensorial Montessori"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border p-2 rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descrição curta</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="Resumo breve do produto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Link de afiliado</label>
            <input
              type="text"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="https://mercadolivre.com/... ou https://amzn.to/..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <label className="text-sm font-medium">Top Recomendações</label>
          </div>

          <div>
            <label className="block text-sm font-medium">Categoria 1</label>
            <select
              value={category1}
              onChange={(e) => setCategory1(e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Categoria 2 (opcional)
            </label>
            <select
              value={category2}
              onChange={(e) => setCategory2(e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              <option value="">-- Nenhuma --</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Preço</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="R$ 89,90"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Salvar JSON
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      {/* Conversor em massa */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Conversor em Massa</h2>
        <textarea
          value={bulkJson}
          onChange={(e) => setBulkJson(e.target.value)}
          className="w-full border p-2 rounded-md h-48"
          placeholder='Cole aqui o JSON em formato de array [...]'
        />
        <button
          type="button"
          onClick={handleBulkConvert}
          className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Baixar ZIP com JSONs
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
