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
      const data = await getOrders(currentPage, 10, statusFilter);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Ahora fetchOrders es estable gracias a useCallback

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
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Órdenes</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filtrar por estado:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
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

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Información de Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección de Envío
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={
                  getStatusColor(order.status)
                    .replace("text", "bg")
                    .split(" ")[0]
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.customerEmail}</div>
                  <div className="text-xs text-gray-400">
                    {order.customerPhone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{order.customerAddress}</div>
                  <div>
                    {order.customerPostalCode} {order.customerCity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`border rounded px-2 py-1 text-xs ${getStatusColor(
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900 mr-3 text-xs"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles de la orden */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Detalles de la Orden #{selectedOrder.orderNumber}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Información del Cliente</h3>
                <p>
                  <strong>Nombre:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </p>
                <p>
                  <strong>Teléfono:</strong> {selectedOrder.customerPhone}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Dirección de Envío</h3>
                <p>{selectedOrder.customerAddress}</p>
                <p>
                  {selectedOrder.customerPostalCode}{" "}
                  {selectedOrder.customerCity}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Productos</h3>
              <div className="border rounded divide-y">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold">
                Total: €{selectedOrder.total.toFixed(2)}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            {selectedOrder.notes && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Notas del Pedido</h3>
                <p className="bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Orders;
