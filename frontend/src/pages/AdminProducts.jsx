import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';
import { formatCurrency } from '../utils/formatters';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stock: 10
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllProducts();
      const data = response.data.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        stock: 10
      });
      setIsEditing(false);
    }
    document.getElementById('product-modal').classList.remove('hidden');
  };

  const handleCloseForm = () => {
    document.getElementById('product-modal').classList.add('hidden');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminService.updateProduct(currentProduct._id, currentProduct);
      } else {
        await adminService.createProduct(currentProduct);
      }
      handleCloseForm();
      fetchProducts();
    } catch (err) {
      alert('Không thể lưu sản phẩm');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await adminService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Không thể xóa sản phẩm');
    }
  };

  if (loading) return <AdminLayout><Loading /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => handleOpenForm()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Kho</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-t">
                <td className="p-4">
                  <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 text-green-600">{formatCurrency(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleOpenForm(product)} className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal Form */}
      <div id="product-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
              <input
                type="text"
                required
                value={currentProduct.name}
                onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                <input
                  type="number"
                  required
                  value={currentProduct.price}
                  onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số lượng kho</label>
                <input
                  type="number"
                  required
                  value={currentProduct.stock}
                  onChange={e => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <input
                type="text"
                required
                value={currentProduct.category}
                onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh URL</label>
              <input
                type="text"
                value={currentProduct.imageUrl}
                onChange={e => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={currentProduct.description}
                onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                className="w-full border p-2 rounded h-24"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={handleCloseForm} className="border px-4 py-2 rounded">Hủy</button>
              <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
