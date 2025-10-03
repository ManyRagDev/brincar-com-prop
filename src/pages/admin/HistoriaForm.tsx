import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

type TextoBloco = {
  id?: string;
  ordem: number;
  conteudo: string;
};

const HistoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(true, true);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [faixaEtariaMin, setFaixaEtariaMin] = useState(0);
  const [faixaEtariaMax, setFaixaEtariaMax] = useState(12);
  const [capaUrl, setCapaUrl] = useState("");
  const [textos, setTextos] = useState<TextoBloco[]>([{ ordem: 1, conteudo: "" }]);

  useEffect(() => {
    if (id && !authLoading) {
      fetchHistoria();
    }
  }, [id, authLoading]);

  const fetchHistoria = async () => {
    try {
      const { data: historia, error } = await supabase
        .from("historias")
        .select("*, historias_textos(*)")
        .eq("id", id)
        .single();

      if (error) throw error;

      setTitulo(historia.titulo);
      setDescricao(historia.descricao || "");
      setFaixaEtariaMin(historia.faixa_etaria_min);
      setFaixaEtariaMax(historia.faixa_etaria_max);
      setCapaUrl(historia.capa_url || "");

      if (historia.historias_textos && historia.historias_textos.length > 0) {
        setTextos(
          historia.historias_textos
            .sort((a: any, b: any) => a.ordem - b.ordem)
            .map((t: any) => ({ id: t.id, ordem: t.ordem, conteudo: t.conteudo }))
        );
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar história",
        description: error.message,
      });
    }
  };

  const handleUploadCapa = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("historias-capas")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("historias-capas").getPublicUrl(filePath);

      setCapaUrl(data.publicUrl);
      toast({
        title: "Capa enviada!",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const adicionarBloco = () => {
    setTextos([...textos, { ordem: textos.length + 1, conteudo: "" }]);
  };

  const removerBloco = (ordem: number) => {
    const novosTextos = textos.filter((t) => t.ordem !== ordem);
    setTextos(novosTextos.map((t, i) => ({ ...t, ordem: i + 1 })));
  };

  const atualizarTexto = (ordem: number, conteudo: string) => {
    setTextos(textos.map((t) => (t.ordem === ordem ? { ...t, conteudo } : t)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("Usuário não autenticado");

      if (id) {
        // Atualizar história existente
        const { error: historiaError } = await supabase
          .from("historias")
          .update({
            titulo,
            descricao,
            faixa_etaria_min: faixaEtariaMin,
            faixa_etaria_max: faixaEtariaMax,
            capa_url: capaUrl,
          })
          .eq("id", id);

        if (historiaError) throw historiaError;

        // Deletar textos antigos
        await supabase.from("historias_textos").delete().eq("historia_id", id);

        // Inserir novos textos
        const { error: textosError } = await supabase.from("historias_textos").insert(
          textos
            .filter((t) => t.conteudo.trim())
            .map((t) => ({
              historia_id: id,
              ordem: t.ordem,
              conteudo: t.conteudo,
            }))
        );

        if (textosError) throw textosError;

        toast({
          title: "História atualizada!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Criar nova história
        const { data: novaHistoria, error: historiaError } = await supabase
          .from("historias")
          .insert({
            titulo,
            descricao,
            faixa_etaria_min: faixaEtariaMin,
            faixa_etaria_max: faixaEtariaMax,
            capa_url: capaUrl,
            created_by: user.id,
          })
          .select()
          .single();

        if (historiaError) throw historiaError;

        // Inserir textos
        const { error: textosError } = await supabase.from("historias_textos").insert(
          textos
            .filter((t) => t.conteudo.trim())
            .map((t) => ({
              historia_id: novaHistoria.id,
              ordem: t.ordem,
              conteudo: t.conteudo,
            }))
        );

        if (textosError) throw textosError;

        toast({
          title: "História criada!",
          description: "A nova história foi cadastrada com sucesso.",
        });
      }

      navigate("/admin/historias");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/historias")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Editar História" : "Nova História"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                placeholder="Ex: A Aventura do Pequeno Explorador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve resumo da história..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faixaMin">Faixa etária mínima *</Label>
                <Input
                  id="faixaMin"
                  type="number"
                  min="0"
                  max="12"
                  value={faixaEtariaMin}
                  onChange={(e) => setFaixaEtariaMin(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faixaMax">Faixa etária máxima *</Label>
                <Input
                  id="faixaMax"
                  type="number"
                  min="0"
                  max="12"
                  value={faixaEtariaMax}
                  onChange={(e) => setFaixaEtariaMax(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Capa da História</Label>
              {capaUrl && (
                <img
                  src={capaUrl}
                  alt="Preview da capa"
                  className="w-full max-w-xs h-48 object-cover rounded-md mb-2"
                />
              )}
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCapa}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Blocos de Texto</Label>
                <Button type="button" onClick={adicionarBloco} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Bloco
                </Button>
              </div>

              {textos.map((texto) => (
                <Card key={texto.ordem}>
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>Bloco {texto.ordem}</Label>
                        <Textarea
                          value={texto.conteudo}
                          onChange={(e) => atualizarTexto(texto.ordem, e.target.value)}
                          placeholder="Digite o texto deste bloco..."
                          rows={4}
                        />
                      </div>
                      {textos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerBloco(texto.ordem)}
                          className="mt-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar História"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriaForm;
