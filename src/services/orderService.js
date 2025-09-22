// src/services/orderService.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getOrders = async (page = 1, limit = 10, status = "") => {
  try {
    const response = await fetch(
      `${API_URL}/orders?page=${page}&limit=${limit}&status=${status}`
    );
    const data = await response.json();
    console.log("Service response:", data); // Agrega este log
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orders/stats`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
