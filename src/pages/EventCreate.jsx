import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Camera, ArrowLeft, MapPin, Type, Palette, Save
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvent';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function EventCreate() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createEvent } = useEvents(user?.uid);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '',
        date: '',
        location: '',
        description: '',
        primaryColor: '#6366f1',
    });

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        setSaving(true);
        try {
            await createEvent({
                name: form.name,
                date: form.date,
                location: form.location,
                description: form.description,
                primaryColor: form.primaryColor,
                photoCount: 0,
                rsvpCount: 0,
                downloadCount: 0,
            });
            navigate('/dashboard');
        } catch (err) {
            alert(`Error al crear evento: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="event-create-page">
            <nav className="navbar scrolled" style={{ position: 'fixed', background: 'rgba(10,10,10,0.9)' }}>
                <div className="container navbar-inner">
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>
                        <ArrowLeft size={18} /> Volver al dashboard
                    </Link>
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon"><Camera size={20} color="white" /></span>
                        <span className="gradient-text">Fotolive</span>
                    </Link>
                </div>
            </nav>
            <div className="event-create-container">
                <div className="event-create-header animate-fade-in-up">
                    <h1>Crear nuevo evento</h1>
                    <p>Completá los datos y empezá a recibir fotos al instante</p>
                </div>
                <form className="event-form animate-fade-in-up delay-200" onSubmit={handleSubmit}>
                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Type size={18} color="var(--primary-400)" /> Información básica
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            <div className="input-group">
                                <label htmlFor="event-name">Nombre del evento *</label>
                                <input id="event-name" className="input" placeholder="Ej: Boda de Ana & Carlos" value={form.name} onChange={update('name')} required />
                            </div>
                            <div className="event-form-row">
                                <div className="input-group">
                                    <label htmlFor="event-date">Fecha y hora *</label>
                                    <input id="event-date" className="input" type="datetime-local" value={form.date} onChange={update('date')} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="event-location">Ubicación</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                        <input id="event-location" className="input" placeholder="Salón, dirección..." value={form.location} onChange={update('location')} style={{ paddingLeft: 36 }} />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="event-desc">Descripción</label>
                                <textarea id="event-desc" className="input textarea" placeholder="Contá algo sobre el evento..." value={form.description} onChange={update('description')} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Palette size={18} color="var(--accent-400)" /> Personalización
                        </h3>
                        <div className="input-group">
                            <label>Color principal</label>
                            <div className="color-picker-row">
                                {COLORS.map((c) => (
                                    <div
                                        key={c}
                                        className={`color-swatch ${form.primaryColor === c ? 'selected' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => setForm({ ...form, primaryColor: c })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="event-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancelar</button>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            <Save size={18} /> {saving ? 'Guardando…' : 'Crear evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
