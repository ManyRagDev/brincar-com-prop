import { Button } from "@/components/ui/button";
import logo from "@/assets/logotipo.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Brincar Educando" className="h-40 w-40 rounded-lg" />
          {/*<div>
            <h1 className="text-xl font-semibold text-foreground">
              Brincar Educando
            </h1>
            <p className="text-xs text-muted-foreground">Cuidar brincando</p>
          </div>*/}
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#inicio" className="text-foreground hover:text-primary transition-smooth">
            Início
          </a>
          <a href="#sobre" className="text-foreground hover:text-primary transition-smooth">
            Top Recomendações
          </a>
          <a href="#resenhas" className="text-foreground hover:text-primary transition-smooth">
            Guias por Idade
          </a>
          <a href="#contato" className="text-foreground hover:text-primary transition-smooth">
            Blog
          </a>
          <a href="#contato" className="text-foreground hover:text-primary transition-smooth">
            Sobre nós
          </a>
          <a href="#contato" className="text-foreground hover:text-primary transition-smooth">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" className="hidden sm:flex">
            Ver brinquedos
          </Button>
          
          {/* Menu mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;