import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarDays, LogOut, Settings, Users, MessageSquare } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Panel", path: "/admin" },
    { icon: <CalendarDays size={20} />, label: "Rezervasyonlar", path: "/admin/reservations" },
    { icon: <BedDouble size={20} />, label: "Oda Yönetimi", path: "/admin/rooms" },
    { icon: <Users size={20} />, label: "Müşteriler", path: "/admin/customers" },
    { icon: <MessageSquare size={20} />, label: "Mesajlar", path: "/admin/messages" },
    { icon: <Settings size={20} />, label: "Ayarlar", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
      
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold tracking-tight text-white">Admin Panel</h2>
        <p className="text-slate-400 text-xs mt-1">Otel Yönetim Sistemi</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 w-full rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Siteye Dön</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;