import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const   handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      const storedUser = localStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      if (userData?.role == "admin") {
        navigate("/admin");
      } else {
        const targetPath = location.state?.returnUrl || "/";
        navigate(targetPath, { replace: true });
      }
    } catch (err: any) {
      const errorMessage = typeof err === "string" ? err : "Giriş yapılamadı.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-xl w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        
        <CardTitle className="text-2xl font-light">Giriş Yap</CardTitle>
        <CardDescription>
          Devam etmek için hesabınıza giriş yapın
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="grid gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Şifre</Label>
              <Link
                to="#"
                className="text-sm font-medium text-slate-600 hover:text-blue-600"
              >
                Şifremi unuttum?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="******"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-lg py-5 mt-7"
          >
            Giriş Yap
          </Button>

          <p className="text-sm text-center text-slate-600">
            Hesabınız yok mu?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Kayıt Ol
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
