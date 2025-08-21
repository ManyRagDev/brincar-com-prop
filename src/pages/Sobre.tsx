import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Texto */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Sobre Nós
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            O <strong>Brincar Educando</strong> nasceu do desejo de transformar a primeira infância em uma jornada mais leve, consciente e cheia de descobertas. Unimos ciência do desenvolvimento infantil com vivências reais para oferecer conteúdos úteis, afetuosos e baseados em evidências.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Além dos conteúdos, também selecionamos cuidadosamente <strong>produtos de alta qualidade</strong> que contribuem para o desenvolvimento infantil e para momentos de brincadeira com propósito. Cada recomendação é pensada para unir segurança, aprendizado e diversão.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Aqui, pais, mães e cuidadores encontram apoio, informação e inspiração para brincar com propósito — todos os dias.
          </p>

          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para o início
          </Button>
        </div>

        {/* Imagem */}
        <div className="md:w-1/2">
          <img
            src="/images/sobre_nos.png"
            alt="Crianças brincando com afeto"
            className="w-full rounded-xl shadow-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Sobre;
