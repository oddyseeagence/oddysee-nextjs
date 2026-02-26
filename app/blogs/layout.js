import Link from 'next/link';
import Script from 'next/script';

const IMG_BASE = 'https://silver-chinchilla-534616.hostingersite.com/uploads/GET-ADS/images';

export default function BlogsLayout({ children }) {
  return (
    <>
      <link rel="stylesheet" href="/style.css" />

      <div style={{ background: '#ffffff', minHeight: 'auto', paddingTop: '92px', paddingBottom: '24px' }}>
        <div className="navbar" style={{ animation: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
          <div className="menu">
            <div>
              <img className="logo-img" src={`${IMG_BASE}/oddysse.svg`} alt="Oddysee" />
            </div>

            <div className="navbar-links">
              <a href="/" className="navbar-link">Accueil</a>
              <a href="/#solutions" className="navbar-link">Solutions</a>
              <a href="/#Services" className="navbar-link">Services</a>
              <Link href="/blogs" className="navbar-link">Blog</Link>
            </div>

            <button className="hamburger-menu" aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <a
              href="https://wa.me/message/TM6GNBIGFXI6G1"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-button"
            >
              Contactez-nous
            </a>
          </div>
        </div>

        <div className="mobile-menu">
          <a href="/" className="mobile-link">Accueil</a>
          <a href="/#solutions" className="mobile-link">Solutions</a>
          <a href="/#Services" className="mobile-link">Services</a>
          <a href="/#Équipe" className="mobile-link">Équipe</a>
          <a href="/#FAQ'S" className="mobile-link">FAQ'S</a>
          <Link href="/blogs" className="mobile-link">Blog</Link>
          <a href="/#Contact" className="mobile-link">Contact</a>
          <a
            href="https://wa.me/message/TM6GNBIGFXI6G1"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-button"
          >
            Contactez-nous
          </a>
        </div>

        <div style={{ width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img src={`${IMG_BASE}/footer-logo.svg`} alt="Oddysee" />
          </div>
          <div className="footer-content">
            <div className="footer-left">
              <ul className="footer-menu">
                <li><a href="/#solutions">Solutions</a></li>
                <li><a href="/#Services">Services</a></li>
                <li><a href="/blogs">Blog</a></li>
                <li><a href="/#Contact">Contact</a></li>
              </ul>
              <div className="footer-social">
                <a href="https://www.instagram.com/oddysee.agence/" target="_blank" rel="noopener noreferrer"><img src={`${IMG_BASE}/footer_instagram.svg`} alt="Instagram" /></a>
                <a href="https://www.linkedin.com/company/oddyse/" target="_blank" rel="noopener noreferrer"><img src={`${IMG_BASE}/footer_linkedin.svg`} alt="LinkedIn" /></a>
                <a href="https://www.facebook.com/oddysee.fr" target="_blank" rel="noopener noreferrer"><img src={`${IMG_BASE}/footer_facebook.svg`} alt="Facebook" /></a>
                <a href="https://www.tiktok.com/@oddysee.fr" target="_blank" rel="noopener noreferrer"><img src={`${IMG_BASE}/footer_tiktok.svg`} alt="TikTok" /></a>
                <a href="https://www.snapchat.com/@oddysee.fr" target="_blank" rel="noopener noreferrer"><img src={`${IMG_BASE}/footer_snapchat.svg`} alt="Snapchat" /></a>
              </div>
            </div>
            <div className="footer-right">
              <a href="https://wa.me/message/TM6GNBIGFXI6G1" target="_blank" rel="noopener noreferrer" className="footer-btn">
                Parler à un expert
                <img src={`${IMG_BASE}/footer-icon.svg`} alt="" />
              </a>
              <p className="footer-text">
                Prêt à passer au niveau supérieur ? <br />
                Parlez gratuitement avec un expert pour <br />
                clarifier vos besoins et vos opportunités.
              </p>
            </div>
          </div>
          <p className="footer-copy">©2026 Oddysee | Tous droits réservés.</p>
        </div>
      </footer>

      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
