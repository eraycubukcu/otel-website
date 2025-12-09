import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPinOff, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl">
          <MapPinOff size={40} className="text-red-500" />
        </div>
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter drop-shadow-sm select-none">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-4 mb-3">
        Sayfa Bulunamadı
      </h2>
      <p className="text-slate-500 text-lg max-w-md mx-auto mb-8 leading-relaxed">
        Aradığınız oda veya sayfa şu an müsait değil, taşınmış veya hiç var
        olmamış olabilir. Endişelenmeyin, resepsiyon (anasayfa) hemen aşağıda.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Ana Sayfaya Dön
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="px-8 py-6 rounded-full text-lg border-slate-300 hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Geri Gel
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
