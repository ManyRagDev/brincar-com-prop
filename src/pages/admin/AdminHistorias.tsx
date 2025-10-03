import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Historia = {
  id: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
  publicado: boolean;
  created_at: string;
};

const AdminHistorias = () => {
  const { loading: authLoading } = useAuth(true, true);
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      fetchHistorias();
    }
  }, [authLoading]);

  const fetchHistorias = async () => {
    try {
      const { data, error } = await supabase
        .from("historias")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistorias(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar histórias",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("historias")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "História excluída",
        description: "A história foi removida com sucesso.",
      });

      setHistorias(historias.filter((h) => h.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message,
      });
    }
  };

  const togglePublicado = async (id: string, publicado: boolean) => {
    try {
      const { error } = await supabase
        .from("historias")
        .update({ publicado: !publicado })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: publicado ? "História despublicada" : "História publicada",
        description: publicado
          ? "A história não está mais visível para usuários."
          : "A história agora está visível para usuários.",
      });

      fetchHistorias();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message,
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Gerenciar Histórias</h1>
          <p className="text-muted-foreground mt-2">
            Crie, edite e publique histórias do BrinContos
          </p>
        </div>
        <Button onClick={() => navigate("/admin/historias/nova")} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Nova História
        </Button>
      </div>

      {historias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma história cadastrada ainda</p>
            <Button onClick={() => navigate("/admin/historias/nova")}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira História
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {historias.map((historia) => (
            <Card key={historia.id}>
              <CardHeader>
                {historia.capa_url && (
                  <img
                    src={historia.capa_url}
                    alt={historia.titulo}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <CardTitle className="line-clamp-2">{historia.titulo}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {historia.descricao || "Sem descrição"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Faixa etária:</span>
                  <span className="font-medium">
                    {historia.faixa_etaria_min}-{historia.faixa_etaria_max} anos
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-medium ${
                      historia.publicado ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {historia.publicado ? "Publicada" : "Rascunho"}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/historias/preview/${historia.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/historias/editar/${historia.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/admin/historias/audio/${historia.id}`)}
                >
                  Upload Áudio
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={historia.publicado ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => togglePublicado(historia.id, historia.publicado)}
                  >
                    {historia.publicado ? "Despublicar" : "Publicar"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(historia.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A história e todos os seus textos e áudios serão
              permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminHistorias;
