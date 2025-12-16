import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, CalendarDays } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Anasayfa", path: "/" },
    { name: "Odalarımız", path: "/rooms" },
    { name: "Hakkımızda", path: "/about" },
    { name: "İletişim", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        <div className="flex-shrink-0">
          <Link to={"/"} className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 hover:scale-110 transition-transform" />
            <span className="text-xl tracking-tight hidden sm:block">MoonRose</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  {/* --- DÜZELTME BURADA --- */}
                  {/* Link dışarıda DEĞİL, içeride olmalı ve asChild kullanılmalı */}
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link to={link.path}>
                      {link.name}
                    </Link>
                  </NavigationMenuLink>
                  {/* --- DÜZELTME BİTTİ --- */}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilim</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/reservations")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Rezervasyonlarım</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
               <Button variant="ghost" asChild>
                 <Link to="/auth/login">Giriş Yap</Link>
               </Button>
               <Button className="bg-slate-900 text-white" asChild>
                 <Link to="/auth/register">Kayıt Ol</Link>
               </Button>
            </div>
          )}

          <button
            className="md:hidden text-slate-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-lg font-medium p-2 hover:bg-slate-100 rounded" onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/auth/login">Giriş Yap</Link>
                </Button>
                <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/auth/register">Kayıt Ol</Link>
                </Button>
              </div>
            )}
        </div>
      )}
    </header>
  );
};

export default Header;