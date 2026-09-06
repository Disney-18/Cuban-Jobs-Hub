#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TIPOS_VALIDOS = ['empleo', 'beca', 'curso', 'freelance', 'recurso'];
const CATEGORIAS_VALIDAS = [
    'Administracion', 'Diseno', 'Redaccion', 'Marketing',
    'Traduccion', 'Audiovisual', 'Idiomas', 'Programacion',
    'Educacion', 'Salud', 'Arte', 'Finanzas', 'Ventas', 'Legal',
    'Recursos Humanos'
];
const MODALIDADES_VALIDAS = ['remoto', 'presencial', 'hibrido', 'recurso'];

const CAMPOS_OBLIGATORIOS = [
    'id', 'tipo', 'titulo', 'organizacion',
    'pais_organizacion', 'modalidad', 'pago_internacional',
    'sin_residencia', 'categoria'
];

function validarOportunidad(item, index) {
    var errores = [];
    var advertencias = [];

    CAMPOS_OBLIGATORIOS.forEach(function(campo) {
        if (item[campo] === undefined || item[campo] === null || item[campo] === '') {
            errores.push('Falta el campo "' + campo + '"');
        }
    });

    if (item.tipo && !TIPOS_VALIDOS.includes(item.tipo)) {
        errores.push('Tipo "' + item.tipo + '" no valido');
    }

    if (item.categoria && !CATEGORIAS_VALIDAS.includes(item.categoria)) {
        advertencias.push('Categoria "' + item.categoria + '" no recomendada');
    }

    if (item.modalidad && !MODALIDADES_VALIDAS.includes(item.modalidad)) {
        errores.push('Modalidad "' + item.modalidad + '" no valida');
    }

    if (item.pago_internacional === true && (!item.metodos_pago || item.metodos_pago.length === 0)) {
        advertencias.push('Pago internacional = true pero no hay metodos de pago');
    }

    if (item.enlace && !item.enlace.startsWith('http')) {
        advertencias.push('Enlace debe comenzar con http:// o https://');
    }

    if (item.id && !item.id.match(/^(emp|bec|cur|fre|rec)-\d{3}$/)) {
        advertencias.push('ID no sigue el formato recomendado');
    }

    return { errores: errores, advertencias: advertencias };
}

function main() {
    var filePath = path.join(__dirname, '..', 'data', 'oportunidades.json');

    if (!fs.existsSync(filePath)) {
        console.error('Archivo no encontrado: ' + filePath);
        process.exit(1);
    }

    var data;
    try {
        var content = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(content);
    } catch (err) {
        console.error('Error al parsear JSON: ' + err.message);
        process.exit(1);
    }

    if (!data.oportunidades || !Array.isArray(data.oportunidades)) {
        console.error('El archivo debe contener un array "oportunidades"');
        process.exit(1);
    }

    console.log('Validando ' + data.oportunidades.length + ' oportunidades...\n');

    var totalErrores = 0;
    var totalAdvertencias = 0;

    data.oportunidades.forEach(function(item, index) {
        var result = validarOportunidad(item, index);
        var errores = result.errores;
        var advertencias = result.advertencias;

        if (errores.length > 0 || advertencias.length > 0) {
            console.log('Entrada ' + (index + 1) + ': ' + (item.titulo || 'Sin titulo'));

            errores.forEach(function(err) {
                console.log('   ERROR: ' + err);
                totalErrores++;
            });

            advertencias.forEach(function(warn) {
                console.log('   ADVERTENCIA: ' + warn);
                totalAdvertencias++;
            });

            console.log('');
        }
    });

    console.log('--------------------------------------------------');
    console.log(data.oportunidades.length + ' oportunidades procesadas');
    console.log(totalErrores + ' errores encontrados');
    console.log(totalAdvertencias + ' advertencias encontradas');
    console.log('--------------------------------------------------');

    if (totalErrores > 0) {
        console.log('Validacion fallida. Corrige los errores.');
        process.exit(1);
    } else {
        console.log('Validacion exitosa!');
        process.exit(0);
    }
}

main();
