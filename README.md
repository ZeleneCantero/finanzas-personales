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

## Notificaciones
Actívalas una sola vez en "Más → Notificaciones". La app avisa una vez al día con lo que generó el dinero ese día, usando la tasa calculada a partir de tus saldos. También avisa cuando se crea el mes nuevo.

El aviso llega por dos vías, sin depender de que la app esté abierta:

- **Web Push (VAPID):** notificación del sistema aunque la PWA esté cerrada. Al tocarla se abre directamente la sección de rendimiento. La clave pública va en la app; la privada es un secreto del Worker (`VAPID_PRIVATE_KEY`). Si ya habías dado permiso, la suscripción se renueva sola al abrir la app.
- **Telegram:** el bot envía el mismo aviso cada día a las 9:00 (15:00 UTC), **solo al chat de Zelene**. La app sincroniza los saldos al Worker en `/api/sync` y el job usa `artifact:rendimiento`. No se envía a mamá.

Ambas vías tienen guard de "ya enviado hoy" para no duplicar. Si hay suscripción push, se usa; si no, el mensaje de Telegram sigue llegando igual.
- Deudas → "PDF para mamá".

## Telegram
La carpeta `../finanzas-telegram-bot/` contiene el bot. La conexión se guarda automáticamente y se recupera sola al abrir la app: no necesitas volver a pegar el enlace ni el token. El token se cifra en el dispositivo y no se incluye en los respaldos JSON. Si quieres cambiarlo, ve a "Más → Sincronización → Configurar".

## Recomendación: híbrido web + nube
- **Ahora (local):** esta app funciona offline con localStorage. Ideal para empezar.
- **Después (cuenta):** para "guardar en tu cuenta" y sincronizar entre dispositivos, crea un proyecto gratuito en Supabase (auth por email + tabla `months` JSONB) y reemplaza `loadState/saveState` por llamadas a Supabase. El bot de Telegram puede leer/escribir la misma tabla.
- **Hosting:** sube `index.html` a GitHub Pages / Netlify / Vercel (gratis).

## Datos iniciales
Incluye tus 4 meses (Ago–Nov 2024) con MSI, deuda mamá, apoyo $5,000, gastos variables e inversión. Edítalos en la app.
