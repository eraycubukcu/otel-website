import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Maximize, ArrowRight, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roomService, type Room } from "@/services/roomService";

const Rooms = () => {
  const [activeCategory, setActiveCategory] = useState("hepsi");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    { id: "hepsi", label: "Tüm Odalar" },
    { id: "standart", label: "Standart Odalar" },
    { id: "deluxe", label: "Deluxe Odalar" },
    { id: "suite", label: "Suitler" },
    { id: "aile", label: "Aile Odaları" },
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

  const handleBookingClick = (roomId: string) => {
    // mongoDb id string old. icin
    if (user) {
      navigate(`/reservation/${roomId}`);
    } else {
      navigate("/auth/login", {
        state: { returnUrl: `/reservation/${roomId}` },
      });
    }
  };

  const filteredRooms =
    activeCategory === "hepsi"
      ? rooms
      : rooms.filter((room) => room.category === activeCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-slate-900 mx-auto mb-4" />
          <p className="text-slate-500">Odalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Konaklama Seçenekleri
          </h1>
          <p className="text-slate-500 text-md max-w-2xl mx-auto">
            Sizin için en uygun odayı seçin ve unutulmaz bir tatilin kapılarını
            aralayın.
          </p>
        </div>

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

        <div className="grid grild-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <Card
              key={room._id}
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

                <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div
                    className="flex items-center gap-2"
                    title="Kişi Kapasitesi"
                  >
                    <Users size={18} className="text-blue-600" />
                    <span>{room.capacity}</span>
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
                <Button
                  className="w-full bg-slate-900 hover:bg-blue-600 ..."
                  onClick={() => handleBookingClick(room._id)}
                >
                  Detayları İncele
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
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
