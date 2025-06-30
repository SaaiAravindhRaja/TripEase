const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <h3>TripEase</h3>
          <p>
            Your one-stop solution for planning the perfect trip. Search flights, 
            book hotels, and create amazing itineraries all in one place.
          </p>
          <p>&copy; {currentYear} TripEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
