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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, Mail, Phone, MapPin, CreditCard, Calendar, User } from "lucide-react";

// Müşteri Veri Tipi
type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: "Konaklıyor" | "Ayrıldı";
  currentRoom: string | null; // Eğer konaklıyorsa oda adı, yoksa null
  totalSpent: string; // Toplam harcama
  lastVisit: string;
  avatarUrl?: string;
};

const AdminCustomers = () => {
  // 1. MOCK DATA
  const [customers] = useState<Customer[]>([
    {
      id: 101,
      fullName: "Ahmet Yılmaz",
      email: "ahmet@gmail.com",
      phone: "+90 555 123 45 67",
      status: "Konaklıyor",
      currentRoom: "King Suite (Oda 302)",
      totalSpent: "15.000 ₺",
      lastVisit: "2023-10-12",
    },
    {
      id: 102,
      fullName: "Ayşe Demir",
      email: "ayse@hotmail.com",
      phone: "+90 532 987 65 43",
      status: "Ayrıldı",
      currentRoom: null,
      totalSpent: "4.500 ₺",
      lastVisit: "2023-09-15",
    },
    {
      id: 103,
      fullName: "Mehmet Öz",
      email: "mehmet@outlook.com",
      phone: "+90 505 555 11 22",
      status: "Konaklıyor",
      currentRoom: "Standart Oda (Oda 105)",
      totalSpent: "2.500 ₺",
      lastVisit: "2023-10-14",
    },
    {
      id: 104,
      fullName: "Zeynep Kaya",
      email: "zeynep@yahoo.com",
      phone: "+90 544 444 33 22",
      status: "Ayrıldı",
      currentRoom: null,
      totalSpent: "8.200 ₺",
      lastVisit: "2023-08-20",
    },
  ]);

  // State Yönetimi
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Detay Görüntüleme Fonksiyonu
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  // Arama Filtresi
  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Müşteri Listesi</h2>
        <p className="text-slate-500">Kayıtlı müşterilerinizi görüntüleyin ve detaylarını inceleyin.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
          <div>
            <CardTitle>Müşteriler</CardTitle>
            <CardDescription>Toplam {customers.length} kayıtlı müşteri.</CardDescription>
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
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={customer.avatarUrl} />
                      <AvatarFallback className="bg-slate-200 text-slate-600">
                        {customer.fullName.charAt(0)}
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
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(customer)}
                      title="Detayları Gör"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
              Bu bilgiler salt okunurdur, buradan düzenleme yapılamaz.
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="grid gap-6 py-4">
              
              {/* Üst Kısım: Avatar ve İsim */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {selectedCustomer.fullName.charAt(0)}
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

              {/* Bilgi Grid Yapısı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* İletişim Bilgileri */}
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

                {/* Konaklama Bilgileri */}
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
                      {selectedCustomer.totalSpent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alt Bilgi */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                 <Calendar size={12} />
                 Son Ziyaret: {selectedCustomer.lastVisit}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;