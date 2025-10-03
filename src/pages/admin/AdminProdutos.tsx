import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { getAllProdutos, type Produto } from "@/lib/produtos";
import { Plus, Download, Package } from "lucide-react";

const AdminProdutos = () => {
  const [existingProducts, setExistingProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para produto individual
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);

  // Estado para bulk
  const [bulkJson, setBulkJson] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const produtos = await getAllProdutos();
      setExistingProducts(produtos);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos existentes");
    } finally {
      setLoading(false);
    }
  };

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const detectSource = (url: string) => {
    if (url.includes("amazon")) return "Amazon";
    if (url.includes("mercadolivre") || url.includes("mercadolibre")) return "Mercado Livre";
    return "Other";
  };

  const handleGenerateId = (value: string) => {
    setTitle(value);
    setId(toKebabCase(value));
  };

  const resetForm = () => {
    setTitle("");
    setId("");
    setExcerpt("");
    setDescription("");
    setCategories("");
    setImage("");
    setLink("");
    setPrice("");
    setFeatured(false);
  };

  const handleAddProduct = () => {
    if (!id || !title || !link) {
      toast.error("Preencha pelo menos ID, Título e Link");
      return;
    }

    const categoriesArray = categories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);

    const newProduct: Produto = {
      id,
      slug: id,
      title,
      excerpt,
      description: description || excerpt,
      categories: categoriesArray,
      image: image || `/images/produtos/${id}.png`,
      link,
      price,
      featured,
      source: detectSource(link),
    };

    setExistingProducts((prev) => [...prev, newProduct]);
    toast.success(`Produto "${title}" adicionado!`);
    resetForm();
  };

  const handleBulkAdd = () => {
    try {
      const products = JSON.parse(bulkJson);
      if (!Array.isArray(products)) {
        toast.error("O JSON deve ser um array de produtos");
        return;
      }

      const newProducts: Produto[] = products.map((p: any) => ({
        id: p.id || toKebabCase(p.title || p.nome || "produto"),
        slug: p.slug || p.id || toKebabCase(p.title || p.nome || "produto"),
        title: p.title || p.nome || "Sem título",
        excerpt: p.excerpt || p.descricao || "",
        description: p.description || p.descricao || p.excerpt || "",
        categories: Array.isArray(p.categories)
          ? p.categories
          : typeof p.categoria === "string"
          ? p.categoria.split(",").map((c: string) => c.trim())
          : [],
        image: p.image || p.imagem || `/images/produtos/${p.id}.png`,
        link: p.link || p.linkAfiliado || "",
        price: p.price || p.preco || "",
        featured: p.featured || false,
        source: p.source || detectSource(p.link || p.linkAfiliado || ""),
      }));

      setExistingProducts((prev) => [...prev, ...newProducts]);
      toast.success(`${newProducts.length} produtos adicionados!`);
      setBulkJson("");
    } catch (error) {
      toast.error("JSON inválido. Verifique o formato.");
      console.error(error);
    }
  };

  const handleDownloadZip = async () => {
    if (existingProducts.length === 0) {
      toast.error("Nenhum produto para exportar");
      return;
    }

    try {
      const zip = new JSZip();

      // Adicionar cada produto como JSON individual
      existingProducts.forEach((produto) => {
        const fileName = `${produto.id}.json`;
        const json = JSON.stringify(produto, null, 2);
        zip.file(fileName, json);
      });

      // Criar index.json com a lista de arquivos
      const indexJson = existingProducts.map((p) => `${p.id}.json`).sort();
      zip.file("index.json", JSON.stringify(indexJson, null, 2));

      // Gerar e baixar o ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "produtos.zip");

      toast.success("ZIP gerado! Extraia em public/produtos/");
    } catch (error) {
      toast.error("Erro ao gerar ZIP");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Administração de Produtos</h1>
          <p className="text-muted-foreground">
            Adicione produtos e baixe o ZIP para atualizar a loja
          </p>
        </div>
        <Button onClick={handleDownloadZip} size="lg" className="gap-2">
          <Download className="h-5 w-5" />
          Baixar ZIP ({existingProducts.length} produtos)
        </Button>
      </div>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Individual
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Package className="mr-2 h-4 w-4" />
            Adicionar em Massa
          </TabsTrigger>
          <TabsTrigger value="list">Lista de Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Novo Produto</CardTitle>
              <CardDescription>
                Preencha os dados do produto. O ID será gerado automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleGenerateId(e.target.value)}
                    placeholder="Ex: Kit Montessori Completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id">ID (gerado automaticamente)</Label>
                  <Input id="id" value={id} readOnly className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Descrição Curta</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Resumo do produto em uma linha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição detalhada do produto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categories">Categorias (separadas por vírgula)</Label>
                  <Input
                    id="categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="montessori, educativos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="R$ 129,90"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link de Afiliado *</Label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Deixe vazio para usar /images/produtos/{id}.png"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Produto em Destaque</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Múltiplos Produtos</CardTitle>
              <CardDescription>
                Cole um JSON com array de produtos. Formato: [{"{"}"id": "...", "title": "...", ...{"}"}]
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder='[{"title":"Produto 1","link":"https://..."},{"title":"Produto 2","link":"https://..."}]'
                rows={15}
                className="font-mono text-sm"
              />
              <Button onClick={handleBulkAdd} className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Adicionar Todos os Produtos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Cadastrados ({existingProducts.length})</CardTitle>
              <CardDescription>
                Lista de todos os produtos que serão incluídos no ZIP
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando produtos...</p>
              ) : existingProducts.length === 0 ? (
                <p className="text-muted-foreground">Nenhum produto cadastrado ainda</p>
              ) : (
                <div className="grid gap-3">
                  {existingProducts.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-start justify-between border rounded-lg p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{produto.title}</h3>
                          {produto.featured && (
                            <Badge variant="secondary">Destaque</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {produto.id}
                        </p>
                        {produto.categories.length > 0 && (
                          <div className="flex gap-1">
                            {produto.categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge>{produto.source || "Link"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProdutos;
