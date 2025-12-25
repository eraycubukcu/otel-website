import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link için import
import { settingsService } from "@/services/settingsServices";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const Footer = () => {
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Footer ayarları yüklenemedi:", error);
      }
    };

    fetchSettings();
  }, []);

  const formatUrl = (url: string) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  return (
    <footer className="w-full py-8 bg-white border-t border-gray-100 mt-auto ">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-6">
        
        <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
            Anasayfa
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/rooms" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
            Odalar & Suitler
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
            Hakkımızda
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
            İletişim
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link>
          {/* <Link to="/reservation" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Rezervasyon Yap
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link> */}
          <Link to="/reservation" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
            Rezervasyon Yap
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="w-12 h-px bg-gray-200"></div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-black transition-colors">
              <Mail className="w-4 h-4" />
              {settings.email}
            </a>
          )}

          {settings.email && settings.phone && (
            <span className="hidden sm:block text-gray-300">|</span>
          )}

          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-black transition-colors">
              <Phone className="w-4 h-4" />
              {settings.phone}
            </a>
          )}
        </div>

        {(settings.instagram || settings.facebook) && (
          <div className="flex items-center gap-5">
            {settings.instagram && (
              <a 
                href={formatUrl(settings.instagram)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110 duration-200"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            )}
            
            {settings.facebook && (
              <a 
                href={formatUrl(settings.facebook)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-700 transition-colors transform hover:scale-110 duration-200"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
            )}
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-gray-400 mb-1">
            &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Designed by 
            <span className="font-bold text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
              Eray
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;