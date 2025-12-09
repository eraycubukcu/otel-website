import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, CalendarCheck, BedDouble, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const stats = [
    { 
      title: "Toplam Gelir", 
      value: "45.250 ₺", 
      icon: <DollarSign className="h-4 w-4 text-green-600" />, 
      trend: "+12%", 
      trendUp: true,
      desc: "Geçen aya göre" 
    },
    { 
      title: "Aktif Rezervasyon", 
      value: "12", 
      icon: <CalendarCheck className="h-4 w-4 text-blue-600" />, 
      trend: "+4", 
      trendUp: true,
      desc: "Onay bekleyen" 
    },
    { 
      title: "Misafir Sayısı", 
      value: "24", 
      icon: <Users className="h-4 w-4 text-orange-600" />, 
      trend: "-2%", 
      trendUp: false,
      desc: "Şu an otelde" 
    },
    { 
      title: "Doluluk Oranı", 
      value: "%85", 
      icon: <BedDouble className="h-4 w-4 text-purple-600" />, 
      trend: "+5%", 
      trendUp: true,
      desc: "25 Odadan 21'i dolu" 
    },
  ];

  const recentBookings = [
    { id: "REZ-1001", guest: "Ahmet Yılmaz", room: "King Suite", amount: "7.500 ₺", status: "Onaylandı" },
    { id: "REZ-1002", guest: "Ayşe Demir", room: "Standart Oda", amount: "2.500 ₺", status: "Bekliyor" },
    { id: "REZ-1003", guest: "Mehmet Öz", room: "Deluxe Oda", amount: "4.000 ₺", status: "İptal" },
    { id: "REZ-1004", guest: "Fatma Kaya", room: "Aile Odası", amount: "5.000 ₺", status: "Onaylandı" },
  ];

  return (
    <div className="space-y-8 p-8 bg-slate-50/50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Otelinizin genel durumuna buradan göz atın.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trendUp ? "text-green-600" : "text-red-600"}>
                  {stat.trend}
                </span>
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Yıllık Gelir Analizi</CardTitle>
            <CardDescription>Aylık bazda otel cirosu.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <span className="text-slate-400 font-medium">Grafik Alanı (Recharts eklenebilir)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Son Rezervasyonlar</CardTitle>
            <CardDescription>Sisteme düşen son 4 işlem.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentBookings.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {item.guest.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.guest}</p>
                      <p className="text-xs text-slate-500">{item.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-900">{item.amount}</p>
                     <p className={`text-[10px] font-medium ${
                        item.status === 'Onaylandı' ? 'text-green-600' : 
                        item.status === 'İptal' ? 'text-red-600' : 'text-yellow-600'
                     }`}>
                        {item.status}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;