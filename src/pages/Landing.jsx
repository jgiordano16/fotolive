import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Camera, Tv, Image, Users, Music, MessageSquare, Printer,
    CheckCircle2, ArrowRight, Sparkles, Zap, QrCode, Shield, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    return (
        <div className="landing-page">
            <Navbar />

            {/* Hero */}
            <section className="hero">
                <div className="hero-orbs">
                    <div className="hero-orb" />
                    <div className="hero-orb" />
                    <div className="hero-orb" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        Plataforma #1 para eventos en vivo
                    </div>
                    <h1>
                        Transformá tu evento en una{' '}
                        <span className="gradient-text">experiencia digital</span>
                    </h1>
                    <p>
                        Los invitados suben fotos y videos en tiempo real desde su celular.
                        Proyectá en vivo, creá un álbum permanente y hacé tu evento inolvidable.
                    </p>
                    <div className="hero-image-container animate-fade-in-up delay-200" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <img src="/hero-image.jpeg" alt="Fotolive en acción" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-lg" onClick={() => setIsPricingModalOpen(true)}>
                            Comienza ahora <ArrowRight size={18} />
                        </button>
                        <a href="#how" className="btn btn-secondary btn-lg">
                            Ver cómo funciona
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-number">10K+</div>
                            <div className="hero-stat-label">Eventos creados</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">500K+</div>
                            <div className="hero-stat-label">Fotos compartidas</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">98%</div>
                            <div className="hero-stat-label">Satisfacción</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag"><Zap size={12} /> Funciones</span>
                        <h2>Todo lo que necesitás para tu <span className="gradient-text">evento perfecto</span></h2>
                        <p>Una plataforma completa que conecta a tus invitados con la magia del momento.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card animate-fade-in-up">
                            <div className="feature-icon purple"><Tv size={24} /></div>
                            <h3>Proyección en Vivo</h3>
                            <p>Proyectá fotos y videos de tus invitados en tiempo real en la pantalla del evento. Efecto WOW garantizado.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up delay-100">
                            <div className="feature-icon pink"><Image size={24} /></div>
                            <h3>Álbum Digital</h3>
                            <p>Galería en la nube sin vencimiento. Tus invitados descargan y comparten los mejores momentos.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up delay-200">
                            <div className="feature-icon amber"><Users size={24} /></div>
                            <h3>RSVP e Invitaciones</h3>
                            <p>Landing personalizada con confirmación de asistencia, cuenta regresiva y mapa del evento.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up delay-300">
                            <div className="feature-icon green"><Music size={24} /></div>
                            <h3>Sugerencias Musicales</h3>
                            <p>Los invitados sugieren canciones que quieren escuchar. El DJ recibe las sugerencias en vivo.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up delay-400">
                            <div className="feature-icon cyan"><MessageSquare size={24} /></div>
                            <h3>Mensajes y Check-in</h3>
                            <p>Chat en vivo, mensajes para los anfitriones y sistema de check-in digital para invitados.</p>
                        </div>
                        <div className="feature-card animate-fade-in-up delay-500">
                            <div className="feature-icon red"><Printer size={24} /></div>
                            <h3>Kiosco de Impresión</h3>
                            <p>Módulo táctil para imprimir fotos al instante. Recuerdos físicos directo desde el evento.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-section" id="how">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag"><QrCode size={12} /> Cómo funciona</span>
                        <h2>Tres pasos para la <span className="gradient-text">magia</span></h2>
                        <p>Sin descargas, sin complicaciones. Todo desde el navegador del celular.</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Creá tu evento</h3>
                            <p>Registrate, personalizá tu evento con logo y colores, y compartí el link o QR con tus invitados.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Los invitados suben fotos</h3>
                            <p>Escanean el QR y suben fotos y videos directo desde su celular. Sin app, sin registro.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Proyectá y guardá</h3>
                            <p>Las fotos aparecen en la pantalla del evento en tiempo real y quedan guardadas en el álbum digital.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section" id="pricing">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag"><Shield size={12} /> Precios</span>
                        <h2>Planes para cada <span className="gradient-text">tipo de evento</span></h2>
                        <p>Sin sorpresas. Pagá solo por lo que necesitás.</p>
                    </div>
                    <div className="pricing-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="pricing-card">
                            <h3>Starter</h3>
                            <p className="pricing-desc">Para eventos pequeños e íntimos</p>
                            <div className="pricing-price">
                                <span className="currency">$</span>
                                <span className="amount">80.000</span>
                                <span className="period">/evento</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginTop: '-8px', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontWeight: 600 }}>USD $80</span> — precio para resto de países
                            </div>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={16} /> Hasta 50 fotos</li>
                                <li><CheckCircle2 size={16} /> Proyección en vivo</li>
                                <li><CheckCircle2 size={16} /> Álbum digital 7 días</li>
                                <li><CheckCircle2 size={16} /> Moderación de contenido</li>
                            </ul>
                            <a href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1331287610-32bfa341-5bd8-4a29-a79e-7169eaba0bd2" className="btn btn-outline" style={{ width: '100%' }}>
                                Comprar Starter
                            </a>
                        </div>
                        <div className="pricing-card popular">
                            <span className="pricing-popular-badge">Más popular</span>
                            <h3>Pro</h3>
                            <p className="pricing-desc">Para bodas, cumpleaños y fiestas</p>
                            <div className="pricing-price">
                                <span className="currency">$</span>
                                <span className="amount">190.000</span>
                                <span className="period">/evento</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginTop: '-8px', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontWeight: 600 }}>USD $160</span> — precio para resto de países
                            </div>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={16} /> Fotos ilimitadas</li>
                                <li><CheckCircle2 size={16} /> Videos HD</li>
                                <li><CheckCircle2 size={16} /> Álbum permanente</li>
                                <li><CheckCircle2 size={16} /> RSVP avanzado</li>
                                <li><CheckCircle2 size={16} /> Moderación de contenido</li>
                                <li><CheckCircle2 size={16} /> Personalización completa</li>
                                <li><CheckCircle2 size={16} /> Soporte prioritario</li>
                            </ul>
                            <a href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1331287610-87876b2b-f75a-4791-8bc4-925e4c60e87c" className="btn btn-primary" style={{ width: '100%' }}>
                                Elegir Pro <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>¿Listo para transformar tu <span className="gradient-text">próximo evento</span>?</h2>
                        <p>Unite a miles de organizadores que ya usan Fotolive.app para crear experiencias inolvidables.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Crear mi primer evento <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Pricing Modal */}
            {isPricingModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-4)',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        background: 'var(--neutral-900)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-6)',
                        maxWidth: '900px',
                        width: '100%',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsPricingModalOpen(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Seleccioná un <span className="gradient-text">Plan</span></h2>
                            <p style={{ color: 'var(--neutral-400)' }}>Elegí la opción que mejor se adapte a tu evento.</p>
                        </div>

                        <div className="pricing-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div className="pricing-card">
                                <h3>Starter</h3>
                                <p className="pricing-desc">Para eventos pequeños e íntimos</p>
                                <div className="pricing-price">
                                    <span className="currency">$</span>
                                    <span className="amount">80.000</span>
                                    <span className="period">/evento</span>
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginTop: '-8px', marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontWeight: 600 }}>USD $80</span> — precio para resto de países
                                </div>
                                <ul className="pricing-features">
                                    <li><CheckCircle2 size={16} /> Hasta 50 fotos</li>
                                    <li><CheckCircle2 size={16} /> Proyección en vivo</li>
                                    <li><CheckCircle2 size={16} /> Álbum digital 7 días</li>
                                    <li><CheckCircle2 size={16} /> Moderación de contenido</li>
                                </ul>
                                <a href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1331287610-32bfa341-5bd8-4a29-a79e-7169eaba0bd2" className="btn btn-outline" style={{ width: '100%' }}>
                                    Comprar Starter
                                </a>
                            </div>
                            <div className="pricing-card popular">
                                <span className="pricing-popular-badge">Más popular</span>
                                <h3>Pro</h3>
                                <p className="pricing-desc">Para bodas, cumpleaños y fiestas</p>
                                <div className="pricing-price">
                                    <span className="currency">$</span>
                                    <span className="amount">190.000</span>
                                    <span className="period">/evento</span>
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-400)', marginTop: '-8px', marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontWeight: 600 }}>USD $160</span> — precio para resto de países
                                </div>
                                <ul className="pricing-features">
                                    <li><CheckCircle2 size={16} /> Fotos ilimitadas</li>
                                    <li><CheckCircle2 size={16} /> Videos HD</li>
                                    <li><CheckCircle2 size={16} /> Álbum permanente</li>
                                    <li><CheckCircle2 size={16} /> RSVP avanzado</li>
                                    <li><CheckCircle2 size={16} /> Moderación de contenido</li>
                                    <li><CheckCircle2 size={16} /> Personalización completa</li>
                                    <li><CheckCircle2 size={16} /> Soporte prioritario</li>
                                </ul>
                                <a href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1331287610-87876b2b-f75a-4791-8bc4-925e4c60e87c" className="btn btn-primary" style={{ width: '100%' }}>
                                    Elegir Pro <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
