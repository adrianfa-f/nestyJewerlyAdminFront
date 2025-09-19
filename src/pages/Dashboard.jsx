// pages/Dashboard.js
import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/useProtectedRoute";
import { getOrderStats } from "../services/orderService";

const Dashboard = () => {
  useProtectedRoute();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getOrderStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total de Órdenes</h3>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Órdenes Pendientes</h3>
          <p className="text-3xl font-bold text-amber-500">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Ventas Totales</h3>
          <p className="text-3xl font-bold text-blue-600">
            €{stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="text-gray-500">
          <p>• Usuario actualizó el producto "Anillo de Diamantes"</p>
          <p>• Nuevo pedido #ORD-12345 recibido</p>
          <p>• Producto "Collar de Perlas" añadido al catálogo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
