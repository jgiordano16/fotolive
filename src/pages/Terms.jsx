import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
    return (
        <div className="landing-page">
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
                <h1 style={{ marginBottom: '40px' }}>Términos y Condiciones de Servicio</h1>

                <div style={{ color: 'var(--neutral-300)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <p>Última actualización: Febrero 2026</p>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>1. Aceptación de los Términos</h2>
                        <p>Al acceder o utilizar el sitio web Fotolive.app y sus servicios de proyección de eventos, aceptás estar legalmente obligado por estas Condiciones de Servicio ("Condiciones"). Si no estás de acuerdo con alguna de las estipulaciones, no podés utilizar nuestra plataforma.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>2. Descripción del Servicio</h2>
                        <p>Fotolive.app es una plataforma digital que permite a los organizadores crear galerías para eventos (bodas, cumpleaños, fiestas) donde los invitados pueden subir fotos, videos, enviar mensajes en tiempo real y visualizar dicho contenido en pantallas mediante nuestra función LiveWall.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>3. Uso Aceptable y Responsabilidades</h2>
                        <ul style={{ listStyleType: 'disc', marginLeft: '24px', marginTop: '8px' }}>
                            <li><strong>Moderación:</strong> El organizador del evento es el único responsable de moderar y controlar el contenido que se sube y proyecta en su evento. Fotolive.app provee herramientas de moderación y aprobación manual.</li>
                            <li><strong>Responsabilidad del Contenido:</strong> No somos responsables por fotos, videos, material inapropiado, ilegal u ofensivo subido por los invitados. Cualquier contenido subido recae bajo la responsabilidad legal directa de quien lo sube y del organizador que permite su publicación.</li>
                            <li><strong>Uso Ilegal:</strong> Está estrictamente prohibido usar la plataforma para difundir spam, malware, discursos de odio o contenido explícito no consensuado.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>4. Pagos y Suscripciones</h2>
                        <p>Los pagos para adquirir planes premium ("Starter", "Pro") se procesan a través de Mercado Pago. Fotolive.app no almacena información financiera. Las compras de planes por evento no son reembolsables, salvo por fallas técnicas demostrables de la plataforma de nuestra parte al momento del evento.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.5rem' }}>5. Disponibilidad del Servicio</h2>
                        <p>Nos esforzamos por garantizar un "uptime" del 99.9% durante tus eventos. Sin embargo, Fotolive.app no será responsable si el servicio no está disponible temporalmente debido a problemas técnicos fuera de nuestro control, como interrupciones severas de AWS, Firebase, Mercado Pago u otros proveedores centrales.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
