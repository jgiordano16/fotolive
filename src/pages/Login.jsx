import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.code === 'auth/invalid-credential' ? 'Email o contraseña incorrectos' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-scale-in">
                <Link to="/" className="navbar-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
                    <span className="logo-icon"><Camera size={20} color="white" /></span>
                    <span className="gradient-text">Fotolive</span>
                    <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>.app</span>
                </Link>
                <h1>Bienvenido de vuelta</h1>
                <p className="auth-subtitle">Ingresá a tu cuenta para gestionar tus eventos</p>
                {error && (
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--error-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        {error}
                    </div>
                )}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                            <input id="email" type="email" className="input" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 40 }} required />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                            <input id="password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 40 }} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Ingresando...' : <> Ingresar <ArrowRight size={18} /></>}
                    </button>
                </form>
                <div className="auth-footer">¿No tenés cuenta? <Link to="/register">Registrate gratis</Link></div>
            </div>
        </div>
    );
}
