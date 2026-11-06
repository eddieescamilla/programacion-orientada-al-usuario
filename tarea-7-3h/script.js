"use strict";

/* =========================================================
   1. DATOS
   Se declara con let porque eliminarProducto() devuelve un
   array nuevo que reemplaza al inventario.
   ========================================================= */
let inventario = [
  { id: 1, nombre: "A Thousand Wishes", categoria: "Mists", cantidad: 8, precio: 18.95, agotado: false },
  { id: 2, nombre: "Japanese Cherry Blossom", categoria: "Mists", cantidad: 12, precio: 18.95, agotado: false },
  { id: 3, nombre: "Into the Night", categoria: "Mists", cantidad: 0, precio: 18.95, agotado: true },
  { id: 4, nombre: "Champagne Toast", categoria: "Mists", cantidad: 5, precio: 18.95, agotado: false },
  { id: 5, nombre: "Warm Vanilla Sugar", categoria: "Cremas corporales", cantidad: 10, precio: 17.5, agotado: false },
  { id: 6, nombre: "Gingham", categoria: "Cremas corporales", cantidad: 6, precio: 17.5, agotado: false },
  { id: 7, nombre: "Sweet Pea", categoria: "Cremas corporales", cantidad: 0, precio: 17.5, agotado: true },
  { id: 8, nombre: "Pure Wonder", categoria: "Geles de ducha", cantidad: 7, precio: 14.5, agotado: false },
  { id: 9, nombre: "Beautiful Day", categoria: "Geles de ducha", cantidad: 9, precio: 14.5, agotado: false }
];

/* =========================================================
   2. SELECCIÓN DE ELEMENTOS DEL DOM
   ========================================================= */
const formularioProducto = document.getElementById("formulario-producto");
const campoNombre = document.querySelector("#nombre");
const campoCategoria = document.querySelector("#categoria");
const campoCantidad = document.querySelector("#cantidad");
const campoPrecio = document.querySelector("#precio");
const listaCategorias = document.getElementById("lista-categorias");
const mensajeError = document.getElementById("mensaje-error");
const selectorCategoria = document.getElementById("filtro-categoria");
const cuerpoInventario = document.getElementById("cuerpo-inventario");
const mensajeVacio = document.getElementById("mensaje-vacio");
const indicadorTotalProductos = document.querySelector("#total-productos");
const indicadorTotalUnidades = document.querySelector("#total-unidades");
const indicadorValorTotal = document.querySelector("#valor-total");
const indicadorTotalAgotados = document.querySelector("#total-agotados");

/* =========================================================
   3. GENERADOR DE IDENTIFICADORES (cierre / closure)
   ========================================================= */

// Devuelve una función que recuerda "contador" gracias al cierre.
// El contador empieza en 100, así que el primer id nuevo será 101
// y nunca coincide con los ids iniciales (1 a 9).
function crearGeneradorId() {
  let contador = 100;
  return function () {
    contador = contador + 1;
    return contador;
  };
}

const generarId = crearGeneradorId();

/* =========================================================
   4. CÁLCULOS (todos con bucles for)
   ========================================================= */

function calcularValorTotal(items) {
  let valorTotal = 0;
  for (let i = 0; i < items.length; i++) {
    valorTotal = valorTotal + items[i].cantidad * items[i].precio;
  }
  return valorTotal;
}

function contarUnidades(items) {
  let totalUnidades = 0;
  for (let i = 0; i < items.length; i++) {
    totalUnidades = totalUnidades + items[i].cantidad;
  }
  return totalUnidades;
}

function contarAgotados(items) {
  let totalAgotados = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      totalAgotados = totalAgotados + 1;
    }
  }
  return totalAgotados;
}

function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;
    if (conteo[categoria] === undefined) {
      conteo[categoria] = 0;
    }
    conteo[categoria] = conteo[categoria] + 1;
  }
  return conteo;
}

// Devuelve una lista de categorías sin repetir.
function obtenerCategorias(items) {
  const categorias = [];
  for (let i = 0; i < items.length; i++) {
    if (!categorias.includes(items[i].categoria)) {
      categorias.push(items[i].categoria);
    }
  }
  return categorias;
}

function formatearMoneda(valor) {
  return "$" + valor.toFixed(2);
}

/* =========================================================
   5. CREACIÓN DE NODOS Y RENDERIZADO
   ========================================================= */

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearBoton(texto, claseBoton, id) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.classList.add("btn", claseBoton);
  boton.setAttribute("data-id", id);
  return boton;
}

