const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
        hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

const CardImage = ({ src, alt, className = '' }) => (
  <div className={`aspect-video overflow-hidden ${className}`}>
    <img
      src={src || 'https://placehold.co/400x225/DC2626/FFFFFF?text=VSV'}
      alt={alt}
      className="w-full h-full object-cover"
    />
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-4 py-3 border-t border-gray-100 ${className}`}>{children}</div>
);

Card.Image = CardImage;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
