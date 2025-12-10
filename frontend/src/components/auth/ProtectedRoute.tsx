import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { is } from "date-fns/locale";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "user"; // Hangi rol gerekli?
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user , isLoading} = useAuth();
  if(isLoading){
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium text-slate-600">Yükleniyor...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;