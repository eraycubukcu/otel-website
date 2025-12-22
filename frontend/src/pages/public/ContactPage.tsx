import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator"; 
import { 
  MapPin, 
  Phone, 
  Mail, 
  Train, 
  Plane, 
  Landmark, 
  Utensils, 
  Send, 
  Loader2 
} from "lucide-react";
import { contactService, type ContactForm } from "@/services/contactService";
import { settingsService } from "@/services/settingsServices";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate(); 
  
  const [contactInfo, setContactInfo] = useState({
    address: "Adres yükleniyor...",
    phone: "",
    email: ""
  });

  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        if (data) {
          setContactInfo({
            address: data.address || "Adres bilgisi girilmemiş.",
            phone: data.phone || "",
            email: data.email || ""
          });
        }
      } catch (error) {
        console.error("İletişim bilgileri çekilemedi:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendMessage(formData);
      toast.success("Mesajınız başarıyla iletildi! Anasayfaya yönlendiriliyorsunuz...");
      
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error(error);
      toast.error("Mesaj gönderilirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <Card className="border-none shadow-lg overflow-hidden py-0">
            <CardContent className="p-8 space-y-8">
              
              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
                  İletişim Bilgileri
                </h3>
                <div className="space-y-4 pl-3">
                  
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                    <span className="whitespace-pre-line">
                      {contactInfo.address}
                    </span>
                  </div>

                  {contactInfo.phone && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-blue-800 transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}

                  {contactInfo.email && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-orange-800 transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                  Ulaşım
                </h3>
                <div className="space-y-4 pl-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Train className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Tramvay : <strong>250 m</strong> (1dk. Yürüme Mesafesi)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Samsun Şehir Merkezi: <strong>12 km</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Plane className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Samsun Çarşamba Havalimanı: <strong>37 km</strong></span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-2">
                   <span className="w-1 h-6 bg-purple-600 rounded-full inline-block"></span>
                   Yakındakiler
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Atakum Sahili: 50m</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Amisos Tepesi: 5km</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Restaurantlar: 100m</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>City Mall AVM: 1.2km</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="border-none shadow-lg h-full py-0">
            <CardContent className="p-8">
              <div className="mb-6">
                 <h2 className="text-2xl font-medium text-slate-800">Bize Yazın</h2>
                 <p className="text-sm text-slate-500 mt-1">
                   Rezervasyon talepleriniz veya görüşleriniz için formu doldurun.
                 </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input 
                    id="name" 
                    placeholder="Adınız ve Soyadınız" 
                    className="h-11"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ornek@email.com" 
                    className="h-11"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input 
                    id="subject" 
                    placeholder="Rezervasyon hakkında..." 
                    className="h-11"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Mesajınızı buraya yazın..." 
                    className="min-h-[180px] resize-none p-4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full text-md py-6 cursor-pointer bg-slate-900 hover:bg-slate-800 transition-all"
                >
                    {loading ? (
                      <>
                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                         Gönderiliyor...
                      </>
                    ) : (
                      <>
                         <Send className="w-4 h-4 mr-2" />
                         Mesajı Gönder
                      </>
                    )}
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