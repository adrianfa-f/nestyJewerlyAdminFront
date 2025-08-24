import { useState } from 'react';
import { Link } from 'react-router-dom';
import useProtectedRoute from '../hooks/useProtectedRoute';
import ProductTable from '../componentes/products/ProductTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../services/adminService';

const Products = () => {
  useProtectedRoute();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts
  });
  
  // CORRECCIÓN: Nueva sintaxis para useMutation
  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      mutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Link 
          to="/admin/products/new" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          Nuevo Producto
        </Link>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {isLoading ? (
        <div>Cargando productos...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default Products;