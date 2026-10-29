// ============================================
// Liquidador laboral 2026 - Taller 3.2
// ============================================

// ----- Constantes 2026 -----
const SMMLV = 1750905;          // Salario minimo 2026 (Decreto 1469 de 2025)
const AUX_TTE = 249095;         // Auxilio de transporte 2026 (Decreto 1470 de 2025)
const JORNADA_SEMANAL = 42;     // Horas semanales (referencia)
const TASA_SALUD = 0.04;        // 4 % aporte del trabajador a salud
const TASA_PENSION = 0.04;      // 4 % aporte del trabajador a pension
const TASA_INTERESES = 0.12;    // 12 % anual sobre cesantias (Ley 52 de 1975)

// ----- Base prestacional -----
// El auxilio de transporte solo aplica si el salario es de hasta 2 SMMLV.
// Entra en prima y cesantias, pero NO en vacaciones.
function basePrestacional(salario) {
    let aux;

    if (salario <= 2 * SMMLV) {
        aux = AUX_TTE;
    } else {
        aux = 0;
    }

    return salario + aux;
}

// ----- Prestaciones -----

// Prima de servicios (art. 306 CST): 30 dias de salario por ano
function prima(salario, dias) {
    return basePrestacional(salario) * dias / 360;
}

// Cesantias (art. 249 CST): un mes de salario por cada ano de servicio
function cesantias(salario, dias) {
    return basePrestacional(salario) * dias / 360;
}

// Intereses sobre cesantias (Ley 52 de 1975): 12 % anual
function interesesCesantias(salario, dias) {
    return cesantias(salario, dias) * dias * TASA_INTERESES / 360;
}

// Vacaciones (art. 186 CST): 15 dias habiles por ano. Sin auxilio de transporte.
function vacaciones(salario, dias) {
    return salario * dias / 720;
}

// ----- Aportes mensuales del trabajador -----
function aporteSalud(salario) {
    return salario * TASA_SALUD;
}

function aportePension(salario) {
    return salario * TASA_PENSION;
}

// ----- Liquidacion -----

// Devuelve el texto con todos los resultados de una liquidacion
function textoLiquidacion(salario, dias) {
    let texto;

    texto = "Salario: $" + salario + "\n" +
            "Dias trabajados: " + dias + "\n\n" +
            "Cesantias: $" + Math.round(cesantias(salario, dias)) + "\n" +
            "Intereses sobre cesantias: $" + Math.round(interesesCesantias(salario, dias)) + "\n" +
            "Prima de servicios: $" + Math.round(prima(salario, dias)) + "\n" +
            "Vacaciones: $" + Math.round(vacaciones(salario, dias)) + "\n\n" +
            "Aporte salud (4 %, mensual): $" + Math.round(aporteSalud(salario)) + "\n" +
            "Aporte pension (4 %, mensual): $" + Math.round(aportePension(salario));

    return texto;
}

// Muestra los tres casos del taller
function casosTaller() {
    alert("Caso 1: salario minimo por un ano completo\n\n" + textoLiquidacion(SMMLV, 360));
    alert("Caso 2: salario de $3.200.000 por 200 dias\n\n" + textoLiquidacion(3200000, 200));
    alert("Caso 3: salario de $6.000.000 por 90 dias\n\n" + textoLiquidacion(6000000, 90));
}

// Liquida con los datos que escribe el usuario
function liquidarPorDatos() {
    let salario, dias;

    salario = parseFloat(prompt("Ingrese el salario mensual"));
    dias = parseInt(prompt("Ingrese los dias trabajados (1 a 360)"), 10);

    if (!(salario > 0) || !(dias >= 1 && dias <= 360)) {
        alert("Revise los datos: el salario debe ser mayor que 0 y los dias entre 1 y 360");
        return;
    }

    alert(textoLiquidacion(salario, dias));
}

// ----- Pruebas unitarias (valores calculados a mano) -----

// Devuelve una linea de texto que indica si la prueba paso
function linea(ok, nombre) {
    if (ok) {
        return "OK     " + nombre + "\n";
    }
    return "FALLO  " + nombre + "\n";
}

function pruebas() {
    let ok, aciertos, texto;

    aciertos = 0;
    texto = "";

    // 1. Salario minimo + auxilio: 1.750.905 + 249.095 = 2.000.000
    ok = basePrestacional(SMMLV) === 2000000;
    texto = texto + linea(ok, "Base con auxilio, salario minimo = 2.000.000");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 2. 3.600.000 es mayor que 2 SMMLV (3.501.810), entonces no hay auxilio
    ok = basePrestacional(3600000) === 3600000;
    texto = texto + linea(ok, "Base sin auxilio, 3.600.000 = 3.600.000");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 3. Cesantias del salario minimo por 360 dias = 2.000.000
    ok = Math.round(cesantias(SMMLV, 360)) === 2000000;
    texto = texto + linea(ok, "Cesantias, salario minimo 360 dias = 2.000.000");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 4. Intereses: 2.000.000 x 360 x 12 % / 360 = 240.000
    ok = Math.round(interesesCesantias(SMMLV, 360)) === 240000;
    texto = texto + linea(ok, "Intereses, salario minimo 360 dias = 240.000");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 5. Prima: 6.000.000 x 90 / 360 = 1.500.000
    ok = Math.round(prima(6000000, 90)) === 1500000;
    texto = texto + linea(ok, "Prima, 6.000.000 por 90 dias = 1.500.000");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 6. Vacaciones sin auxilio: 1.750.905 / 2 = 875.452,5, redondeado a 875.453
    ok = Math.round(vacaciones(SMMLV, 360)) === 875453;
    texto = texto + linea(ok, "Vacaciones sin auxilio, salario minimo = 875.453");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 7. Cesantias con auxilio: 3.449.095 x 200 / 360 = 1.916.163,89, redondeado a 1.916.164
    ok = Math.round(cesantias(3200000, 200)) === 1916164;
    texto = texto + linea(ok, "Cesantias, 3.200.000 por 200 dias = 1.916.164");
    if (ok) {
        aciertos = aciertos + 1;
    }

    // 8. Aporte a salud: 1.750.905 x 4 % = 70.036,2, redondeado a 70.036
    ok = Math.round(aporteSalud(SMMLV)) === 70036;
    texto = texto + linea(ok, "Aporte salud, salario minimo = 70.036");
    if (ok) {
        aciertos = aciertos + 1;
    }

    texto = texto + "\n" + aciertos + " de 8 pruebas correctas";
    alert(texto);
}
