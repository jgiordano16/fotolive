import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
    Camera, MapPin, Navigation, Clock, Users, Upload,
    QrCode, CalendarCheck, Send, Image, ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEvent } from '../hooks/useEvent';
import { useUpload } from '../hooks/useMedia';
import { useRSVP } from '../hooks/useRSVP';

function CountdownTimer({ targetDate }) {
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) return;
            setTime({ days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), mins: Math.floor((diff / 60000) % 60), secs: Math.floor((diff / 1000) % 60) });
        };
        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, [targetDate]);
    return (
        <div className="countdown">
            {[{ val: time.days, label: 'Días' }, { val: time.hours, label: 'Horas' }, { val: time.mins, label: 'Min' }, { val: time.secs, label: 'Seg' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {i > 0 && <span className="countdown-separator">:</span>}
                    <div className="countdown-item">
                        <div className="countdown-number">{String(item.val).padStart(2, '0')}</div>
                        <div className="countdown-label">{item.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function EventPublic() {
    const { eventId } = useParams();
    const { event, loading: eventLoading } = useEvent(eventId);
    const { uploadFiles, progress, uploading } = useUpload(eventId, 'Invitado', event?.liveWallConfig?.autoApprove);
    const { submitRSVP } = useRSVP(eventId);

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [rsvp, setRsvp] = useState({ name: '', email: '', companions: 0, dietary: '' });
    const [rsvpSent, setRsvpSent] = useState(false);
    const [uploaderName, setUploaderName] = useState('');

    // La principal diferencia: Este QR envía directo al formulario minimalista en móvil
    const uploadUrl = `${window.location.origin}/qr/${eventId}`;

    const handleFiles = (newFiles) => {
        const arr = Array.from(newFiles);
        setFiles((p) => [...p, ...arr]);
        setPreviews((p) => [...p, ...arr.map((f) => URL.createObjectURL(f))]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        await uploadFiles(files, uploaderName);
        setFiles([]);
        setPreviews([]);
        alert('¡Fotos subidas exitosamente a Firestore! 🎉');
    };

    const handleRsvp = async (e) => {
        e.preventDefault();
        await submitRSVP(rsvp);
        setRsvpSent(true);
    };

    if (eventLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-950)' }}>
            <div style={{ color: 'var(--neutral-400)' }}>Cargando evento…</div>
        </div>
    );

    if (!event) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-950)' }}>
            <div style={{ color: 'var(--error-400)' }}>Evento no encontrado.</div>
        </div>
    );

    const eventDate = event.date ? new Date(event.date) : null;

    return (
        <div className="event-public">
            <Navbar />
            <div className="event-hero">
                <div className="event-hero-bg" style={{ background: `linear-gradient(135deg, ${event.primaryColor || '#6366f1'}, #ec4899, #1e1b4b)` }} />
                <div className="event-hero-content animate-fade-in-up">
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
                        <ArrowLeft size={16} /> Volver a Fotolive
                    </Link>
                    <div className="hero-badge"><CalendarCheck size={14} /> Estás invitado</div>
                    <h1>{event.name}</h1>
                    {eventDate && <div className="event-date-display"><Clock size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{eventDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>}
                    {eventDate && <CountdownTimer targetDate={event.date} />}
                    {event.description && <p style={{ color: 'var(--neutral-300)', maxWidth: 500, margin: '0 auto' }}>{event.description}</p>}
                </div>
            </div>

            <div className="event-sections container">
                {/* Upload */}
                <div className="event-section" id="upload">
                    <h2><Upload size={22} color="var(--primary-400)" /> Subí tus fotos</h2>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <input className="input" placeholder="Tu nombre (opcional)" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} style={{ maxWidth: 300 }} />
                    </div>
                    <div
                        className={`upload-area ${dragging ? 'dragging' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <div className="upload-area-icon"><Camera size={32} /></div>
                        <h3>Arrastrá tus fotos aquí</h3>
                        <p>o hacé clic para seleccionar</p>
                        <p style={{ marginTop: 8, color: 'var(--neutral-600)', fontSize: 'var(--text-xs)' }}>JPG, PNG, MP4 — máx. 20MB</p>
                        <input type="file" multiple accept="image/*,video/*" onChange={(e) => handleFiles(e.target.files)} />
                    </div>
                    {previews.length > 0 && (
                        <div className="upload-previews">
                            {previews.map((src, i) => (
                                <div key={i} className="upload-preview animate-scale-in">
                                    <img src={src} alt={`preview-${i}`} />
                                    <button className="upload-preview-remove" onClick={() => { setFiles(files.filter((_, j) => j !== i)); setPreviews(previews.filter((_, j) => j !== i)); }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {uploading && (
                        <div className="upload-progress" style={{ marginTop: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 6 }}>
                                <span>Subiendo…</span><span>{progress}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                        </div>
                    )}
                    {files.length > 0 && !uploading && (
                        <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-6)', width: '100%' }} onClick={handleUpload}>
                            <Upload size={18} /> Subir {files.length} {files.length === 1 ? 'archivo' : 'archivos'}
                        </button>
                    )}
                </div>

                {/* QR */}
                <div className="event-section qr-section">
                    <h2 style={{ justifyContent: 'center' }}><QrCode size={22} color="var(--accent-400)" /> Escaneá para subir fotos</h2>
                    <div className="qr-card glass-card">
                        <QRCodeSVG value={uploadUrl} size={200} bgColor="transparent" fgColor="white" level="H" style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-xl)' }} />
                        <p>Escaneá con tu celular para subir fotos y videos al instante</p>
                    </div>
                </div>

                {/* RSVP */}
                <div className="event-section" id="rsvp">
                    <h2><Users size={22} color="var(--success-400)" /> Confirmar asistencia</h2>
                    {rsvpSent ? (
                        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>🎉</div>
                            <h3>¡Gracias por confirmar!</h3>
                            <p style={{ color: 'var(--neutral-400)', marginTop: 'var(--space-2)' }}>Te esperamos en el evento</p>
                        </div>
                    ) : (
                        <form className="rsvp-form" onSubmit={handleRsvp}>
                            <div className="input-group">
                                <label>Nombre completo *</label>
                                <input className="input" placeholder="Tu nombre" value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input className="input" type="email" placeholder="tu@email.com" value={rsvp.email} onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Acompañantes</label>
                                <input className="input" type="number" min="0" max="10" value={rsvp.companions} onChange={(e) => setRsvp({ ...rsvp, companions: Number(e.target.value) })} />
                            </div>
                            <div className="input-group">
                                <label>Restricciones alimentarias</label>
                                <input className="input" placeholder="Ej: Celíaco, vegetariano..." value={rsvp.dietary} onChange={(e) => setRsvp({ ...rsvp, dietary: e.target.value })} />
                            </div>
                            <div className="full-width">
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    <Send size={18} /> Confirmar asistencia
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Location */}
                {event.location && (
                    <div className="event-section">
                        <h2><MapPin size={22} color="var(--error-400)" /> Ubicación</h2>
                        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--neutral-300)' }}>{event.location}</p>
                            <div className="location-buttons">
                                <a href={`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                    <MapPin size={16} /> Google Maps
                                </a>
                                <a href={`https://waze.com/ul?q=${encodeURIComponent(event.location)}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                    <Navigation size={16} /> Waze
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="event-section" style={{ textAlign: 'center', paddingBottom: 'var(--space-16)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={`/album/${eventId}`} className="btn btn-secondary"><Image size={16} /> Ver álbum</Link>
                        <Link to={`/interaction/${eventId}`} className="btn btn-secondary"><Users size={16} /> Interacción</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
