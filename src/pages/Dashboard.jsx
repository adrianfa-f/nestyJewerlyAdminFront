import useProtectedRoute from '../hooks/useProtectedRoute';

const Dashboard = () => {
  useProtectedRoute();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total de Productos</h3>
          <p className="text-3xl font-bold text-emerald-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Órdenes Pendientes</h3>
          <p className="text-3xl font-bold text-amber-500">5</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Ventas Totales</h3>
          <p className="text-3xl font-bold text-blue-600">$12,450</p>
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