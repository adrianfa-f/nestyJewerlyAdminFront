import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = () => {
    // Cerrar el menú al seleccionar una opción en dispositivos móviles
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Header móvil */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center md:hidden">
        <div className="text-xl font-bold">Admin Panel</div>
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menú lateral */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full w-52 bg-gray-800 text-white 
          transform transition-transform duration-300 ease-in-out z-50
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:flex flex-col
        `}
      >
        <div className="p-4 text-xl font-bold hidden md:block">Admin Panel</div>

        {/* Botón de cerrar en móviles */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="mt-6 flex-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center py-3 px-4 hover:bg-gray-700"
            onClick={handleNavigation}
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center py-3 px-4 hover:bg-gray-700"
            onClick={handleNavigation}
          >
            <FaBox className="mr-3" />
            Productos
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center py-3 px-4 hover:bg-gray-700"
            onClick={handleNavigation}
          >
            <FaShoppingBag className="mr-3" />
            Órdenes
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-700"
          >
            <FaSignOutAlt className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay para móviles */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
