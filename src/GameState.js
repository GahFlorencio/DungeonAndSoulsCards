/**
 * Gerencia o estado do jogo
 */
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        // Cartas disponíveis
        this.cartasJogador = [];
        this.cartasTerreno = [];
        this.cartasEquipamento = [];

        // Mãos dos jogadores (3 cartas cada)
        this.maoJogador = [];
        this.maoOponente = [];

        // Recursos escolhidos no início da partida
        this.equipamentosJogador = []; // 2 equipamentos escolhidos
        this.equipamentosOponente = []; // 2 equipamentos escolhidos
        this.terrenoJogador = null; // 1 terreno escolhido
        this.terrenoOponente = null; // 1 terreno escolhido

        // Recursos usados (não podem ser reutilizados)
        this.equipamentosUsadosJogador = [];
        this.equipamentosUsadosOponente = [];
        this.terrenosUsadosJogador = [];
        this.terrenosUsadosOponente = [];

        // Estado da partida
        this.rodadaAtual = 1;
        this.maxRodadas = 3; // Pode ser 2 ou 3
        this.pontosJogador = 0;
        this.pontosOponente = 0;
        this.jogoFinalizado = false;
        this.vencedor = null;

        // Estado do turno atual
        this.turnoAtual = 1; // 1, 2 ou 3
        this.jogadorIniciante = null; // 1 = jogador, 2 = oponente
        this.primeiraTentativa = true; // Para decidir quem inicia por dado

        // Seleções da rodada
        this.atributoRodada = null; // Definido pelo primeiro jogador
        this.terrenoRodada = null; // Definido pelo primeiro jogador

        // Cartas jogadas na rodada atual
        this.cartaJogadorRodada = null;
        this.cartaOponenteRodada = null;
        this.equipamentoJogadorRodada = null;
        this.equipamentoOponenteRodada = null;

        // Seleções temporárias do jogador
        this.cartaSelecionada = null;
        this.atributoSelecionado = null;
        this.equipamentoSelecionado = null;
        this.terrenoSelecionado = null;

        // Resultado da rodada
        this.resultadoTexto = '';
        this.cartaVencedora = null;
    }

    // Getters para estado do jogo
    isGameFinished() {
        return this.jogoFinalizado || 
               this.rodadaAtual > this.maxRodadas || 
               this.maoJogador.length === 0 || 
               this.maoOponente.length === 0;
    }

    getCurrentRoundInfo() {
        return {
            rodada: this.rodadaAtual,
            maxRodadas: this.maxRodadas,
            turno: this.turnoAtual,
            pontosJogador: this.pontosJogador,
            pontosOponente: this.pontosOponente,
            jogadorIniciante: this.jogadorIniciante,
            atributoRodada: this.atributoRodada,
            terrenoRodada: this.terrenoRodada
        };
    }

    getPlayerSelections() {
        return {
            carta: this.cartaSelecionada,
            atributo: this.atributoSelecionado,
            equipamento: this.equipamentoSelecionado,
            terreno: this.terrenoSelecionado
        };
    }

    // Validações baseadas no turno
    canPlayTurn() {
        if (this.turnoAtual === 1) {
            // Primeiro turno: precisa carta + atributo (jogador iniciante)
            return this.cartaSelecionada && this.atributoSelecionado;
        } else if (this.turnoAtual === 2) {
            // Segundo turno: precisa apenas carta (segundo jogador)
            return this.cartaSelecionada;
        }
        return false;
    }

    isFirstPlayer() {
        return (this.turnoAtual === 1 && this.jogadorIniciante === 1) ||
               (this.turnoAtual === 2 && this.jogadorIniciante === 2);
    }

    canSelectTerrain() {
        // Só pode selecionar terreno se for o primeiro jogador da rodada
        return this.isFirstPlayer() && this.turnoAtual === 1;
    }

    canSelectAttribute() {
        // Só pode selecionar atributo se for o primeiro jogador da rodada
        return this.isFirstPlayer() && this.turnoAtual === 1;
    }

    // Equipamentos disponíveis (não usados ainda)
    getAvailableEquipments() {
        return this.equipamentosJogador.filter(eq =>
            !this.equipamentosUsadosJogador.includes(eq)
        );
    }

    // Terrenos disponíveis (não usados ainda na rodada)
    getAvailableTerrains() {
        if (!this.canSelectTerrain()) return [];
        return [this.terrenoJogador].filter(t =>
            t && !this.terrenosUsadosJogador.includes(t)
        );
    }

    // Setters para seleções
    selectCard(carta) {
        this.cartaSelecionada = carta;
    }

    selectAttribute(atributo) {
        if (this.canSelectAttribute()) {
            this.atributoSelecionado = atributo;
        }
    }

    selectEquipment(equipamento) {
        this.equipamentoSelecionado = equipamento;
    }

    selectTerrain(terreno) {
        if (this.canSelectTerrain()) {
            this.terrenoSelecionado = terreno;
        }
    }

    clearSelections() {
        this.cartaSelecionada = null;
        this.atributoSelecionado = null;
        this.equipamentoSelecionado = null;
        this.terrenoSelecionado = null;
    }

    // Avança para próximo turno/rodada
    nextTurn() {
        if (this.turnoAtual === 3) {
            // Fim da rodada, avança para próxima
            this.rodadaAtual++;
            this.turnoAtual = 1;
            // Alterna quem inicia
            this.jogadorIniciante = this.jogadorIniciante === 1 ? 2 : 1;
            // Limpa estado da rodada
            this.atributoRodada = null;
            this.terrenoRodada = null;
            this.cartaJogadorRodada = null;
            this.cartaOponenteRodada = null;
            this.equipamentoJogadorRodada = null;
            this.equipamentoOponenteRodada = null;
        } else {
            this.turnoAtual++;
        }
    }

    // Define configurações da rodada (primeiro turno)
    setRoundConfiguration(atributo, terreno = null) {
        this.atributoRodada = atributo;
        this.terrenoRodada = terreno;
        if (terreno) {
            this.terrenosUsadosJogador.push(terreno);
        }
    }

    // Usa equipamento (marca como usado)
    useEquipment(equipamento, isPlayer = true) {
        if (isPlayer) {
            this.equipamentosUsadosJogador.push(equipamento);
        } else {
            this.equipamentosUsadosOponente.push(equipamento);
        }
    }
}
