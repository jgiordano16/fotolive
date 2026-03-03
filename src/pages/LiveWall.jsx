import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
    Maximize, Minimize, Grid, Monitor, Camera, ArrowLeft, LayoutList
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { useEvent } from '../hooks/useEvent';
import { useMedia } from '../hooks/useMedia';
import { usePlaylists } from '../hooks/usePlaylists';
import { VIDEO_LIBRARY } from '../constants/videos';

const DEFAULT_CONFIG = {
    // ... (rest of constants stays the same but I should include them in the replace)
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
    const { playlists } = usePlaylists(eventId);
    const { media: realMedia } = useMedia(eventId, 'approved', event?.activePlaylistId);

    const [mode, setMode] = useState('single');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentEffect, setCurrentEffect] = useState('fadeKeyframe');
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

    // Manejar el Mix de efectos
    useEffect(() => {
        if (config.playbackType === 'Mix') {
            const effects = ['Zoom', 'Slide', 'Desenfocar', 'Cubo', 'Predeterminada'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            setCurrentEffect(getAnimationName(randomEffect));
        } else {
            setCurrentEffect(getAnimationName(config.playbackType));
        }
    }, [currentIndex, config.playbackType]);

    // Reset index when playlist changes remotely
    useEffect(() => {
        setCurrentIndex(0);
    }, [event?.activePlaylistId]);

    const getDynamicBg = () => {
        // ... (rest stays the same)
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

    const [started, setStarted] = useState(false);

    const handleStartProjection = () => {
        toggleFullscreen();
        setStarted(true);
    };

    // MODO STREAMING EN VIVO
    if (event?.liveStreamUrl) {
        const twitchChannel = getTwitchChannel(event.liveStreamUrl);
        const kickChannel = getKickChannel(event.liveStreamUrl);

        const renderPlayer = () => {
            const rotation = event.liveStreamRotation || 0;
            const isVertical = rotation === 90 || rotation === 270;

            const iframeStyle = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                width: isVertical ? '100vh' : '100vw',
                height: isVertical ? '100vw' : '100vh',
                border: 'none'
            };

            const IframeCover = ({ src }) => (
                <>
                    <style>{`
                        .iframe-cover {
                            width: ${isVertical ? '100vh' : '100vw'};
                            height: ${isVertical ? '100vw' : '100vh'};
                        }
                        @media (max-aspect-ratio: 16/9) {
                            .iframe-cover {
                                width: ${isVertical ? 'calc(100vw * (16 / 9))' : 'calc(100vh * (16 / 9))'};
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
                <div style={{ ...iframeStyle, overflow: 'hidden' }}>
                    <ReactPlayer
                        url={event.liveStreamUrl}
                        playing={true}
                        controls={false}
                        muted={true}
                        width="100%"
                        height="100%"
                        config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'cover' } } } }}
                    />
                </div>
            );
        };

        return (
            <div className="live-wall" ref={containerRef} style={{ background: '#000', width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
                {!started && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <button className="btn btn-primary btn-lg" onClick={handleStartProjection}>
                            <Monitor size={24} /> INICIAR PROYECCIÓN EN VIVO
                        </button>
                    </div>
                )}
                {renderPlayer()}
            </div>
        );
    }

    // Si todavía no hay fotos aprobadas, mostramos esta increíble pantalla de espera interactiva (tipo Flow o Netflix)
    if (realMedia.length === 0) {
        return (
            <div className="live-wall" ref={containerRef} style={{ background: getDynamicBg(), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {!started && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <button className="btn btn-primary btn-lg" onClick={handleStartProjection}>
                            <Monitor size={24} /> INICIAR PROYECCIÓN
                        </button>
                    </div>
                )}
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
                            {event?.activePlaylistId && (
                                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.2rem', marginTop: '10px' }}>
                                    Lista activa: {playlists.find(p => p.id === event.activePlaylistId)?.name}
                                </p>
                            )}
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
            {!started && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <button className="btn btn-primary btn-lg" onClick={handleStartProjection}>
                        <Monitor size={24} /> INICIAR PROYECCIÓN
                    </button>
                </div>
            )}
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

                {/* VISTA GRILLA */}
                {
                    mode === 'grid' ? (
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
                                {config.playbackType === 'Collage' ? (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1.6fr 1fr',
                                        gridTemplateRows: '1fr 1fr',
                                        gap: '2vw',
                                        width: '100vw',
                                        height: '100vh',
                                        padding: '4vw',
                                        background: getDynamicBg(), // Usar el fondo del evento
                                        position: 'relative'
                                    }}>
                                        {/* Columna Izquierda (2 fotos) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw', justifyContent: 'center' }}>
                                            {[0, 1].map((off) => {
                                                const idx = (currentIndex + off) % realMedia.length;
                                                const item = realMedia[idx];
                                                if (!item) return null;
                                                return (
                                                    <div key={`left-${idx}`} className="polaroid-wrapper" style={{ transform: `rotate(${off === 0 ? '-3deg' : '2deg'})` }}>
                                                        <div className="polaroid-frame" style={{ paddingBottom: '1.5vw' }}>
                                                            <div className="polaroid-inner">
                                                                {item.mediaType === 'video' ? (
                                                                    <video src={item.fileUrl} autoPlay muted loop playsInline />
                                                                ) : (
                                                                    <img src={item.fileUrl} alt="" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Columna Central (Fija, Ocupa todo el alto) */}
                                        <div style={{ gridRow: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="polaroid-wrapper center-polaroid" style={{ height: '90%', width: '100%' }}>
                                                <div className="polaroid-frame" style={{ height: '100%', padding: '20px' }}>
                                                    <div className="polaroid-inner" style={{ background: '#111' }}>
                                                        {config.collageFixedPhoto ? (
                                                            <img src={config.collageFixedPhoto} alt="Central" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
                                                                <Monitor size={64} opacity={0.2} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha (1 sola foto arriba para dejar espacio al QR) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw', justifyContent: 'flex-start' }}>
                                            {[2].map((off) => {
                                                const idx = (currentIndex + off) % realMedia.length;
                                                const item = realMedia[idx];
                                                if (!item) return null;
                                                return (
                                                    <div key={`right-${idx}`} className="polaroid-wrapper" style={{ transform: `rotate(3deg)`, marginTop: '2vw' }}>
                                                        <div className="polaroid-frame" style={{ paddingBottom: '1.5vw' }}>
                                                            <div className="polaroid-inner">
                                                                {item.mediaType === 'video' ? (
                                                                    <video src={item.fileUrl} autoPlay muted loop playsInline />
                                                                ) : (
                                                                    <img src={item.fileUrl} alt="" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* MANTENER SINGLE PERO CON EFECTO */
                                    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                                                    animation: `${currentEffect} 1.5s ease-in-out forwards`,
                                                }}
                                                key={`vid-${currentPhoto?.id}`}
                                            />
                                        ) : (
                                            <img
                                                src={currentPhoto?.fileUrl}
                                                alt="En vivo"
                                                style={{
                                                    width: '100vw',
                                                    height: '100vh',
                                                    objectFit: 'contain',
                                                    animation: `${currentEffect} 1.5s ease-in-out forwards`,
                                                }}
                                                key={`img-${currentPhoto?.id}`}
                                            />
                                        )}
                                    </div>
                                )}

                                {config.showQrAlways && (
                                    <div style={{
                                        position: 'absolute',
                                        top: `${config.qrPosY}%`,
                                        left: `${config.qrPosX}%`,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 100,
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

                                {config.showUserName && currentPhoto && config.playbackType !== 'Collage' && (
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
                @keyframes zoomEffect {
                    0% { opacity: 0; transform: scale(0.5) rotate(-5deg); filter: blur(10px); }
                    100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
                }
                @keyframes slideEffect {
                    0% { opacity: 0; transform: translateX(100%) skewX(-10deg); }
                    100% { opacity: 1; transform: translateX(0) skewX(0); }
                }
                @keyframes blurEffect {
                    0% { opacity: 0; filter: blur(50px) brightness(2); }
                    100% { opacity: 1; filter: blur(0) brightness(1); }
                }
                @keyframes cubeEffect {
                    0% { opacity: 0; transform: perspective(1000px) rotateY(90deg) translateZ(100px); }
                    100% { opacity: 1; transform: perspective(1000px) rotateY(0) translateZ(0); }
                }

                .polaroid-frame {
                    background: white;
                    padding: 1vw 1vw 4vw 1vw;
                    box-shadow: 0 1vw 3vw rgba(0,0,0,0.4);
                    border: 1px solid rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: auto;
                    position: relative;
                }
                .polaroid-inner {
                    flex: 1;
                    overflow: hidden;
                    background: #eee;
                    aspect-ratio: 1;
                    display: flex;
                }
                .polaroid-inner img, .polaroid-inner video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    animation: fadeKeyframe 0.8s ease-in-out forwards;
                }
                .polaroid-label {
                    position: absolute;
                    bottom: 0.8vw;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: #333;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                    font-size: 1vw;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .center-polaroid .polaroid-inner {
                    aspect-ratio: auto; /* Dejar que el centro ocupe el alto */
                }
            `}</style>
        </div >
    );
}

function getAnimationName(type) {
    switch (type) {
        case 'Zoom': return 'zoomEffect';
        case 'Slide': return 'slideEffect';
        case 'Desenfocar': return 'blurEffect';
        case 'Cubo': return 'cubeEffect';
        default: return 'fadeKeyframe';
    }
}
