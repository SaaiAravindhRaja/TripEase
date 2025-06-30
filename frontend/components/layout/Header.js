import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../ui/Button';

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const navigation = [
    { name: 'Home', href: '/', current: router.pathname === '/' },
    { name: 'Flights', href: '/flights', current: router.pathname === '/flights' },
  ];


  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div>
          <Link href="/" className="logo">
            TripEase
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${item.current ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user.name}!</span>
              <Button onClick={handleLogout} variant="secondary" size="small">
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/" className="nav-link">
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
