import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <div className="landing-page">
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
                <h1 style={{ marginBottom: '40px' }}>Política de Privacidad</h1>

                <div style={{ color: 'var(--neutral-300)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <p>Última actualización: Febrero 2026</p>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>1. Información que Recopilamos</h2>
                        <p>En Fotolive.app recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:</p>
                        <ul style={{ listStyleType: 'disc', marginLeft: '24px', marginTop: '8px' }}>
                            <li><strong>Información de Registro:</strong> Cuando creás una cuenta, recopilamos tu nombre, dirección de correo electrónico y contraseña (encriptada).</li>
                            <li><strong>Contenido del Evento:</strong> Fotos, videos, sugerencias musicales y mensajes subidos por los invitados a los álbumes digitales del evento.</li>
                            <li><strong>Datos de Uso:</strong> Información sobre cómo interactuás con la plataforma, tiempos de conexión y preferencias del evento.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>2. Uso de la Información</h2>
                        <p>Utilizamos la información recopilada para:</p>
                        <ul style={{ listStyleType: 'disc', marginLeft: '24px', marginTop: '8px' }}>
                            <li>Proporcionar, operar y mantener nuestra plataforma y servicios de proyección en vivo.</li>
                            <li>Garantizar el correcto almacenamiento del Álbum Digital y los archivos multimedia del evento.</li>
                            <li>Mejorar, personalizar y expandir nuestra plataforma de eventos.</li>
                            <li>Procesar transacciones a través de Mercado Pago (no almacenamos datos de tarjetas de crédito).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>3. Compartir Información</h2>
                        <p>Las fotos y videos subidos a un evento en particular solo serán visibles para los usuarios que tengan acceso a dicho evento (mediante el enlace o código QR proporcionado por el organizador). No vendemos tus datos personales ni los compartimos con terceros con fines comerciales.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>4. Seguridad de los Datos</h2>
                        <p>Implementamos medidas de seguridad para proteger tu información personal y los archivos multimedia de los eventos contra el acceso no autorizado, alteración, divulgación o destrucción. Utilizamos proveedores líderes en la industria (como Firebase de Google) para el almacenamiento seguro.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>5. Tus Derechos</h2>
                        <p>Los organizadores pueden eliminar un evento y todo su contenido asociado (fotos, videos, mensajes) en cualquier momento desde su panel de control (Dashboard). Esto ejecuta un "borrado en cascada" que elimina permanentemente los archivos de nuestros servidores.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
