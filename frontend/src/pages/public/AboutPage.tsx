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
                  Armida City Hotel Hakkında
                </h2>

                <p className="text-slate-600 leading-relaxed font-light mb-6 text-justify">
                  Otelimiz, Tamtur Turizm bünyesinde hizmet vermekte olup, turizm cenneti 
                  Çanakkale’nin merkezinde yer almaktadır. Tarihi ve turistik noktalara yakın 
                  konumuyla misafirlerine eşsiz bir deneyim sunan otelimiz, Aynalı Çarşı, Çimenlik 
                  Kalesi (Kale-i Sultaniye), Truva Atı ve Çanakkale’nin incisi Kordon Boyu’na yürüme 
                  mesafesindedir. Çanakkale Feribot İskelesi’ne sadece 3 dakikalık yürüyüş 
                  mesafesinde bulunan otelimiz, Çanakkale Havalimanı’na ise 2,5 km uzaklıktadır. 
                  Ayrıca, Çanakkale İl Emniyet Müdürlüğü ile Çanakkale Belediyesi arasında yer 
                  alan tarihi Hasan Mevsuf Sokak’ta konumlanarak ulaşım açısından büyük bir 
                  avantaj sunmaktadır.
                </p>

                <p className="text-slate-600 leading-relaxed font-light text-justify">
                  Misafirlerimizin konforu düşünülerek tasarlanan butik otelimiz, toplam 25 odadan 
                  oluşmaktadır. <span className="font-medium text-slate-900">2019 yılında inşa edilen binamız depreme dayanıklı olup, 
                  Çanakkale merkezde bu özelliğe sahip nadir otellerden biridir.</span> Dömi klasik 
                  mimariye sahip olan otelimiz, geleneksel Çanakkale el sanatlarının sergilendiği 
                  lobisiyle sıcak ve huzurlu bir atmosfer sunmaktadır. Siz değerli misafirlerimizi ve 
                  dostlarınızı ağırlamaktan mutluluk duyduğumuz otelimizde, Çanakkale’nin 
                  yöresel lezzetlerinden özenle hazırlanan kahvaltımız beğeninize sunulmaktadır. 
                  Organik ve taze ürünlerle hazırlanan kahvaltımızda, yerel tatların en doğal 
                  halleriyle güne keyifli bir başlangıç yapabilirsiniz.
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