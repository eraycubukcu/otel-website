import { useState, useEffect } from "react";
import { reservationService, type Reservation } from "@/services/reservationService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  MoreHorizontal, 
  CalendarDays,
  Loader2,
  RefreshCw
} from "lucide-react";

// Shadcn UI Bileşenleri
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // veya 'react-hot-toast'

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Verileri Getir
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      // En yeni rezervasyon en üstte görünsün
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Veri hatası:", error);
      toast.error("Rezervasyon listesi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 2. Onaylama İşlemi
  const handleApprove = async (id: string) => {
    try {
      await reservationService.updateReservation(id, "confirmed");
      toast.success("Rezervasyon onaylandı.");
      
      // Listeyi güncelle (Tekrar fetch atmadan local update)
      setReservations((prev) =>
        prev.map((res) => (res._id === id ? { ...res, status: "confirmed" } : res))
      );
    } catch (error) {
      toast.error("Onaylama işlemi başarısız.");
    }
  };

  // 3. İptal/Silme İşlemi
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu rezervasyonu kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
      await reservationService.deleteReservation(id);
      toast.success("Rezervasyon silindi.");
      setReservations((prev) => prev.filter((res) => res._id !== id));
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  // 4. Arama Filtresi (İsim, Email veya Oda adına göre)
  const filteredReservations = reservations.filter((res) => {
    const term = searchTerm.toLowerCase();
    const userName = res.user ? `${res.user.name} ${res.user.surname}`.toLowerCase() : "";
    const userEmail = res.user?.email.toLowerCase() || "";
    const roomTitle = res.room?.title.toLowerCase() || "";
    
    return userName.includes(term) || userEmail.includes(term) || roomTitle.includes(term);
  });

  // Helper: Tarih Formatla
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: tr });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rezervasyon Yönetimi</h2>
          <p className="text-slate-500">Tüm rezervasyonları buradan takip edebilir ve yönetebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={fetchReservations} title="Yenile">
                <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
                placeholder="Misafir, e-posta veya oda ara..."
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Rezervasyon Listesi</CardTitle>
            <Badge variant="secondary" className="px-2 py-1">
                Toplam {filteredReservations.length} Kayıt
            </Badge>
          </div>
          <CardDescription>
            Son güncellenme: {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Misafir Bilgisi</TableHead>
                <TableHead>Oda & Tarih</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Tarih</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span>Veriler yükleniyor...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <TableRow key={res._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-400">
                      #{res._id.slice(-6).toUpperCase()}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                            {res.user ? `${res.user.name || ""} ${res.user.surname || ""}` : "Silinmiş Kullanıcı"}
                        </span>
                        <span className="text-xs text-slate-500">{res.user?.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">
                            {res.room?.title || "Silinmiş Oda"}
                        </span>
                        <div className="flex items-center text-xs text-slate-500 gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(res.checkInDate)} - {formatDate(res.checkOutDate)}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                        {res.totalPrice.toLocaleString("tr-TR")} ₺
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                            res.status === "confirmed" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" 
                            : res.status === "cancelled"
                            ? "bg-red-100 text-red-700 hover:bg-red-200 border-none"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none"
                        }
                      >
                        {res.status === "confirmed" ? "Onaylandı" : res.status === "cancelled" ? "İptal" : "Beklemede"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-xs text-slate-400">
                        {new Date(res.createdAt).toLocaleDateString("tr-TR")}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menü aç</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          {res.status === "pending" && (
                              <DropdownMenuItem 
                                onClick={() => handleApprove(res._id)}
                                className="text-green-600 focus:text-green-700 cursor-pointer"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Onayla
                              </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(res._id)}
                            className="text-red-600 focus:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil / İptal Et
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Aradığınız kriterlere uygun kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReservations;