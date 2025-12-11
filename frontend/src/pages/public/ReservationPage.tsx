import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, differenceInCalendarDays, addDays } from "date-fns"; // Tarih işlemleri
import { tr } from "date-fns/locale"; // Türkçe takvim için
import { Calendar as CalendarIcon, Check, ChevronLeft, Loader2 } from "lucide-react";

// Shadcn Bileşenleri
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Shadcn utility
import { reservationService } from "@/services/reservationService";
import { roomService, type Room } from "@/services/roomService";

const ReservationPage = () => {
  const { id } = useParams(); // URL'den ID al
  const navigate = useNavigate(); // Yönlendirme için

  // State'ler
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tarih State'i
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [guestNote, setGuestNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      try {
        const data = await roomService.getRoomById(id);
        setSelectedRoom(data as unknown as Room); 
      } catch (error) {
        console.error("Oda yüklenirken hata:", error);
        alert("Oda bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (selectedRoom && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      const validNights = dayCount > 0 ? dayCount : 0;

      setNights(validNights);
      setTotalPrice(validNights * selectedRoom.price);
    }
  }, [date, selectedRoom]);

  const handleCompleteReservation = async () => {
    if (!selectedRoom || !date.from || !date.to) {
      alert("Lütfen geçerli bir tarih aralığı seçin.");
      return;
    }

    try {
      setSubmitting(true);

      await reservationService.createReservation({
        room: selectedRoom._id,
        checkInDate: date.from,
        checkOutDate: date.to,
        totalPrice: totalPrice,
        guestNote: guestNote,
      });

      alert("Rezervasyonunuz başarıyla oluşturuldu!");
      navigate("/profile/reservations");

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Rezervasyon oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!selectedRoom) {
    return <div className="p-10 text-center">Oda bulunamadı.</div>;
  }

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Geri Dön Butonu */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)} // React Router geri gitme
          className="mb-6 pl-0 hover:bg-transparent hover:text-slate-900 text-slate-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Odalara Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL TARAF - ODA KARTI */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg sticky top-8 overflow-hidden pt-0">
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={selectedRoom.image || "https://via.placeholder.com/800x600"}
                  alt={selectedRoom.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  {selectedRoom.title}
                </CardTitle>
                <p className="text-slate-500 text-sm">
                   {selectedRoom.description?.substring(0, 100)}...
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Gecelik Fiyat</span>
                  <span className="font-semibold text-slate-900">
                    {selectedRoom.price.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Giriş Tarihi</span>
                    <span className="font-medium text-slate-800">
                      {date?.from
                        ? format(date.from, "dd MMM yyyy", { locale: tr })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Çıkış Tarihi</span>
                    <span className="font-medium text-slate-800">
                      {date?.to
                        ? format(date.to, "dd MMM yyyy", { locale: tr })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Konaklama</span>
                    <span className="font-medium text-slate-800">
                      {nights} Gece
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-900">
                    Toplam Tutar
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {totalPrice.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SAĞ TARAF - FORM */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. TARİH SEÇİMİ */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Tarih Seçimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label>Giriş ve Çıkış Tarihleri</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 border-slate-200",
                          !date.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "dd MMM yyyy", { locale: tr })}{" "}
                              - {format(date.to, "dd MMM yyyy", { locale: tr })}
                            </>
                          ) : (
                            format(date.from, "dd MMM yyyy", { locale: tr })
                          )
                        ) : (
                          <span>Tarih Seçiniz</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(range: any) => setDate(range)}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                        locale={tr}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-slate-400 mt-1">
                    *Müsaitlik durumuna göre seçim yapabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. MİSAFİR BİLGİLERİ FORM */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Misafir Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Adınız</Label>
                    <Input id="firstName" placeholder="Adınız" className="h-11 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyadınız</Label>
                    <Input id="lastName" placeholder="Soyadınız" className="h-11 border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input id="email" type="email" placeholder="ornek@email.com" className="h-11 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <Input id="phone" type="tel" placeholder="05XX XXX XX XX" className="h-11 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Özel İstekler (Opsiyonel)</Label>
                  <Input
                    id="notes"
                    placeholder="Geç giriş, ekstra yastık vb..."
                    className="h-11 border-slate-200"
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800"
                  onClick={handleCompleteReservation}
                  disabled={submitting || nights === 0}
                >
                  {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> İşleniyor...
                    </>
                  ) : (
                    `Rezervasyonu Tamamla (${totalPrice.toLocaleString("tr-TR")} ₺)`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReservationPage;
