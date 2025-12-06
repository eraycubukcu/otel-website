import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Eğer yüklü değilse: npx shadcn@latest add badge
import { Users, Wifi, Maximize, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
  // 1. STATE: Hangi filtrenin seçili olduğunu tutar (Varsayılan: 'hepsi')
  const [activeCategory, setActiveCategory] = useState("hepsi");

  const navigate = useNavigate();
  // 2. KATEGORİ LİSTESİ (Butonlar için)
  const categories = [
    { id: "hepsi", label: "Tüm Odalar" },
    { id: "standart", label: "Standart Odalar" },
    { id: "deluxe", label: "Deluxe Odalar" },
    { id: "suite", label: "Suitler" },
    { id: "aile", label: "Aile Odaları" },
  ];

  // 3. ODA VERİLERİ (Database simülasyonu)
  const roomsData = [
    {
      id: 1,
      category: "standart",
      title: "Standart Çift Kişilik Oda",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=800&q=80",
      price: "2.500 ₺",
      size: "25 m²",
      guests: "2 Yetişkin",
      description: "Ekonomik ve konforlu bir konaklama için ideal seçim.",
    },
    {
      id: 2,
      category: "deluxe",
      title: "Deluxe Deniz Manzaralı",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&w=800&q=80",
      price: "4.000 ₺",
      size: "35 m²",
      guests: "2 Yetişkin, 1 Çocuk",
      description: "Muhteşem deniz manzarası ve geniş balkon keyfi.",
    },
    {
      id: 3,
      category: "suite",
      title: "King Suite",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&w=800&q=80",
      price: "7.500 ₺",
      size: "60 m²",
      guests: "4 Yetişkin",
      description: "Lüksün sınırlarını zorlayan, jakuzili özel suit.",
    },
    {
      id: 4,
      category: "aile",
      title: "Geniş Aile Odası",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&w=800&q=80",
      price: "5.000 ₺",
      size: "45 m²",
      guests: "2 Yetişkin, 2 Çocuk",
      description: "Ailenizle rahatça konaklayabileceğiniz ferah alanlar.",
    },
    {
      id: 5,
      category: "standart",
      title: "Standart Tek Kişilik",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&w=800&q=80",
      price: "1.800 ₺",
      size: "20 m²",
      guests: "1 Yetişkin",
      description: "İş seyahatleri için kompakt ve modern tasarım.",
    },
    {
      id: 6,
      category: "suite",
      title: "Honeymoon Suite",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&w=800&q=80",
      price: "6.000 ₺",
      size: "50 m²",
      guests: "2 Yetişkin",
      description: "Balayı çiftlerine özel romantik detaylar ve ikramlar.",
    },
  ];

  // 4. FİLTRELEME MANTIĞI
  const filteredRooms =
    activeCategory === "hepsi"
      ? roomsData
      : roomsData.filter((room) => room.category === activeCategory);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Başlık kısmı */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Konaklama Seçenekleri
          </h1>
          <p className="text-slate-500 text-md max-w-2xl mx-auto">
            Sizin için en uygun odayı seçin ve unutulmaz bir tatilin kapılarını
            aralayın.
          </p>
        </div>

        {/* Filtreme Butonları */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className="rounded-full px-6"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Oda kartları */}
        <div className="grid grild-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col py-0"
            >
              <CardHeader className="p-0 relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transtion duration-700 group-hover:scale-110:"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">
                  {categories.find((c) => c.id === room.category)?.label}
                </Badge>
                <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white px-3 py-1 rounded-lg backdrop-blur-sm text-sm font-bold shadow-lg">
                  {room.price}{" "}
                  <span className="font-normal text-xs opacity-80">/ Gece</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 transition-colors">
                  {room.title}
                </h3>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {room.description}
                </p>

                {/* Özellik İkonları */}
                <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div
                    className="flex items-center gap-2"
                    title="Kişi Kapasitesi"
                  >
                    <Users size={18} className="text-blue-600" />
                    <span>{room.guests}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    title="Oda Büyüklüğü"
                  >
                    <Maximize size={18} className="text-blue-600" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2" title="Wifi">
                    <Wifi size={18} className="text-blue-600" />
                    <span>Free Wifi</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-slate-900 text-white transition-colors group-hover:shadow-lg"
                onClick={()=> {navigate(`/reservation/${room.id}`)}}>
                  Detayları İncele
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
