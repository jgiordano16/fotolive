import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import {
    Maximize, Minimize, Grid, Monitor, Camera, ArrowLeft
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { useEvent } from '../hooks/useEvent';
import { useMedia } from '../hooks/useMedia';
import { VIDEO_LIBRARY } from '../constants/videos';
const DEFAULT_CONFIG = {
    autoApprove: false,
    playbackType: 'Predeterminada',
    imageTime: 8,
    bgType: 'color',
    bgColor1: '#050505',
    bgColor2: '#1e1b4b',
    bgVideo: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-motion-of-shifting-blue-particles-23133-large.mp4',
    bgBrightness: 100,
    fontFamily: 'Inter',
    showWaitText: true,
    waitText: 'Subí tu foto o Video',
    waitTextColor: '#ffffff',
    textSize: 24,
    showUserName: true,
    userNameColor: '#ffffff',
    userNameBgColor: 'rgba(255,255,255,0.2)',
    showQrAlways: true,
    qrAlwaysColor: '#ffffff',
    qrAlwaysBgColor: 'transparent',
    qrSize: 120,
    qrPosX: 90,
    qrPosY: 90
};

export default function LiveWall() {
    const { eventId } = useParams();
    const { event } = useEvent(eventId);
    const { media: realMedia } = useMedia(eventId, 'approved');

    const [mode, setMode] = useState('single');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    const config = { ...DEFAULT_CONFIG, ...(event?.liveWallConfig || {}) };

    useEffect(() => {
        if (mode !== 'single' || realMedia.length === 0) return;
        const interval = setInterval(() => {
            if (config.playbackType === 'Aleatoria') {
                setCurrentIndex(Math.floor(Math.random() * realMedia.length));
            } else {
                setCurrentIndex((prev) => (prev + 1) % realMedia.length);
            }
        }, config.imageTime * 1000);
        return () => clearInterval(interval);
    }, [mode, realMedia.length, config.imageTime, config.playbackType]);

    const getDynamicBg = () => {
        if (config.bgType === 'color') return config.bgColor1;
        if (config.bgType === 'gradient') return `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})`;
        return 'transparent';
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const uploadUrl = `${window.location.origin}/qr/${eventId}`;


    // Helpers: detectar plataformas y extraer canal
    const getTwitchChannel = (url) => {
        if (!url) return null;
        const match = url.match(/(?:twitch\.tv\/)([a-zA-Z0-9_]+)/);
        return match ? match[1] : null;
    };
    const getKickChannel = (url) => {
        if (!url) return null;
        const match = url.match(/(?:kick\.com\/)([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    // MODO STREAMING EN VIVO
    if (event?.liveStreamUrl) {
        const twitchChannel = getTwitchChannel(event.liveStreamUrl);
        const kickChannel = getKickChannel(event.liveStreamUrl);

        const renderPlayer = () => {
            const iframeStyle = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100vw',
                height: '100vh',
                border: 'none'
            };

            const IframeCover = ({ src }) => (
                <>
                    <style>{`
                        .iframe-cover {
                            width: 100vw;
                            height: 100vh;
                        }
                        @media (max-aspect-ratio: 16/9) {
                            .iframe-cover {
                                width: calc(100vh * (16 / 9));
                            }
                        }
                        @media (min-aspect-ratio: 16/9) {
                            .iframe-cover {
                                height: calc(100vw * (9 / 16));
                            }
                        }
                    `}</style>
                    <iframe
                        src={src}
                        className="iframe-cover"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen"
                        style={iframeStyle}
                    />
                </>
            );

            if (twitchChannel) {
                return <IframeCover src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}&muted=true&autoplay=true`} />;
            }
            if (kickChannel) {
                return <IframeCover src={`https://player.kick.com/${kickChannel}`} />;
            }
            return (
                <ReactPlayer
                    url={event.liveStreamUrl}
                    playing={true}
                    controls={true}
                    muted={true}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }}
                />
            );
        };

        return (
            <div className="live-wall" ref={containerRef} style={{ background: '#000', width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
                {renderPlayer()}

                {/* Controles Overlay */}
                <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 100 }}>
                    <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>
                <div style={{ position: 'absolute', top: 30, right: 30, display: 'flex', gap: 10, zIndex: 100 }}>
                    <button className="btn btn-secondary btn-sm" onClick={toggleFullscreen} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}>
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>

                {/* Indicador En Vivo */}
                <div style={{ position: 'absolute', bottom: 30, left: 30, zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 'var(--radius-lg)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
                    <span style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: 600 }}>EN VIVO</span>
                </div>
            </div>
        );
    }

    // Si todavía no hay fotos aprobadas, mostramos esta increíble pantalla de espera interactiva (tipo Flow o Netflix)
    if (realMedia.length === 0) {
        return (
            <div className="live-wall" ref={containerRef} style={{ background: getDynamicBg(), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Video Background Layer */}
                {config.bgType === 'video' && config.bgVideo && (
                    <video
                        src={config.bgVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    />
                )}

                {/* Oscurecedor según brillo */}
                <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 1 - (config.bgBrightness / 100), zIndex: 1 }} />

                <style>{`
                    .floating-qr { animation: float 6s ease-in-out infinite; position: relative; zIndex: 10; }
                    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
                `}</style>

                <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 100 }}>
                    <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>

                <div style={{ position: 'absolute', top: 30, right: 30, display: 'flex', gap: 10, zIndex: 100 }}>
                    <button className="btn btn-secondary btn-sm" onClick={toggleFullscreen} style={{ background: 'rgba(255,255,255,0.1)' }}>
                        {isFullscreen ? <Minimize size={16} color="white" /> : <Maximize size={16} color="white" />}
                    </button>
                </div>

                <div className="animate-fade-in-up floating-qr" style={{ textAlign: 'center', fontFamily: config.fontFamily }}>
                    <div style={{ background: config.qrAlwaysBgColor !== 'transparent' ? config.qrAlwaysBgColor : 'white', padding: 20, borderRadius: 24, display: 'inline-block', marginBottom: 40, border: config.qrAlwaysBgColor === 'transparent' ? 'none' : '2px solid rgba(255,255,255,0.2)' }}>
                        <QRCodeSVG value={uploadUrl} size={300} bgColor="transparent" fgColor={config.qrAlwaysColor} level="H" />
                    </div>
                    {config.showWaitText && (
                        <>
                            <h1 style={{ color: config.waitTextColor, fontSize: `${config.textSize}px`, fontWeight: 800, textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: 0 }}>
                                {config.waitText || event?.name}
                            </h1>
                            <p style={{ color: 'var(--neutral-300)', fontSize: '1.5rem', marginTop: 15, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                Escaneá el código para compartir tus fotos en pantalla gigante 📸
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // CUANDO HAY FOTOS REALES: Mostrar el proyector de fotos
    const currentPhoto = realMedia[currentIndex];

    return (
        <div className="live-wall" ref={containerRef} style={{ background: '#000', overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', inset: 0, background: getDynamicBg(), zIndex: 0 }} />
            {/* Video Background Layer - Fallback behind the single view */}
            {config.bgType === 'video' && config.bgVideo && (
                <video
                    src={config.bgVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                />
            )}

            <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 1 - (config.bgBrightness / 100), zIndex: 1 }} />

            {/* Contenido principal se levanta por sobre el fondo interactivo */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header / Controles ocultables */}
                <div className="live-wall-header" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', borderBottom: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', textDecoration: 'none' }}>
                            <ArrowLeft size={16} />
                        </Link>
                        <div className="live-indicator">
                            <div className="live-dot" />
                            <span>EN VIVO</span>
                            <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginLeft: 'var(--space-2)' }}>
                                {realMedia.length} fotos reales
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {/* Botón Grilla (Mosaico) */}
                        <button
                            className="btn btn-sm"
                            style={{ background: mode === 'grid' ? 'white' : 'rgba(255,255,255,0.1)', color: mode === 'grid' ? 'black' : 'white', border: 'none' }}
                            onClick={() => setMode('grid')}
                        >
                            <Grid size={16} />
                        </button>
                        {/* Botón Single (Pantalla Completa Automática) */}
                        <button
                            className="btn btn-sm"
                            style={{ background: mode === 'single' ? 'white' : 'rgba(255,255,255,0.1)', color: mode === 'single' ? 'black' : 'white', border: 'none' }}
                            onClick={() => setMode('single')}
                        >
                            <Monitor size={16} />
                        </button>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', border: 'none' }} onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize size={16} color="white" /> : <Maximize size={16} color="white" />}
                        </button>
                    </div>
                </div>

                {/* VISTA GRILLA */}
                {mode === 'grid' ? (
                    <div className="live-wall-grid" style={{ paddingTop: 90, padding: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {realMedia.map((photo) => (
                            <div key={photo.id} className="live-photo animate-fade-in-up" style={{ borderRadius: 16, overflow: 'hidden' }}>
                                <div style={{
                                    width: '100%', height: 350,
                                    position: 'relative',
                                    background: 'black'
                                }}>
                                    {photo.mediaType === 'video' ? (
                                        <video
                                            src={photo.fileUrl}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            backgroundImage: `url(${photo.fileUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }} />
                                    )}
                                    <div style={{
                                        position: 'absolute', bottom: 'var(--space-3)', left: 'var(--space-3)',
                                        fontSize: 'var(--text-xs)', fontWeight: 600,
                                        background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)', backdropFilter: 'blur(5px)'
                                    }}>
                                        📸 {photo.uploaderName || 'Invitado'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* VISTA SINGLE: Pantalla Completa Cinematográfica */
                    mode === 'single' && (
                        <div className="live-wall-single" style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
                            {/* Renderizamos video o imagen dependiendo del tipo */}
                            {currentPhoto?.mediaType === 'video' ? (
                                <video
                                    src={currentPhoto?.fileUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{
                                        width: '100vw',
                                        height: '100vh',
                                        objectFit: 'contain',
                                        animation: 'fadeKeyframe 1s ease-in-out forwards',
                                    }}
                                    key={`video-${currentPhoto?.id}`}
                                />
                            ) : (
                                <img
                                    src={currentPhoto?.fileUrl}
                                    alt="En vivo"
                                    style={{
                                        width: '100vw',
                                        height: '100vh',
                                        objectFit: 'contain',
                                        animation: 'fadeKeyframe 1s ease-in-out forwards',
                                    }}
                                    key={`img-${currentPhoto?.id}`}
                                />
                            )}

                            {config.showQrAlways && (
                                <div style={{
                                    position: 'absolute',
                                    top: `${config.qrPosY}%`,
                                    left: `${config.qrPosX}%`,
                                    transform: 'translate(-50%, -50%)',
                                    background: config.qrAlwaysBgColor,
                                    borderRadius: '1.5rem',
                                    padding: '1.25rem',
                                    display: 'flex', alignItems: 'center', gap: '1.25rem', backdropFilter: 'blur(10px)',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <QRCodeSVG value={uploadUrl} size={config.qrSize} bgColor="transparent" fgColor={config.qrAlwaysColor} level="Q" />
                                    <div>
                                        <h3 style={{ color: config.waitTextColor, fontFamily: config.fontFamily, fontSize: `${Math.max(16, config.textSize * 0.4)}px`, margin: '0 0 5px 0' }}>{event?.name}</h3>
                                        <p style={{ color: 'var(--neutral-300)', fontFamily: config.fontFamily, fontSize: `${Math.max(12, config.textSize * 0.3)}px`, margin: 0 }}>Escaneá para subir a la pantalla</p>
                                    </div>
                                </div>
                            )}

                            {config.showUserName && currentPhoto && (
                                <div style={{
                                    position: 'absolute', bottom: 40, left: 40,
                                    background: config.userNameBgColor,
                                    color: config.userNameColor,
                                    fontFamily: config.fontFamily,
                                    fontSize: '1.2rem',
                                    fontWeight: 600,
                                    padding: '8px 24px',
                                    borderRadius: 100,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    📸 {currentPhoto.uploaderName || 'Invitado'}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* Animación custom para cruce de imágenes en projector */}
            <style>{`
                @keyframes fadeKeyframe {
                    0% { opacity: 0; transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
