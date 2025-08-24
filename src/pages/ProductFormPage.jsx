import { useNavigate, useParams } from 'react-router-dom';
import useProtectedRoute from '../hooks/useProtectedRoute';
import ProductForm from '../componentes/products/ProductForm';
import { 
  getProductById, 
  createProduct, 
  updateProduct 
} from '../services/adminService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ProductFormPage = () => {
  useProtectedRoute();
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: isEditing
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
  });

  // CORRECCIÓN: Esta función debe manejar el submit
  const handleFormSubmit = (formData) => {
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h1>
      
      {isEditing && isLoading ? (
        <div>Cargando producto...</div>
      ) : (
        // CORRECCIÓN: Pasar handleFormSubmit como onSubmit
        <ProductForm 
          initialData={product} 
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default ProductFormPage;