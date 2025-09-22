import React, { useState, useEffect, useCallback } from "react";
import useProtectedRoute from "../hooks/useProtectedRoute";
import { getOrders, updateOrderStatus } from "../services/orderService";

const Orders = () => {
  useProtectedRoute();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      console.log("Fetching orders...");
      const data = await getOrders(currentPage, 10, statusFilter);
      console.log("Raw data from service:", data);

      // Si data es un array, úsalo directamente
      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1); // O calcula las páginas si tienes esa información
        console.log("Orders set to array:", data);
      }
      // Si data es un objeto con propiedad orders
      else if (data && data.orders) {
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
        console.log("Orders set from data.orders:", data.orders);
      }
      // Si no hay datos válidos
      else {
        setOrders([]);
        console.log("No valid data, setting orders to empty array");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Agrega un efecto para debuguear cambios en orders
  useEffect(() => {
    console.log("Orders state updated:", orders);
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Gestión de Órdenes</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium whitespace-nowrap"
          >
            Filtrar por estado:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className={
                    getStatusColor(order.status)
                      .replace("text", "bg")
                      .split(" ")[0]
                  }
                >
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                    {order.orderNumber || "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    <div className="truncate max-w-[100px]">
                      {order.customerName || "N/A"}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    <div className="truncate max-w-[120px]">
                      {order.customerEmail || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[120px]">
                      {order.customerPhone || "N/A"}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    <div className="truncate max-w-[120px]">
                      {order.customerAddress || "N/A"}
                    </div>
                    <div className="text-xs truncate max-w-[120px]">
                      {order.customerPostalCode || "N/A"}{" "}
                      {order.customerCity || "N/A"}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    €{order.total ? order.total.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`border rounded px-1 py-1 text-xs w-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 text-xs whitespace-nowrap"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-3 py-4 text-center text-gray-500">
                  No se encontraron órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles de la orden */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Detalles de la Orden #{selectedOrder.orderNumber || "N/A"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Información del Cliente</h3>
                <p className="text-sm">
                  <strong>Nombre:</strong> {selectedOrder.customerName || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedOrder.customerEmail || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Teléfono:</strong>{" "}
                  {selectedOrder.customerPhone || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Dirección de Envío</h3>
                <p className="text-sm">
                  {selectedOrder.customerAddress || "N/A"}
                </p>
                <p className="text-sm">
                  {selectedOrder.customerPostalCode || "N/A"}{" "}
                  {selectedOrder.customerCity || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Productos</h3>
              <div className="border rounded divide-y">
                {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                  selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name || "Producto sin nombre"}
                        </p>
                        <p className="text-gray-600">
                          Cantidad: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-medium">
                        €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    No hay información de productos disponible
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold">
                Total: €
                {selectedOrder.total ? selectedOrder.total.toFixed(2) : "0.00"}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status || "pending"}
              </span>
            </div>

            {selectedOrder.notes && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Notas del Pedido</h3>
                <p className="bg-gray-50 p-3 rounded text-sm">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
