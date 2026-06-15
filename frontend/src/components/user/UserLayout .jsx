// components/user/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar/Header */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 px-4">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
