import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, Mic, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useEvent } from '../hooks/useEvent';
import { useUpload } from '../hooks/useMedia';

export default function EventMobile() {
    const { eventId } = useParams();
    const { event, loading: eventLoading } = useEvent(eventId);
    const { uploadFiles, progress, uploading } = useUpload(eventId, 'Invitado', event?.liveWallConfig?.autoApprove);
    const fileInputRef = useRef(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        await uploadFiles(files);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
    };

    if (eventLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-900)' }}>
            <div style={{ color: 'var(--neutral-400)' }}>Cargando evento…</div>
        </div>
    );

    if (!event) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-900)' }}>
            <div style={{ color: 'var(--error-400)' }}>Evento no encontrado.</div>
        </div>
    );

    const primaryColor = event.primaryColor || '#db6b6b';

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(to bottom, #4a2121 0%, ${primaryColor} 40%, ${primaryColor} 100%)`,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <style>{`.navbar { display: none !important; }`}</style>

            <div className="animate-scale-in" style={{
                background: 'white',
                borderRadius: '32px',
                padding: 'var(--space-10) var(--space-6)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {uploading ? (
                    <div style={{ padding: 'var(--space-8) 0' }}>
                        <h2 style={{ color: primaryColor, marginBottom: 'var(--space-4)' }}>Subiendo archivos...</h2>
                        <div className="progress-bar" style={{ background: 'var(--neutral-100)', height: 12, borderRadius: 6, overflow: 'hidden', margin: '0 auto', maxWidth: 200 }}>
                            <div className="progress-fill" style={{ width: `${progress}%`, background: primaryColor, height: '100%', transition: 'width 0.3s' }} />
                        </div>
                        <p style={{ marginTop: 'var(--space-2)', color: 'var(--neutral-500)', fontWeight: 600 }}>{progress}%</p>
                    </div>
                ) : uploadSuccess ? (
                    <div style={{ padding: 'var(--space-8) 0', color: primaryColor }}>
                        <CheckCircle2 size={64} style={{ margin: '0 auto var(--space-4)' }} />
                        <h3>¡Subida exitosa!</h3>
                        <p style={{ color: 'var(--neutral-500)', marginTop: 'var(--space-2)' }}>Gracias por compartir tus fotos.</p>
                    </div>
                ) : (
                    <>
                        <h3 style={{ color: primaryColor, fontSize: 'var(--text-lg)', fontWeight: 400, margin: 0, opacity: 0.9 }}>Bienvenid@ a</h3>
                        <h1 style={{ color: primaryColor, fontSize: 'var(--text-4xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-6)', lineHeight: 1.1 }}>
                            {event.name}
                        </h1>
                        <p style={{ color: primaryColor, fontSize: 'var(--text-xl)', fontWeight: 400, opacity: 0.8, marginBottom: 'var(--space-8)' }}>
                            ¿Qué deseas hacer?
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: primaryColor,
                                    color: 'white',
                                    border: 'none',
                                    padding: 'var(--space-5)',
                                    borderRadius: '100px',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingLeft: 'var(--space-8)',
                                    gap: 'var(--space-4)',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 25px -5px rgba(219, 107, 107, 0.4)',
                                    transition: 'transform 0.2s',
                                    width: '100%'
                                }}
                            >
                                <Camera size={26} /> Subir Imagen / Video
                            </button>

                            <button
                                style={{
                                    background: primaryColor,
                                    color: 'white',
                                    border: 'none',
                                    padding: 'var(--space-5)',
                                    borderRadius: '100px',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingLeft: 'var(--space-8)',
                                    gap: 'var(--space-4)',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 25px -5px rgba(219, 107, 107, 0.4)',
                                    transition: 'transform 0.2s',
                                    opacity: 0.95,
                                    width: '100%'
                                }}
                                onClick={() => alert('Función de envío de audio en camino (Próximamente).')}
                            >
                                <Mic size={26} /> Enviar Audio
                            </button>

                            <Link
                                to={`/album/${eventId}`}
                                style={{
                                    background: primaryColor,
                                    color: 'white',
                                    border: 'none',
                                    padding: 'var(--space-5)',
                                    borderRadius: '100px',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingLeft: 'var(--space-8)',
                                    gap: 'var(--space-4)',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(219, 107, 107, 0.4)',
                                    transition: 'transform 0.2s',
                                    opacity: 0.95,
                                    width: '100%'
                                }}
                            >
                                <ImageIcon size={26} /> Ver Galería
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
