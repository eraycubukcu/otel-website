import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "user"; // Hangi rol gerekli?
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // 1. Kullanıcı hiç giriş yapmamışsa Login'e at
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Admin sayfasına girmeye çalışıyor ama rolü 'user' ise Anasayfaya at
  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Sorun yoksa sayfayı göster
  return <>{children}</>;
};

export default ProtectedRoute;