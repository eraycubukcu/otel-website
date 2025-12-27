import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Maximize2, ArrowRight, Loader2, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roomService, type Room } from "@/services/roomService";
import { cn } from "@/lib/utils";

const Rooms = () => {
  const [activeCategory, setActiveCategory] = useState("hepsi");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    { id: "hepsi", label: "Tüm Odalar" },
    { id: "standart", label: "Standart" },
    { id: "deluxe", label: "Deluxe" },
    { id: "suite", label: "Suitler" },
    { id: "aile", label: "Aile" },
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await roomService.getAllRooms();
        setRooms(rooms);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBookingClick = (roomSlug: string) => {
    if (user) {
      navigate(`/reservation/${roomSlug}`);
    } else {
      navigate("/auth/login", {
        state: { returnUrl: `/reservation/${roomSlug}` },
      });
    }
  };

  const filteredRooms =
    activeCategory === "hepsi"
      ? rooms
      : rooms.filter((room) => room.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900 mb-4" />
        <p className="text-slate-400 font-medium tracking-wide animate-pulse text-sm">Odalar hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen py-8 md:py-10">
      <div className="container mx-auto px-6 md:px-10">
        
        <div className="flex flex-col items-center text-center mb-14 space-y-3">
          <Badge variant="outline" className="px-3 py-1 border-slate-200 text-slate-500 uppercase tracking-widest text-xs font-bold rounded-full">
            Konaklama
          </Badge>
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            Odalar & Suitler
          </h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto font-light leading-relaxed">
            Her detayı incelikle düşünülmüş, konforlu yaşam alanları.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          <div className="inline-flex p-1 bg-slate-100/80 rounded-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out",
                  activeCategory === cat.id
                    ? "bg-white text-slate-900 shadow-sm transform scale-105"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-500 ease-out"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-md shadow-sm">
                   <div className="flex flex-col items-end leading-none">
                      <span className="text-base font-bold text-slate-900">{room.price} ₺</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase">/ Gece</span>
                   </div>
                </div>

                <span className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-medium border border-white/20">
                  {categories.find((c) => c.id === room.category)?.label}
                </span>
              </div>

              <div className="flex flex-col flex-grow p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {room.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {room.description}
                  </p>
                </div>

                <div className="flex items-center gap-5 mb-6 text-slate-400">
                   <div className="flex items-center gap-2" title="Kapasite">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium text-slate-600">{room.capacity} Kişi</span>
                   </div>
                   <div className="flex items-center gap-2" title="Boyut">
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-sm font-medium text-slate-600">{room.size}</span>
                   </div>
                   <div className="flex items-center gap-2" title="Wifi">
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm font-medium text-slate-600">Wifi</span>
                   </div>
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-sm rounded-xl border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 group/btn"
                    onClick={() => handleBookingClick(room.slug)}
                  >
                    <span>Detaylar ve Rezervasyon</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 mb-4">
                <BedDouble className="w-7 h-7 text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">Bu kategoride oda bulunamadı.</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default Rooms;