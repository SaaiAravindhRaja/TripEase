// frontend/pages/_app.js
import '../styles/globals.css'; // This is the crucial line

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;