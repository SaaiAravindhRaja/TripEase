import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

export default function Custom404() {
  return (
    <Layout title="Page Not Found - TripEase">
      <div className="error-page">
        <div className="error-content">
          <div className="error-icon">🔍</div>
          <h1 className="error-title">404</h1>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="error-actions">
            <Button
              onClick={() => window.location.href = '/'}
              variant="primary"
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="secondary"
              style={{ marginLeft: '12px' }}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
