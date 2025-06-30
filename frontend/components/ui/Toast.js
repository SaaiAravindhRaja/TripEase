import { useState } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  const iconStyles = {
    info: '🛈',
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div className={`toast toast-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>{iconStyles[type]}</span>
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: '16px',
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: '0.8'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const hideToast = () => {
    setToast(null);
  };

  const ToastContainer = () => (
    toast ? (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    ) : null
  );

  return {
    showToast,
    hideToast,
    ToastContainer
  };
};

export default Toast;
export { Toast, useToast };
