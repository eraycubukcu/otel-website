import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/HomePage";
import About from "./pages/public/AboutPage";
import Contact from "./pages/public/ContactPage";
import Layout from "./layouts/Layout";
import Rooms from "./pages/public/RoomsPage";
import ReservationPage from "./pages/public/ReservationPage";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/public/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/public/NotFound";
import MyReservations from "./pages/public/MyReservations";
import Dashboard from "./pages/admin/Dashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/rooms" element={<Rooms />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/reservation" element={<Rooms />}></Route>
            <Route path="/reservation/:slug" element={<ReservationPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/reservations" element={<MyReservations />} />
            <Route
              path="/reservation/:slug"
              element={
                <ProtectedRoute requiredRole="user">
                  <ReservationPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="top-center" richColors />
      </AuthProvider>
    </>
  );
}

export default App;