function crearFila(item) {
  const fila = document.createElement("tr");
  if (item.agotado) {
    fila.classList.add("fila-agotada");
  }

  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(String(item.cantidad)));
  fila.appendChild(crearCelda(formatearMoneda(item.precio)));
  fila.appendChild(crearCelda(formatearMoneda(item.cantidad * item.precio)));

  const celdaEstado = crearCelda(item.agotado ? "Agotado" : "Disponible");
  celdaEstado.classList.add(item.agotado ? "estado-agotado" : "estado-disponible");
  fila.appendChild(celdaEstado);

  const celdaAcciones = document.createElement("td");
  celdaAcciones.classList.add("celda-acciones");
  const textoBotonEstado = item.agotado ? "Marcar disponible" : "Marcar agotado";
  celdaAcciones.appendChild(crearBoton(textoBotonEstado, "btn-estado", item.id));
  celdaAcciones.appendChild(crearBoton("Eliminar", "btn-eliminar", item.id));
  fila.appendChild(celdaAcciones);

  return fila;
}

function limpiarTabla() {
  while (cuerpoInventario.firstChild) {
    cuerpoInventario.removeChild(cuerpoInventario.firstChild);
  }
}

// Interpretación elegida: los indicadores reflejan los productos VISIBLES.
// Por eso reciben los mismos "items" que se dibujan en la tabla
// (el inventario completo o el resultado del filtro).
function actualizarIndicadores(items) {
  indicadorTotalProductos.textContent = String(items.length);
  indicadorTotalUnidades.textContent = String(contarUnidades(items));
  indicadorValorTotal.textContent = formatearMoneda(calcularValorTotal(items));
  indicadorTotalAgotados.textContent = String(contarAgotados(items));
}

function renderizar(items) {
  limpiarTabla();
  for (let i = 0; i < items.length; i++) {
    cuerpoInventario.appendChild(crearFila(items[i]));
  }
  actualizarIndicadores(items);
  mensajeVacio.hidden = items.length > 0;
}

/* =========================================================
   6. FILTRO POR CATEGORÍA
   ========================================================= */

// Devuelve un array nuevo; no modifica inventario.
function filtrarPorCategoria(categoria) {
  const productosFiltrados = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria === categoria) {
      productosFiltrados.push(inventario[i]);
    }
  }
  return productosFiltrados;
}

function obtenerProductosVisibles() {
  const categoriaSeleccionada = selectorCategoria.value;
  if (categoriaSeleccionada === "todas") {
    return inventario;
  }
  return filtrarPorCategoria(categoriaSeleccionada);
}

// Vuelve a dibujar respetando el filtro que esté activo.
function mostrarInventarioActual() {
  renderizar(obtenerProductosVisibles());
}

function llenarSelectorCategorias() {
  const seleccionAnterior = selectorCategoria.value;
  const categorias = obtenerCategorias(inventario);

  // Si la categoría seleccionada se quedó sin productos (se eliminó el último),
  // se conserva en el selector para que se vea #mensaje-vacio.
  // Desaparece en cuanto el usuario elige otro filtro.
  if (seleccionAnterior !== "todas" && !categorias.includes(seleccionAnterior)) {
    categorias.push(seleccionAnterior);
  }

  // Se borran todas las opciones excepto la primera ("Todas").
  while (selectorCategoria.options.length > 1) {
    selectorCategoria.remove(1);
  }

  for (let i = 0; i < categorias.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = categorias[i];
    opcion.textContent = categorias[i];
    selectorCategoria.appendChild(opcion);
  }

  selectorCategoria.value = seleccionAnterior;
}

// Sugerencias del campo categoría del formulario (datalist).
function llenarSugerenciasCategorias() {
  const categorias = obtenerCategorias(inventario);

  while (listaCategorias.firstChild) {
    listaCategorias.removeChild(listaCategorias.firstChild);
  }

  for (let i = 0; i < categorias.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = categorias[i];
    listaCategorias.appendChild(opcion);
  }
}

function actualizarListasDeCategorias() {
  llenarSelectorCategorias();
  llenarSugerenciasCategorias();
}

function manejarCambioFiltro() {
  llenarSelectorCategorias();
  mostrarInventarioActual();
  console.log("Filtro aplicado:", selectorCategoria.value);
}

