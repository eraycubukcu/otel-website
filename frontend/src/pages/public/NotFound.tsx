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
      <h1 className="text-4xl font-medium text-slate-900 tracking-tighter drop-shadow-sm select-none">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-medium text-slate-800 mt-4 mb-3">
        Sayfa Bulunamadı
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <Button
          asChild
          className="bg-slate-900 text-white px-8 py-6 rounded-full"
        >
          <Link to="/">
            <Home className="mr-1 h-3 w-3" />
            Ana Sayfa
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="px-8 py-6 rounded-full border-slate-300"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Geri Gel
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
