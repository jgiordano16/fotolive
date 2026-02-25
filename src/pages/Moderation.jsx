import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Clock, User, CheckCircle2, XCircle, AlertCircle, Filter, MonitorPlay, StopCircle } from 'lucide-react';
import { useMedia } from '../hooks/useMedia';
import { useEvent, updateEventDoc } from '../hooks/useEvent';

export default function Moderation() {
    const { eventId } = useParams();
    const [filter, setFilter] = useState('pending');
    const { media, loading, moderate } = useMedia(eventId, filter === 'all' ? null : filter);
    const { event } = useEvent(eventId);
    const [streamInput, setStreamInput] = useState('');

    useEffect(() => {
        if (event?.liveStreamUrl && !streamInput) {
            setStreamInput(event.liveStreamUrl);
        }
    }, [event?.liveStreamUrl]);

    const handleStartStream = async () => {
        if (!streamInput.trim()) return;
        try {
            await updateEventDoc(eventId, { liveStreamUrl: streamInput.trim() });
        } catch (err) {
            console.error("Error iniciando stream:", err);
        }
    };

    const handleStopStream = async () => {
        try {
            await updateEventDoc(eventId, { liveStreamUrl: '' });
            setStreamInput('');
        } catch (err) {
            console.error("Error deteniendo stream:", err);
        }
    };

    return (
        <div className="moderation-page">
            <div className="moderation-header">
                <div className="container moderation-header-inner" style={{ flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', textDecoration: 'none' }}>
                            <ArrowLeft size={16} /> Volver al inicio
                        </Link>
                        <h1 style={{ fontSize: 'var(--text-2xl)' }}>Moderación de contenido</h1>
                    </div>

                    {/* Panel de Streaming — Solo Moderador */}
                    <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: '700px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: 'var(--text-md)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <MonitorPlay size={18} /> Proyectar Streaming / Video
                            </h3>
                            {event?.liveStreamUrl && (
                                <span className="badge badge-error" style={{ animation: 'pulse 2s infinite' }}>🔴 En Vivo</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="URL de Twitch, YouTube, MP4, etc."
                                value={streamInput}
                                onChange={(e) => setStreamInput(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            {event?.liveStreamUrl ? (
                                <button className="btn btn-secondary" onClick={handleStopStream} style={{ borderColor: 'var(--error)' }}>
                                    <StopCircle size={18} color="var(--error)" /> Detener
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleStartStream}>
                                    <MonitorPlay size={18} /> Proyectar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="moderation-filters" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        {[
                            { key: 'all', label: 'Todo', icon: Filter },
                            { key: 'pending', label: 'Pendiente', icon: AlertCircle },
                            { key: 'approved', label: 'Aprobado', icon: CheckCircle2 },
                            { key: 'rejected', label: 'Rechazado', icon: XCircle },
                        ].map((f) => (
                            <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                                <f.icon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--neutral-400)' }}>Cargando contenido…</div>
                ) : media.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Filter size={32} /></div>
                        <h3>Sin contenido</h3>
                        <p>No hay fotos con este filtro todavía</p>
                    </div>
                ) : (
                    <div className="moderation-grid">
                        {media.map((item) => (
                            <div key={item.id} className="moderation-card animate-fade-in-up">
                                <div className="moderation-card-img">
                                    {item.mediaType === 'video' ? (
                                        <video src={item.fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={item.fileUrl} alt={item.uploaderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                                <div className="moderation-card-body">
                                    <div className="moderation-card-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} /> {item.uploaderName || 'Invitado'}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} /> {item.createdAt?.toDate?.()?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) || '—'}
                                        </span>
                                    </div>
                                    {item.status === 'pending' ? (
                                        <div className="moderation-actions">
                                            <button className="mod-btn approve" onClick={() => moderate(item.id, 'approved')}>
                                                <Check size={16} /> Aprobar
                                            </button>
                                            <button className="mod-btn reject" onClick={() => moderate(item.id, 'rejected')}>
                                                <X size={16} /> Rechazar
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <span className={`badge ${item.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                                {item.status === 'approved' ? <><CheckCircle2 size={12} /> Aprobada</> : <><XCircle size={12} /> Rechazada</>}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
