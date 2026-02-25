import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, Download, Share2, QrCode, X, ChevronLeft, ChevronRight, Heart, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import { useMedia } from '../hooks/useMedia';

export default function Album() {
    const { eventId } = useParams();
    const { media, loading } = useMedia(eventId, 'approved');
    const [lightbox, setLightbox] = useState(null);
    const [showQR, setShowQR] = useState(false);

    const shareUrl = `${window.location.origin}/album/${eventId}`;

    const handleDownload = (url) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fotolive-photo.jpg';
        a.target = '_blank';
        a.click();
    };

    return (
        <div className="album-page">
            <Navbar />
            <div className="container">
                <div className="album-header animate-fade-in-up">
                    <Link to={`/dashboard`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Volver al inicio
                    </Link>
                    <h1>Álbum del <span className="gradient-text">Evento</span></h1>
                    <p>{loading ? 'Cargando…' : `${media.length} fotos compartidas por los invitados`}</p>
                    <div className="album-actions">
                        <button className="btn btn-secondary btn-sm"><Download size={16} /> Descargar todo</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowQR(!showQR)}>
                            <QrCode size={16} /> Compartir QR
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                            <Share2 size={16} /> Copiar link
                        </button>
                    </div>
                </div>

                {showQR && (
                    <div style={{ textAlign: 'center', margin: 'var(--space-6) 0' }} className="animate-scale-in">
                        <div className="glass-card" style={{ display: 'inline-block', padding: 'var(--space-6)' }}>
                            <QRCodeSVG value={shareUrl} size={160} bgColor="transparent" fgColor="white" level="H" />
                            <p style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>Escaneá para ver el álbum</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--neutral-400)' }}>Cargando fotos…</div>
                ) : media.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Camera size={32} /></div>
                        <h3>Sin fotos todavía</h3>
                        <p>Las fotos aprobadas por el organizador aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="photo-grid animate-fade-in-up delay-200">
                        {media.map((item, i) => (
                            <div key={item.id} className="photo-card" onClick={() => setLightbox(i)}>
                                {item.mediaType === 'video' ? (
                                    <video src={item.fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                ) : (
                                    <img src={item.fileUrl} alt={item.uploaderName} loading="lazy" />
                                )}
                                <div className="photo-card-overlay">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.uploaderName || 'Invitado'}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)' }}>
                                                {item.createdAt?.toDate?.()?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="photo-actions">
                                            <button className="btn btn-secondary btn-icon btn-sm" title="Me gusta" onClick={(e) => e.stopPropagation()}><Heart size={14} /></button>
                                            <button className="btn btn-secondary btn-icon btn-sm" title="Descargar" onClick={(e) => { e.stopPropagation(); handleDownload(item.fileUrl); }}><Download size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox !== null && media[lightbox] && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close btn btn-secondary btn-icon" onClick={() => setLightbox(null)}>
                        <X size={20} />
                    </button>
                    <div onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                        {media[lightbox].mediaType === 'video' ? (
                            <video src={media[lightbox].fileUrl} controls style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 'var(--radius-2xl)' }} />
                        ) : (
                            <img src={media[lightbox].fileUrl} alt="foto" style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 'var(--radius-2xl)', objectFit: 'contain' }} />
                        )}
                        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setLightbox(Math.max(0, lightbox - 1))}><ChevronLeft size={16} /> Anterior</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleDownload(media[lightbox].fileUrl)}><Download size={16} /> Descargar</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setLightbox(Math.min(media.length - 1, lightbox + 1))}>Siguiente <ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
