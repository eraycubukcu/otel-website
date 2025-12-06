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

const Home = () => {
  const sliderData = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Lüks Konaklama",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Eşsiz Manzara",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=1920&q=80",
      title: "Konforlu Odalar",
    },
  ];

  const features = [
    {
      id: 1,
      title: "Kahvaltı Salonu",
      description:
        "Çanakkale Bölgesi’nin en taze ve organik ürünleriyle hazırlanan kahvaltımız, kahvaltı tabağı ile siz değerli misafirlerimize sunulmaktadır. Doğal lezzetler eşliğinde güne keyifli bir başlangıç yapabilir, yöresel tatların tadını çıkarabilirsiniz. Taptaze peynirler, zeytinler, ev yapımı reçeller ve daha birçok lezzet, özenle hazırlanan kahvaltımızda sizi bekliyor.",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&w=1920&q=80", // Temsili kahvaltı resmi
      reverse: false, // Resmi solda mı istiyorsun? (False = Sol, True = Sağ)
    },
    // İkinci bir örnek (Tersi yapı)
    {
      id: 2,
      title: "Konforlu Odalar",
      description:
        "Günün yorgunluğunu atabileceğiniz, modern ve ferah dizayn edilmiş odalarımızda evinizin rahatlığını bulacaksınız. Ortopedik yataklar, ses yalıtımı ve özel iklimlendirme sistemleri ile kesintisiz bir uyku deneyimi sunuyoruz.",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=1920&q=80",
      reverse: true, // Resmi sağa almak istersen bunu true yapabilirsin
    },
  ];

  const documents = [
    {
      id: 1,
      title: "Turizm İşletme Belgesi",
      subTitle: "Hotel - Basit Konaklama Turizm İşletme Belgesi",
    },
    {
      id: 2,
      title: "Yangın Güvenlik Raporu",
      subTitle: "Hotel - Yapı Yangın Güvenlik Raporu",
    },
    {
      id: 3,
      title: "Yapı Kullanma İzin Belgesi",
      subTitle: "Hotel - Yapı Kullanma İzin Belgesi",
    },
    {
      id: 4,
      title: "Hijyen ve Haşere Belgesi",
      subTitle: "Hotel - Hijyen ve Haşere Mücadelesi Hizmet Sözleşmesi",
    },
  ];

  return (
    <div>
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
            {sliderData.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[500px] w-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                      {slide.title}
                    </h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black border-none h-12 w-12" />
        </Carousel>
      </div>

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
                      <h4 className="text-xl md:text-2xl font-bold mb-3 text-slate-800">
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

                  <h5 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-red-600 transition-colors">
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
      <div className="w-full h-[400px] relative group bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.!2d28.!3d41.00843437135063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be92011c27%3A0x236e6f6f37444fae!2sSultanahmet%20Meydan%C4%B1!5e0!3m2!1str!2str!4v1709725835261!5m2!1str!2str"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
        ></iframe>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center gap-2">
            <MapPin className="text-red-600" size={20} />
            <span className="font-medium text-sm text-slate-800">Otel Konumu</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
