import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Upload, Trash2, Play, Pause } from "lucide-react";

type Audio = {
  id: string;
  audio_url: string;
  duracao_segundos: number | null;
  narrador: string | null;
};

const HistoriaAudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth(true, true);
  const { toast } = useToast();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [narrador, setNarrador] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && id) {
      fetchAudios();
    }
  }, [authLoading, id]);

  const fetchAudios = async () => {
    try {
      const { data, error } = await supabase
        .from("historias_audios")
        .select("*")
        .eq("historia_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAudios(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar áudios",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("historias-audio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("historias-audio").getPublicUrl(filePath);

      // Criar áudio no banco
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = async () => {
        const { error: insertError } = await supabase.from("historias_audios").insert({
          historia_id: id,
          audio_url: data.publicUrl,
          duracao_segundos: Math.round(audio.duration),
          narrador: narrador || null,
        });

        if (insertError) throw insertError;

        toast({
          title: "Áudio enviado!",
          description: "O arquivo foi carregado com sucesso.",
        });

        setNarrador("");
        fetchAudios();
      };
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

  const handleDelete = async (audioId: string, audioUrl: string) => {
    try {
      const { error } = await supabase.from("historias_audios").delete().eq("id", audioId);

      if (error) throw error;

      // Deletar arquivo do storage
      const filePath = audioUrl.split("/").slice(-2).join("/");
      await supabase.storage.from("historias-audio").remove([filePath]);

      toast({
        title: "Áudio excluído",
        description: "O arquivo foi removido com sucesso.",
      });

      fetchAudios();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message,
      });
    }
  };

  const togglePlay = (audioId: string) => {
    if (playingId === audioId) {
      setPlayingId(null);
    } else {
      setPlayingId(audioId);
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
          <CardTitle>Gerenciar Áudios da História</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="narrador">Nome do Narrador (opcional)</Label>
              <Input
                id="narrador"
                value={narrador}
                onChange={(e) => setNarrador(e.target.value)}
                placeholder="Ex: Maria Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio">Upload de Áudio *</Label>
              <div className="flex gap-2">
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
              </div>
              <p className="text-sm text-muted-foreground">
                Formatos aceitos: MP3, WAV, OGG. Máximo: 50MB
              </p>
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Áudios Cadastrados</h3>
            {audios.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum áudio cadastrado ainda.
              </p>
            ) : (
              audios.map((audio) => (
                <Card key={audio.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => togglePlay(audio.id)}
                      >
                        {playingId === audio.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            {audio.narrador && (
                              <p className="font-medium">{audio.narrador}</p>
                            )}
                            {audio.duracao_segundos && (
                              <p className="text-sm text-muted-foreground">
                                Duração: {Math.floor(audio.duracao_segundos / 60)}:
                                {(audio.duracao_segundos % 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(audio.id, audio.audio_url)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        {playingId === audio.id && (
                          <audio
                            src={audio.audio_url}
                            autoPlay
                            controls
                            className="w-full mt-2"
                            onEnded={() => setPlayingId(null)}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriaAudio;
