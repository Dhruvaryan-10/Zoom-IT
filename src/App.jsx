import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/login.jsx";
import Info from "./Components/info.jsx";
import Cities from "./Components/cities.jsx";
import DelhiHome from "./Components/Home/DelhiHome.jsx";
import KolkataHome from "./Components/Home/KolkataHome.jsx";
import ChennaiHome from "./Components/Home/ChennaiHome.jsx";
import BangaloreHome from "./Components/Home/BangaloreHome.jsx";
import AhmedabadHome from "./Components/Home/AhmedabadHome.jsx";
import MenuPage from "./Components/Home/MenuItems.jsx"
import ReceiptPage from "./Components/Home/Reciept.jsx";


const App = () => {
  const location = useLocation();
  console.log("Current Route:", location.pathname);

  const [loggedInEmail, setLoggedInEmail] = useState('');

  return (
    <>
      <Routes>
        <Route path="/" element={<Login setLoggedInEmail={setLoggedInEmail} />} />
        <Route path="/info" element={<Info usersEmail={loggedInEmail} />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/home/delhi" element={<DelhiHome />} />
        <Route path="/home/kolkata" element={<KolkataHome />} />
        <Route path="/home/Chennai" element={<ChennaiHome />} />
        <Route path="/home/bangalore" element={<BangaloreHome />} />
        <Route path="/home/ahmedabad" element={<AhmedabadHome />} />
        <Route path="/home/:city/menu" element={<MenuPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />

      </Routes>
    </>
  );
};

export default App;
