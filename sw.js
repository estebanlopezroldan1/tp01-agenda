// Nombre de la cache para tu agenda
let nombreCache = "agenda-cache-v1";

// Archivos que se guardan la primera vez para usar sin internet
let archivosParaCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icono-192.png",
  "./icono-512.png"
];

// Instalación: guarda los archivos
self.addEventListener("install", function(evento) {
  evento.waitUntil(
    caches.open(nombreCache).then(function(cache) {
      return cache.addAll(archivosParaCache);
    })
  );
});

// Cada vez que la app pide un archivo, lo da desde la cache si no hay internet
self.addEventListener("fetch", function(evento) {
  evento.respondWith(
    caches.match(evento.request).then(function(respuesta) {
      return respuesta || fetch(evento.request);
    })
  );
});