/* =========================================================
   7. ALTA DE PRODUCTOS (validación con throw y try...catch)
   ========================================================= */

// Convierte el texto de un campo a número; un campo vacío se considera inválido (NaN).
function convertirANumero(texto) {
  const textoLimpio = texto.trim();
  if (textoLimpio === "") {
    return NaN;
  }
  return Number(textoLimpio);
}

// Si la categoría ya existe con otras mayúsculas/minúsculas, usa la existente
// para no crear "mists" y "Mists" como categorías distintas.
function normalizarCategoria(textoCategoria) {
  const categorias = obtenerCategorias(inventario);
  for (let i = 0; i < categorias.length; i++) {
    if (categorias[i].toLowerCase() === textoCategoria.toLowerCase()) {
      return categorias[i];
    }
  }
  return textoCategoria;
}

function leerDatosFormulario() {
  return {
    nombre: campoNombre.value.trim(),
    categoria: normalizarCategoria(campoCategoria.value.trim()),
    cantidad: convertirANumero(campoCantidad.value),
    precio: convertirANumero(campoPrecio.value)
  };
}

function validarProducto(datos) {
  if (datos.nombre === "") {
    throw new Error("El nombre no puede estar vacío.");
  }
  if (datos.categoria === "") {
    throw new Error("La categoría no puede estar vacía.");
  }
  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error("La cantidad debe ser un número entero mayor que cero.");
  }
  if (!Number.isFinite(datos.precio) || datos.precio < 0) {
    throw new Error("El precio debe ser un número mayor o igual que cero.");
  }
}

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
}

function limpiarError() {
  mensajeError.textContent = "";
}

function agregarProducto(event) {
  event.preventDefault();

  try {
    const datos = leerDatosFormulario();
    validarProducto(datos);

    const nuevoProducto = {
      id: generarId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };

    inventario.push(nuevoProducto);
    limpiarError();
    actualizarListasDeCategorias();
    mostrarInventarioActual();
    formularioProducto.reset();
    campoNombre.focus();
    console.log("Alta de producto:", nuevoProducto);
  } catch (error) {
    mostrarError(error.message);
    console.error("No se pudo agregar el producto:", error.message);
  }
}

/* =========================================================
   8. BAJA Y CAMBIO DE ESTADO (delegación de eventos)
   ========================================================= */

function buscarProductoPorId(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      return inventario[i];
    }
  }
  return null;
}

// Devuelve un array nuevo sin el producto indicado.
function eliminarProducto(id) {
  const inventarioActualizado = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      inventarioActualizado.push(inventario[i]);
    }
  }
  return inventarioActualizado;
}

// Alterna la propiedad agotado del producto con ese id y lo devuelve.
function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
      return inventario[i];
    }
  }
  return null;
}

function procesarEliminacion(id) {
  const productoEliminado = buscarProductoPorId(id);
  inventario = eliminarProducto(id);
  actualizarListasDeCategorias();
  mostrarInventarioActual();
  console.log("Baja de producto:", productoEliminado);
}

function procesarCambioEstado(id) {
  const productoActualizado = cambiarEstado(id);
  mostrarInventarioActual();
  const estadoNuevo = productoActualizado.agotado ? "agotado" : "disponible";
  console.log("Cambio de estado: " + productoActualizado.nombre + " ahora está " + estadoNuevo);
}

// Un único escuchador en el tbody gestiona los botones de todas las filas.
function manejarClicEnTabla(event) {
  const elementoClicado = event.target;
  const esBotonEstado = elementoClicado.classList.contains("btn-estado");
  const esBotonEliminar = elementoClicado.classList.contains("btn-eliminar");

  if (!esBotonEstado && !esBotonEliminar) {
    return;
  }

  const id = Number(elementoClicado.getAttribute("data-id"));

  if (esBotonEliminar) {
    procesarEliminacion(id);
  } else {
    procesarCambioEstado(id);
  }
}

/* =========================================================
   9. INICIO DEL PROGRAMA
   ========================================================= */

function mostrarResumenEnConsola() {
  console.table(inventario);
  console.table(contarPorCategoria(inventario));
}

function iniciar() {
  actualizarListasDeCategorias();
  renderizar(inventario);
  formularioProducto.addEventListener("submit", agregarProducto);
  cuerpoInventario.addEventListener("click", manejarClicEnTabla);
  selectorCategoria.addEventListener("change", manejarCambioFiltro);
  mostrarResumenEnConsola();
}

iniciar();
