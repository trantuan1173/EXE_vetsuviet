import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { success } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    success('Đã thêm vào giỏ hàng!');
  };

  // Determine badge based on category or other criteria
  const getBadge = () => {
    if (product.category?.toLowerCase().includes('premium')) {
      return { text: 'PREMIUM EDITION', color: '#7d5713' };
    }
    if (product.category?.toLowerCase().includes('artifact') || 
        product.category?.toLowerCase().includes('cổ vật')) {
      return { text: 'ARTIFACT', color: '#4b0003' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div 
      className="overflow-hidden"
      style={{ 
        backgroundColor: '#f8f3eb',
        border: '1px solid #e8e1d3'
      }}
    >
      {/* Image Section with Badge */}
      <div className="relative" style={{ paddingBottom: '24px' }}>
        <div className="relative overflow-hidden" style={{ 
          borderRadius: '6px',
          height: '348px',
          margin: '25px 25px 0 25px'
        }}>
          <img 
            src={product.images[0].url} 
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#ffffff80' }}
          />
          
          {/* Badge Overlay */}
          {badge && (
            <div 
              className="absolute top-4 right-4 px-3 py-1 text-white text-[10px] font-bold tracking-wider"
              style={{ 
                backgroundColor: badge.color,
                borderRadius: '12px',
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '1px',
                lineHeight: '15px'
              }}
            >
              {badge.text}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '0 25px 25px 25px' }}>
        {/* Category Tag */}
        <div className="mb-2">
          <span 
            className="text-xs font-bold tracking-wider inline-block"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              color: '#7d5713',
              letterSpacing: '1.2px',
              lineHeight: '16px'
            }}
          >
            {product.category?.toUpperCase() || 'SẢN PHẨM'}
          </span>
        </div>

        {/* Product Title */}
        <h3 
          className="font-medium mb-2"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '32px',
            lineHeight: '40px',
            color: '#1d1c17'
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p 
          className="mb-6 line-clamp-3"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#57413f',
            paddingTop: '4px'
          }}
        >
          {product.description}
        </p>

        {/* Footer with Price/Stock and Button */}
        <div 
          className="pt-6 flex items-center justify-between"
          style={{ 
            borderTop: '1px solid #debfbc4d'
          }}
        >
          {/* Price/Stock Info */}
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z" fill="#7d5713"/>
            </svg>
            <span 
              className="font-bold"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#7d5713'
              }}
            >
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Action Button */}
          <button
            // onClick={handleAddToCart}
            onClick={() => window.open('https://www.facebook.com/people/V%E1%BA%BFt-S%E1%BB%AD-Vi%E1%BB%87t/61590322566391/', '_blank')}
            disabled={product.stock === 0}
            className="px-6 py-2 text-xs font-bold tracking-wider text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: '#6f0d0d',
              borderRadius: '2px',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '1.2px',
              lineHeight: '16px'
            }}
          >
            {product.stock > 0 ? 'MUA NGAY' : 'HẾT HÀNG'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;