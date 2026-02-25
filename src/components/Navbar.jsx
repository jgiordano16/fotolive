import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-inner">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon"><Camera size={20} color="white" /></span>
                        <span className="gradient-text">Fotolive</span>
                        <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>.app</span>
                    </Link>
                    <ul className="navbar-links">
                        <li><a href="#features">Funciones</a></li>
                        <li><a href="#how">Cómo funciona</a></li>
                        <li><a href="#pricing">Precios</a></li>
                    </ul>
                    <div className="navbar-actions">
                        <Link to="/login" className="btn btn-secondary btn-sm">Iniciar sesión</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Crear cuenta</Link>
                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {mobileOpen && (
                <div className="mobile-nav">
                    <button className="mobile-nav-close btn-icon" onClick={() => setMobileOpen(false)}>
                        <X size={24} />
                    </button>
                    <a href="#features" onClick={() => setMobileOpen(false)}>Funciones</a>
                    <a href="#how" onClick={() => setMobileOpen(false)}>Cómo funciona</a>
                    <a href="#pricing" onClick={() => setMobileOpen(false)}>Precios</a>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>Iniciar sesión</Link>
                    <Link to="/register" className="btn btn-primary btn-lg" onClick={() => setMobileOpen(false)}>Crear cuenta</Link>
                </div>
            )}
        </>
    );
}
