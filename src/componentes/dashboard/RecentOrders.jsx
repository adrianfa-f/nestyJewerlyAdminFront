// components/RecentOrders.js
import React, { useState, useEffect } from "react";
import { getOrders } from "../services/orderService";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const data = await getOrders(1, 5);
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex justify-between items-center text-sm"
        >
          <div>
            <div className="font-medium">#{order.orderNumber}</div>
            <div className="text-gray-500">{order.customerName}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">€{order.total.toFixed(2)}</div>
            <div
              className={`text-xs px-2 py-1 rounded-full inline-block ${
                order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "paid"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrders;
