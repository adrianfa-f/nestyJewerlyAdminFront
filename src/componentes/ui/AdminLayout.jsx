import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="mt-6">
          <Link 
            to="/admin/dashboard" 
            className="block py-3 px-4 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className="block py-3 px-4 hover:bg-gray-700"
          >
            Productos
          </Link>
          <Link 
            to="/admin/orders" 
            className="block py-3 px-4 hover:bg-gray-700"
          >
            Órdenes
          </Link>
          <button 
            onClick={logout}
            className="w-full text-left py-3 px-4 hover:bg-gray-700 mt-4"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;