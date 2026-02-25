import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Monitor, Shield, Image as ImageIcon,
    Type, QrCode, Sliders, CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEvent, updateEventDoc } from '../hooks/useEvent';
import { VIDEO_LIBRARY } from '../constants/videos';

const DEFAULT_CONFIG = {
    autoApprove: false,
    playbackType: 'Predeterminada',
    imageTime: 8,
    bgType: 'color', // color, gradient, image
    bgColor1: '#050505',
    bgColor2: '#1e1b4b',
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

export default function Configuration() {
    const { eventId } = useParams();
    const { event, loading } = useEvent(eventId);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('ENVIVO');
    const [videoPage, setVideoPage] = useState(0);
    const VIDEOS_PER_PAGE = 6;

    useEffect(() => {
        if (event && event.liveWallConfig) {
            setConfig({ ...DEFAULT_CONFIG, ...event.liveWallConfig });
        }
    }, [event]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--neutral-400)' }}>Cargando configuración...</div>;
    if (!event) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--error-400)' }}>Evento no encontrado</div>;

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateEventDoc(eventId, { liveWallConfig: config });
            alert("¡Configuración guardada exitosamente!");
        } catch (e) {
            console.error(e);
            alert("Error al guardar.");
        }
        setSaving(false);
    };

    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    // Construir estilo de fondo dinámico para la previsualización
    const getPreviewBg = () => {
        if (config.bgType === 'color') return config.bgColor1;
        if (config.bgType === 'gradient') return `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})`;
        return '#000'; // Fallback
    };

    // Paginación de videos
    const totalVideoPages = Math.ceil(VIDEO_LIBRARY.length / VIDEOS_PER_PAGE);
    const paginatedVideos = VIDEO_LIBRARY.slice(videoPage * VIDEOS_PER_PAGE, (videoPage + 1) * VIDEOS_PER_PAGE);

    return (
        <div className="config-page pb-32">
            <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Volver al dashboard
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)' }}>Configuración de <span className="gradient-text">{event.name}</span></h1>
                </div>

                {/* Tabs Top */}
                <div className="interaction-tabs" style={{ marginBottom: 'var(--space-8)', justifyContent: 'center' }}>
                    <button className={`interaction-tab ${activeTab === 'ENVIVO' ? 'active' : ''}`} onClick={() => setActiveTab('ENVIVO')}>EN VIVO</button>
                    <button className={`interaction-tab ${activeTab === 'INVITADO' ? 'active' : ''}`} onClick={() => setActiveTab('INVITADO')}>INVITADO</button>
                    <button className={`interaction-tab ${activeTab === 'GALERIA' ? 'active' : ''}`} onClick={() => setActiveTab('GALERIA')}>GALERÍA</button>
                </div>

                {activeTab === 'ENVIVO' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
                        {/* Panel Izquierdo: Previsualización */}
                        <div className="config-left-panel">
                            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: 1 }}>Previsualización</h3>

                            <div className="preview-container glass-card" style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                position: 'relative',
                                overflow: 'hidden',
                                background: getPreviewBg(),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--neutral-800)'
                            }}>
                                {/* Video Preview Layer */}
                                {config.bgType === 'video' && config.bgVideo && (
                                    <video
                                        src={config.bgVideo}
                                        autoPlay
                                        loop
                                        muted
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                                    />
                                )}

                                {/* Oscurecedor por brillo */}
                                <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 1 - (config.bgBrightness / 100), zIndex: 1 }} />

                                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                                    <div style={{ width: 160, height: 220, background: '#222', borderRadius: 8, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid white' }}>
                                        <Monitor size={48} color="#555" />
                                    </div>
                                    {config.showUserName && (
                                        <div style={{ marginTop: 10 }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: 100,
                                                background: config.userNameBgColor,
                                                color: config.userNameColor,
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>Javier Giordano</span>
                                        </div>
                                    )}
                                </div>

                                {/* Texts preview */}
                                {config.showWaitText && (
                                    <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '100%', textAlign: 'center' }}>
                                        <h2 style={{
                                            fontFamily: config.fontFamily,
                                            color: config.waitTextColor,
                                            fontSize: `${config.textSize * 0.5}px`, // Scaled for preview
                                            margin: 0,
                                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                        }}>
                                            {config.waitText}
                                        </h2>
                                    </div>
                                )}

                                {/* QR Preview */}
                                {config.showQrAlways && (
                                    <div style={{
                                        position: 'absolute',
                                        left: `${config.qrPosX}%`,
                                        top: `${config.qrPosY}%`,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10,
                                        background: config.qrAlwaysBgColor,
                                        padding: 8,
                                        borderRadius: 8
                                    }}>
                                        <QRCodeSVG value="https://fotolive.app" size={config.qrSize * 0.4} fgColor={config.qrAlwaysColor} bgColor="transparent" />
                                    </div>
                                )}
                            </div>

                            {/* Aprobacion Automatica Toggle */}
                            <div className="glass-card" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-lg)', marginBottom: 4 }}>
                                        <Shield size={18} color="var(--primary-400)" /> Aprobación Automática
                                    </h4>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', lineHeight: 1.4 }}>
                                        Cuando está activada, las fotos se mostrarán en vivo automáticamente sin revisión previa.
                                    </p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={config.autoApprove} onChange={(e) => updateConfig('autoApprove', e.target.checked)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Panel Derecho: Formularios */}
                        <div className="config-right-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                            {/* Reproducción */}
                            <div className="glass-card config-section">
                                <h3><Monitor size={18} /> Reproducción</h3>
                                <div className="input-group">
                                    <label>Tipo de Reproducción</label>
                                    <select className="input" value={config.playbackType} onChange={(e) => updateConfig('playbackType', e.target.value)}>
                                        <option value="Predeterminada">Predeterminada</option>
                                        <option value="Aleatoria">Aleatoria</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <label>Tiempo por imagen</label>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-400)' }}>{config.imageTime}s</span>
                                    </div>
                                    <input type="range" min="3" max="30" value={config.imageTime} onChange={(e) => updateConfig('imageTime', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                </div>
                            </div>

                            {/* Fondo */}
                            <div className="glass-card config-section">
                                <h3><ImageIcon size={18} /> Fondo</h3>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-4)' }}>
                                    {['color', 'gradient', 'video'].map(type => (
                                        <button
                                            key={type}
                                            className={`btn btn-sm ${config.bgType === type ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => updateConfig('bgType', type)}
                                            style={{ flex: 1 }}
                                        >
                                            {type === 'color' ? 'Color' : type === 'gradient' ? 'Gradiente' : 'Video'}
                                        </button>
                                    ))}
                                </div>

                                {config.bgType === 'color' && (
                                    <div className="input-group">
                                        <label>Color</label>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <input type="color" value={config.bgColor1} onChange={(e) => updateConfig('bgColor1', e.target.value)} style={{ width: 50, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                                            <input className="input" value={config.bgColor1} onChange={(e) => updateConfig('bgColor1', e.target.value)} style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                )}

                                {config.bgType === 'gradient' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div className="input-group">
                                            <label>Color 1</label>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <input type="color" value={config.bgColor1} onChange={(e) => updateConfig('bgColor1', e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8 }} />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Color 2</label>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <input type="color" value={config.bgColor2} onChange={(e) => updateConfig('bgColor2', e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8 }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {config.bgType === 'video' && (
                                    <div className="video-library-grid">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)' }}>Seleccioná un clip de video:</label>
                                            <span style={{ fontSize: '10px', color: 'var(--neutral-500)' }}>Página {videoPage + 1} de {totalVideoPages}</span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
                                            {paginatedVideos.map(video => (
                                                <div
                                                    key={video.id}
                                                    onClick={() => updateConfig('bgVideo', video.url)}
                                                    style={{
                                                        position: 'relative', paddingTop: '56.25%', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer',
                                                        border: config.bgVideo === video.url ? '2px solid var(--primary-400)' : '2px solid rgba(255,255,255,0.1)',
                                                        background: 'black',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <video
                                                        src={video.url}
                                                        muted
                                                        loop
                                                        onMouseOver={e => e.target.play()}
                                                        onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '12px 6px 4px', fontSize: '9px', color: 'white', pointerEvents: 'none' }}>
                                                        {video.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                disabled={videoPage === 0}
                                                onClick={() => setVideoPage(p => Math.max(0, p - 1))}
                                                style={{ padding: '4px 12px' }}
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                disabled={videoPage >= totalVideoPages - 1}
                                                onClick={() => setVideoPage(p => Math.min(totalVideoPages - 1, p + 1))}
                                                style={{ padding: '4px 12px' }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <label>Brillo del fondo</label>
                                        <span style={{ fontSize: 'var(--text-sm)' }}>{config.bgBrightness}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={config.bgBrightness} onChange={(e) => updateConfig('bgBrightness', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                </div>
                            </div>

                            {/* Textos */}
                            <div className="glass-card config-section">
                                <h3><Type size={18} /> Textos</h3>
                                <div className="input-group">
                                    <label>Fuente</label>
                                    <select className="input" value={config.fontFamily} onChange={(e) => updateConfig('fontFamily', e.target.value)}>
                                        <option value="Inter">Inter</option>
                                        <option value="Poppins">Poppins</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>

                                <div style={{ borderTop: '1px solid var(--neutral-800)', margin: '16px 0', paddingTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <label style={{ margin: 0 }}>Mostrar texto principal</label>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={config.showWaitText} onChange={(e) => updateConfig('showWaitText', e.target.checked)} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    {config.showWaitText && (
                                        <>
                                            <input className="input" value={config.waitText} onChange={(e) => updateConfig('waitText', e.target.value)} style={{ marginBottom: 12 }} />
                                            <div style={{ display: 'flex', gap: 16 }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Color</label>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <input type="color" value={config.waitTextColor} onChange={(e) => updateConfig('waitTextColor', e.target.value)} style={{ width: 32, height: 32, padding: 0, border: 'none', borderRadius: 4 }} />
                                                    </div>
                                                </div>
                                                <div style={{ flex: 2 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Tamaño</label>
                                                        <span style={{ fontSize: 12 }}>{config.textSize}px</span>
                                                    </div>
                                                    <input type="range" min="16" max="72" value={config.textSize} onChange={(e) => updateConfig('textSize', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px solid var(--neutral-800)', margin: '16px 0', paddingTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <label style={{ margin: 0 }}>Mostrar nombre del fotógrafo</label>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={config.showUserName} onChange={(e) => updateConfig('showUserName', e.target.checked)} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Personalización QR */}
                            <div className="glass-card config-section">
                                <h3><QrCode size={18} /> Personalización QR</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <label style={{ margin: 0 }}>Mostrar QR en pantalla</label>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={config.showQrAlways} onChange={(e) => updateConfig('showQrAlways', e.target.checked)} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                {config.showQrAlways && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                            <div>
                                                <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Color QR</label>
                                                <input type="color" value={config.qrAlwaysColor} onChange={(e) => updateConfig('qrAlwaysColor', e.target.value)} style={{ width: '100%', height: 40, border: 'none', borderRadius: 8 }} />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Tamaño</label>
                                                    <span style={{ fontSize: 12 }}>{config.qrSize}px</span>
                                                </div>
                                                <input type="range" min="60" max="300" value={config.qrSize} onChange={(e) => updateConfig('qrSize', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Posición X</label>
                                                    <span style={{ fontSize: 12 }}>{config.qrPosX}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={config.qrPosX} onChange={(e) => updateConfig('qrPosX', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <label style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Posición Y</label>
                                                    <span style={{ fontSize: 12 }}>{config.qrPosY}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={config.qrPosY} onChange={(e) => updateConfig('qrPosY', Number(e.target.value))} className="range-slider" style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )}
                {activeTab !== 'ENVIVO' && (
                    <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: 'var(--neutral-400)' }}>
                        Sección en desarrollo...
                    </div>
                )}
            </div>

            {/* Float Save Button */}
            <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '16px 32px', boxShadow: '0 10px 30px rgba(99,102,241,0.5)', borderRadius: 100 }}
                >
                    <Save size={20} /> {saving ? 'Guardando...' : 'Guardar Configuración'}
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .config-section {
                    padding: var(--space-6);
                }
                .config-section h3 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-4);
                    color: white;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: var(--neutral-800);
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--primary-500);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 24px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                .range-slider {
                    -webkit-appearance: none;
                    height: 6px;
                    background: var(--neutral-800);
                    border-radius: 3px;
                    outline: none;
                }
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--primary-400);
                    cursor: pointer;
                }
            `}} />
        </div>
    );
}
