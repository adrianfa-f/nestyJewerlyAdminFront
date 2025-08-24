import React, { useState, useRef } from 'react';

const ProductForm = ({ initialData, onSubmit, isSubmitting }) => {
  // Inicializar estado con datos iniciales o valores por defecto
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    sku: '',
    stock: '',
    category: 'Anillos compromiso',
    status: 'active',
    mainImage: '',
    hoverImage: '',
    images: []
  });
  
  // Referencias para los inputs de archivo
  const mainImageRef = useRef(null);
  const hoverImageRef = useRef(null);
  const additionalImagesRef = useRef(null);
  
  // Estados para los archivos de imagen
  const [mainImageFile, setMainImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  // Categorías actualizadas
  const categories = [
    'Anillos compromiso',
    'Anillos matrimonio',
    'Collares y cadenas',
    'Pulseras y brazaletes',
    'Aretes y pendientes',
    'Dijes y charms',
    'Broches y alfileres'
  ];

  // Manejar cambios en los inputs de texto/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si el campo que cambia es "status"
    if (name === 'status' && value === 'active') {
      // Limpiar imágenes si se vuelve a "active"
      setFormData(prev => ({
        ...prev,
        status: value,
        mainImage: '',
        hoverImage: ''
      }));
      // También puedes limpiar los archivos referenciados si usas FileReader
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (hoverImageRef.current) hoverImageRef.current.value = '';
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejar cambio en la imagen principal
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      
      // Crear una URL local para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, mainImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar cambio en la imagen de hover
  const handleHoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHoverImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, hoverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar cambio en las imágenes adicionales
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImageFiles(files);
      
      // Crear URLs locales para vista previa
      const newImages = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev.images, ...newImages] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Eliminar una imagen adicional
  const removeAdditionalImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newFiles = [...additionalImageFiles];
    newFiles.splice(index, 1);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setAdditionalImageFiles(newFiles);
  };

  // Restablecer inputs de archivo
  const resetFileInput = (ref) => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  // Eliminar imagen principal
  const removeMainImage = () => {
    setMainImageFile(null);
    setFormData(prev => ({ ...prev, mainImage: '' }));
    resetFileInput(mainImageRef);
  };

  // Eliminar imagen hover
  const removeHoverImage = () => {
    setHoverImageFile(null);
    setFormData(prev => ({ ...prev, hoverImage: '' }));
    resetFileInput(hoverImageRef);
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar datos para enviar
    const submitData = {
      ...formData,
      mainImageFile,
      hoverImageFile,
      imageFiles: additionalImageFiles
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (€)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="active">Activo</option>
            <option value="featured">Destacado (Home)</option>
          </select>
      </div>
      
      {formData.status === 'featured' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen Principal (Home)
          </label>
          <input
            ref={mainImageRef}
            type="file"
            name="mainImage"
            onChange={handleMainImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
          {formData.mainImage && (
            <div className="mt-2 flex items-center">
              <img 
                src={formData.mainImage} 
                alt="Vista previa imagen principal" 
                className="w-32 h-32 object-contain"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      )}

      
      {formData.status === 'featured' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen Hover (Home - Opcional)
          </label>
          <input
            ref={hoverImageRef}
            type="file"
            name="hoverImage"
            onChange={handleHoverImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
          {formData.hoverImage && (
            <div className="mt-2 flex items-center">
              <img 
                src={formData.hoverImage} 
                alt="Vista previa imagen hover" 
                className="w-32 h-32 object-contain"
              />
              <button
                type="button"
                onClick={removeHoverImage}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      )}

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imágenes Adicionales (Detalle del producto)
        </label>
        <input
          ref={additionalImagesRef}
          type="file"
          multiple
          onChange={handleAdditionalImagesChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        <div className="mt-2 flex gap-2 flex-wrap">
          {formData.images.map((img, index) => (
            <div key={index} className="relative">
              <img 
                src={img} 
                alt={`Imagen ${index + 1}`} 
                className="w-16 h-16 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeAdditionalImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`bg-emerald-600 text-white px-6 py-2 rounded ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
        }`}
      >
        {initialData ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );
};

export default ProductForm;