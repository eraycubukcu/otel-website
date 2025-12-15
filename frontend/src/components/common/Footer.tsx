const Footer = () => {
  return (
    <footer className="w-full py-4 bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
          
          <a href="mailto:bilgi@gmail.com" className="hover:text-black transition-colors">
            bilgi@gmail.com
          </a>

          <span className="hidden sm:block text-gray-300">|</span>

          <a href="tel:02126160000" className="hover:text-black transition-colors">
            0212 616 00 00
          </a>

          <span className="hidden sm:block text-gray-300">|</span>

          <a href="/reservation" className="hover:text-blue-600 transition-colors">
            Reservasyon Yap
          </a>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">
            &copy; 2025 MoonRose Hotel.
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