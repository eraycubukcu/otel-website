import { useState, useEffect } from "react";
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
    <footer className="w-full py-6 bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        
        {/* İletişim Bilgileri */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
          
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

          {(settings.phone || settings.email) && (
            <span className="hidden sm:block text-gray-300">|</span>
          )}

          <a href="/reservation" className="hover:text-blue-600 transition-colors">
            Rezervasyon Yap
          </a>
        </div>

        {/* Sosyal Medya */}
        {(settings.instagram || settings.facebook) && (
          <div className="flex items-center gap-4">
            {settings.instagram && (
              <a 
                href={formatUrl(settings.instagram)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-pink-600 transition-colors"
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
                className="text-gray-500 hover:text-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
            )}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400 mb-1">
            &copy; {new Date().getFullYear()} MoonRose Hotel.
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