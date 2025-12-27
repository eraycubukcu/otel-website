import { Card, CardContent } from "@/components/ui/card";
import { settingsService } from "@/services/settingsServices";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        
        setAboutText(data.about || "İçerik hazırlanıyor...");

        if (data.aboutImage) {
            setAboutImage(data.aboutImage);
        } 
        else if (data.heroImages && data.heroImages.length > 0) {
            const img = data.heroImages[0];
            setAboutImage(typeof img === 'string' ? img : img.url);
        } 
        else {
            setAboutImage("https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
      return <div className="flex h-svh justify-center py-20"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="w-full bg-slate-50 py-8 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden border-none shadow-xl bg-white py-0">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-medium text-slate-700 mb-6">
                  MoonRose Otel Hakkında
                </h2>

                <p className="text-slate-600 leading-relaxed font-light text-justify whitespace-pre-line">
                  {aboutText}
                </p>

              </div>

              <div className="w-full md:w-1/2 min-h-[400px] relative">
                <img
                  src={aboutImage}
                  alt="MoonRose Otel Hakkında"
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
