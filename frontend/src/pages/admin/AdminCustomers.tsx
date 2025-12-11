import { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";
import { userService, type UserData } from "@/services/userService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner"; // Hata/Başarı bildirimleri için

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<UserData[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Verileri Çek
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error("Müşteri listesi alınamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 2. Kullanıcı Sil
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await userService.deleteUser(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      toast.success("Kullanıcı başarıyla silindi.");
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  // 3. Detay Göster
  const handleViewDetails = (customer: UserData) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  // 4. Arama Filtresi
  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Tarih Formatla
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
        return format(new Date(dateStr), "d MMM yyyy", { locale: tr });
    } catch (e) {
        return "-";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Müşteri Listesi</h2>
        <p className="text-slate-500">Kayıtlı müşterilerinizi görüntüleyin ve detaylarını inceleyin.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
          <div>
            <CardTitle>Müşteriler</CardTitle>
            <CardDescription>
                {loading ? "Yükleniyor..." : `Toplam ${customers.length} kayıtlı müşteri.`}
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="İsim veya e-posta ara..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Ad Soyad</TableHead>
                <TableHead className="hidden md:table-cell">E-posta</TableHead>
                <TableHead className="hidden md:table-cell">Telefon</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex justify-center items-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin h-5 w-5" /> Yükleniyor...
                      </div>
                   </TableCell>
                 </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <Avatar>
                        <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                          {customer.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{customer.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500">{customer.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500">{customer.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.status === "Konaklıyor"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(customer)}
                                title="Detayları Gör"
                            >
                                <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(customer._id)}
                                title="Sil"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      Kayıt bulunamadı.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- DETAY MODALI (READ-ONLY) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Müşteri Bilgileri</DialogTitle>
            <DialogDescription>
              Bu bilgiler sistemden otomatik çekilmiştir.
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="grid gap-6 py-4">
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                    {selectedCustomer.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedCustomer.fullName}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${selectedCustomer.status === "Konaklıyor" ? "bg-green-500" : "bg-slate-400"}`}></span>
                    {selectedCustomer.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 uppercase flex items-center gap-1">
                      <Mail size={12} /> E-posta Adresi
                    </span>
                    <div className="p-3 bg-white border rounded-md text-sm text-slate-700 font-medium">
                      {selectedCustomer.email}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 uppercase flex items-center gap-1">
                      <Phone size={12} /> Telefon Numarası
                    </span>
                    <div className="p-3 bg-white border rounded-md text-sm text-slate-700 font-medium">
                      {selectedCustomer.phone}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 uppercase flex items-center gap-1">
                      <MapPin size={12} /> Mevcut Oda
                    </span>
                    <div className="p-3 bg-white border rounded-md text-sm text-slate-700 font-medium">
                      {selectedCustomer.currentRoom ? (
                        <span className="text-blue-600">{selectedCustomer.currentRoom}</span>
                      ) : (
                        <span className="text-slate-400 italic">Şu an konaklamıyor</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 uppercase flex items-center gap-1">
                      <CreditCard size={12} /> Toplam Harcama
                    </span>
                    <div className="p-3 bg-white border rounded-md text-sm text-slate-700 font-medium">
                      {selectedCustomer.totalSpent.toLocaleString("tr-TR")} ₺
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                 <Calendar size={12} />
                 Son Ziyaret: {formatDate(selectedCustomer.lastVisit)}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;