import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout = ({ children, title = 'TripEase', description = 'Your ultimate trip planning companion', user, onLogout }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="app-container">
        <Header user={user} onLogout={onLogout} />
        
        <main className="main-content">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout;
