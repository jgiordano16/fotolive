// scripts/create-mp-preferences.js
// Ejecutar con: node scripts/create-mp-preferences.js
// Genera los links de pago de Mercado Pago para cada plan

import { MercadoPagoConfig, Preference } from 'mercadopago';

const ACCESS_TOKEN = 'APP_USR-2116458492705860-022404-bcb0543befcbaef1104964e4d37c938c-1331287610';

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
const preference = new Preference(client);

const APP_URL = 'https://fotolive.app'; // Cambiar por tu dominio real

async function createPreferences() {
    console.log('Creando preferencias de Mercado Pago...\n');

    // Plan Starter
    const starter = await preference.create({
        body: {
            items: [{
                title: 'FotoLive Starter — 1 evento',
                description: 'Hasta 50 fotos, proyección en vivo, álbum digital 7 días, moderación de contenido',
                quantity: 1,
                unit_price: 80000,
                currency_id: 'ARS',
            }],
            back_urls: {
                success: `${APP_URL}/register?plan=starter&status=success`,
                failure: `${APP_URL}/#pricing`,
                pending: `${APP_URL}/register?plan=starter&status=pending`,
            },
            auto_return: 'approved',
            statement_descriptor: 'FOTOLIVE STARTER',
        }
    });

    // Plan Pro
    const pro = await preference.create({
        body: {
            items: [{
                title: 'FotoLive Pro — 1 evento',
                description: 'Fotos ilimitadas, videos HD, álbum permanente, RSVP avanzado, moderación, personalización completa',
                quantity: 1,
                unit_price: 190000,
                currency_id: 'ARS',
            }],
            back_urls: {
                success: `${APP_URL}/register?plan=pro&status=success`,
                failure: `${APP_URL}/#pricing`,
                pending: `${APP_URL}/register?plan=pro&status=pending`,
            },
            auto_return: 'approved',
            statement_descriptor: 'FOTOLIVE PRO',
        }
    });

    const starterUrl = starter.init_point;
    const proUrl = pro.init_point;

    console.log('✅ Links de pago generados:\n');
    console.log('🔵 STARTER:');
    console.log(`   URL: ${starterUrl}`);
    console.log(`   ID:  ${starter.id}\n`);
    console.log('🟣 PRO:');
    console.log(`   URL: ${proUrl}`);
    console.log(`   ID:  ${pro.id}\n`);
    console.log('Copiá estos links en Landing.jsx para los botones de compra.');
}

createPreferences().catch(console.error);
