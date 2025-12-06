import { useState } from "react"; // 1. useState eklendi
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Hamburger ve Kapatma ikonları

const Header = () => {
  // 2. Menünün açık/kapalı durumunu tutan state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex-shrink-0">
          <Link to={"/"} className="flex items-center gap-2">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8 hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Otel</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink href={link.path} className={navigationMenuTriggerStyle()}>
                      {link.name}
                    </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            className="rounded-full px-4 md:px-6 shadow-md hover:shadow-lg transition-all text-sm hidden sm:flex"
            asChild
          >
            <Link to={"/reservation"}>Reservation</Link>
          </Button>
          <button
            className="md:hidden text-slate-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 p-2 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <Button
              variant={"outline"}
              className="w-full rounded-lg"
              asChild
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link to={"/reservation"}>Reservation</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;