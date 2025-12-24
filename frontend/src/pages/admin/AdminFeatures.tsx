import { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { settingsService, type Feature } from "@/services/settingsServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const AdminFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Verileri Çek
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        if (data && data.features) {
          setFeatures(data.features);
        }
      } catch (error) {
        console.error("Ayarlar çekilemedi:", error);
        toast.error("Veriler yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Input Değişikliği
  const handleChange = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFeatures(updatedFeatures);
  };

  // Yeni Ekle
  const handleAddFeature = () => {
    setFeatures([...features, { title: "", description: "", image: "" }]);
  };

  // Sil
  const handleRemoveFeature = (index: number) => {
    if (!confirm("Bu özelliği silmek istediğinize emin misiniz?")) return;
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  // Resim Yükle
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      const url = await settingsService.uploadImage(file);
      
      const updatedFeatures = [...features];
      updatedFeatures[index].image = url;
      setFeatures(updatedFeatures);
      
      toast.success("Resim yüklendi.");
    } catch (error) {
      console.error(error);
      toast.error("Resim yüklenemedi.");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Kaydet
  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.updateHotelSettings({ features });
      toast.success("Özellikler başarıyla kaydedildi!");
    } catch (error) {
      console.error(error);
      toast.error("Kaydetme işlemi başarısız.");
    } finally {
      setSaving(false);
    }
  };

  // Helper: Resim URL düzeltici
  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Öne Çıkan Özellikler</h2>
          <p className="text-sm text-slate-500">
            Anasayfada (Slider altında) görünen tanıtım kartlarını buradan yönetebilirsiniz.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Kaydet
        </Button>
      </div>

      <div className="grid gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="relative group overflow-hidden border border-slate-200 p-0 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row h-full">
                
                {/* SOL: Resim Yükleme Alanı (w-1/2 ve KISALTILDI) */}
                <div className="w-full md:w-1/2 bg-slate-100 border-r border-slate-100">
                  {/* DEĞİŞİKLİK BURADA: min-h-[300px] yerine min-h-[220px] yapıldı */}
                  <div className="relative h-full min-h-[220px] flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    {feature.image ? (
                      <img 
                        src={getFullImageUrl(feature.image)} 
                        className="w-full h-full object-cover absolute inset-0" 
                        alt="Preview" 
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">Resim Yok</span>
                      </div>
                    )}

                    {/* Resim Yükleme Overlay */}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all z-10">
                       {uploadingIndex === index ? (
                         <div className="bg-white p-3 rounded-full">
                            <Loader2 className="animate-spin text-black" />
                         </div>
                       ) : (
                         <div className="flex flex-col items-center text-white bg-black/20 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="font-semibold text-sm">Resmi Değiştir</span>
                         </div>
                       )}
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e, index)}
                       />
                    </label>
                  </div>
                </div>

                {/* SAĞ: Input Alanları (w-1/2 ve KOMPAKTLARŞTIRILDI) */}
                {/* DEĞİŞİKLİK BURADA: p-6 space-y-5 yerine p-5 space-y-4 yapıldı */}
                <div className="w-full md:w-1/2 p-5 space-y-4 flex flex-col justify-center">
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <Label className="text-slate-500 font-semibold text-sm">Kart #{index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Sil
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Başlık</Label>
                    <Input 
                      value={feature.title} 
                      onChange={(e) => handleChange(index, "title", e.target.value)}
                      placeholder="Örn: Kahvaltı Salonu"
                      className="font-medium h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Açıklama</Label>
                    <Textarea 
                      value={feature.description} 
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                      placeholder="Özellik hakkında kısa bir açıklama yazın..."
                      rows={4}
                      className="resize-none leading-relaxed text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          variant="outline" 
          onClick={handleAddFeature} 
          className="h-20 border-dashed border-2 flex flex-col gap-2 hover:bg-slate-50 hover:border-slate-400 transition-all"
        >
          <Plus className="w-6 h-6 text-slate-400" />
          <span className="text-slate-600 font-medium">Yeni Özellik Kartı Ekle</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminFeatures;