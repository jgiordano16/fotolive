import { useState } from 'react';
import { Camera, MapPin, Type, Palette, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvent';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function CreateEventModal({ isOpen, onClose }) {
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

    if (!isOpen) return null;

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
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
            onClose(); // Cerrar modal al guardar exitosamente
        } catch (err) {
            alert(`Error al crear evento: ${err.message}`);
        } finally {
            setSaving(false);
            setForm({ // Reset form
                name: '', date: '', location: '', description: '', primaryColor: '#6366f1',
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 'var(--z-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
        }}>
            <div className="glass-card animate-scale-in" style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <button
                    onClick={onClose}
                    className="btn btn-icon btn-secondary"
                    style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 10 }}
                >
                    <X size={20} />
                </button>

                <div style={{ padding: 'var(--space-6) var(--space-8)', borderBottom: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: 'var(--text-2xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Camera size={24} color="var(--primary-400)" /> Crear nuevo evento
                    </h2>
                    <p style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                        Completá los datos y empezá a recibir fotos al instante
                    </p>
                </div>

                <form className="event-form" onSubmit={handleSubmit} style={{ padding: 'var(--space-6) var(--space-8)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>
                        <Type size={18} color="var(--primary-400)" /> Información básica
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                        <div className="input-group">
                            <label htmlFor="event-name">Nombre del evento *</label>
                            <input id="event-name" className="input" placeholder="Ej: Boda de Ana & Carlos" value={form.name} onChange={update('name')} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="input-group">
                                <label htmlFor="event-date">Fecha y hora *</label>
                                <input id="event-date" className="input" type="datetime-local" value={form.date} onChange={update('date')} required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="event-location">Ubicación</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
                                    <input id="event-location" className="input" placeholder="Salón, dirección..." value={form.location} onChange={update('location')} style={{ paddingLeft: 36, width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="event-desc">Descripción</label>
                            <textarea id="event-desc" className="input textarea" placeholder="Contá algo sobre el evento..." value={form.description} onChange={update('description')} style={{ minHeight: '80px' }} />
                        </div>
                    </div>

                    <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>
                        <Palette size={18} color="var(--accent-400)" /> Personalización
                    </h3>
                    <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
                        <label>Color principal</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                            {COLORS.map((c) => (
                                <div
                                    key={c}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                                        border: form.primaryColor === c ? '2px solid white' : '2px solid transparent',
                                        boxShadow: form.primaryColor === c ? '0 0 0 2px var(--primary-500)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => setForm({ ...form, primaryColor: c })}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--glass-border)' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Save size={18} /> {saving ? 'Guardando…' : 'Crear evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
