import { Heart, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Brincar Educando" className="h-12 w-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Brincar Educando
                </h3>
                <p className="text-sm text-muted-foreground">Cuidar brincando</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Um portal de conteúdo dedicado a pais, mães e cuidadores que buscam informação de qualidade
              sobre brinquedos educativos e desenvolvimento infantil.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Feito com carinho para famílias brasileiras
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links úteis</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sobre"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-afiliados"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Política de Afiliados
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-privacidade"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato e redes sociais */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Conecte-se</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/brincareducando__"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Instagram className="h-5 w-5" />
                @brincareducando
              </a>
              <a
                href="mailto:contato@brincareducando.com.br"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Mail className="h-5 w-5" />
                Envie um email
              </a>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Brincar Educando. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              <span className="text-primary">brincareducando.com.br</span> • Informação consciente para famílias
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
