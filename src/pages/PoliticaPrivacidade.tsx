// src/pages/PoliticaPrivacidade.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SITE_NAME = "Brincar Educando";
const CONTACT_EMAIL = "contato@brincareducando.com.br"; // ajuste se for outro

export default function PoliticaPrivacidade() {
  const navigate = useNavigate();
  const lastUpdated = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date());

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última atualização: {lastUpdated}
        </p>

        <article className="prose prose-neutral dark:prose-invert">
          <p className="lead">
            No <strong>{SITE_NAME}</strong>, respeitamos a sua privacidade. Esta Política descreve
            como coletamos, usamos e protegemos dados pessoais em nosso site.
          </p>

          <h2 id="informacoes">1. Informações que coletamos</h2>
          <ul>
            <li>
              <strong>Fornecidas por você:</strong> nome, e-mail e mensagens (ex.: newsletter, formulários).
            </li>
            <li>
              <strong>De navegação:</strong> IP, páginas visitadas, dispositivo/navegador e métricas de uso
              (via ferramentas de análise).
            </li>
            <li>
              <strong>Cookies e similares:</strong> para lembrar preferências e melhorar a experiência.
            </li>
          </ul>

          <h2 id="uso">2. Como usamos seus dados</h2>
          <ul>
            <li>Entregar conteúdo, funcionalidades e melhorias do site.</li>
            <li>Enviar e-mails (se você consentir) com novidades e conteúdos úteis.</li>
            <li>Personalizar recomendações de produtos e artigos.</li>
            <li>Atender solicitações e suporte enviados por formulários.</li>
          </ul>

          <h2 id="compartilhamento">3. Compartilhamento</h2>
          <p>
            Não vendemos nem alugamos seus dados. Podemos compartilhar com{" "}
            <em>fornecedores de serviços</em> (hospedagem, e-mail, analytics) que atuam em nosso nome e
            seguem esta Política; e com autoridades, quando exigido por lei.
          </p>

          <h2 id="cookies">4. Cookies</h2>
          <p>
            Usamos cookies para lembrar preferências e entender como o site é usado. Você pode desativá-los
            no navegador; algumas funções podem ficar limitadas.
          </p>

          <h2 id="seguranca">5. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger suas informações. Ainda assim,
            nenhum sistema é 100% seguro.
          </p>

          <h2 id="direitos">6. Seus direitos (LGPD)</h2>
          <p>
            Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados, além de revogar
            consentimentos e obter informações sobre o uso de dados.
          </p>

          <h2 id="infantis">7. Conteúdos e público</h2>
          <p>
            Nosso conteúdo é direcionado a pais, mães e cuidadores. Não coletamos conscientemente dados
            pessoais de crianças. Se acreditar que coletamos dados de uma criança, entre em contato para
            remoção.
          </p>

          <h2 id="links">8. Links externos</h2>
          <p>
            Podemos conter links para sites de terceiros. Não somos responsáveis pelas práticas de privacidade
            desses sites. Recomendamos ler as políticas de cada serviço visitado.
          </p>

          <h2 id="alteracoes">9. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta página periodicamente. Manteremos a versão mais recente publicada aqui.
          </p>

          <h2 id="contato">10. Contato e DPO</h2>
          <p>
            Dúvidas ou solicitações sobre privacidade e LGPD:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p className="text-xs">
            Aviso legal: este material é informativo e não substitui aconselhamento jurídico.
          </p>
        </article>

        <div className="mt-10">
          <Button onClick={() => navigate(-1)} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    </section>
  );
}
