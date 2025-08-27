// main.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 🔥 Ajusta o tamanho do canvas
canvas.width = 1800;
canvas.height = 1200;

// ------------------
// Estados do jogo
// ------------------
let cartasJogador = [];
let cartasTerreno = [];
let cartasEquipamento = [];

let maoJogador = [];
let maoOponente = [];

let terrenoJogador = [];
let terrenoOponente = [];

let equipamentosJogador = [];
let equipamentosOponente = [];

let resultadoTexto = '';
let cartaVencedora = null;

let rodadaAtual = 1;
let maxRodadas = 3;
let pontosJogador = 0;
let pontosOponente = 0;

// ------------------
// Seleções
// ------------------
let cartaSelecionada = null;
let atributoSelecionadoValor = null;
let equipamentoSelecionado = null;
let terrenoSelecionado = null;

// ------------------
// Utilidades
// ------------------
function rolarDado(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

// ------------------
// Carregar JSONs
// ------------------
async function carregarTodosJSON() {
    const [jogadorRes, terrenoRes, equipRes] = await Promise.all([
        fetch('cartas_jogador.json'),
        fetch('cartas_terreno.json'),
        fetch('cartas_equipamento.json')
    ]);
    const jogadorDados = await jogadorRes.json();
    const terrenoDados = await terrenoRes.json();
    const equipDados = await equipRes.json();

    cartasJogador = jogadorDados.cartas;
    cartasTerreno = terrenoDados.terrenos;
    cartasEquipamento = equipDados.equipamentos;

    iniciarPartida();
}

// ------------------
// Iniciar Partida
// ------------------
function iniciarPartida() {
    maoJogador = cartasJogador.sort(() => 0.5 - Math.random()).slice(0,3);
    maoOponente = cartasJogador.sort(() => 0.5 - Math.random()).slice(3,6);

    equipamentosJogador = cartasEquipamento.sort(() => 0.5 - Math.random()).slice(0,2);
    equipamentosOponente = cartasEquipamento.sort(() => 0.5 - Math.random()).slice(0,2);

    terrenoJogador = cartasTerreno.slice(0);
    terrenoOponente = cartasTerreno.slice(0);

    resultadoTexto = '';
    cartaVencedora = null;
    rodadaAtual = 1;
    pontosJogador = 0;
    pontosOponente = 0;

    atualizarInterface();
    desenharCartas();
}

// ------------------
// Calcular valor com bônus
// ------------------
function calcularValorComBonus(carta, atributo, equipamento=null, terreno=null) {
    let valor = carta[atributo] || 0;

    if(terreno) {
        if(terreno.bonus && terreno.bonus[atributo]) valor += terreno.bonus[atributo];
        if(terreno.punicao && terreno.punicao[atributo]) valor += terreno.punicao[atributo];
    }

    if(equipamento && equipamento.bonus && equipamento.bonus[atributo]) valor += equipamento.bonus[atributo];

    return valor;
}

// ------------------
// Jogar rodada
// ------------------
function jogarRodada(cartaJogador, atributo, equipamentoJogador=null, terrenoJogadorRodada=null) {
    const cartaOponente = maoOponente[Math.floor(Math.random() * maoOponente.length)];
    const equipamentoOponente = equipamentosOponente.length > 0 && Math.random() < 0.5 
        ? equipamentosOponente[Math.floor(Math.random()*equipamentosOponente.length)] 
        : null;
    const terrenoOponenteRodada = terrenoOponente.length > 0 && Math.random() < 0.5 
        ? terrenoOponente[Math.floor(Math.random()*terrenoOponente.length)] 
        : null;

    const valorJogador = calcularValorComBonus(cartaJogador, atributo, equipamentoJogador, terrenoJogadorRodada);
    const valorOponente = calcularValorComBonus(cartaOponente, atributo, equipamentoOponente, terrenoOponenteRodada);

    if(valorJogador > valorOponente) {
        resultadoTexto = `Você venceu! ${cartaJogador.nome} (${valorJogador}) > ${cartaOponente.nome} (${valorOponente})`;
        cartaVencedora = cartaJogador;
        pontosJogador++;
    } else if(valorJogador < valorOponente) {
        resultadoTexto = `Você perdeu! ${cartaJogador.nome} (${valorJogador}) < ${cartaOponente.nome} (${valorOponente})`;
        cartaVencedora = cartaOponente;
        pontosOponente++;
    } else {
        const dadoJogador = rolarDado();
        const dadoOponente = rolarDado();
        if(dadoJogador > dadoOponente) {
            resultadoTexto = `Empate! Mas você venceu no dado: ${dadoJogador} > ${dadoOponente}`;
            cartaVencedora = cartaJogador;
            pontosJogador++;
        } else if(dadoJogador < dadoOponente) {
            resultadoTexto = `Empate! Mas você perdeu no dado: ${dadoJogador} < ${dadoOponente}`;
            cartaVencedora = cartaOponente;
            pontosOponente++;
        } else {
            resultadoTexto = `Empate duplo! Dados iguais: ${dadoJogador}`;
            cartaVencedora = null;
        }
    }

    // Consome recursos
    maoJogador = maoJogador.filter(c => c !== cartaJogador);
    maoOponente = maoOponente.filter(c => c !== cartaOponente);
    if(equipamentoJogador) equipamentosJogador = equipamentosJogador.filter(eq => eq !== equipamentoJogador);
    if(equipamentoOponente) equipamentosOponente = equipamentosOponente.filter(eq => eq !== equipamentoOponente);
    if(terrenoJogadorRodada) terrenoJogador = terrenoJogador.filter(t => t !== terrenoJogadorRodada);
    if(terrenoOponenteRodada) terrenoOponente = terrenoOponente.filter(t => t !== terrenoOponenteRodada);

    atualizarInterface();
    desenharCartas();
}

// ------------------
// Desenho de uma carta
// ------------------
function desenharCarta(carta, x, y, width = 300, height = 450, variant = 1) {
    const img = new Image();
    img.src = `assets/images/heros/${carta.id}/${variant}.png`;
    img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        desenharOverlay();
    };

    function desenharOverlay() {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Nome da carta no topo (centralizado)
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(x, y, width, 50);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(carta.nome, x + width / 2, y + 34);

        // Barra de atributos no rodapé
        const atributos = [
            { nome: 'forca', cor: '#FF4444', icone: '⚔️' },
            { nome: 'destreza', cor: '#44FF44', icone: '🏹' },
            { nome: 'inteligencia', cor: '#4488FF', icone: '🧠' },
            { nome: 'constituicao', cor: '#FFFF44', icone: '💪' },
            { nome: 'defesa', cor: '#FFAA44', icone: '🛡️' },
        ];

        const barraAltura = 60;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(x, y + height - barraAltura, width, barraAltura);

        const spacing = width / atributos.length;

        atributos.forEach((attr, i) => {
            const centerX = x + spacing * i + spacing / 2;

            // Ícone
            ctx.font = '24px sans-serif';
            ctx.fillStyle = attr.cor;
            ctx.textAlign = 'center';
            ctx.fillText(attr.icone, centerX, y + height - barraAltura + 25);

            // Valor
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(carta[attr.nome], centerX, y + height - barraAltura + 50);
        });
    }
}



