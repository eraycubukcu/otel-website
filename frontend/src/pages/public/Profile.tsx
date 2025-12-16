import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail, Phone, Save, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [infoForm, setInfoForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setInfoForm({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfoForm({ ...infoForm, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.id]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user?._id) return;

      await userService.updateUser(user._id, infoForm);
      
      const updatedUser = { ...user, ...infoForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profil bilgileriniz güncellendi.");
    } catch (error: any) {
      console.error(error);
      toast.error("Profil güncellenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warning("Yeni şifreler birbiriyle uyuşmuyor!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
        toast.warning("Şifreniz en az 6 karakter olmalıdır.");
        return;
    }

    setIsLoading(true);

    try {
      if (!user?._id) return;

      await userService.updateUser(user._id, { password: passwordForm.newPassword });

      toast.success("Şifreniz başarıyla değiştirildi.");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error(error);
      toast.error("Şifre değiştirilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hesap Ayarları</h1>
            <p className="text-slate-500">Profil bilgilerinizi ve güvenliğinizi yönetin.</p>
          </div>
          <div className="h-16 w-16 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
             {user?.name?.charAt(0).toUpperCase()}
          </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-8">
          <TabsTrigger value="account" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
             <User className="w-4 h-4 mr-2" />
             Profil Bilgileri
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
             <ShieldCheck className="w-4 h-4 mr-2" />
             Güvenlik & Şifre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
              <CardDescription>
                Ad, soyad ve iletişim bilgilerinizi güncelleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Ad</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                                id="name" 
                                value={infoForm.name} 
                                onChange={handleInfoChange} 
                                className="pl-10 h-11"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="surname">Soyad</Label>
                        <Input 
                            id="surname" 
                            placeholder="Soyadınız"
                            value={infoForm.surname} 
                            onChange={handleInfoChange} 
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                     <Input 
                        id="email" 
                        type="email"
                        value={infoForm.email} 
                        onChange={handleInfoChange} 
                        className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon Numarası</Label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                     <Input 
                        id="phone" 
                        placeholder="05XX XXX XX XX"
                        value={infoForm.phone} 
                        onChange={handleInfoChange} 
                        className="pl-10 h-11"
                    />
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-slate-900 h-11 px-8">
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                   Değişiklikleri Kaydet
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Şifre Güncelleme</CardTitle>
              <CardDescription>
                Güvenliğiniz için şifrenizi düzenli olarak değiştirmenizi öneririz.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="newPassword" 
                        type="password"
                        placeholder="******"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 h-11"
                      />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        placeholder="******"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 h-11"
                      />
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 flex justify-end">
                <Button type="submit" variant="destructive" disabled={isLoading} className="h-11 px-8">
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                   Şifreyi Güncelle
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;