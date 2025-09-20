import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logotipo.png";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const links = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre nós", href: "/Sobre" },
    { name: "Nossa Loja", href: "/loja" },
    { name: "Guias por Idade", href: "#guias" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
    { name: "Privacidade", href: "/politica-de-privacidade" },
    { name: "Termos de Uso", href: "/termos"}
    
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Brincar Educando" className="h-16 md:h-20 lg:h-40 w-auto max-h-[160px] rounded-md" />
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary transition"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Botões extras */}
        <div className="flex items-center gap-2">
          {/*<Button variant="hero" size="sm" className="hidden sm:flex">
            Ver Brinquedos
          </Button>*/}

          {/* Menu mobile toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t px-4 pb-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block py-2 text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
