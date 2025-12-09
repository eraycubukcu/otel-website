import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react";

// Oda Veri Tipi
type Room = {
  id: number;
  title: string;
  category: string;
  price: number;
  capacity: string;
  size: string;
  description: string;
  image: string;
};

const AdminRooms = () => {
  // 1. BAŞLANGIÇ VERİLERİ (Mock Data)
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      title: "Standart Çift Kişilik",
      category: "standart",
      price: 2500,
      capacity: "2 Yetişkin",
      size: "25 m²",
      description: "Ekonomik ve konforlu bir konaklama.",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&w=800&q=80",
    },
    {
      id: 2,
      title: "King Suite",
      category: "suite",
      price: 7500,
      capacity: "4 Yetişkin",
      size: "60 m²",
      description: "Lüks ve geniş yaşam alanı.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&w=800&q=80",
    },
  ]);

  // 2. STATE YÖNETİMİ
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Hangi oda düzenleniyor? (Null ise yeni eklemedir)

  // Form Verileri
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    title: "",
    category: "standart",
    price: 0,
    capacity: "",
    size: "",
    description: "",
    image: "",
  });

  // 3. FONKSİYONLAR

  // Yeni Ekle veya Düzenle butonuna basılınca formu hazırlar
  const handleOpenDialog = (room?: Room) => {
    if (room) {
      // Düzenleme Modu
      setEditingId(room.id);
      setFormData({ ...room }); // Mevcut verileri forma doldur
    } else {
      // Ekleme Modu
      setEditingId(null);
      setFormData({
        title: "",
        category: "standart",
        price: 0,
        capacity: "",
        size: "",
        description: "",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", // Varsayılan resim
      });
    }
    setIsDialogOpen(true);
  };

  // Kaydet Butonuna Basılınca (Ekleme veya Güncelleme)
  const handleSave = () => {
    if (editingId) {
      // GÜNCELLEME
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editingId ? { ...formData, id: editingId } : room
        )
      );
    } else {
      // YENİ EKLEME
      const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      setRooms((prev) => [...prev, { ...formData, id: newId }]);
    }
    setIsDialogOpen(false);
  };

  // Silme İşlemi
  const handleDelete = (id: number) => {
    if (window.confirm("Bu odayı silmek istediğinize emin misiniz?")) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Oda Yönetimi</h2>
          <p className="text-slate-500">Otel odalarını ekleyin, düzenleyin veya kaldırın.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" /> Yeni Oda Ekle
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Mevcut Odalar</CardTitle>
          <CardDescription>Sistemde kayıtlı toplam {rooms.length} oda tipi var.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Görsel</TableHead>
                <TableHead>Oda Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Fiyat (Gecelik)</TableHead>
                <TableHead>Kapasite</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-10 h-10 rounded-md object-cover bg-slate-100"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{room.title}</TableCell>
                  <TableCell className="capitalize">{room.category}</TableCell>
                  <TableCell>{room.price} ₺</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleOpenDialog(room)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- EKLEME / DÜZENLEME MODALI (DIALOG) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Odayı Düzenle" : "Yeni Oda Ekle"}</DialogTitle>
            <DialogDescription>
              Oda bilgilerini eksiksiz doldurduğunuzdan emin olun.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Oda Başlığı</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Deluxe Deniz Manzaralı"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standart">Standart</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="aile">Aile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Boyut (m²)</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="Örn: 25 m²"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Örn: 2 Yetişkin, 1 Çocuk"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Resim URL</Label>
              <div className="flex items-center gap-2">
                 <ImageIcon className="text-slate-400" />
                 <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Oda hakkında kısa bilgi..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
            <Button onClick={handleSave} className="bg-slate-900">Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;