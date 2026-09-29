function lerNumeroBrasileiro(valor)
{
    return Number(valor.replace(/\./g, "").replace(",", "."));
}

function formatarDuranteDigitacao(evento)
{
    let campo = evento.target;
    let valor = campo.value;
    let posicaoCursor = campo.selectionStart;
    let prefixo = valor.slice(0, posicaoCursor);
    let indiceVirgula = valor.lastIndexOf(",");
    let parteInteira = indiceVirgula === -1 ? valor : valor.slice(0, indiceVirgula);
    let parteDecimal = indiceVirgula === -1 ? "" : valor.slice(indiceVirgula + 1);
    let digitosInteiros = parteInteira.replace(/\D/g, "");
    let digitosDecimais = parteDecimal.replace(/\D/g, "").slice(0, 2);
    let inteiroFormatado = digitosInteiros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let valorFormatado = inteiroFormatado;

    if (indiceVirgula !== -1) {
        valorFormatado += "," + digitosDecimais;
    }

    let virgulaAntesDoCursor = prefixo.includes(",");
    let digitosAntesDoCursor = (prefixo.match(/\d/g) || []).length;
    let novaPosicaoCursor = 0;

    if (virgulaAntesDoCursor) {
        novaPosicaoCursor = valorFormatado.indexOf(",") + 1 +
            (prefixo.split(",")[1].match(/\d/g) || []).length;
    } else {
        let digitosEncontrados = 0;
        for (let indice = 0; indice < valorFormatado.length; indice++) {
            if (/\d/.test(valorFormatado[indice])) digitosEncontrados++;
            novaPosicaoCursor = indice + 1;
            if (digitosEncontrados === digitosAntesDoCursor) break;
        }
    }

    campo.value = valorFormatado;
    campo.setSelectionRange(novaPosicaoCursor, novaPosicaoCursor);
}

function formatarCampo(evento)
{
    let campo = evento.target;
    let valor = campo.value.trim();
    if (valor === "" || valor === ",") return;

    let numero = lerNumeroBrasileiro(valor);
    if (Number.isFinite(numero)) {
        campo.value = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    ["Capital", "valorMensal"].forEach(function (id) {
        let campo = document.getElementById(id);
        campo.addEventListener("input", formatarDuranteDigitacao);
        campo.addEventListener("blur", formatarCampo);
    });
});

function Test1()
{
    let Capital = lerNumeroBrasileiro(document.getElementById("Capital").value);
    let Juros = Number(document.getElementById("Juros").value);
    let Tempo = Number(document.getElementById("Tempo").value);
    let valorMensal = lerNumeroBrasileiro(document.getElementById("valorMensal").value);

    let meses = Tempo * 12;
    let taxaMensal = (1 + Juros / 100) ** (1 / 12) - 1;
    let totalInvestido = Capital + valorMensal * meses;
    let residual = taxaMensal === 0
        ? Capital + valorMensal * meses
        : Capital * (1 + taxaMensal) ** meses + valorMensal * (((1 + taxaMensal) ** meses - 1) / taxaMensal);
    let totalGanho = residual - totalInvestido;
    let totalInvestidoFormatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalInvestido);
    let residualFormatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(residual);
    let totalGanhoFormatado = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalGanho);
    alert("Total investido: " + totalInvestidoFormatado + "\nGanho total com Juros: " + totalGanhoFormatado + "\nValor residual: " + residualFormatado);
}