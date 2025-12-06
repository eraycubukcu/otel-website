import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Layout from "./pages/Layout";
import Rooms from "./pages/RoomsPage";
import ReservationPage from "./pages/ReservationPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/rooms" element={<Rooms />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/reservation" element={<Rooms />}></Route>
          <Route path="/reservation/:id" element={<ReservationPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
