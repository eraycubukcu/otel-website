import { useState, useEffect } from "react";
import { contactService, type MessageData } from "@/services/contactService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
    Search, 
    Trash2, 
    Mail, 
    CheckCircle2, 
    Loader2, 
    Inbox 
} from "lucide-react";
import { toast } from "sonner";

const AdminMessages = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Verileri Çek
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error("Mesajlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Silme İşlemi
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    if (!window.confirm("Bu mesajı kalıcı olarak silmek istiyor musunuz?")) return;

    try {
      await contactService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Mesaj silindi.");
      
      if (selectedMessage?._id === id) setIsDialogOpen(false);
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  // 3. Detay Görüntüleme & Otomatik Okundu İşaretleme
  const handleViewMessage = async (message: MessageData) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    if (!message.isRead) {
        try {
            await contactService.markAsRead(message._id);
            setMessages((prev) => 
                prev.map((m) => m._id === message._id ? { ...m, isRead: true } : m)
            );
            setSelectedMessage({ ...message, isRead: true });
        } catch (error) {
            console.error("Okundu işaretlenemedi");
        }
    }
  };

  // 4. Manuel Okundu İşaretleme
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await contactService.markAsRead(id);
        setMessages((prev) => 
            prev.map((m) => m._id === id ? { ...m, isRead: true } : m)
        );
        toast.success("Okundu olarak işaretlendi.");
    } catch (error) {
        toast.error("İşlem başarısız.");
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMM yyyy HH:mm", { locale: tr });
    } catch (e) { return "-"; }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Gelen Kutusu</h2>
        <p className="text-slate-500">Müşteri mesajlarını yönetin.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
                <Inbox size={20} />
                Mesajlar
            </CardTitle>
            <CardDescription>
                {messages.filter(m => !m.isRead).length} okunmamış mesaj var.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Ara..."
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
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Gönderen</TableHead>
                <TableHead>Konu</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin h-5 w-5" /> Yükleniyor...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow 
                    key={message._id} 
                    className={`cursor-pointer transition-colors ${!message.isRead ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${!message.isRead ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                          {message.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className={`font-medium ${!message.isRead ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                                {message.name}
                            </span>
                            <span className="text-xs text-slate-500">{message.email}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className={`${!message.isRead ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                            {message.subject}
                        </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                        {formatDate(message.createdAt)}
                    </TableCell>
                    <TableCell>
                      {message.isRead ? (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Okundu</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Yeni</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!message.isRead && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Okundu işaretle"
                                onClick={(e) => handleMarkAsRead(message._id, e)}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => handleDelete(message._id, e)}
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
                    Mesaj kutunuz boş.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- DETAY MODALI --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5 text-blue-600" />
                Mesaj Detayı
            </DialogTitle>
            <DialogDescription>
                {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-slate-900 text-white text-lg">
                            {selectedMessage.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-bold text-slate-900">{selectedMessage.name}</h4>
                        <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Konu</label>
                    <div className="text-lg font-semibold text-slate-800 border-b pb-2">
                        {selectedMessage.subject}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mesaj İçeriği</label>
                    <div className="p-4 bg-slate-50 border rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {selectedMessage.message}
                    </div>
                </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Kapat
            </Button>
            <Button 
                variant="destructive" 
                onClick={() => selectedMessage && handleDelete(selectedMessage._id)}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = `mailto:${selectedMessage?.email}`}>
                Yanıtla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;