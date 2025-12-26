import { useEffect, useState } from "react";
import { settingsService } from "@/services/settingsServices";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Lock,
  Upload,
  ImageIcon,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import AdminFeatures from "@/pages/admin/AdminFeatures";
import { Textarea } from "@/components/ui/textarea";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Site Ayarları State
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: "",
    siteDescription: "",
    about: "",
    aboutImage: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
  });

  // Şifre State
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Slider Resimleri Listesi
  const [heroImages, setHeroImages] = useState<string[]>([]);

  // Verileri Yükle
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getHotelSettings();
        setSettingsForm({
          siteTitle: data.siteTitle || "",
          siteDescription: data.siteDescription || "",
          about: data.about || "",
          aboutImage: data.aboutImage || "",
          logo: data.logo || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
        });

        if (data.heroImages && data.heroImages.length > 0) {
          const normalizedImages = data.heroImages.map((img: any) =>
            typeof img === "string" ? img : img.imageUrl || img.url
          );
          setHeroImages(normalizedImages);
        } else if (data.heroImage) {
          setHeroImages([data.heroImage]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadSettings();
  }, []);

  // --- LOGO YÜKLEME ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await settingsService.uploadImage(file);
      setSettingsForm((prev) => ({ ...prev, logo: uploadedUrl }));
      toast.success("Logo yüklendi. Kaydet butonuna basmayı unutmayın!");
    } catch (error) {
      toast.error("Logo yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  // --- SLIDER RESMİ EKLEME ---
  const handleAddSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await settingsService.uploadImage(file);
      await settingsService.addSliderImage(uploadedUrl);
      setHeroImages((prev) => [...prev, uploadedUrl]);
      toast.success("Resim galeriye eklendi!");
    } catch (error) {
      console.error(error);
      toast.error("Resim galeriye eklenemedi.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // --- SLIDER RESMİ SİLME ---
  const handleRemoveSlide = async (urlToDelete: string) => {
    if (!confirm("Bu resmi slider'dan silmek istediğinize emin misiniz?"))
      return;

    try {
      await settingsService.removeSliderImage(urlToDelete);
      setHeroImages((prev) => prev.filter((url) => url !== urlToDelete));
      toast.success("Resim silindi.");
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  // --- GENEL AYARLARI KAYDETME ---
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await settingsService.updateHotelSettings(settingsForm);
      toast.success("Genel ayarlar kaydedildi.");
    } catch (error) {
      toast.error("Kaydetme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.warning("Şifreler uyuşmuyor!");
      return;
    }
    setLoading(true);
    try {
      await settingsService.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success("Şifre değiştirildi.");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettingsForm({ ...settingsForm, [e.target.id]: e.target.value });
  };

  const handleAboutImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Aynı upload servisini kullanıyoruz
      const uploadedUrl = await settingsService.uploadImage(file);
      setSettingsForm((prev) => ({ ...prev, aboutImage: uploadedUrl }));
      toast.success("Hakkımızda resmi yüklendi. Kaydetmeyi unutmayın!");
    } catch (error) {
      toast.error("Resim yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-8 bg-slate-50/50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Ayarlar</h2>
        <p className="text-slate-500">
          Site içeriğini, görselleri ve güvenliği yönetin.
        </p>
      </div>

      <Tabs defaultValue="visuals" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="visuals">Genel & Slider</TabsTrigger>
          <TabsTrigger value="features">Vitrin & Özellikler</TabsTrigger>
          <TabsTrigger value="contact">İletişim & Sosyal</TabsTrigger>
          <TabsTrigger value="about">Hakkımızda</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        {/* --- 1. GÖRSELLER & SLIDER & HAKKIMIZDA --- */}
        <TabsContent value="visuals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Görünümü</CardTitle>
              <CardDescription>
                Logo, kapak fotoğrafı ve hakkımızda yazısı.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Başlığı</Label>
                  <Input
                    id="siteTitle"
                    value={settingsForm.siteTitle}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Input
                    id="siteDescription"
                    value={settingsForm.siteDescription}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* LOGO (Aynen Kalıyor) */}
              <div className="space-y-3 border-t pt-4">
                <Label>Site Logosu</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border rounded-lg bg-white flex items-center justify-center overflow-hidden relative">
                    {settingsForm.logo ? (
                      <img
                        src={settingsForm.logo}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <Input
                      value={settingsForm.logo}
                      onChange={handleChange}
                      id="logo"
                      placeholder="URL veya dosya yükleyin"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id="uploadLogo"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <Label
                        htmlFor="uploadLogo"
                        className="cursor-pointer bg-slate-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />{" "}
                        {uploading ? "..." : "Bilgisayardan Seç"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SLIDER (Aynen Kalıyor) */}
              <div className="space-y-3 border-t pt-4">
                {/* ... Slider Kodların Aynen Kalacak ... */}
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Ana Sayfa Slider Resimleri
                  </Label>
                  <div>
                    <Input
                      type="file"
                      id="uploadSlide"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAddSlide}
                      disabled={uploading}
                    />
                    <Label
                      htmlFor="uploadSlide"
                      className={`cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Yeni Resim Ekle
                    </Label>
                  </div>
                </div>
                {heroImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {heroImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-lg overflow-hidden h-40 bg-slate-100"
                      >
                        <img
                          src={imgUrl}
                          alt={`Slide ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveSlide(imgUrl)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Sil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg text-slate-400">
                    Henüz hiç slider resmi yüklenmemiş.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-slate-900"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Genel Ayarları Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ... DİĞER TABLAR (Features, Contact, Security) AYNEN KALIYOR ... */}
        <TabsContent value="features" className="space-y-4">
          <AdminFeatures />
        </TabsContent>
        <TabsContent value="contact">
          {/* ... Mevcut Contact kodun ... */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={settingsForm.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    value={settingsForm.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={settingsForm.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settingsForm.instagram}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settingsForm.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-slate-900"
              >
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hakkımızda Sayfası</CardTitle>
              <CardDescription>
                "Hakkımızda" sayfasında görünecek metni ve yan görseli buradan
                yönetebilirsiniz.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* --- YENİ: Hakkımızda Resmi Yükleme Alanı --- */}
              <div className="space-y-3 pt-2">
                <Label>Hakkımızda Yan Görseli</Label>
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50 mb-6">
                  {/* Önizleme Kutusu */}
                  <div className="w-32 h-32 border rounded-lg bg-white flex items-center justify-center overflow-hidden relative shadow-sm">
                    {settingsForm.aboutImage ? (
                      <img
                        src={settingsForm.aboutImage}
                        alt="About"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-slate-300 w-8 h-8" />
                    )}
                  </div>

                  {/* Yükleme Butonu ve Input */}
                  <div className="space-y-2 flex-1">
                    <p className="text-sm text-slate-500">
                      Bu resim "Hakkımızda" sayfasında yazının yanında
                      görünecektir. (Önerilen boyut: Dikey veya Kare)
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Gizli Input */}
                      <Input
                        type="file"
                        id="uploadAboutImage"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAboutImageUpload}
                      />

                      {/* Görünen Buton */}
                      <Label
                        htmlFor="uploadAboutImage"
                        className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Yükleniyor..." : "Resim Seç & Yükle"}
                      </Label>
                    </div>

                    {/* URL Input (Elle girmek isterse) */}
                    <Input
                      value={settingsForm.aboutImage}
                      onChange={handleChange}
                      id="aboutImage"
                      placeholder="veya resim URL'si yapıştırın"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* --- 3. YENİ EKLENEN KISIM: Hakkımızda Yazısı --- */}
              <div className="space-y-2">
                <Label htmlFor="about">Hakkımızda Yazısı</Label>
                <Textarea
                  id="about"
                  value={settingsForm.about}
                  onChange={handleChange}
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>

            <CardFooter className="justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-slate-900"
              >
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          {/* ... Mevcut Security kodun ... */}
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Mevcut Şifre</Label>
                <Input
                  type="password"
                  id="current"
                  value={passForm.currentPassword}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">Yeni Şifre</Label>
                  <Input
                    type="password"
                    id="new"
                    value={passForm.newPassword}
                    onChange={(e) =>
                      setPassForm({ ...passForm, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
                  <Input
                    type="password"
                    id="confirm"
                    value={passForm.confirmPassword}
                    onChange={(e) =>
                      setPassForm({
                        ...passForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={handlePasswordChange}
                disabled={loading}
                variant="destructive"
              >
                <Lock className="mr-2 h-4 w-4" /> Şifreyi Güncelle
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
