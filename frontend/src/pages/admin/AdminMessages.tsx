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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, MailOpen, Eye, Mail } from "lucide-react";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
};

const AdminMessages = () => {
  // MOCK DATA
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: "Ali Veli",
      email: "ali@gmail.com",
      subject: "Fiyat Bilgisi Hakkında",
      message: "Merhaba, Temmuz ayı için uzun süreli konaklama fiyatlarınızda indirim yapıyor musunuz?",
      date: "2023-10-25",
      isRead: false,
    },
    {
      id: 2,
      name: "Ayşe Yılmaz",
      email: "ayse@hotmail.com",
      subject: "Balayı Paketi",
      message: "Balayı süiti için özel süsleme ve ikramlarınız nelerdir? Detaylı bilgi alabilir miyim?",
      date: "2023-10-24",
      isRead: true,
    },
    {
      id: 3,
      name: "Mehmet Demir",
      email: "mehmet@outlook.com",
      subject: "Restoran Rezervasyonu",
      message: "Dışarıdan gelen misafirler için restoranınız açık mı?",
      date: "2023-10-20",
      isRead: false,
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mesajı Oku (Detay Aç)
  const handleViewMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setIsDialogOpen(true);

    // Açıldığında "Okundu" olarak işaretle
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
  };

  // Mesajı Sil
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Satıra tıklamayı engelle
    if (window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Okunmamış Mesaj Sayısı
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Gelen Kutusu</h2>
          <p className="text-slate-500">Müşterilerden gelen iletişim talepleri.</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {unreadCount} Okunmamış Mesaj
          </Badge>
        )}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
          <CardDescription>Toplam {messages.length} mesajınız var.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Gönderen</TableHead>
                <TableHead>Konu</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow 
                  key={msg.id} 
                  className={`cursor-pointer transition-colors ${!msg.isRead ? "bg-blue-50/50 font-medium" : "hover:bg-slate-50"}`}
                  onClick={() => handleViewMessage(msg)}
                >
                  <TableCell>
                    {!msg.isRead ? (
                      <Mail className="h-4 w-4 text-blue-600 fill-blue-100" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-slate-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{msg.name}</span>
                      <span className="text-xs text-slate-500 font-normal">{msg.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="text-sm text-slate-500">{msg.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(msg.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                        Hiç mesajınız yok.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MESAJ OKUMA MODALI --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
                <MailOpen className="h-5 w-5 text-blue-600" />
                Mesaj Detayı
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6 py-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <p className="text-slate-500 text-xs uppercase font-bold">Gönderen</p>
                      <p className="font-medium text-slate-900">{selectedMessage.name}</p>
                      <p className="text-slate-500">{selectedMessage.email}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-slate-500 text-xs uppercase font-bold">Tarih</p>
                      <p className="font-medium text-slate-900">{selectedMessage.date}</p>
                  </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs uppercase font-bold mb-2">Konu</p>
                  <h4 className="font-bold text-slate-800 mb-4">{selectedMessage.subject}</h4>
                  
                  <p className="text-slate-500 text-xs uppercase font-bold mb-2">Mesaj</p>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                  </p>
               </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Kapat</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Yanıtla (E-posta)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;