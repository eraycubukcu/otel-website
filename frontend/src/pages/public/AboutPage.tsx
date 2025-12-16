import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="w-full bg-slate-50 py-8  flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden border-none shadow-xl bg-white py-0">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-medium text-slate-900 mb-6">
                  MoonRose Otel Hakkında
                </h2>

                <p className="text-slate-600 leading-relaxed font-light mb-6 text-justify">
                  Karadeniz’in parlayan yıldızı Samsun’da, modern şehircilik
                  anlayışını geleneksel Türk misafirperverliği ile harmanlayan
                  MoonRose Otel, konuklarına sadece bir konaklama değil,
                  benzersiz bir yaşam deneyimi sunmak üzere kapılarını açmıştır.
                  Şehrin dinamik temposunun merkezinde yer almasına rağmen,
                  kapısından içeri girdiğiniz andan itibaren sizi huzurlu ve
                  sofistike bir atmosferle karşılayan otelimiz, her detayı
                  incelikle düşünülmüş mimarisiyle dikkat çekmektedir. MoonRose
                  ailesi olarak temel felsefemiz; lüksü ulaşılabilir kılmak ve
                  her misafirimizin otelimizden ayrılırken yanına Samsun’a dair
                  unutulmaz, keyifli anılar almasını sağlamaktır. Bizim için
                  otelcilik, sadece dört duvar arasında sunulan bir hizmet
                  değil, konfor ve estetiğin kusursuz uyumunu yakalayarak
                  misafirlerimize kendilerini özel hissettirme sanatıdır
                </p>

                <p className="text-slate-600 leading-relaxed font-light text-justify">
                  MoonRose Otel’de geçireceğiniz her an, sizin konforunuz ve
                  mutluluğunuz için tasarlanmış ayrıcalıklarla doludur. İster
                  yoğun bir iş seyahati için şehrimizde bulunun, ister
                  Karadeniz’in eşsiz doğasını keşfetmek için bir tatil
                  planlayın; geniş ve ferah odalarımız, dünya mutfağından seçkin
                  lezzetler sunan restoranımız ve günün yorgunluğunu
                  atabileceğiniz sosyal alanlarımızla beklentilerinizin ötesine
                  geçmeyi hedefliyoruz. Teknolojik altyapımızla iş dünyasının
                  ihtiyaçlarına profesyonel çözümler üretirken, güler yüzlü ve
                  deneyimli ekibimizle kendinizi evinizde hissetmeniz için 7/24
                  hizmet veriyoruz. Samsun’daki yeni eviniz MoonRose Otel,
                  standartların ötesinde bir kalite ve samimiyetle sizi
                  ağırlamak için bekliyor.
                </p>
              </div>

              {/* --- 2. SAĞ TARA: RESİM ALANI --- */}
              <div className="w-full md:w-1/2 min-h-[400px] relative">
                <img
                  // Buraya kendi resminin yolunu koymalısın. Örn: "/images/about-hotel.jpg"
                  // Geçici olarak Unsplash'ten benzer bir görsel koyuyorum.
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Armida City Hotel İç Mekan"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
