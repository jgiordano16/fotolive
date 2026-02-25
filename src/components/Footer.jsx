import { Link } from 'react-router-dom';
import { Camera, Instagram, Twitter, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="navbar-logo">
                            <span className="logo-icon"><Camera size={20} color="white" /></span>
                            <span className="gradient-text">Fotolive</span>
                            <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>.app</span>
                        </Link>
                        <p>Transformá tus eventos en experiencias digitales inolvidables con fotos y videos en tiempo real.</p>
                    </div>
                    <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                        <h4>Producto</h4>
                        <ul>
                            <li><a href="#features">Funciones</a></li>
                            <li><a href="#pricing">Precios</a></li>
                            <li><a href="#how">Cómo funciona</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacidad">Privacidad</Link></li>
                            <li><Link to="/terminos">Términos y Condiciones</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 Fotolive.app — Todos los derechos reservados</span>
                    <div className="footer-socials">
                        <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                        <a href="#" aria-label="Github"><Github size={16} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
