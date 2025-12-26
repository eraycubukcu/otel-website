import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { FileText, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsService, type Feature } from "@/services/settingsServices";

interface SlideData {
  imageUrl: string;
  title?: string;
}

const Home = () => {
  const [mapKey, setMapKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const [slides, setSlides] = useState<SlideData[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  // Varsayılan Slider
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

  // Sabit Belgeler
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

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d619.6817057651684!2d36.22903784437605!3d41.3676116225508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40887fa50c6c4409%3A0xafc00b5d8a3737f9!2sOTEL%20MOONROSE!5e1!3m2!1str!2str!4v1765828286499!5m2!1str!2str";

  const handleResetLocation = () => {
    setMapKey((prev) => prev + 1);
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        
        let fetchedSlides: SlideData[] = [];
        if (data) {
          if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
             fetchedSlides = data.heroImages.map((item: any) => {
                if (typeof item === 'string') return { imageUrl: item, title: "MoonRose Otel" };
                return { imageUrl: item.imageUrl || item.url, title: item.title || "MoonRose Otel" };
             });
          } else if (data.heroImage) {
            fetchedSlides = [{ imageUrl: data.heroImage, title: "MoonRose Otel" }];
          }

          if (data.features && Array.isArray(data.features)) {
             setFeatures(data.features);
          }
        }
        setSlides(fetchedSlides.length > 0 ? fetchedSlides : defaultSlides);
      } catch (error) {
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div>
      {/* --- SLIDER --- */}
      <div>
        <Carousel className="w-full" 
        // plugins={[Autoplay({ delay: 3000 })]}
        >
          <CarouselContent className="px-1">
            {slides.map((slide, index) => (
              <CarouselItem  key={index}>
                <div className="border-solid border-[1px] border-gray-200 relative h-[500px] w-full overflow-hidden rounded-xl">
                  <img
                    src={getFullImageUrl(slide.imageUrl)}
                    alt={slide.title || "Slider Image"}
                    className="h-full w-full object-cover transition-all duration-500"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80"; }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
        </Carousel>
      </div>

      {/* --- ÖZELLİKLER (FEATURES) --- */}
      {features.length > 0 && (
        <div className="w-full bg-slate-50 py-10">
          <div className="container max-w-5xl mx-auto px-4 flex flex-col gap-8">
            {features.map((feature, index) => {
              const isReverse = index % 2 !== 0;

              return (
                <Card
                  key={feature._id || index}
                  // BURASI DEĞİŞTİ: 
                  // 1. h-auto md:h-64 -> Mobilde otomatik, Masaüstünde SABİT yükseklik (256px)
                  // 2. w-full -> Genişliği konteyner kadar
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow py-0 h-auto md:h-64"
                >
                  <CardContent className="p-0 h-full">
                    <div
                      className={`flex flex-col ${
                        isReverse ? "md:flex-row-reverse" : "md:flex-row"
                      } h-full w-full`} // w-full önemli
                    >
                      {/* RESİM ALANI */}
                      {/* md:w-1/2 -> Genişlik kesinlikle %50 */}
                      {/* h-48 md:h-full -> Mobilde 48 birim, masaüstünde kartın tamamı */}
                      {/* relative ve shrink-0 -> Resim alanı asla sıkışmaz veya genişlemez */}
                      <div className="w-full md:w-1/2 h-48 md:h-full relative bg-slate-100 shrink-0">
                        <img
                          src={getFullImageUrl(feature.image)}
                          alt={feature.title}
                          // absolute inset-0 -> Resim kutuya hapsolur, kutuyu büyütmez
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/800x600?text=Resim+Yok";
                          }}
                        />
                      </div>

                      {/* METİN ALANI */}
                      {/* overflow-hidden -> Metin çok uzunsa taşmayı engeller */}
                      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white h-full overflow-hidden">
                        {feature.title && (
                          <h4 className="text-xl md:text-2xl font-medium mb-3 text-slate-800 truncate">
                            {feature.title}
                          </h4>
                        )}
                        {/* line-clamp-4 -> 4 satırdan fazla metin varsa ... koyar, kutuyu bozmaz */}
                        <div className="text-slate-600 leading-relaxed text-sm md:text-base line-clamp-4 md:line-clamp-5">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* --- BELGELER --- */}
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

      {/* --- HARİTA --- */}
      <div className="w-full h-[400px] relative group bg-gray-200 rounded-lg overflow-hidden px-1">
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