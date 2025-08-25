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
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    material: '',
    color: '',
    gender: ''
  });
  
  // Referencias para los inputs de archivo
  const mainImageRef = useRef(null);
  const hoverImageRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const image4Ref = useRef(null);
  
  // Estados para los archivos de imagen
  const [mainImageFile, setMainImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [image3File, setImage3File] = useState(null);
  const [image4File, setImage4File] = useState(null);

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

  // Manejar cambio en las imágenes
  const handleImageChange = (e, setFileFunction, imageField) => {
    const file = e.target.files[0];
    if (file) {
      setFileFunction(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, [imageField]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const removeImage = (setFileFunction, imageField, ref) => {
    setFileFunction(null);
    setFormData(prev => ({ ...prev, [imageField]: '' }));
    resetFileInput(ref);
  };

  // Restablecer inputs de archivo
  const resetFileInput = (ref) => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar datos para enviar
    const submitData = {
      ...formData,
      mainImageFile,
      hoverImageFile,
      image1File,
      image2File,
      image3File,
      image4File
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

      {/* Nuevos campos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material (Opcional)
          </label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ej: Oro, Plata, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color (Opcional)
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ej: Dorado, Plateado, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género (Opcional)
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccionar género</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="unisex">Unisex</option>
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
            onChange={(e) => handleImageChange(e, setMainImageFile, 'mainImage')}
            className="w-full p-2 border rounded"
            accept="image/*"
            required={!initialData && formData.status === 'featured'}
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
                onClick={() => removeImage(setMainImageFile, 'mainImage', mainImageRef)}
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
            onChange={(e) => handleImageChange(e, setHoverImageFile, 'hoverImage')}
            className="w-full p-2 border rounded"
            accept="image/*"
            required={formData.status === 'featured' && !initialData}
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
                onClick={() => removeImage(setHoverImageFile, 'hoverImage', hoverImageRef)}
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
          Imagen 1 (Requerida)
        </label>
        <input
          ref={image1Ref}
          type="file"
          onChange={(e) => handleImageChange(e, setImage1File, 'image1')}
          className="w-full p-2 border rounded"
          accept="image/*"
          required={!initialData}
        />
        {formData.image1 && (
          <div className="mt-2 flex items-center">
            <img 
              src={formData.image1} 
              alt="Vista previa imagen 1" 
              className="w-32 h-32 object-contain"
            />
            <button
              type="button"
              onClick={() => removeImage(setImage1File, 'image1', image1Ref)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen 2 (Opcional)
        </label>
        <input
          ref={image2Ref}
          type="file"
          onChange={(e) => handleImageChange(e, setImage2File, 'image2')}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        {formData.image2 && (
          <div className="mt-2 flex items-center">
            <img 
              src={formData.image2} 
              alt="Vista previa imagen 2" 
              className="w-32 h-32 object-contain"
            />
            <button
              type="button"
              onClick={() => removeImage(setImage2File, 'image2', image2Ref)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen 3 (Opcional)
        </label>
        <input
          ref={image3Ref}
          type="file"
          onChange={(e) => handleImageChange(e, setImage3File, 'image3')}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        {formData.image3 && (
          <div className="mt-2 flex items-center">
            <img 
              src={formData.image3} 
              alt="Vista previa imagen 3" 
              className="w-32 h-32 object-contain"
            />
            <button
              type="button"
              onClick={() => removeImage(setImage3File, 'image3', image3Ref)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen 4 (Opcional)
        </label>
        <input
          ref={image4Ref}
          type="file"
          onChange={(e) => handleImageChange(e, setImage4File, 'image4')}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        {formData.image4 && (
          <div className="mt-2 flex items-center">
            <img 
              src={formData.image4} 
              alt="Vista previa imagen 4" 
              className="w-32 h-32 object-contain"
            />
            <button
              type="button"
              onClick={() => removeImage(setImage4File, 'image4', image4Ref)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        )}
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