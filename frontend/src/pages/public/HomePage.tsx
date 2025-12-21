import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { FileText, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsService } from "@/services/settingsServices";

// Backend'den gelen veri tipini tanımlıyoruz (Typescript için)
interface SlideData {
  imageUrl: string;
  title?: string;
}

const Home = () => {
  const [mapKey, setMapKey] = useState(0);
  
  // Slider verilerini tutacak state
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Varsayılan Resimler (Veritabanından veri gelmezse bunlar görünür)
  const defaultSlides: SlideData[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Lüks Konaklama",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Eşsiz Manzara",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Konforlu Odalar",
    },
  ];

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6817057651684!2d36.22903784437605!3d41.3676116225508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40887fa50c6c4409%3A0xafc00b5d8a3737f9!2sOTEL%20MOONROSE!5e1!3m2!1str!2str!4v1765828286499!5m2!1str!2str";

  const handleResetLocation = () => {
    setMapKey((prev) => prev + 1);
  };

  // Backend'den resimleri çekme işlemi
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        
        let fetchedSlides: SlideData[] = [];

        if (data) {
          // 1. İhtimal: Veri 'heroImages' adında bir dizi olarak geliyor
          if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
             // Gelen veri string mi yoksa obje mi kontrol et ve normalize et
             fetchedSlides = data.heroImages.map((item: any) => {
                if (typeof item === 'string') return { imageUrl: item, title: "MoonRose Otel" };
                return { imageUrl: item.imageUrl || item.url, title: item.title || "MoonRose Otel" };
             });
          }
          // 2. İhtimal: Belki tek bir 'coverImage' veya 'imageUrl' alanı vardır (Eski yapı)
          else if (data.imageUrl || data.coverImage) {
            fetchedSlides = [{ 
              imageUrl: data.imageUrl || data.coverImage, 
              title: "MoonRose Otel" 
            }];
          }
        }

        // Eğer geçerli resim bulduysak state'i güncelle, bulamadıysak varsayılanları koy
        if (fetchedSlides.length > 0) {
          setSlides(fetchedSlides);
        } else {
          setSlides(defaultSlides);
        }

      } catch (error) {
        console.error("Slider verisi çekilemedi, varsayılanlar kullanılıyor.", error);
        setSlides(defaultSlides);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const features = [
    {
      id: 1,
      title: "Kahvaltı Salonu",
      description:
        "Çanakkale Bölgesi’nin en taze ve organik ürünleriyle hazırlanan kahvaltımız, kahvaltı tabağı ile siz değerli misafirlerimize sunulmaktadır. Doğal lezzetler eşliğinde güne keyifli bir başlangıç yapabilir, yöresel tatların tadını çıkarabilirsiniz.",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&w=1920&q=80",
      reverse: false,
    },
    {
      id: 2,
      title: "Konforlu Odalar",
      description:
        "Günün yorgunluğunu atabileceğiniz, modern ve ferah dizayn edilmiş odalarımızda evinizin rahatlığını bulacaksınız. Ortopedik yataklar, ses yalıtımı ve özel iklimlendirme sistemleri ile kesintisiz bir uyku deneyimi sunuyoruz.",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=1920&q=80",
      reverse: true,
    },
  ];

  const documents = [
    {
      id: 1,
      title: "Turizm İşletme Belgesi",
      subTitle: "MoonRose Hotel - Basit Konaklama Turizm İşletme Belgesi",
    },
    {
      id: 2,
      title: "Yangın Güvenlik Raporu",
      subTitle: "MoonRose Hotel - Yapı Yangın Güvenlik Raporu",
    },
    {
      id: 3,
      title: "Yapı Kullanma İzin Belgesi",
      subTitle: "MoonRose Hotel - Yapı Kullanma İzin Belgesi",
    },
    {
      id: 4,
      title: "Hijyen ve Haşere Belgesi",
      subTitle: "MoonRose Hotel - Hijyen ve Haşere Mücadelesi Hizmet Sözleşmesi",
    },
  ];

  // Resim URL'ini düzelten yardımcı fonksiyon (Backend bazen tam URL vermez)
  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    // Eğer localhost'ta çalışıyorsan ve resimler 'uploads' klasöründeyse:
    // Backend portun neyse onu yaz (Örn: 5000)
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div>
      {/* --- SLIDER ALANI --- */}
      <div>
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {/* Loading sırasında veya veri yokken hata vermemesi için güvenli map */}
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] w-full overflow-hidden">
                  <img
                    src={getFullImageUrl(slide.imageUrl)}
                    alt={slide.title || "Slider Image"}
                    className="h-full w-full object-cover transition-all duration-500"
                    // Resim yüklenemezse (404 vb.) varsayılan resmi koy
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80";
                    }}
                  />
                  {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white drop-shadow-lg text-center px-4">
                      {slide.title || "MoonRose Otel"}
                    </h2>
                  </div> */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
        </Carousel>
      </div>

      {/* --- ÖZELLİKLER ALANI --- */}
      <div className="w-full bg-slate-50 py-10">
        <div className="container max-w-5xl mx-auto px-4 flex flex-col gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow py-0"
            >
              <CardContent className="p-0">
                <div
                  className={`flex flex-col ${
                    feature.reverse ? "md:flex-row-reverse" : "md:flex-row"
                  } h-full`}
                >
                  <div className="w-full md:w-1/2 h-48 md:h-auto">
                    <img
                      src={feature.image}
                      alt="feature-photo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    {feature.title && (
                      <h4 className="text-xl md:text-2xl font-medium mb-3 text-slate-800">
                        {feature.title}
                      </h4>
                    )}
                    <div className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- BELGELER ALANI --- */}
      <div className="w-full py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer py-0"
              >
                <CardContent className="flex flex-col items-center p-8 text-center h-full py-3">
                  <div className="mb-6">
                    <FileText size={48} className="text-red-600 stroke-[1.5]" />
                  </div>

                  <h5 className="font-medium text-slate-900 text-lg mb-3 group-hover:text-red-600 transition-colors">
                    {doc.title}
                  </h5>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {doc.subTitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* --- HARİTA ALANI --- */}
      <div className="w-full h-[400px] relative group bg-gray-200">
        <iframe
          key={mapKey}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
        ></iframe>
        <button
          onClick={handleResetLocation}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all cursor-pointer group/btn z-10"
        >
          <MapPin
            className="text-red-600 group-hover/btn:animate-bounce"
            size={20}
          />
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm text-slate-800">
              Otel Konumu
            </span>
            <span className="text-[10px] text-slate-500 hidden group-hover/btn:block">
              Merkeze Odakla
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;