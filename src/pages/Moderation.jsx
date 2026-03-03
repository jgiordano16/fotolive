import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Clock, User, CheckCircle2, XCircle, AlertCircle, Filter, MonitorPlay, StopCircle, Plus, LayoutList } from 'lucide-react';
import { useMedia } from '../hooks/useMedia';
import { useEvent, updateEventDoc } from '../hooks/useEvent';
import { usePlaylists } from '../hooks/usePlaylists';

export default function Moderation() {
    const { eventId } = useParams();
    const [filter, setFilter] = useState('pending');
    const { event } = useEvent(eventId);
    const { playlists, createPlaylist } = usePlaylists(eventId);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
    const { media, loading, moderate } = useMedia(eventId, filter === 'all' ? null : filter);
    const [streamInput, setStreamInput] = useState('');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

    useEffect(() => {
        if (event?.liveStreamUrl && !streamInput) {
            setStreamInput(event.liveStreamUrl);
        }
    }, [event?.liveStreamUrl]);

    // Sincronizar selectedPlaylistId con el documento del evento
    useEffect(() => {
        if (event?.activePlaylistId) {
            setSelectedPlaylistId(event.activePlaylistId);
        } else if (playlists.length > 0 && !selectedPlaylistId) {
            // Si no hay seleccionada en el evento pero hay listas, tomamos la primera
            const firstId = playlists[0].id;
            setSelectedPlaylistId(firstId);
            updateEventDoc(eventId, { activePlaylistId: firstId });
        }
    }, [event?.activePlaylistId, playlists]);

    const handlePlaylistChange = (newId) => {
        setSelectedPlaylistId(newId);
        updateEventDoc(eventId, { activePlaylistId: newId });
    };

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

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            const docRef = await createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setShowCreatePlaylist(false);
            handlePlaylistChange(docRef.id);
        } catch (err) {
            console.error("Error creando playlist:", err);
        }
    };

    return (
        <div className="moderation-page">
            <div className="moderation-header">
                <div className="container moderation-header-inner" style={{ flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', textDecoration: 'none' }}>
                            <ArrowLeft size={16} /> Volver al inicio
                        </Link>
                        <h1 style={{ fontSize: 'var(--text-2xl)' }}>Moderación de contenido</h1>
                    </div>

                    {/* Gestión de Playlists */}
                    <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: '400px', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: 'var(--text-md)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--primary)' }}>
                                <LayoutList size={18} /> Playlists
                            </h3>
                            <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '4px 8px' }}
                                onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                            >
                                <Plus size={14} /> Crear
                            </button>
                        </div>

                        {showCreatePlaylist ? (
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nombre de la lista..."
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    style={{ flex: 1, height: '36px', fontSize: '14px' }}
                                    autoFocus
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleCreatePlaylist}>OK</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>Guardar aprobadas en:</span>
                                <select
                                    className="form-input"
                                    style={{ height: '36px', fontSize: '14px', background: 'rgba(0,0,0,0.2)' }}
                                    value={selectedPlaylistId}
                                    onChange={(e) => handlePlaylistChange(e.target.value)}
                                >
                                    {playlists.length === 0 && <option value="">No hay listas creadas</option>}
                                    {playlists.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Panel de Streaming — Solo Moderador */}
                    <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: '450px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: 'var(--text-md)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <MonitorPlay size={18} /> Streaming / Video
                            </h3>
                            {event?.liveStreamUrl && (
                                <span className="badge badge-error" style={{ animation: 'pulse 2s infinite' }}>🔴 En Vivo</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="URL Video/Stream"
                                value={streamInput}
                                onChange={(e) => setStreamInput(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            {event?.liveStreamUrl ? (
                                <button className="btn btn-secondary" onClick={handleStopStream} style={{ borderColor: 'var(--error)' }}>
                                    <StopCircle size={18} color="var(--error)" />
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleStartStream}>
                                    <MonitorPlay size={18} />
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
                                            <button className="mod-btn approve" onClick={() => moderate(item.id, 'approved', selectedPlaylistId)}>
                                                <Check size={16} /> Aprobar
                                            </button>
                                            <button className="mod-btn reject" onClick={() => moderate(item.id, 'rejected')}>
                                                <X size={16} /> Rechazar
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <span className={`badge ${item.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                                {item.status === 'approved' ? <><CheckCircle2 size={12} /> Aprobada</> : <><XCircle size={12} /> Rechazada</>}
                                            </span>
                                            {item.status === 'approved' && item.playlistIds && item.playlistIds.length > 0 && (
                                                <span style={{ fontSize: '10px', color: 'var(--neutral-400)' }}>
                                                    En: {playlists.find(p => p.id === item.playlistIds[0])?.name || 'Lista eliminada'}
                                                </span>
                                            )}
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
