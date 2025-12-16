import { useEffect, useState } from "react";
import { reservationService, type Reservation } from "@/services/reservationService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Loader2, 
  CreditCard, 
  BedDouble, 
  CalendarArrowDown, 
  CalendarArrowUp,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom"; // React Router kullanıyorsun

// Shadcn UI Bileşenleri
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"; // veya 'react-hot-toast'

const MyReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Verileri Çekme
  const fetchReservations = async () => {
    try {
      const data = await reservationService.getUserReservation();
      // Tarihe göre sırala (En yeni en üstte)
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReservations(sortedData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      toast.error("Rezervasyonlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 2. İptal Fonksiyonu
  const handleCancel = async (id: string) => {
    if (!window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;

    try {
      await reservationService.deleteReservation(id); 
      toast.success("Rezervasyon iptal edildi.");
      setReservations((prev) => prev.filter((res) => res._id !== id));
    } catch (error) {
      toast.error("İptal işlemi başarısız.");
    }
  };

  // Helper: Durum Stilleri
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": 
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 text-sm border-none shadow-none">Onaylandı</Badge>;
      case "pending": 
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 text-sm border-none shadow-none">Onay Bekliyor</Badge>;
      case "cancelled": 
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 text-sm border-none shadow-none">İptal Edildi</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: tr });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        <p className="text-slate-500 text-sm">Rezervasyonlarınız yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4">
      {/* Başlık Alanı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rezervasyonlarım</h2>
          <p className="text-slate-500 mt-1">Geçmiş ve yaklaşan tüm konaklama detaylarınız.</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-sm text-slate-400">Toplam Kayıt</p>
           <p className="text-2xl font-bold text-slate-900">{reservations.length}</p>
        </div>
      </div>

      {reservations.length === 0 ? (
        // BOŞ DURUM (Empty State)
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
             <CalendarDays className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Henüz bir rezervasyonunuz yok</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Hayalinizdeki tatil sadece bir tık uzakta. Odalarımızı inceleyip hemen yerinizi ayırtın.
          </p>
          <Button asChild className="mt-6 bg-slate-900 hover:bg-slate-800" size="lg">
            <Link to="/rooms">Odaları İncele</Link>
          </Button>
        </div>
      ) : (
        // DOLU LİSTE
        <div className="grid gap-6 ">
          {reservations.map((res) => (
            <Card key={res._id} className="overflow-hidden pt-0 pb-0 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-col md:flex-row">
                
                {/* SOL: Oda Görseli */}
                <div className="w-full md:w-64 h-56 md:h-auto relative">
                   <img 
                    src={res.room?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"} 
                    alt={res.room?.title || "Oda"} 
                    className="w-full h-full object-cover  transition-transform duration-500"
                   />
                   {/* Mobil için Durum Rozeti (Resim üstünde) */}
                   <div className="absolute top-3 right-3 md:hidden">
                      {getStatusBadge(res.status)}
                   </div>
                </div>

                {/* SAĞ: İçerik */}
                <div className="flex-1 p-6 flex flex-col">
                  
                  {/* Üst Kısım: Başlık ve Durum */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                         <h3 className="text-xl font-bold text-slate-900 transition-colors">
                            {res.room ? res.room.title : <span className="text-red-400">Silinmiş Oda Bilgisi</span>}
                         </h3>
                         <div className="flex items-center text-slate-500 text-sm mt-1 gap-4">
                           <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>Antalya</span>
                           </div>
                           <div className="flex items-center">
                              <BedDouble className="h-3.5 w-3.5 mr-1" />
                              <span>2 Yetişkin</span>
                           </div>
                         </div>
                    </div>
                    {/* Desktop Durum Rozeti */}
                    <div className="hidden md:block">
                        {getStatusBadge(res.status)}
                    </div>
                  </div>

                  <Separator className="mb-4" />
                    
                  {/* Orta Kısım: Tarih Kutucukları */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                          <div className="bg-white p-2 rounded-md shadow-sm text-blue-600">
                              <CalendarArrowDown className="h-5 w-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Giriş Tarihi</p>
                              <p className="text-sm font-semibold text-slate-900">{formatDate(res.checkInDate)}</p>
                          </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                          <div className="bg-white p-2 rounded-md shadow-sm text-orange-600">
                              <CalendarArrowUp className="h-5 w-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Çıkış Tarihi</p>
                              <p className="text-sm font-semibold text-slate-900">{formatDate(res.checkOutDate)}</p>
                          </div>
                      </div>
                  </div>

                  {/* Alt Kısım: Fiyat ve Aksiyon */}
                  <div className="mt-auto flex items-center justify-between pt-2">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">TOPLAM TUTAR</span>
                        <div className="flex items-center gap-2 text-slate-900">
                           <CreditCard className="h-5 w-5 text-slate-400" />
                           <span className="text-2xl font-bold">{res.totalPrice.toLocaleString("tr-TR")} ₺</span>
                        </div>
                     </div>
                     
                     {res.status === "pending" && (
                         <Button 
                           variant="outline" 
                           className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                           onClick={() => handleCancel(res._id)}
                         >
                            <XCircle className="h-4 w-4 mr-2" />
                            İptal Et
                         </Button>
                     )}
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;