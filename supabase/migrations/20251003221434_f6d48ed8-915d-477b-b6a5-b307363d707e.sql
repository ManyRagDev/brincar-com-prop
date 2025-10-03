-- ====================================
-- FASE 1: FUNDAÇÃO - ESTRUTURA COMPLETA
-- ====================================

-- 1. CRIAR ENUM DE ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. TABELA DE ROLES DE USUÁRIOS
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 3. TABELA DE USUÁRIOS (PERFIL DO RESPONSÁVEL)
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. TABELA DE CRIANÇAS
CREATE TABLE public.criancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  apelido TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. TABELA DE HISTÓRIAS (BRINCONTOS)
CREATE TABLE public.historias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  capa_url TEXT,
  faixa_etaria_min INTEGER NOT NULL DEFAULT 0,
  faixa_etaria_max INTEGER NOT NULL DEFAULT 12,
  duracao_minutos INTEGER,
  publicado BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. TABELA DE TEXTOS DAS HISTÓRIAS (BLOCOS ORDENADOS)
CREATE TABLE public.historias_textos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historia_id UUID REFERENCES public.historias(id) ON DELETE CASCADE NOT NULL,
  ordem INTEGER NOT NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(historia_id, ordem)
);

-- 7. TABELA DE ÁUDIOS DAS HISTÓRIAS
CREATE TABLE public.historias_audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historia_id UUID REFERENCES public.historias(id) ON DELETE CASCADE NOT NULL,
  audio_url TEXT NOT NULL,
  duracao_segundos INTEGER,
  narrador TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. TABELA DE HISTÓRICO (PROGRESSO E FAVORITOS)
CREATE TABLE public.historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  crianca_id UUID REFERENCES public.criancas(id) ON DELETE CASCADE,
  historia_id UUID REFERENCES public.historias(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('leitura', 'audio', 'favorito')),
  progresso_segundos INTEGER DEFAULT 0,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ====================================
-- FUNCTION DE VERIFICAÇÃO DE ROLE (SECURITY DEFINER)
-- ====================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ====================================
-- TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- ====================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.usuarios (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email
  );
  
  -- Atribuir role 'user' por padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- ENABLE ROW LEVEL SECURITY
-- ====================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historias_textos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historias_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico ENABLE ROW LEVEL SECURITY;

-- ====================================
-- RLS POLICIES - USER_ROLES
-- ====================================
CREATE POLICY "Admins podem ver todos os roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem ver seu próprio role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- ====================================
-- RLS POLICIES - USUARIOS
-- ====================================
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.usuarios FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.usuarios FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- RLS POLICIES - CRIANCAS
-- ====================================
CREATE POLICY "Usuários podem ver suas próprias crianças"
  ON public.criancas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar suas próprias crianças"
  ON public.criancas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias crianças"
  ON public.criancas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar suas próprias crianças"
  ON public.criancas FOR DELETE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Admins podem ver todas as crianças"
  ON public.criancas FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- RLS POLICIES - HISTORIAS
-- ====================================
CREATE POLICY "Todos podem ver histórias publicadas"
  ON public.historias FOR SELECT
  USING (publicado = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem criar histórias"
  ON public.historias FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar histórias"
  ON public.historias FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar histórias"
  ON public.historias FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- RLS POLICIES - HISTORIAS_TEXTOS
-- ====================================
CREATE POLICY "Todos podem ver textos de histórias publicadas"
  ON public.historias_textos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.historias
      WHERE historias.id = historia_id
        AND (historias.publicado = true OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins podem criar textos"
  ON public.historias_textos FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar textos"
  ON public.historias_textos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar textos"
  ON public.historias_textos FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- RLS POLICIES - HISTORIAS_AUDIOS
-- ====================================
CREATE POLICY "Todos podem ver áudios de histórias publicadas"
  ON public.historias_audios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.historias
      WHERE historias.id = historia_id
        AND (historias.publicado = true OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins podem criar áudios"
  ON public.historias_audios FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar áudios"
  ON public.historias_audios FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar áudios"
  ON public.historias_audios FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- RLS POLICIES - HISTORICO
-- ====================================
CREATE POLICY "Usuários podem ver seu próprio histórico"
  ON public.historico FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar seu próprio histórico"
  ON public.historico FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seu próprio histórico"
  ON public.historico FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seu próprio histórico"
  ON public.historico FOR DELETE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Admins podem ver todo o histórico"
  ON public.historico FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ====================================
-- STORAGE BUCKETS (PRIVADOS)
-- ====================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('historias-capas', 'historias-capas', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('historias-audio', 'historias-audio', false, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'])
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- STORAGE POLICIES - HISTORIAS-CAPAS
-- ====================================
CREATE POLICY "Admins podem fazer upload de capas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'historias-capas' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins podem atualizar capas"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'historias-capas' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins podem deletar capas"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'historias-capas' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Usuários autenticados podem ver capas"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'historias-capas'
    AND auth.role() = 'authenticated'
  );

-- ====================================
-- STORAGE POLICIES - HISTORIAS-AUDIO
-- ====================================
CREATE POLICY "Admins podem fazer upload de áudios"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'historias-audio' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins podem atualizar áudios"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'historias-audio' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins podem deletar áudios"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'historias-audio' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Usuários autenticados podem ver áudios"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'historias-audio'
    AND auth.role() = 'authenticated'
  );

-- ====================================
-- TRIGGERS DE UPDATED_AT
-- ====================================
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_criancas_updated_at
  BEFORE UPDATE ON public.criancas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_historias_updated_at
  BEFORE UPDATE ON public.historias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_historico_updated_at
  BEFORE UPDATE ON public.historico
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();