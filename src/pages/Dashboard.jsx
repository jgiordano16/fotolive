import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Camera, Calendar, Users, Settings, LogOut,
    Plus, Eye, Tv, Shield, Trash2,
    Sun, Moon, User, Mail, Phone, Briefcase, Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvent';
import { useClients } from '../hooks/useClients';
import CreateEventModal from '../components/CreateEventModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { events, loading: eventsLoading, deleteEvent, updateEvent } = useEvents(user?.uid);
    const { clients, loading: clientsLoading, createClient, deleteClient, updateClient } = useClients(user?.uid);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Eventos');

    // States for New Client
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '' });
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);

    const sidebarItems = [
        { icon: Calendar, label: 'Eventos' },
        { icon: Users, label: 'Clientes' },
        { icon: Settings, label: 'Configuración' },
    ];

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
        if (window.confirm(`¿Estás seguro que querés eliminar el evento "${eventName}"?`)) {
            await deleteEvent(eventId);
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        if (!newClient.name) return;
        await createClient(newClient);
        setNewClient({ name: '', email: '', phone: '', company: '' });
        setIsClientModalOpen(false);
    };

    const handleLinkClientToEvent = async (eventId, clientId) => {
        await updateEvent(eventId, { clientId });
        alert('Evento vinculado al cliente correctamente.');
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
                    <button onClick={toggleTheme} className="btn btn-secondary btn-icon" style={{ width: 32, height: 32 }}>
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
                <ul className="sidebar-nav">
                    {sidebarItems.map((item) => (
                        <li
                            key={item.label}
                            className={`sidebar-item ${activeTab === item.label ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.label)}
                            style={{ cursor: 'pointer' }}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </li>
                    ))}
                </ul>
                <div className="sidebar-footer">
                    <div style={{ padding: 'var(--space-3 var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
                        {user?.email}
                    </div>
                    <div className="sidebar-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <LogOut size={18} />
                        Cerrar sesión
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>{activeTab}</h1>
                        <p>Gestioná tu plataforma de Fotolive</p>
                    </div>
                    {activeTab === 'Eventos' && (
                        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
                            <Plus size={18} /> Nuevo evento
                        </button>
                    )}
                    {activeTab === 'Clientes' && (
                        <button onClick={() => setIsClientModalOpen(true)} className="btn btn-primary">
                            <Plus size={18} /> Nuevo cliente
                        </button>
                    )}
                </div>

                {/* Tab: Eventos */}
                {activeTab === 'Eventos' && (
                    <div className="animate-fade-in">
                        {eventsLoading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>Cargando eventos…</div>
                        ) : events.length === 0 ? (
                            <div className="empty-state">
                                <h3>No hay eventos creados</h3>
                                <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">Crear mi primer evento</button>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {events.map((event) => (
                                    <div key={event.id} className="event-card">
                                        <div className="event-card-banner" style={{ height: 60 }}>
                                            <div className="event-card-banner-gradient" style={{ background: `linear-gradient(135deg, ${event.primaryColor || '#6366f1'}, #ec4899)` }} />
                                        </div>
                                        <div className="event-card-body">
                                            <h3>{event.name}</h3>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: 'var(--space-4)' }}>
                                                {clients.find(c => c.id === event.clientId)?.name ? (
                                                    <span style={{ color: 'var(--primary-400)' }}>👤 Cliente: {clients.find(c => c.id === event.clientId).name}</span>
                                                ) : 'Sin cliente vinculado'}
                                            </div>
                                            <div className="event-card-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <Link to={`/event/${event.id}`} className="btn btn-secondary btn-sm" title="Ver entrega" style={{ padding: '8px', display: 'flex' }}><Eye size={16} color="white" /></Link>
                                                <Link to={`/live/${event.id}`} className="btn btn-primary btn-sm" title="Proyectar" style={{ padding: '8px', display: 'flex' }}><Tv size={16} color="white" /></Link>
                                                <Link to={`/moderation/${event.id}`} className="btn btn-secondary btn-sm" title="Moderar" style={{ padding: '8px', display: 'flex' }}><Shield size={16} color="white" /></Link>
                                                <Link to={`/configuration/${event.id}`} className="btn btn-secondary btn-sm" title="Configurar Pantalla" style={{ padding: '8px', display: 'flex' }}><Settings size={16} color="white" /></Link>
                                                <select
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ width: '110px', padding: '4px', fontSize: '10px', height: '34px', color: 'white' }}
                                                    onChange={(e) => handleLinkClientToEvent(event.id, e.target.value)}
                                                    value={event.clientId || ''}
                                                >
                                                    <option value="" style={{ background: '#333' }}>👤 Vincular...</option>
                                                    {clients.map(c => <option key={c.id} value={c.id} style={{ background: '#333' }}>{c.name}</option>)}
                                                </select>
                                                <button onClick={() => handleEventDelete(event.id, event.name)} className="btn btn-secondary btn-sm" style={{ padding: '8px', display: 'flex' }} title="Eliminar"><Trash2 size={16} color="#ef4444" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Clientes */}
                {activeTab === 'Clientes' && (
                    <div className="animate-fade-in">
                        {clientsLoading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>Cargando clientes…</div>
                        ) : clients.length === 0 ? (
                            <div className="empty-state">
                                <Users size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
                                <h3>No tenés clientes registrados</h3>
                                <button onClick={() => setIsClientModalOpen(true)} className="btn btn-primary">Registrar primer cliente</button>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {clients.map((client) => (
                                    <div key={client.id} className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                            <div style={{ background: 'var(--primary-500)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0 }}>{client.name}</h3>
                                                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>{client.company || 'Empresa no especificada'}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--neutral-400)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} /> {client.email || 'Sin mail'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} /> {client.phone || 'Sin teléfono'}</div>
                                        </div>
                                        <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
                                            <button onClick={() => deleteClient(client.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--error-400)', flex: 1 }}>Borrar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Configuración */}
                {activeTab === 'Configuración' && (
                    <div className="animate-fade-in" style={{ maxWidth: 600 }}>
                        <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                            <h3 style={{ marginBottom: 'var(--space-6)' }}>Perfil del Organizador</h3>
                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div className="input-group">
                                    <label>Nombre Público</label>
                                    <input className="input" defaultValue={user?.displayName} />
                                </div>
                                <div className="input-group">
                                    <label>Email de contacto</label>
                                    <input className="input" defaultValue={user?.email} disabled />
                                </div>
                                <div className="input-group">
                                    <label>Idioma del Dashboard</label>
                                    <select className="input">
                                        <option>Español (Argentina)</option>
                                        <option>English</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            <CreateEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {isClientModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card animate-scale-in" style={{ maxWidth: 400 }}>
                        <h2>Registrar Cliente</h2>
                        <form onSubmit={handleCreateClient} style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                            <div className="input-group">
                                <label>Nombre completo *</label>
                                <input className="input" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input className="input" type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Teléfono</label>
                                <input className="input" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Empresa / Marca</label>
                                <input className="input" value={newClient.company} onChange={e => setNewClient({ ...newClient, company: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                                <button type="button" onClick={() => setIsClientModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
