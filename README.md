# Finanzas personales (app web)

App web de finanzas personales en un solo archivo HTML: `index.html`.
Diseño rosa 🪼 con ballena 🐳 hacia el primer millón, pestañas abajo.

## Cómo usar
1. Abre `index.html` en el navegador (doble clic). No necesita servidor.
2. Los datos se guardan en el navegador (localStorage). Usa "Más → Descargar JSON" para respaldo.
3. Para compartir entre dispositivos/cuenta, integra Supabase/Firebase (ver abajo).

## Pestañas
Resumen, Deudas, Gastos, Inversión, Rendim., Meta, Más.

## Automatización
El día 12 de cada mes (al abrir la app) se crea el mes nuevo y los MSI avanzan un pago automáticamente. Los liquidados se marcan "Liquidado" y no se borran. No hay botón manual de "+1 pago".

## PDFs
- "Más → PDF mensual" genera el PDF del mes.
- Deudas → "PDF para mamá".

## Telegram
La carpeta `../finanzas-telegram-bot/` contiene el bot. En "Más" configura la URL del worker y el token, luego "Sincronizar ahora".

## Recomendación: híbrido web + nube
- **Ahora (local):** esta app funciona offline con localStorage. Ideal para empezar.
- **Después (cuenta):** para "guardar en tu cuenta" y sincronizar entre dispositivos, crea un proyecto gratuito en Supabase (auth por email + tabla `months` JSONB) y reemplaza `loadState/saveState` por llamadas a Supabase. El bot de Telegram puede leer/escribir la misma tabla.
- **Hosting:** sube `index.html` a GitHub Pages / Netlify / Vercel (gratis).

## Datos iniciales
Incluye tus 4 meses (Ago–Nov 2024) con MSI, deuda mamá, apoyo $5,000, gastos variables e inversión. Edítalos en la app.
