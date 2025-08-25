import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

const ProductTable = ({ products, onDelete }) => {
  const [expandedProduct, setExpandedProduct] = useState(null);

  const toggleExpand = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {/* Vista de tabla para escritorio */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image1 && (
                      <img 
                        src={product.image1} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    to={`/admin/products/edit/${product.id}`} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden">
        {products.map(product => (
          <div key={product.id} className="border-b border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                {product.image1 && (
                  <img 
                    src={product.image1} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.sku}</div>
                </div>
              </div>
              
              <button 
                onClick={() => toggleExpand(product.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaEllipsisV />
              </button>
            </div>
            
            {/* Información expandida */}
            {expandedProduct === product.id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Precio:</span>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Stock:</span>
                    <div className="font-medium">{product.stock}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/admin/products/edit/${product.id}`}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm text-center flex items-center justify-center"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </Link>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;