import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  CalendarCheck, 
  BedDouble, 
  Loader2,
  Clock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  stats: {
    totalIncome: number;
    activeReservationsCount: number;
    totalGuests: number;
    occupancyRate: number;
    totalRooms: number;
    occupiedRooms: number;
  };
  recentBookings: any[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getStats();
        setData(res);
      } catch (error) {
        console.error(error);
        toast.error("Veriler alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Toplam Ciro",
      value: `${(data.stats?.totalIncome || 0).toLocaleString('tr-TR')} ₺`,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      desc: "İptal edilmeyen tüm rezervasyonlar"
    },
    {
      title: "Aktif Rezervasyon",
      value: data.stats?.activeReservationsCount || 0,
      icon: <CalendarCheck className="h-5 w-5 text-blue-600" />,
      desc: "Giriş yapmış veya bekleyen misafirler"
    },
    {
      title: "Toplam Üye",
      value: data.stats?.totalGuests || 0,
      icon: <Users className="h-5 w-5 text-orange-600" />,
      desc: "Sisteme kayıtlı kullanıcı sayısı"
    },
    {
      title: "Doluluk Oranı",
      value: `%${data.stats?.occupancyRate || 0}`,
      icon: <BedDouble className="h-5 w-5 text-purple-600" />,
      desc: `${data.stats?.totalRooms || 0} odadan ${data.stats?.occupiedRooms || 0}'i dolu`
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-slate-50/50 min-h-screen">
      
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">Yönetim Paneli</h2>
           <p className="text-slate-500 mt-1">Otel durumunun anlık özeti.</p>
        </div>
        <div className="flex items-center text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            <Clock className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-slate-50 rounded-full">
                 {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-2">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 