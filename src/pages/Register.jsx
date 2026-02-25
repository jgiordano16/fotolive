import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Mail, Lock, User, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    // Auth form state
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Admin gate state (auto-unlock if coming from a successful MP payment)
    const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('status') === 'approved' || queryParams.get('status') === 'success';
    });
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [gateError, setGateError] = useState('');

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleGateSubmit = (e) => {
        e.preventDefault();
        setGateError('');
        if (adminUser === 'fotolive' && adminPass === 'Caseros305') {
            setIsAdminUnlocked(true);
        } else {
            setGateError('Credenciales de administrador incorrectas.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
        setLoading(true);
        try {
            await register(form.email, form.password, form.name);
            navigate('/dashboard');
        } catch (err) {
            setError(err.code === 'auth/email-already-in-use' ? 'Ya existe una cuenta con ese email' : err.message);
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

                {!isAdminUnlocked ? (
                    // ---------------- ADMIN GATE FORM ----------------
                    <>
                        <h1>Acceso Restringido</h1>
                        <p className="auth-subtitle">Ingresá clave de administrador para crear cuentas</p>
                        {gateError && (
                            <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--error-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                                {gateError}
                            </div>
                        )}
                        <form className="auth-form" onSubmit={handleGateSubmit}>
                            <div className="input-group">
                                <label htmlFor="adminUser">Usuario</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="adminUser" type="text" className="input" placeholder="Usuario admin" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="adminPass">Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <ShieldAlert size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="adminPass" type="password" className="input" placeholder="••••••••" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                Desbloquear Registro <ArrowRight size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    // ---------------- STANDARD REGISTRATION FORM ----------------
                    <>
                        <h1>Creá la cuenta</h1>
                        <p className="auth-subtitle">Empezá a crear eventos increíbles en minutos</p>
                        {error && (
                            <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--error-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                                {error}
                            </div>
                        )}
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="name">Nombre completo</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="name" type="text" className="input" placeholder="Tu nombre" value={form.name} onChange={update('name')} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="reg-email">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="reg-email" type="email" className="input" placeholder="tu@email.com" value={form.email} onChange={update('email')} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="reg-password">Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="reg-password" type="password" className="input" placeholder="Mínimo 8 caracteres" value={form.password} onChange={update('password')} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirm-password">Confirmar contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="confirm-password" type="password" className="input" placeholder="Repetí tu contraseña" value={form.confirmPassword} onChange={update('confirmPassword')} style={{ paddingLeft: 40 }} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Creando cuenta...' : <> Crear cuenta <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </>
                )}

                <div className="auth-footer" style={{ marginTop: '24px' }}>
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </div>
            </div>
        </div>
    );
}
