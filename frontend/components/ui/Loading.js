const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loading ${className}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

const LoadingCard = ({ message = 'Loading...' }) => {
  return (
    <div className="card">
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

const Loading = ({ message = 'Loading...', type = 'default' }) => {
  if (type === 'card') {
    return <LoadingCard message={message} />;
  }
  
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
export { LoadingSpinner, LoadingCard };
