import api from './api';

export const loginAdmin = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  
  // Agregar campos de texto
  Object.entries(productData).forEach(([key, value]) => {
    if (key !== 'mainImageFile' && key !== 'hoverImageFile' && key !== 'imageFiles') {
      formData.append(key, value);
    }
  });
  
  // Agregar archivos
  if (productData.mainImageFile) {
    formData.append('mainImage', productData.mainImageFile);
  }
  
  if (productData.hoverImageFile) {
    formData.append('hoverImage', productData.hoverImageFile);
  }
  
  if (productData.imageFiles) {
    productData.imageFiles.forEach(file => {
      formData.append('images', file);
    });
  }
  
  const response = await api.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Actualizar producto con FormData
export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  
  // Agregar campos de texto
  Object.entries(productData).forEach(([key, value]) => {
    if (key !== 'mainImageFile' && key !== 'hoverImageFile' && key !== 'imageFiles') {
      formData.append(key, value);
    }
  });
  
  // Agregar archivos
  if (productData.mainImageFile) {
    formData.append('mainImage', productData.mainImageFile);
  }
  
  if (productData.hoverImageFile) {
    formData.append('hoverImage', productData.hoverImageFile);
  }
  
  if (productData.imageFiles) {
    productData.imageFiles.forEach(file => {
      formData.append('images', file);
    });
  }
  
  const response = await api.put(`/api/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Obtener productos destacados
export const getFeaturedProducts = async () => {
  const response = await api.get('/api/products/featured');
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};