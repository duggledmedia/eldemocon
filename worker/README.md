# IA de El Demonio Contesta — configuración gratuita

La web sigue en GitHub Pages. La IA usa un Cloudflare Worker como intermediario y Gemini 2.5 Flash-Lite con nivel gratuito sujeto a límites de Google. No se sube ninguna API key a GitHub.

1. Generá una clave de API en https://aistudio.google.com/apikey (no la pegues en el chat).
2. En Cloudflare, creá un Worker desde el editor del panel y pegá el contenido de `worker/index.js`. Publicalo.
3. En Worker > Settings > Variables and Secrets, agregá el secreto `GEMINI_API_KEY` con la clave generada, marcándolo **Secret**. Volvé a desplegar cuando el panel lo indique.
4. Copiá la URL pública de tu Worker (por ejemplo, `https://nombre.usuario.workers.dev`).
5. En GitHub > repositorio eldemocon > Settings > Secrets and variables > Actions > Variables, creá `VITE_DEMON_API_URL` con la URL del Worker. Es una URL pública, no un secreto.
6. Ejecutá el workflow `Publicar El Demonio Contesta` desde GitHub Actions o hacé un commit para compilar React con la URL.

**Estado actual:** el frontend muestra un error explicativo hasta que configures la URL y el Worker. No coloca una clave privada en el navegador. Las consultas nuevas se acumulan localmente en el navegador del visitante (hasta 30); para un archivo compartido entre todos los visitantes hace falta agregar una base de datos como D1 y moderación.

**Seguridad:** CORS comprueba el origen del navegador, pero no equivale a autenticación y no evita abusos por clientes que falsifican encabezados. Antes de abrir el sitio a tráfico grande, activá rate limiting real (Cloudflare) y cuotas de Gemini; si no, terceros podrían agotar el nivel gratuito.