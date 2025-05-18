import React, { useState, useEffect, useRef } from 'react';

// Define Product interface with array of images
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string[]; // Array to support multiple images
  discount?: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [images, setImages] = useState<string[]>([]); // Array for multiple images
  const [discount, setDiscount] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
      alert('Lưu trữ sản phẩm thất bại do giới hạn bộ nhớ.');
    }
  }, [products]);

  // Handle multiple file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validImages: string[] = [];

      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          alert(`Tệp ${file.name} không phải là hình ảnh.`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`Hình ảnh ${file.name} quá lớn. Vui lòng chọn tệp dưới 5MB.`);
          continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            validImages.push(reader.result);
            if (validImages.length === fileArray.length) {
              setImages(validImages); // Update state when all files are processed
            }
          }
        };
        reader.onerror = () => {
          alert(`Lỗi khi đọc tệp ${file.name}.`);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const parsedDiscount = discount ? Number(discount) : undefined;

    // Validation
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('Giá phải là một số không âm.');
      return;
    }
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert('Số lượng phải là một số không âm.');
      return;
    }
    if (!name.trim()) {
      alert('Tên sản phẩm không được để trống.');
      return;
    }
    if (parsedDiscount !== undefined && (parsedDiscount < 0 || parsedDiscount > 100)) {
      alert('Giảm giá phải từ 0 đến 100%.');
      return;
    }

    if (editId !== null) {
      setProducts(
        products.map((product) =>
          product.id === editId
            ? { ...product, name, price: parsedPrice, quantity: parsedQuantity, image: images.length > 0 ? images : product.image, discount: parsedDiscount }
            : product
        )
      );
      setEditId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        price: parsedPrice,
        quantity: parsedQuantity,
        image: images.length > 0 ? images : undefined,
        discount: parsedDiscount,
      };
      setProducts([...products, newProduct]);
    }
    // Reset form
    setName('');
    setPrice('');
    setQuantity('');
    setImages([]);
    setDiscount('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setQuantity(product.quantity.toString());
    setImages(product.image || []);
    setDiscount(product.discount?.toString() || '');
    setEditId(product.id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Statistics
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.quantity > 0).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <section id="products" className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Quản lý sản phẩm</h2>

      {/* Product Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Tổng số sản phẩm */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 border border-gray-100">
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4m0 0v10"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng số sản phẩm</p>
            <p className="text-2xl font-semibold text-gray-900">{totalProducts.toLocaleString()}</p>
          </div>
        </div>

        {/* Card 2: Sản phẩm còn hàng */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 border border-gray-100">
          <div className="p-2 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sản phẩm còn hàng</p>
            <p className="text-2xl font-semibold text-gray-900">{inStock.toLocaleString()}</p>
          </div>
        </div>

        {/* Card 3: Sản phẩm hết hàng */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 border border-gray-100">
          <div className="p-2 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sản phẩm hết hàng</p>
            <p className="text-2xl font-semibold text-gray-900">{outOfStock.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4">
          {editId !== null ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tên sản phẩm</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Giá</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Số lượng</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              multiple // Enable multiple file selection
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              ref={fileInputRef}
            />
            {images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm">Xem trước:</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Giảm giá (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editId !== null ? 'Cập nhật' : 'Thêm'}
            </button>
            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName('');
                  setPrice('');
                  setQuantity('');
                  setImages([]);
                  setDiscount('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Danh sách sản phẩm</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Tên</th>
              <th className="p-2 text-left">Giá</th>
              <th className="p-2 text-left">Số lượng</th>
              <th className="p-2 text-left">Hình ảnh</th>
              <th className="p-2 text-left">Giảm giá</th>
              <th className="p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-2 text-center">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.price.toLocaleString()}₫</td>
                  <td className="p-2">{product.quantity}</td>
                  <td className="p-2">
                    {product.image && product.image.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {product.image.slice(0, 3).map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                        {product.image.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{product.image.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="p-2">{product.discount ? `${product.discount}%` : 'N/A'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductManagement;