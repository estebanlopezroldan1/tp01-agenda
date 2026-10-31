/*
  REGISTRO DE USO DE IA:
    - Fecha: 
    - Herramienta: 
    - Qué se generó / consultó:
    - Prompt usado:
    - Cambios que hice a mano:
*/

// Array para guardar todos los contactos de la agenda
let contactos = [];

// Array para guardar todos los eventos de la agenda
let eventos = [];

/**
  * guardarDatos: Guarda los dos arrays en localStorage.
  * Usa una sola clave "agenda-datos" para tener todo junto.
 */
function guardarDatos() {
  // Creamos un objeto que contiene ambas listas
  let datosParaGuardar = {
    contactos: contactos,
    eventos: eventos
  };

  // Convertimos el objeto a texto JSON y lo guardamos
  // localStorage solo puede guardar texto, no objetos
  let textoJson = JSON.stringify(datosParaGuardar);
  localStorage.setItem("agenda-datos", textoJson);
}

/**
  * cargarDatos: Lee los datos al abrir la página.
  * Si no hay nada guardado, arranca con listas vacías.
 */
function cargarDatos() {
  // Leemos el texto guardado en la clave "agenda-datos"
  let textoGuardado = localStorage.getItem("agenda-datos");

  // Si no hay nada guardado, no hacemos nada (quedan arrays vacíos)
  if (!textoGuardado) {
    contactos = [];
    eventos = [];
    return;
  }

  // Si sí hay texto, lo convertimos de vuelta a objeto
  let datosRecuperados = JSON.parse(textoGuardado);
  
  // Asignamos los datos a nuestros arrays
  contactos = datosRecuperados.contactos || [];
  eventos = datosRecuperados.eventos || [];
}

// Al cargar la página, intentamos recuperar lo guardado
cargarDatos();

// --- REFERENCIAS AL DOM (elementos del HTML por su id) ---
let formularioContacto = document.getElementById("formularioContacto");
let listaContactos = document.getElementById("listaContactos");
let formularioEvento = document.getElementById("formularioEvento");
let listaEventos = document.getElementById("listaEventos");
let selectContactoEvento = document.getElementById("selectContactoEvento");
// Inputs del contacto
let inputNombreContacto = document.getElementById("inputNombreContacto");
let inputTelefonoContacto = document.getElementById("inputTelefonoContacto");
let inputEmailContacto = document.getElementById("inputEmailContacto");
let inputNotasContacto = document.getElementById("inputNotasContacto");
// Inputs del evento
let inputTituloEvento = document.getElementById("inputTituloEvento");
let inputFechaEvento = document.getElementById("inputFechaEvento");
let inputHoraEvento = document.getElementById("inputHoraEvento");
let inputLugarEvento = document.getElementById("inputLugarEvento");
// --- FUNCIONES DE AYUDA ---
// Crea un id único usando la fecha actual
function crearIdUnico() {
  return Date.now().toString();
}
// Llena el select del formulario de eventos con los contactos que existen
function actualizarSelectContactos() {
  // Borramos opciones viejas, dejando solo "Sin contacto"
  selectContactoEvento.innerHTML = '<option value="">Sin contacto</option>';
  // Recorremos cada contacto para crear una opción
  for (let contacto of contactos) {
    let opcion = document.createElement("option");
    opcion.value = contacto.id; // El valor es el id
    opcion.textContent = contacto.nombre; // Lo que ve el usuario
    selectContactoEvento.appendChild(opcion);
  }
}
// Dibuja todas las tarjetas de contactos en pantalla
function mostrarContactos() {
  // Vaciamos la lista antes de dibujar
  listaContactos.innerHTML = "";
  // Si no hay contactos, mostramos un mensaje ficticio
  if (contactos.length === 0) {
    listaContactos.innerHTML = "<p>📭 No hay contactos aún.</p>";
    return;
  }
  for (let contacto of contactos) {
    let tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta"; // Usa el estilo del CSS
    tarjeta.innerHTML = `
      <strong>👤 ${contacto.nombre}</strong><br>
      📞 ${contacto.telefono || "Sin teléfono"}<br>
      ✉️ ${contacto.email || "Sin email"}
    `;
    listaContactos.appendChild(tarjeta);
  }
}
// Dibuja todos los eventos, ordenados por fecha y hora (más próximos primero)
function mostrarEventos() {
  listaEventos.innerHTML = "";
  if (eventos.length === 0) {
    listaEventos.innerHTML = "<p>🗓️ No hay eventos aún.</p>";
    return;
  }
  // Creamos una copia ordenada para no modificar el array original
  let eventosOrdenados = [...eventos].sort((eventoA, eventoB) => {
    // Unimos fecha y hora en un objeto Date para comparar
    let fechaA = new Date(eventoA.fecha + "T" + (eventoA.hora || "00:00"));
    let fechaB = new Date(eventoB.fecha + "T" + (eventoB.hora || "00:00"));
    return fechaA - fechaB; // Menor primero = más próximo primero
  });
  for (let evento of eventosOrdenados) {
    let tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <strong>📌 ${evento.titulo}</strong><br>
      📅 ${evento.fecha} ${evento.hora || ""}<br>
      📍 ${evento.lugar || "Sin lugar"}
    `;
    listaEventos.appendChild(tarjeta);
  }
}
// --- EVENTOS DE FORMULARIOS ---
// Cuando se envía el formulario de contactos
formularioContacto.addEventListener("submit", function(eventoFormulario) {
  eventoFormulario.preventDefault(); // Evita que la página se recargue
  // Creamos un objeto contacto nuevo con datos ficticios del usuario
  let nuevoContacto = {
    id: crearIdUnico(),
    nombre: inputNombreContacto.value,
    telefono: inputTelefonoContacto.value,
    email: inputEmailContacto.value,
    notas: inputNotasContacto.value
  };
  // Lo agregamos al array
  contactos.push(nuevoContacto);
  // Guardamos en localStorage
  guardarDatos();
  // Volvemos a dibujar la lista y el select de eventos
  mostrarContactos();
  actualizarSelectContactos();
  // Limpiamos el formulario para el próximo contacto
  formularioContacto.reset();
});
// Cuando se envía el formulario de eventos
formularioEvento.addEventListener("submit", function(eventoFormulario) {
  eventoFormulario.preventDefault(); // Evita que la página se recargue
  // Creamos un objeto evento nuevo
  let nuevoEvento = {
    id: crearIdUnico(),
    titulo: inputTituloEvento.value,
    fecha: inputFechaEvento.value,
    hora: inputHoraEvento.value,
    lugar: inputLugarEvento.value,
    contactoId: selectContactoEvento.value // Guarda el id del contacto elegido
  };
  eventos.push(nuevoEvento);
  guardarDatos();
  mostrarEventos();
  formularioEvento.reset(); // Limpia el formulario
});
// --- INICIO ---
// Al abrir la página, dibujamos lo que se cargó desde localStorage
actualizarSelectContactos();
mostrarContactos();
mostrarEventos();
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#2F80ED">
