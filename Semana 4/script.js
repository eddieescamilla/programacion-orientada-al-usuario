// Ejercicio 1: Calcula el promedio de tres calificaciones usando un arreglo y un ciclo for
function calcularPromedio() {
    let resultado = document.getElementById("resultado");

    // Entrada: guardar los tres valores en un arreglo (llegan como texto)
    let notas = [
        document.getElementById("nota1").value,
        document.getElementById("nota2").value,
        document.getElementById("nota3").value
    ];

    // Proceso: recorrer el arreglo con for e ir sumando
    let suma = 0;

    for (let i = 0; i < notas.length; i++) {
        // Validación: que ningún campo esté vacío
        if (notas[i] === "") {
            resultado.textContent = "Por favor ingresa las tres calificaciones.";
            return;
        }

        suma = suma + Number(notas[i]);
    }

    let promedio = suma / notas.length;

    // Salida: mostrar el resultado con 2 decimales
    resultado.textContent = "El promedio es: " + promedio.toFixed(2);
}

// Ejercicio 2: Genera un arreglo con la tabla de multiplicar (1-10) usando map
function generarTabla() {
    let resultadoTabla = document.getElementById("resultadoTabla");

    // Entrada: leer el número (llega como texto)
    let texto = document.getElementById("numero").value;

    // Validación: que el campo no esté vacío
    if (texto === "") {
        resultadoTabla.textContent = "Por favor ingresa un número.";
        return;
    }

    let numero = Number(texto);

    // Proceso: multiplicar el número por cada valor del 1 al 10 con map
    let multiplicadores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let tabla = multiplicadores.map(multiplicador => numero * multiplicador);

    // También se muestra en la consola, como en el enunciado
    console.log(tabla);

    // Salida: mostrar el arreglo en la página con formato [a, b, c]
    resultadoTabla.textContent = "[" + tabla.join(", ") + "]";
}