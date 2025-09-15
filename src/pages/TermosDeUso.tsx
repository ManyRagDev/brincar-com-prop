import * as React from "react";
import { useNavigate } from "react-router-dom";


const LAST_UPDATED = "14 de setembro de 2025"; // Atualize quando necessário

export default function TermosDeUso() {
    const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Termos de Uso</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Última atualização: {LAST_UPDATED}
          </p>
        </div>
      </header>
<div className="mx-auto max-w-3xl px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 transition"
        >
          ← Voltar
        </button>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-10 prose prose-zinc">
        <h2 id="aceitacao">1. Aceitação dos Termos</h2>
        <p>
          Bem-vindo(a) ao <strong>Brincar Educando</strong> (“nós”, “nosso”).
          Ao acessar ou utilizar nosso site e conteúdos, você declara que leu,
          compreendeu e concorda com estes Termos de Uso. Caso não concorde, não
          utilize a plataforma.
        </p>

        <h2 id="uso">2. Uso da Plataforma</h2>
        <p>
          O uso deve respeitar a legislação vigente e estes Termos. É proibido
          utilizar a plataforma para práticas ilegais, prejudiciais, difamatórias
          ou que violem direitos de terceiros. Podemos suspender ou encerrar o
          acesso em caso de descumprimento.
        </p>

        <h2 id="conteudo">3. Conteúdo e Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo (textos, imagens, ilustrações, materiais e marcas)
          pertence ao Brincar Educando ou a seus licenciadores, sendo protegido
          por direitos autorais e outras normas. É vedada a reprodução ou
          distribuição sem autorização expressa.
        </p>

        <h2 id="afiliados">4. Afiliados e Recomendações</h2>
        <p>
          Podemos indicar produtos de terceiros através de links de afiliados. Ao
          adquirir por esses links, poderemos receber uma comissão, sem custo
          adicional para você. Não nos responsabilizamos pelas condições
          comerciais oferecidas pelos fornecedores.
        </p>

        <h2 id="privacidade">5. Privacidade</h2>
        <p>
          O tratamento de dados pessoais ocorre conforme nossa{" "}
          <a href="/politica-de-privacidade" className="underline">
            Política de Privacidade
          </a>
          . Ao utilizar a plataforma, você declara estar ciente e de acordo com
          suas disposições.
        </p>

        <h2 id="isencoes">6. Isenções de Responsabilidade</h2>
        <p>
          Os conteúdos possuem caráter informativo e educacional, não substituindo
          aconselhamento profissional qualificado (ex.: pediatria, nutrição,
          psicologia). Não garantimos ausência de erros ou resultados específicos.
        </p>

        <h2 id="links">7. Links de Terceiros</h2>
        <p>
          O site pode conter links externos. Não temos controle sobre o conteúdo,
          políticas ou práticas desses sites, sendo o acesso de sua
          responsabilidade.
        </p>

        <h2 id="alteracoes">8. Alterações</h2>
        <p>
          Podemos atualizar estes Termos a qualquer momento, publicando a versão
          revisada nesta página, com a respectiva data de atualização. Recomendamos
          revisão periódica.
        </p>

        <h2 id="contato">9. Contato</h2>
        <p>
          Em caso de dúvidas, fale com a gente:{" "}
          <a href="mailto:contato@brincareducando.com.br" className="underline">
            contato@brincareducando.com.br
          </a>
        </p>
      </div>

      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-zinc-600">
          © {new Date().getFullYear()} Brincar Educando. Todos os direitos reservados.{" "}
          <a className="underline" href="/politica-de-privacidade">
            Política de Privacidade
          </a>
        </div>
      </footer>
    </main>
  );
}
