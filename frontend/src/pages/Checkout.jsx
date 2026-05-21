import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import orderService from '../services/orderService';
import Button from '../components/Common/Button';
import { formatCurrency } from '../utils/formatters';
import { PAYMENT_METHODS } from '../utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { success, error } = useNotification();

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    paymentMethod: 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
    }
    if (!form.shippingPhone.trim()) {
      newErrors.shippingPhone = 'Vui lòng nhập số điện thoại';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: form.shippingAddress,
        shippingPhone: form.shippingPhone,
        paymentMethod: form.paymentMethod,
      };

      const response = await orderService.createOrder(orderData);
      success('Đặt hàng thành công!');
      clearCart();
      navigate(`/orders/${response.data.data._id}`);
    } catch (err) {
      error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">
                  Thông tin giao hàng
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      name="shippingAddress"
                      value={form.shippingAddress}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.shippingAddress ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="shippingPhone"
                      value={form.shippingPhone}
                      onChange={handleChange}
                      placeholder="0912345678"
                      className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.shippingPhone ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.shippingPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.shippingPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-heading font-semibold text-lg mb-4">Đơn hàng</h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
