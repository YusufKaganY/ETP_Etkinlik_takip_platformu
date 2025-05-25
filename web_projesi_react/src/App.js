import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Sayfalar/Landing";
import Register from "./Sayfalar/Register";
import Explore from "./Sayfalar/Expoler";
import Login from "./Sayfalar/Login";
import Home from "./Sayfalar/Home";
import Cart from "./Sayfalar/Cart";
import ChangePassword from "./Sayfalar/ChangePassword";
import EventDetail from "./Sayfalar/EventDetail";
import InterestSuggestions from "./Sayfalar/InterestSuggestions";
import UserProfile from "./Sayfalar/UserProfile";
import AdminPanel from "./Sayfalar/AdminPanel"; // AdminPanel'i aktif et!
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/interest-suggestions" element={<InterestSuggestions />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/admin-panel" element={<AdminPanel />} /> {/* Sadece bu satır! */}
      </Routes>
    </Router>
  );
}

export default App;