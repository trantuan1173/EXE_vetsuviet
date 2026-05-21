import { Link } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
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

  return (
    <Card hover>
      <Card.Image src={product.image} alt={product.name} />
      <Card.Body>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
        <h3 className="font-heading font-semibold text-lg text-gray-900 mt-2 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
          </span>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          {product.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
