import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

function Error({ statusCode, hasGetInitialPropsRun, err }) {
  useEffect(() => {
    if (err) {
      // Log the error to your error reporting service
      console.error('Client-side error:', err);
    }
  }, [err]);

  const errorMessage = statusCode
    ? `A ${statusCode} error occurred on server`
    : 'An error occurred on client';

  const getErrorDescription = () => {
    switch (statusCode) {
      case 404:
        return "The page you're looking for doesn't exist.";
      case 500:
        return "Something went wrong on our end. We're working to fix it.";
      case 403:
        return "You don't have permission to access this resource.";
      case 401:
        return "You need to be logged in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <Layout>
      <div className="error-page">
        <div className="error-content">
          <div className="error-icon">
            {statusCode === 404 ? '🔍' : '⚠️'}
          </div>
          <h1 className="error-title">
            {statusCode || 'Error'}
          </h1>
          <p className="error-message">
            {getErrorDescription()}
          </p>
          <div className="error-actions">
            <Button
              onClick={() => window.location.href = '/'}
              variant="primary"
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              style={{ marginLeft: '12px' }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
