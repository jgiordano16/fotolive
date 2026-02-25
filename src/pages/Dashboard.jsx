import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Camera, LayoutDashboard, Calendar, Image, Settings, LogOut,
    Plus, TrendingUp, Users, Download, Eye, ChevronRight, Tv, Shield, Trash2,
    Sun, Moon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvent';
import CreateEventModal from '../components/CreateEventModal'; // AGREGADO

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Eventos' },
    { icon: Image, label: 'Galería' },
    { icon: Users, label: 'Invitados' },
    { icon: Settings, label: 'Configuración' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { events, loading, deleteEvent } = useEvents(user?.uid);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // AGREGADO

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleEventDelete = async (eventId, eventName) => {
        if (window.confirm(`¿Estás seguro que querés eliminar el evento "${eventName}"? Esta acción no se puede deshacer.`)) {
            try {
                await deleteEvent(eventId);
            } catch (err) {
                console.error("Error al eliminar el evento:", err);
                alert("Hubo un error al eliminar el evento.");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
                    <Link to="/" className="sidebar-logo" style={{ marginBottom: 0 }}>
                        <span className="logo-icon" style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)' }}>
                            <Camera size={16} color="white" />
                        </span>
                        <span className="gradient-text">Fotolive</span>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-secondary btn-icon"
                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}
                        title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
                <ul className="sidebar-nav">
                    {sidebarItems.map((item) => (
                        <li key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`}>
                            <item.icon size={18} />
                            {item.label}
                        </li>
                    ))}
                </ul>
                <div className="sidebar-footer">
                    <div style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
                        {user?.email}
                    </div>
                    <div className="sidebar-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <LogOut size={18} />
                        Cerrar sesión
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Bienvenido, {user?.displayName || user?.email} 👋</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} /> Nuevo evento
                    </button>
                </div>

                {/* Metrics */}
                <div className="metrics-grid">
                    <div className="metric-card animate-fade-in-up">
                        <div className="metric-card-header">
                            <div className="metric-card-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary-400)' }}>
                                <Image size={20} />
                            </div>
                            <span className="metric-card-trend up"><TrendingUp size={12} /> En vivo</span>
                        </div>
                        <div className="metric-value">{loading ? '—' : events.reduce((a, e) => a + (e.photoCount || 0), 0)}</div>
                        <div className="metric-label">Fotos totales</div>
                    </div>
                    <div className="metric-card animate-fade-in-up delay-100">
                        <div className="metric-card-header">
                            <div className="metric-card-icon" style={{ background: 'rgba(236,72,153,0.15)', color: 'var(--accent-400)' }}>
                                <Users size={20} />
                            </div>
                            <span className="metric-card-trend up"><TrendingUp size={12} /> En vivo</span>
                        </div>
                        <div className="metric-value">{loading ? '—' : events.reduce((a, e) => a + (e.rsvpCount || 0), 0)}</div>
                        <div className="metric-label">Invitados RSVP</div>
                    </div>
                    <div className="metric-card animate-fade-in-up delay-200">
                        <div className="metric-card-header">
                            <div className="metric-card-icon" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success-400)' }}>
                                <Download size={20} />
                            </div>
                            <span className="metric-card-trend up"><TrendingUp size={12} /> En vivo</span>
                        </div>
                        <div className="metric-value">{loading ? '—' : events.reduce((a, e) => a + (e.downloadCount || 0), 0)}</div>
                        <div className="metric-label">Descargas</div>
                    </div>
                    <div className="metric-card animate-fade-in-up delay-300">
                        <div className="metric-card-header">
                            <div className="metric-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning-400)' }}>
                                <Eye size={20} />
                            </div>
                            <span className="metric-card-trend up"><TrendingUp size={12} /> En vivo</span>
                        </div>
                        <div className="metric-value">{loading ? '—' : events.length}</div>
                        <div className="metric-label">Eventos activos</div>
                    </div>
                </div>

                {/* Events */}
                <div className="events-section-header">
                    <h2 style={{ fontSize: 'var(--text-xl)' }}>Tus Eventos</h2>
                    <Link to="/event/create" className="btn btn-secondary btn-sm">
                        Ver todos <ChevronRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--neutral-400)' }}>
                        Cargando eventos…
                    </div>
                ) : events.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Calendar size={32} /></div>
                        <h3>No tenés eventos todavía</h3>
                        <p>Creá tu primer evento y empezá a recibir fotos en segundos</p>
                        <Link to="/event/create" className="btn btn-primary">
                            <Plus size={18} /> Crear evento
                        </Link>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map((event) => (
                            <div key={event.id} className="event-card animate-fade-in-up">
                                <div className="event-card-banner">
                                    <div className="event-card-banner-gradient" style={{ background: `linear-gradient(135deg, ${event.primaryColor || '#6366f1'}, #ec4899)` }} />
                                </div>
                                <div className="event-card-body">
                                    <h3>{event.name}</h3>
                                    <div className="event-card-date">
                                        {event.date?.toDate?.()?.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) || event.date}
                                    </div>
                                    <div className="event-card-stats">
                                        <span className="event-card-stat"><Image size={12} /> {event.photoCount || 0} fotos</span>
                                        <span className="event-card-stat"><Users size={12} /> {event.rsvpCount || 0} invitados</span>
                                    </div>
                                    <div className="event-card-actions">
                                        <Link to={`/event/${event.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                            <Eye size={14} /> Ver evento
                                        </Link>
                                        <Link to={`/live/${event.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                                            <Tv size={14} /> Proyectar
                                        </Link>
                                        <Link to={`/configuration/${event.id}`} className="btn btn-secondary btn-sm btn-icon" title="Configurar Pantalla">
                                            <Settings size={14} />
                                        </Link>
                                        <Link to={`/moderation/${event.id}`} className="btn btn-secondary btn-sm btn-icon" title="Moderar">
                                            <Shield size={14} />
                                        </Link>
                                        <button
                                            className="btn btn-secondary btn-sm btn-icon"
                                            title="Eliminar Evento"
                                            onClick={() => handleEventDelete(event.id, event.name)}
                                            style={{ color: 'var(--error-400)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