// ------------------
// Desenhar cartas no canvas
// ------------------
function desenharCartas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jogador (embaixo, alinhado à direita)
    maoJogador.forEach((c, i) => {
        desenharCarta(c, canvas.width - ((i + 1) * 320), 700, 300, 450, (Math.floor(Math.random() * 3) + 1));
    });

    // Oponente (em cima, alinhado à esquerda)
    maoOponente.forEach((c, i) => {
        desenharCarta(c, 80 + i * 320, 80, 300, 450, (Math.floor(Math.random() * 3) + 1));
    });

    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Rodada: ${rodadaAtual}/${maxRodadas}`, 20, canvas.height - 50);
    ctx.fillText(`Placar: Jogador ${pontosJogador} - ${pontosOponente} Oponente`, 400, canvas.height - 50);

    if(resultadoTexto) {
        ctx.fillText(resultadoTexto, 20, canvas.height - 100);
    }
}

// ------------------
// Interface
// ------------------
function atualizarInterface() {
    document.getElementById('cartasJogador').innerHTML =
        '<h3>Cartas na mão:</h3>' +
        maoJogador.map((c,i)=> `<button onclick="selecionarCarta(${i})">${c.nome}</button>`).join('');

    document.getElementById('atributos').innerHTML =
        '<h3>Atributos:</h3>' +
        ['forca','destreza','inteligencia','constituicao','defesa']
        .map(a=> `<button onclick="atributoSelecionado('${a}')">${a}</button>`).join('');

    document.getElementById('equipamentosJogador').innerHTML =
        '<h3>Equipamentos:</h3>' +
        equipamentosJogador.map((e,i)=> `<button onclick="equipamentoSelecionadoFunction(${i})">${e.nome}</button>`).join('');

    document.getElementById('terrenosJogador').innerHTML =
        '<h3>Terrenos:</h3>' +
        terrenoJogador.map((t,i)=> `<button onclick="terrenoSelecionadoFunction(${i})">${t.nome}</button>`).join('');
}

// ------------------
// Seleções
// ------------------
function selecionarCarta(i) { cartaSelecionada = maoJogador[i]; }
function atributoSelecionado(a) { atributoSelecionadoValor = a; }
function equipamentoSelecionadoFunction(i) { equipamentoSelecionado = equipamentosJogador[i]; }
function terrenoSelecionadoFunction(i) { terrenoSelecionado = terrenoJogador[i]; }

// ------------------
// Botão Jogar
// ------------------
document.getElementById('playBtn').addEventListener('click', () => {
    if(!cartaSelecionada || !atributoSelecionadoValor) {
        alert('Selecione uma carta e um atributo para jogar!');
        return;
    }
    jogarRodada(cartaSelecionada, atributoSelecionadoValor, equipamentoSelecionado, terrenoSelecionado);

    cartaSelecionada = null;
    atributoSelecionadoValor = null;
    equipamentoSelecionado = null;
    terrenoSelecionado = null;
});

// ------------------
// Inicializar
// ------------------
document.addEventListener('DOMContentLoaded', () => {
    carregarTodosJSON();
});
