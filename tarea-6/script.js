const gastos = [
    { descripcion: 'Supermercado del mes', monto: 250, categoria: 'comida' },
    { descripcion: 'Cuota de la universidad', monto: 135, categoria: 'universidad' },
    { descripcion: 'Salida al cine y cena', monto: 100, categoria: 'ocio' },
    { descripcion: 'Luz, agua e internet', monto: 200, categoria: 'servicios' },
    { descripcion: 'Almuerzos de la semana', monto: 32.50, categoria: 'comida' },
    { descripcion: 'Libros y materiales', monto: 65.75, categoria: 'universidad' }
];

function clasificarGasto(monto) {
    if (monto >= 100) {
        return 'Alto';
    } else if (monto >= 50) {
        return 'Medio';
    } else {
        return 'Bajo';
    }
}

function describirCategoria(categoria) {
    switch (categoria) {
        case 'comida':
            return 'Gastos de alimentos';
        case 'universidad':
            return 'Pago de mensualidades';
        case 'ocio':
            return 'Gastos de entretenimiento';
        case 'servicios':
            return 'Pago de servicios básicos';
        default:
            return 'Categoría desconocida';
    }
}

const esGastoAlto = monto => monto >= 100;

function calcularTotal(gastos) {
    let total = 0;
    for (let i = 0; i < gastos.length; i++) {
        if (typeof gastos[i].monto !== 'number') {
            throw new Error('El monto debe ser un número: ' + gastos[i].descripcion);
        }
        total = total + gastos[i].monto;
    }
    return total;
}

function calcularPromedio(gastos) {
    if (gastos.length === 0) {
        throw new Error('No se puede calcular el promedio: no hay gastos registrados');
    }
    return calcularTotal(gastos) / gastos.length;
}

function obtenerMayorGasto(gastos) {
    if (gastos.length === 0) {
        return null;
    }
    let mayor = gastos[0];
    for (let i = 1; i < gastos.length; i++) {
        if (gastos[i].monto > mayor.monto) {
            mayor = gastos[i];
        }
    }
    return mayor;
}

function filtrarPorCategoria(gastos, categoria) {
    const resultado = [];
    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].categoria === categoria) {
            resultado[resultado.length] = gastos[i];
        }
    }
    return resultado;
}

function crearContadorDeAltos() {
    let contador = 0;
    return function () {
        contador = contador + 1;
        return contador;
    };
}

try {
    const contarAlto = crearContadorDeAltos();
    let cantidadAltos = 0;

    const gastosClasificados = [];
    for (let i = 0; i < gastos.length; i++) {
        gastosClasificados[gastosClasificados.length] = {
            descripcion: gastos[i].descripcion,
            monto: gastos[i].monto,
            categoria: gastos[i].categoria,
            nivel: clasificarGasto(gastos[i].monto),
            descripcionCategoria: describirCategoria(gastos[i].categoria)
        };

        if (esGastoAlto(gastos[i].monto)) {
            cantidadAltos = contarAlto();
        }
    }

    console.table(gastosClasificados);

    const total = calcularTotal(gastos);
    const promedio = calcularPromedio(gastos);
    console.log('Total gastado: $' + total.toFixed(2));
    console.log('Promedio por gasto: $' + promedio.toFixed(2));

    const mayorGasto = obtenerMayorGasto(gastos);
    console.log('Gasto más alto: ' + mayorGasto.descripcion + ' | Monto: $' + mayorGasto.monto + ' | Categoría: ' + mayorGasto.categoria);

    console.log('Cantidad de gastos altos (100 o más): ' + cantidadAltos);

    const categoriaElegida = 'comida';
    const gastosFiltrados = filtrarPorCategoria(gastos, categoriaElegida);
    console.log('Gastos de la categoría "' + categoriaElegida + '":', gastosFiltrados);

    const resumenPorCategoria = {};
    for (let i = 0; i < gastos.length; i++) {
        const categoria = gastos[i].categoria;
        if (resumenPorCategoria[categoria] === undefined) {
            resumenPorCategoria[categoria] = 0;
        }
        resumenPorCategoria[categoria] = resumenPorCategoria[categoria] + gastos[i].monto;
    }
    console.log('Total gastado por categoría:', resumenPorCategoria);

    const informe = {
        total: total,
        promedio: Number(promedio.toFixed(2)),
        cantidadAltos: cantidadAltos,
        mayorGasto: mayorGasto,
        resumenPorCategoria: resumenPorCategoria
    };
    console.log('Informe final de gastos:');
    console.log(JSON.stringify(informe, null, 2));
} catch (error) {
    console.error('Ocurrió un error al procesar los gastos: ' + error.message);
}

try {
    console.log('Prueba controlada: calcular el promedio de una lista vacía');
    calcularPromedio([]);
} catch (error) {
    console.error('Error capturado en la prueba controlada: ' + error.message);
}