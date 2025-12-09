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
import { Save, Lock, Hotel } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Ayarlar</h2>
        <p className="text-slate-500">
          Otel iletişim bilgilerini ve hesap güvenliğini yönetin.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        {/* --- 1. GENEL BİLGİLER --- */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Otel Bilgileri</CardTitle>
              <CardDescription>
                Müşterilerin sitede göreceği iletişim bilgilerini güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="hotelName">Otel Adı</Label>
                <div className="flex items-center gap-2">
                   <Hotel className="text-slate-400 h-4 w-4" />
                   <Input id="hotelName" defaultValue="Armida City Hotel" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">İletişim E-posta</Label>
                <Input id="email" defaultValue="info@armidacity.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input id="phone" defaultValue="+90 212 123 45 67" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adres</Label>
                <Input id="address" defaultValue="Merkez Mah. Cumhuriyet Cad. No:1" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-slate-900">
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- 2. GÜVENLİK --- */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>
                Admin paneli giriş şifrenizi güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Mevcut Şifre</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">Yeni Şifre</Label>
                <Input id="new" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-slate-900">
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