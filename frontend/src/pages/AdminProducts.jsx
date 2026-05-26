import { useState, useEffect, useRef } from 'react';
import adminService from '../services/adminService';
import AdminLayout from '../components/Layout/AdminLayout';
import Loading from '../components/Common/Loading';
import { formatCurrency } from '../utils/formatters';

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 10,
  isPublished: false,
  courses: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(EMPTY_PRODUCT);
  const [savedProductId, setSavedProductId] = useState(null);

  // Multiple images state: array of { url, key } already uploaded
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCourses();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllProducts();
      const data = response.data.data;
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await adminService.getAllCourses({ limit: 100 });
      const data = response.data.data;
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleOpenForm = (product = null) => {
    if (product) {
      setCurrentProduct({
        ...product,
        courses: (product.courses || []).map((c) => (typeof c === 'object' ? c._id : c)),
      });
      setUploadedImages(product.images || []);
      setSavedProductId(product._id);
      setIsEditing(true);
    } else {
      setCurrentProduct(EMPTY_PRODUCT);
      setUploadedImages([]);
      setSavedProductId(null);
      setIsEditing(false);
    }
    setUploadProgress(0);
    document.getElementById('product-modal').classList.remove('hidden');
  };

  const handleCloseForm = () => {
    document.getElementById('product-modal').classList.add('hidden');
    setUploadedImages([]);
    setSavedProductId(null);
    setUploadProgress(0);
  };

  // Ensure product is saved first (create if new) and return productId
  const ensureProductSaved = async () => {
    if (savedProductId) return savedProductId;
    // Create product first to get an ID
    const payload = {
      name: currentProduct.name || 'Sản phẩm mới',
      description: currentProduct.description,
      price: currentProduct.price,
      category: currentProduct.category || 'Chung',
      stock: currentProduct.stock,
      isPublished: false,
      courses: currentProduct.courses,
    };
    const res = await adminService.createProduct(payload);
    const newId = res.data.data._id;
    setSavedProductId(newId);
    setIsEditing(true); // Switch to editing mode since product now exists
    return newId;
  };

  // Upload image immediately when file is selected
  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const productId = await ensureProductSaved();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i) / files.length) * 100));

        let uploadKey = null;
        let uploadId = null;

        try {
          // Init upload
          const initRes = await adminService.initProductImageUpload(productId, {
            fileName: file.name,
            contentType: file.type,
          });
          const { key, uploadId: uid, signedUrl } = initRes.data.data;
          uploadKey = key;
          uploadId = uid;

          // Upload to MinIO
          const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });
          const eTag = uploadRes.headers.get('ETag')?.replaceAll('"', '');

          // Complete upload
          const completeRes = await adminService.completeProductImageUpload(productId, {
            key,
            uploadId: uid,
            parts: [{ PartNumber: 1, ETag: eTag }],
          });

          const newImage = completeRes.data.data?.image;
          if (newImage) {
            setUploadedImages((prev) => [...prev, newImage]);
          }
        } catch (err) {
          console.error(`Upload failed for ${file.name}`, err);
          if (uploadKey && uploadId) {
            try {
              await adminService.abortProductImageUpload({ key: uploadKey, uploadId });
            } catch (_) {}
          }
          alert(`Tải ảnh "${file.name}" thất bại`);
        }
      }
      setUploadProgress(100);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete a single uploaded image
  const handleDeleteImage = async (imageKey) => {
    if (!savedProductId) return;
    if (!window.confirm('Bạn có chắc muốn xoá ảnh này?')) return;

    try {
      await adminService.deleteProductImage(savedProductId, { imageKey });
      setUploadedImages((prev) => prev.filter((img) => img.key !== imageKey));
    } catch (err) {
      console.error('Delete image failed', err);
      alert('Không thể xoá ảnh');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        category: currentProduct.category,
        stock: currentProduct.stock,
        isPublished: currentProduct.isPublished,
        courses: currentProduct.courses,
      };

      if (isEditing && savedProductId) {
        await adminService.updateProduct(savedProductId, payload);
      } else if (!savedProductId) {
        const res = await adminService.createProduct(payload);
        setSavedProductId(res.data.data._id);
      } else {
        // Product was auto-created for image upload, just update it
        await adminService.updateProduct(savedProductId, payload);
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

  const handleCourseToggle = (courseId) => {
    setCurrentProduct((prev) => {
      const exists = prev.courses.includes(courseId);
      return {
        ...prev,
        courses: exists ? prev.courses.filter((c) => c !== courseId) : [...prev.courses, courseId],
      };
    });
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Ảnh</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Danh mục</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Giá</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Kho</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Khóa học liên kết</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">Chưa có sản phẩm nào</td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product._id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {product.images && product.images.length > 0 ? (
                    <div className="flex -space-x-2">
                      {product.images.slice(0, 3).map((img, idx) => (
                        <img
                          key={img.key || idx}
                          src={img.url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border-2 border-white"
                        />
                      ))}
                      {product.images.length > 3 && (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-300 text-xs">
                      No img
                    </div>
                  )}
                </td>
                <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 text-green-600 font-medium">{formatCurrency(product.price)}</td>
                <td className="p-4 text-gray-700">{product.stock}</td>
                <td className="p-4">
                  {product.courses && product.courses.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.courses.map((c) => (
                        <span
                          key={typeof c === 'object' ? c._id : c}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                        >
                          {typeof c === 'object' ? c.title : c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {product.isPublished ? 'Đã đăng' : 'Ẩn'}
                  </span>
                </td>
                <td className="p-4 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenForm(product)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal Form */}
      <div
        id="product-modal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50 p-4"
      >
        <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VND) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục *</label>
                <input
                  type="text"
                  required
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, category: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Ví dụ: Sách, Vật dụng, Khóa học..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 h-24 resize-none"
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              {/* Image Upload - Multiple, immediate upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Ảnh sản phẩm</label>

                {/* Uploaded images gallery */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {uploadedImages.map((img) => (
                      <div key={img.key} className="relative group">
                        <img
                          src={img.url}
                          alt="product"
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.key)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xoá ảnh"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button & progress */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="border border-dashed border-gray-400 px-4 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {uploadingImage ? 'Đang tải...' : 'Thêm ảnh'}
                  </button>
                  <p className="text-xs text-gray-400">
                    Chọn 1 hoặc nhiều ảnh. Ảnh sẽ được tải lên ngay lập tức.
                  </p>
                </div>

                {uploadingImage && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Đang tải ảnh lên... {uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Linked Courses */}
              {courses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Khóa học liên kết</label>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {courses.map((course) => (
                      <label key={course._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentProduct.courses.includes(course._id)}
                          onChange={() => handleCourseToggle(course._id)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={currentProduct.isPublished}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, isPublished: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                  Đăng công khai
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
                >
                  {uploadingImage ? 'Đang xử lý...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;