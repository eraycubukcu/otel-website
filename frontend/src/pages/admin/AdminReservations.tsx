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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Rezervasyon Tipi
type Reservation = {
  id: number;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  status: "Beklemede" | "Onaylandı";
};

const AdminReservations = () => {
  // Mock Veriler
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 101, guestName: "Ahmet Yılmaz", room: "King Suite", checkIn: "2023-10-12", checkOut: "2023-10-15", amount: "7.500 ₺", status: "Beklemede" },
    { id: 102, guestName: "Ayşe Demir", room: "Standart Oda", checkIn: "2023-11-01", checkOut: "2023-11-03", amount: "2.500 ₺", status: "Onaylandı" },
    { id: 103, guestName: "Mehmet Öz", room: "Deluxe Oda", checkIn: "2023-12-20", checkOut: "2023-12-25", amount: "12.000 ₺", status: "Beklemede" },
    { id: 104, guestName: "Fatma Kaya", room: "Aile Odası", checkIn: "2023-10-14", checkOut: "2023-10-18", amount: "5.000 ₺", status: "Onaylandı" },
    { id: 105, guestName: "Ali Veli", room: "Standart Oda", checkIn: "2023-09-10", checkOut: "2023-09-12", amount: "1.800 ₺", status: "Beklemede" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Onaylama Fonksiyonu
  const handleApprove = (id: number) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status: "Onaylandı" } : res
      )
    );
  };

  // Silme Fonksiyonu
  const handleDelete = (id: number) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
      setReservations((prev) => prev.filter((res) => res.id !== id));
    }
  };

  // Arama Filtresi
  const filteredReservations = reservations.filter(
    (res) =>
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Rezervasyon Yönetimi</h2>
        <p className="text-slate-500">Gelen rezervasyon taleplerini buradan yönetebilirsiniz.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Rezervasyon Listesi</CardTitle>
            <CardDescription>Toplam {reservations.length} kayıt bulundu.</CardDescription>
          </div>
          {/* Arama Kutusu */}
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Misafir veya oda ara..."
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
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Misafir</TableHead>
                <TableHead>Oda</TableHead>
                <TableHead>Giriş - Çıkış</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">#{res.id}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{res.guestName}</TableCell>
                    <TableCell>{res.room}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {res.checkIn} <br /> {res.checkOut}
                    </TableCell>
                    <TableCell>{res.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={res.status === "Onaylandı" ? "default" : "secondary"}
                        className={res.status === "Onaylandı" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 text-white hover:bg-yellow-600"}
                      >
                        {res.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Onayla Butonu (Sadece Beklemedeyse göster) */}
                        {res.status === "Beklemede" && (
                          <Button
                            size="icon"
                            className="bg-green-600 hover:bg-green-700 h-8 w-8"
                            onClick={() => handleApprove(res.id)}
                            title="Onayla"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Sil Butonu (Her zaman göster) */}
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => handleDelete(res.id)}
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Kayıt bulunamadı.
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