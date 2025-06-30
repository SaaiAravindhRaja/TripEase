const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  loading = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const getButtonClasses = () => {
    let classes = 'button';
    
    // Add variant classes
    if (variant === 'primary') classes += ' button-primary';
    else if (variant === 'secondary') classes += ' button-secondary';
    else if (variant === 'danger') classes += ' button-danger';
    
    // Add size classes
    if (size === 'small') classes += ' button-small';
    
    // Add custom className
    if (className) classes += ` ${className}`;
    
    return classes;
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loading-text">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
