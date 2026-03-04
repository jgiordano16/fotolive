import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Folder, Download, Share2, ArrowLeft, Image as ImageIcon,
    FileArchive, ExternalLink, Clock, User
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';
import { useEvent } from '../hooks/useEvent';
import { useMedia } from '../hooks/useMedia';

export default function EventPublic() {
    const { eventId } = useParams();
    const { event, loading: eventLoading } = useEvent(eventId);
    const { media, loading: mediaLoading } = useMedia(eventId, 'approved');
    const [downloading, setDownloading] = useState(false);

    const generateZipBlob = async () => {
        const zip = new JSZip();
        const folderName = event?.name?.replace(/[^a-z0-9]/gi, '_') || 'evento';
        const imgFolder = zip.folder(folderName);

        // Descargar cada archivo y añadirlo al zip
        const promises = media.map(async (item, index) => {
            const response = await fetch(item.fileUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('CORS');
            const blob = await response.blob();
            const extension = item.mediaType === 'video' ? 'mp4' : 'jpg';
            imgFolder.file(`foto_${index + 1}.${extension}`, blob);
        });

        await Promise.all(promises);
        return await zip.generateAsync({ type: 'blob' });
    };

    const handleShare = async () => {
        if (media.length === 0 || downloading) return;

        try {
            setDownloading(true);
            const blob = await generateZipBlob();
            const folderName = event?.name?.replace(/[^a-z0-9]/gi, '_') || 'evento';
            const file = new File([blob], `${folderName}.zip`, { type: 'application/zip' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Fotos de ${event?.name}`,
                    text: 'Aquí tienes todas las fotos del evento.',
                });
            } else {
                // Fallback si no admite archivos
                const zipUrl = URL.createObjectURL(blob);
                saveAs(blob, `${folderName}.zip`);
                alert('Tu navegador no permite compartir archivos directamente. He descargado el ZIP por ti.');
            }
        } catch (err) {
            console.error("Error sharing zip:", err);
            // Fallback al link
            navigator.clipboard.writeText(window.location.href); // Using window.location.href as fallback
            alert('No se pudo generar el archivo para compartir. Link copiado.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadAll = async () => {
        if (media.length === 0 || downloading) return;

        setDownloading(true);
        alert(`Iniciando descarga de ${media.length} archivos...`);

        try {
            const blob = await generateZipBlob();
            const folderName = event?.name?.replace(/[^a-z0-9]/gi, '_') || 'evento';
            saveAs(blob, `${folderName}.zip`);
        } catch (err) {
            console.log("Falling back to sequential download...");
            for (const item of media) {
                const link = document.createElement('a');
                link.href = item.fileUrl;
                link.download = item.fileUrl.split('/').pop();
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                await new Promise(r => setTimeout(r, 300));
            }
            alert("Descarga completada");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadSingle = (url) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fotolive-photo.jpg';
        a.target = '_blank';
        a.click();
    };

    if (eventLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-950)' }}>
            <div style={{ color: 'var(--neutral-400)' }}>Cargando galería…</div>
        </div>
    );

    if (!event) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-950)' }}>
            <div style={{ color: 'var(--error-400)' }}>Evento no encontrado.</div>
        </div>
    );

    return (
        <div className="event-public">
            <Navbar />

            <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
                <div className="animate-fade-in-up">
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Volver al panel
                    </Link>

                    {/* Folder Header */}
                    <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)', borderLeft: '4px solid var(--primary-500)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: 'var(--radius-xl)', color: 'var(--primary-400)' }}>
                                <Folder size={48} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-1)', margin: 0 }}>{event.name}</h1>
                                <p style={{ color: 'var(--neutral-400)', margin: 0 }}>
                                    {mediaLoading ? 'Calculando archivos...' : `${media.length} archivos totales`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                <button className="btn btn-primary" onClick={handleDownloadAll} disabled={downloading}>
                                    <FileArchive size={18} /> {downloading ? 'Procesando...' : 'Descargar todo (.zip)'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Photos Grid */}
                    {mediaLoading ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--neutral-400)' }}>Explorando carpeta…</div>
                    ) : media.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><ImageIcon size={32} /></div>
                            <h3>La carpeta está vacía</h3>
                            <p>No se han encontrado fotos aprobadas en este evento.</p>
                        </div>
                    ) : (
                        <div className="photo-grid">
                            {media.map((item) => (
                                <div key={item.id} className="photo-card" style={{ height: '300px' }}>
                                    {item.mediaType === 'video' ? (
                                        <video src={item.fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                    ) : (
                                        <img src={item.fileUrl} alt={item.uploaderName} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                    <div className="photo-card-overlay">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <User size={12} /> {item.uploaderName || 'Invitado'}
                                                </div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={12} /> {item.createdAt?.toDate?.()?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="photo-actions">
                                                <button
                                                    className="btn btn-secondary btn-icon btn-sm"
                                                    title="Descargar"
                                                    onClick={() => handleDownloadSingle(item.fileUrl)}
                                                >
                                                    <Download size={14} />
                                                </button>
                                                <a
                                                    href={item.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-icon btn-sm"
                                                    title="Ver original"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
