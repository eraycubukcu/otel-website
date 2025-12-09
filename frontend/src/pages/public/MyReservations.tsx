import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, CreditCard, Clock } from "lucide-react";

const MyReservations = () => {
  // Mock Veriler
  const reservations = [
    {
      id: 1,
      hotelName: "Otel Adı",
      room: "Deluxe Deniz Manzaralı",
      checkIn: "12 Ekim 2025",
      checkOut: "15 Ekim 2025",
      price: "12.000 ₺",
      status: "active", // active, completed, cancelled
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&w=800&q=80"
    },
    {
      id: 2,
      hotelName: "Otel Adı",
      room: "Standart Oda",
      checkIn: "01 Eylül 2024",
      checkOut: "05 Eylül 2024",
      price: "8.500 ₺",
      status: "completed",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=800&q=80"
    },
    {
      id: 3,
      hotelName: "Otel Adı",
      room: "King Suite",
      checkIn: "20 Temmuz 2024",
      checkOut: "22 Temmuz 2024",
      price: "15.000 ₺",
      status: "cancelled",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&w=800&q=80"
    },
  ];

  // Rezervasyon Kartı Bileşeni (Tekrar kullanmak için)
  const ReservationCard = ({ data }: { data: any }) => (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow mb-6 flex flex-col md:flex-row">
      {/* Resim Alanı */}
      <div className="w-full md:w-1/3 h-48 md:h-auto relative">
        <img src={data.image} alt={data.room} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
           <Badge className={`
             ${data.status === 'active' ? 'bg-green-600' : 
               data.status === 'completed' ? 'bg-slate-500' : 'bg-red-600'}
           `}>
             {data.status === 'active' ? 'Onaylandı' : 
              data.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
           </Badge>
        </div>
      </div>

      {/* Bilgi Alanı */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        <div>
           <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{data.room}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                   <MapPin size={14} /> Çanakkale, Türkiye
                </p>
              </div>
              <div className="text-right">
                 <p className="text-lg font-bold text-slate-900">{data.price}</p>
                 <p className="text-xs text-slate-400">Toplam Tutar</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-400 mb-1">Giriş Tarihi</p>
                 <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    <CalendarDays size={16} className="text-blue-600" /> {data.checkIn}
                 </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-400 mb-1">Çıkış Tarihi</p>
                 <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    <Clock size={16} className="text-orange-600" /> {data.checkOut}
                 </p>
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
           {data.status === 'active' && (
             <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                Rezervasyonu İptal Et
             </Button>
           )}
           <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              Detayları Gör
           </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Rezervasyonlarım</h1>
        <p className="text-slate-500 mt-2">Geçmiş ve gelecek konaklama detaylarınız.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Aktif</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Geçmiş</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">İptal Edilen</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {reservations.filter(r => r.status === 'active').map(res => (
            <ReservationCard key={res.id} data={res} />
          ))}
          {reservations.filter(r => r.status === 'active').length === 0 && (
            <div className="text-center py-12 text-slate-400">Aktif rezervasyonunuz bulunmamaktadır.</div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {reservations.filter(r => r.status === 'completed').map(res => (
            <ReservationCard key={res.id} data={res} />
          ))}
        </TabsContent>

        <TabsContent value="cancelled">
          {reservations.filter(r => r.status === 'cancelled').map(res => (
            <ReservationCard key={res.id} data={res} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReservations;