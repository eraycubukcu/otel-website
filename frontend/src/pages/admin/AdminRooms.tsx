import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Pencil, Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { roomService, type Room } from "@/services/roomService";

const AdminRooms = () => {
  // state yönetimi
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "standart",
    price: 0,
    capacity: "",
    size: "",
    description: "",
    image: "",
  });

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // functions

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingId(room._id);
      setFormData({
        title: room.title,
        category: room.category,
        price: room.price,
        capacity: room.capacity,
        size: room.size,
        description: room.description,
        image: room.image,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        category: "standart",
        price: 0,
        capacity: "",
        size: "",
        description: "",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingId) {
        await roomService.updateRoom(editingId, formData);
      } else {
        await roomService.createRoom(formData);
      }

      setIsDialogOpen(false);
      fetchRooms(); // Listeyi yenile
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Sil (DELETE)
  const handleDelete = async (id: string) => {
    if (window.confirm("Bu odayı silmek istediğinize emin misiniz?")) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms(); // Listeyi yenile
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Odalar yükleniyor...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Oda Yönetimi
          </h2>
          <p className="text-slate-500">
            Otel odalarını ekleyin, düzenleyin veya kaldırın.
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Oda Ekle
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Mevcut Odalar</CardTitle>
          <CardDescription>
            Sistemde kayıtlı toplam {rooms.length} oda tipi var.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Henüz hiç oda eklenmemiş. "Yeni Oda Ekle" butonunu kullanın.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Görsel</TableHead>
                  <TableHead>Oda Adı</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Kapasite</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-10 h-10 rounded-md object-cover bg-slate-100"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://via.placeholder.com/150")
                        } // Kırık resim önlemi
                      />
                    </TableCell>
                    <TableCell className="font-medium">{room.title}</TableCell>
                    <TableCell className="capitalize">
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {room.category}
                      </span>
                    </TableCell>
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
                          onClick={() => handleDelete(room._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* --- MODAL (DIALOG) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Odayı Düzenle" : "Yeni Oda Ekle"}
            </DialogTitle>
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Örn: Deluxe Deniz Manzaralı"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Boyut</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  placeholder="Örn: 25 m²"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
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
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Oda hakkında kısa bilgi..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-slate-900"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Güncelle" : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
