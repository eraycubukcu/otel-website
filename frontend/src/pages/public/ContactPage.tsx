import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator"; 
import { MapPin, Phone, Mail, Train, Plane, Car, Landmark, Utensils, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="w-full bg-slate-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* --- SOL TARA: BİLGİLER (TEK KART) --- */}
          <Card className="border-none shadow-lg overflow-hidden py-0">
            <CardContent className="p-8 space-y-8">
              
              {/* 1. BÖLÜM: İletişim Bilgileri */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
                  İletişim Bilgileri
                </h3>
                <div className="space-y-4 pl-3">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                    <span>
                      Merkez Mahallesi, Cumhuriyet Caddesi No:123<br />
                      Fatih / İstanbul, Türkiye
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                    <a href="tel:+902121234567" className="hover:text-blue-800 transition-colors">+90 (212) 123 45 67</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                    <a href="mailto:info@hotel.com" className="hover:text-orange-800 transition-colors">info@hotel.com</a>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 2. BÖLÜM: Ulaşım */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                  Ulaşım
                </h3>
                <div className="space-y-4 pl-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Plane className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>İstanbul Havalimanı: <strong>45 km</strong> (Taksi ile ~40dk)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Train className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Metro İstasyonu: <strong>200m</strong> yürüme mesafesinde.</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Car className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Özel otopark ve vale hizmetimiz mevcuttur.</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 3. BÖLÜM: Yakındakiler */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <span className="w-1 h-6 bg-purple-600 rounded-full inline-block"></span>
                   Yakındakiler
                </h3>
                {/* Burayı hafif renklendirilmiş bir kutu içine aldım ki diğerlerinden ayrılsın */}
                <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Ayasofya: 500m</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Topkapı Sarayı: 700m</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Restaurantlar: 100m</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Kapalı Çarşı: 1.2km</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* --- SAĞ TARAF: FORM (TEK KART) --- */}
          {/* Sticky kaldırıldı, artık sol tarafla beraber kayacak */}
          <Card className="border-none shadow-lg h-full py-0">
            <CardContent className="p-8">
              <div className="mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Bize Yazın</h2>
                 <p className="text-sm text-slate-500 mt-1">
                   Rezervasyon talepleriniz veya görüşleriniz için formu doldurun.
                 </p>
              </div>

              <form className="space-y-4">
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" placeholder="Adınız ve Soyadınız" className="h-11" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <Input id="email" type="email" placeholder="ornek@email.com" className="h-11" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input id="subject" placeholder="Rezervasyon hakkında..." className="h-11" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Mesajınızı buraya yazın..." 
                    className="min-h-[180px] resize-none p-4"
                  />
                </div>

                <Button className="w-full text-md py-6 cursor-pointer bg-slate-900 hover:bg-slate-800 transition-all">
                   <Send className="w-4 h-4 mr-2" />
                   Mesajı Gönder
                </Button>

              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Contact;