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

## Depósito de ahorro
El ahorro se deposita el día **29** de cada mes. Si el 29 cae sábado o domingo, se adelanta al **viernes anterior**. En febrero se usa el último día del mes (28) y también se adelanta al viernes anterior si cae fin de semana (por ejemplo, febrero 2027 → viernes 26).

## Rendimiento
En **Rendim.** se capturan el saldo de ayer y el de hoy. La diferencia entre ambos define la tasa diaria que da el banco; a partir de ahí la app calcula el rendimiento **día a día con interés compuesto**, lo agrupa por semana y muestra la proyección total del mes. El saldo total de la app se recalibra automáticamente para cuadrar con el saldo de hoy capturado.

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
