import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, differenceInCalendarDays, eachDayOfInterval, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, Loader2, Info } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { reservationService } from "@/services/reservationService";
import { roomService, type Room } from "@/services/roomService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // Kullanıcı bilgisi için ekledim

const ReservationPage = () => {
  // 1. URL'deki parametreyi alıyoruz.
  // Router'da :slug veya :id ne yazıyorsa useParams onu yakalar.
  // Biz buraya gelen değerin artık bir "Slug" (isim) olduğunu biliyoruz.
  const params = useParams();
  const slug = params.slug || params.id; // Her ihtimale karşı ikisini de kontrol et

  const navigate = useNavigate();
  const { user } = useAuth(); // Kullanıcı bilgilerini otomatik doldurmak için

  // State'ler
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // DOLU GÜNLER STATE'İ
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  // Tarih State'i
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [guestNote, setGuestNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0); // Başlangıçta 0

  // 1. Verileri (Oda ve Takvim) Çek - MANTIK BURADA DÜZELTİLDİ
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);

      try {
        // A) Önce Slug (İsim) ile Odayı Bul
        // roomService dosyanıza 'getRoomBySlug' eklediğinizden emin olun!
        const roomData = await roomService.getRoomBySlug(slug);
        setSelectedRoom(roomData as unknown as Room);

        // B) Oda Bulunduysa, onun ID'sini kullanarak Takvimi (Dolu Günleri) Çek
        if (roomData && roomData._id) {
            try {
              const busyRanges = await reservationService.getUnavailableDates(roomData._id);
              const blockedDates: Date[] = [];
              
              if (Array.isArray(busyRanges)) {
                busyRanges.forEach((range: any) => {
                  const start = new Date(range.checkInDate);
                  const end = new Date(range.checkOutDate);

                  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const interval = eachDayOfInterval({ start, end });
                    blockedDates.push(...interval);
                  }
                });
              }
              setDisabledDates(blockedDates);
            } catch (calendarError) {
              console.warn("Takvim verisi çekilemedi:", calendarError);
            }
        }

      } catch (error) {
        console.error("Oda yüklenirken hata:", error);
        toast.error("Oda bilgileri alınamadı veya bulunamadı.");
        navigate("/rooms"); // Hata varsa listeye dön
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  // Fiyat Hesaplama
  useEffect(() => {
    if (selectedRoom && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      // Giriş ve çıkış aynı gün olamaz, en az 1 gece
      if (dayCount > 0) {
         setNights(dayCount);
         setTotalPrice(dayCount * selectedRoom.price);
      } else {
         setNights(0);
         setTotalPrice(0);
      }
    }
  }, [date, selectedRoom]);

  const handleCompleteReservation = async () => {
    if (!selectedRoom || !date.from || !date.to) {
      toast.warning("Lütfen geçerli bir tarih aralığı seçin.");
      return;
    }

    try {
      setSubmitting(true);

      await reservationService.createReservation({
        room: selectedRoom._id, // Backend ID bekler, onu gönderiyoruz
        checkInDate: date.from,
        checkOutDate: date.to,
        totalPrice: totalPrice,
        guestNote: guestNote,
      });

      toast.success("Rezervasyonunuz başarıyla oluşturuldu! İyi tatiller.");
      navigate("/profile/reservations");

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Rezervasyon oluşturulamadı. Seçilen tarihler dolu olabilir.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Resim URL düzeltici (Senin kodunda yoktu ama garanti olsun diye ekledim, tasarım bozmaz)
  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
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
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
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
                  src={getFullImageUrl(selectedRoom.image)}
                  alt={selectedRoom.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x600?text=Resim+Yok"; }}
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
                      {date?.from ? format(date.from, "dd MMM yyyy", { locale: tr }) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Çıkış Tarihi</span>
                    <span className="font-medium text-slate-800">
                      {date?.to ? format(date.to, "dd MMM yyyy", { locale: tr }) : "-"}
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

          <div className="lg:col-span-2 space-y-8">
            
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
                        defaultMonth={date?.from || new Date()}
                        selected={date}
                        onSelect={(range: any) => setDate(range)}
                        numberOfMonths={2}
                        locale={tr}
                        disabled={[
                          ...disabledDates, 
                          { before: startOfDay(new Date()) } 
                        ]}
                        modifiers={{
                            booked: disabledDates
                        }}
                        modifiersClassNames={{
                            booked: "bg-red-100 text-red-500 line-through opacity-100 font-medium hover:bg-red-100" 
                        }}
                      />
                      
                      <div className="p-3 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></div>
                             <span>Dolu</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm"></div>
                             <span>Geçmiş</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-slate-900 rounded-sm"></div>
                             <span>Seçili</span>
                          </div>
                      </div>

                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <Info className="w-4 h-4 text-slate-400" />
                      <p>Kırmızı ile işaretli günler doludur ve seçilemez.</p>
                  </div>

                </div>
              </CardContent>
            </Card>

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
                    {/* Otomatik doldurma eklendi */}
                    <Input id="firstName" defaultValue={user?.name || ""} placeholder="Adınız" className="h-11 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyadınız</Label>
                    <Input id="lastName" defaultValue={user?.surname || ""} placeholder="Soyadınız" className="h-11 border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} placeholder="ornek@email.com" className="h-11 border-slate-200" />
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
                  className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 cursor-pointer"
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