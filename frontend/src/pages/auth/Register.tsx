import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifreler birbirleriyle uyuşmuyor.");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success("Kayıt başarıyla oluşturuldu! Giriş yapabilirsiniz.");
      navigate("/");
    } catch (err: any) {
      toast.error("Kayıt başarısız. Bu e-posta adresi kullanılıyor olabilir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-xl w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-light mr-5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          Hesap Oluştur
        </CardTitle>
        <CardDescription>
          Rezervasyonu yapmak için hemen üye olun.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleRegister}>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                placeholder="Adınız"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Soyad</Label>
              <Input
                id="surname"
                placeholder="Soyadınız"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-lg py-5 mt-5"
          >
            Kayıt Ol
          </Button>
          <p className="text-sm text-center text-slate-600">
            Zaten hesabınız var mı?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;
