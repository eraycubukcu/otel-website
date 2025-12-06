import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, differenceInCalendarDays, addDays } from "date-fns"; // Tarih işlemleri
import { tr } from "date-fns/locale"; // Türkçe takvim için
import { Calendar as CalendarIcon, Check, ChevronLeft } from "lucide-react";

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

const ReservationPage = () => {
  const { id } = useParams(); // URL'den oda ID'sini al (örn: /rezervasyon/1)
  const navigate = useNavigate();

  const roomsData = [
    {
      id: 1,
      title: "Standart Çift Kişilik Oda",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=800&q=80",
      price: 2500, // Hesaplama kolaylığı için number yaptım
    },
    {
      id: 2,
      title: "Deluxe Deniz Manzaralı",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&w=800&q=80",
      price: 4000,
    },
    {
      id: 3,
      title: "King Suite",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&w=800&q=80",
      price: 7500,
    },
  ];

  const selectedRoom = roomsData.find((r) => r.id === Number(id));

  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    if (selectedRoom && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      const validNights = dayCount > 0 ? dayCount : 1;

      setNights(validNights);
      setTotalPrice(validNights * selectedRoom.price);
    }
  }, [date, selectedRoom]);

  if (!selectedRoom) {
    return <div className="p-10 text-center">Oda bulunamadı.</div>;
  }

  const handleCompleteReservation = () => {
    alert(
      `Rezervasyon Alındı!\nToplam Tutar: ${totalPrice} TL\nTarih: ${format(
        date.from,
        "dd/MM/yyyy"
      )} - ${date.to ? format(date.to, "dd/MM/yyyy") : "?"}`
    );
    navigate("/");
  };

  return (
    <div className="bg-slate-50 py-8">
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
          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg sticky top-8 overflow-hidden pt-0">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  {selectedRoom.title}
                </CardTitle>
                <p className="text-slate-500 text-sm">Maksimum 2 Yetişkin</p>
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
                          !date && "text-muted-foreground"
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
                        onSelect={setDate}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
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
                    <Input
                      id="firstName"
                      placeholder="Adınızı giriniz"
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyadınız</Label>
                    <Input
                      id="lastName"
                      placeholder="Soyadınızı giriniz"
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Özel İstekler (Opsiyonel)</Label>
                  <Input
                    id="notes"
                    placeholder="Varsa notlarınızı buraya yazabilirsiniz..."
                    className="h-11 border-slate-200"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800"
                  onClick={handleCompleteReservation}
                >
                  Rezervasyonu Tamamla ({totalPrice.toLocaleString("tr-TR")} ₺)
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
