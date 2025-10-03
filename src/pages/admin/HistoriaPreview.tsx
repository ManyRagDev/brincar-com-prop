import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Historia = {
  id: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
  publicado: boolean;
};

type TextoBloco = {
  ordem: number;
  conteudo: string;
};

const HistoriaPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth(true, true);
  const { toast } = useToast();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [textos, setTextos] = useState<TextoBloco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && id) {
      fetchHistoria();
    }
  }, [authLoading, id]);

  const fetchHistoria = async () => {
    try {
      const { data, error } = await supabase
        .from("historias")
        .select("*, historias_textos(*)")
        .eq("id", id)
        .single();

      if (error) throw error;

      setHistoria(data);
      setTextos(
        (data.historias_textos || [])
          .sort((a: any, b: any) => a.ordem - b.ordem)
          .map((t: any) => ({ ordem: t.ordem, conteudo: t.conteudo }))
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!historia) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">História não encontrada</p>
        <Button onClick={() => navigate("/admin/historias")}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/historias")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={() => navigate(`/admin/historias/editar/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <Card className="overflow-hidden">
          {historia.capa_url && (
            <img
              src={historia.capa_url}
              alt={historia.titulo}
              className="w-full h-80 object-cover"
            />
          )}
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{historia.titulo}</h1>
                {historia.descricao && (
                  <p className="text-lg text-muted-foreground">{historia.descricao}</p>
                )}
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  <strong>Faixa etária:</strong> {historia.faixa_etaria_min}-
                  {historia.faixa_etaria_max} anos
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={historia.publicado ? "text-green-600" : "text-orange-600"}
                  >
                    {historia.publicado ? "Publicada" : "Rascunho"}
                  </span>
                </div>
              </div>

              <hr className="my-8" />

              <div className="space-y-6">
                {textos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Esta história ainda não possui textos cadastrados.
                  </p>
                ) : (
                  textos.map((texto) => (
                    <div key={texto.ordem} className="space-y-2">
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {texto.conteudo}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoriaPreview;
