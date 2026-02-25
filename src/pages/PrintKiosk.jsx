import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Printer, Check, Camera, ArrowLeft, ShoppingCart, X
} from 'lucide-react';

const GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #ec4899)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #06b6d4, #6366f1)',
    'linear-gradient(135deg, #22c55e, #06b6d4)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #ef4444, #f59e0b)',
    'linear-gradient(135deg, #14b8a6, #22c55e)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #6366f1, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #8b5cf6)',
    'linear-gradient(135deg, #22c55e, #ec4899)',
    'linear-gradient(135deg, #06b6d4, #ef4444)',
];

const DEMO_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
    id: `kiosk-${i}`,
    gradient: GRADIENTS[i],
}));

export default function PrintKiosk() {
    const { eventId } = useParams();
    const [photos] = useState(DEMO_PHOTOS);
    const [selected, setSelected] = useState([]);
    const [printing, setPrinting] = useState(false);
    const [queue, setQueue] = useState(3);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handlePrint = () => {
        setPrinting(true);
        setTimeout(() => {
            setPrinting(false);
            setQueue(queue + 1);
            setSelected([]);
            alert(`¡Listo! Tu turno es el #${queue + 1}. Retirá tus fotos en el kiosco.`);
        }, 2000);
    };

    return (
        <div className="kiosk-page">
            <div className="kiosk-header">
                <div>
                    <Link to={`/dashboard`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)', textDecoration: 'none' }}>
                        <ArrowLeft size={14} /> Volver al inicio
                    </Link>
                    <h1>
                        <Printer size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--primary-400)' }} />
                        Kiosco de Impresión
                    </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="kiosk-queue">
                        <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)' }}>En cola:</span>
                        <span className="kiosk-queue-number">{queue}</span>
                    </div>
                    {selected.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelected([])}>
                            <X size={14} /> Limpiar
                        </button>
                    )}
                </div>
            </div>

            <div className="kiosk-grid">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className={`kiosk-photo ${selected.includes(photo.id) ? 'selected' : ''}`}
                        onClick={() => toggleSelect(photo.id)}
                    >
                        <div style={{
                            width: '100%', height: '100%', background: photo.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Camera size={32} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        </div>
                        <div className="kiosk-photo-check">
                            <Check size={18} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="kiosk-footer">
                <div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)' }}>
                        {selected.length} {selected.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
                    </span>
                </div>
                <button
                    className="btn btn-primary btn-lg"
                    disabled={selected.length === 0 || printing}
                    onClick={handlePrint}
                >
                    {printing ? (
                        <>Enviando a impresión...</>
                    ) : (
                        <><Printer size={18} /> Imprimir {selected.length > 0 ? `(${selected.length})` : ''}</>
                    )}
                </button>
            </div>
        </div>
    );
}
