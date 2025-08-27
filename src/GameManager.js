/**
 * Gerenciador principal do jogo - coordena todos os outros componentes
 */
class GameManager {
    constructor() {
        this.gameState = new GameState();
        this.cardManager = new CardManager();
        this.cardRenderer = null;
        this.uiManager = null;
        
        // Estado da fase do jogo
        this.gamePhase = 'SETUP'; // SETUP, EQUIPMENT_SELECTION, TERRAIN_SELECTION, PLAYING
        this.setupData = null;
        
        // Novo sistema de seleção
        this.selectedPlayerCard = null;
        this.selectedAttribute = null;
        this.battleLog = [];

        this.initializeGame();
    }

    async initializeGame() {
        // Carrega as cartas
        const success = await this.cardManager.loadAllCards();
        if (!success) {
            alert('Erro ao carregar cartas do jogo!');
            return;
        }

        // Inicializa componentes de UI (novo sistema HTML/DOM)
        this.cardRenderer = new CardRenderer();
        this.uiManager = new UIManager(this.gameState, this.cardManager);

        // Inicia fase de preparação
        this.startSetupPhase();
        
        // Força a renderização inicial das cartas
        setTimeout(() => {
            this.cardRenderer.renderAllCards();
        }, 100);
        
        // Inicializa battle log
        this.addBattleLogEntry('🎮 Bem-vindo ao Dungeon & Souls Cards!', 'system');
        this.addBattleLogEntry('⚔️ Preparando battlefield...', 'system');
    }

    /**
     * Fase 1: Distribuição de cartas
     */
    startSetupPhase() {
        this.gamePhase = 'SETUP';
        this.gameState.reset();

        try {
            // Distribui cartas e obtém recursos disponíveis
            this.setupData = this.cardManager.distributeCards();
            this.gameState.cartasJogador = this.cardManager.cartasJogador;
            this.gameState.cartasTerreno = this.cardManager.cartasTerreno;
            this.gameState.cartasEquipamento = this.cardManager.cartasEquipamento;
            
            this.gameState.maoJogador = this.setupData.maoJogador;
            this.gameState.maoOponente = this.setupData.maoOponente;

            // Oponente seleciona recursos automaticamente
            const opponentResources = this.cardManager.selectOpponentResources();
            this.gameState.equipamentosOponente = opponentResources.equipamentosOponente;
            this.gameState.terrenoOponente = opponentResources.terrenoOponente;

            // Inicia seleção de equipamentos do jogador
            this.startEquipmentSelection();
        } catch (error) {
            console.error('Erro no setup, usando cartas de teste:', error);
            
            // Fallback: Cria cartas de teste temporárias
            const cartasTeste = [
                { id: 1, nome: 'Guerreiro', forca: 8, destreza: 4, constituicao: 7, inteligencia: 3, tipo: 'hero' },
                { id: 2, nome: 'Mago', forca: 3, destreza: 5, constituicao: 4, inteligencia: 8, tipo: 'hero' },
                { id: 3, nome: 'Arqueiro', forca: 5, destreza: 8, constituicao: 5, inteligencia: 6, tipo: 'hero' }
            ];

            // Define as mãos dos jogadores
            this.gameState.maoJogador = [...cartasTeste];
            this.gameState.maoOponente = [...cartasTeste];
            
            // Atualiza display diretamente
            this.updateDisplay();
        }
    }

    /**
     * Fase 2: Seleção de equipamentos (jogador escolhe 2)
     */
    startEquipmentSelection() {
        this.gamePhase = 'EQUIPMENT_SELECTION';
        this.gameState.equipamentosJogador = [];
        this.updateDisplay();

        // Abre imediatamente o modal de seleção de equipamentos (obrigatório)
        setTimeout(() => {
            this.uiManager.showEquipmentModal();
        }, 100);
    }

    /**
     * Fase 3: Seleção de terreno (jogador escolhe 1)
     */
    startTerrainSelection() {
        this.gamePhase = 'TERRAIN_SELECTION';
        this.updateDisplay();

        // Abre imediatamente o modal de seleção de terreno (obrigatório)
        setTimeout(() => {
            this.uiManager.showTerrainModal();
        }, 100);
    }

    /**
     * Fase 4: Inicia o jogo propriamente dito
     */
    startGamePhase() {
        this.gamePhase = 'PLAYING';

        // Rola dado para decidir quem inicia
        const initiative = this.cardManager.rollInitiative();
        this.gameState.jogadorIniciante = initiative.jogadorInicia;
        this.gameState.primeiraTentativa = false;

        this.gameState.resultadoTexto = `🎲 Dados: Você ${initiative.dadoJogador} x ${initiative.dadoOponente} Oponente. ${
            initiative.jogadorInicia === 1 ? 'Você' : 'Oponente'
        } inicia!`;

        this.updateDisplay();
    }

    /**
     * Seleciona equipamento durante a fase de seleção
     */
    selectEquipmentForSetup(equipamento) {
        if (this.gamePhase !== 'EQUIPMENT_SELECTION') return;

        if (!this.gameState.equipamentosJogador.includes(equipamento)) {
            this.gameState.equipamentosJogador.push(equipamento);

            if (this.gameState.equipamentosJogador.length === 2) {
                this.startTerrainSelection();
            }
        }
        this.updateDisplay();
    }

    /**
     * Seleciona terreno durante a fase de seleção
     */
    selectTerrainForSetup(terreno) {
        if (this.gamePhase !== 'TERRAIN_SELECTION') return;

        this.gameState.terrenoJogador = terreno;
        this.startGamePhase();
    }

    /**
     * Joga um turno
     */
    playTurn() {
        if (this.gamePhase !== 'PLAYING') return;

        // Valida se pode jogar
        if (!this.gameState.canPlayTurn()) {
            this.showTurnInstructions();
            return;
        }

        if (this.gameState.isGameFinished()) {
            alert('O jogo já terminou!');
            return;
        }

        // Executa o turno baseado no estado atual
        if (this.gameState.turnoAtual === 1) {
            this.executeFirstTurn();
        } else if (this.gameState.turnoAtual === 2) {
            this.executeSecondTurn();
        }

        this.updateDisplay();
    }

    /**
     * Primeiro turno: jogador iniciante define atributo e terreno
     */
    executeFirstTurn() {
        const selections = this.gameState.getPlayerSelections();

        if (this.gameState.jogadorIniciante === 1) {
            // Jogador humano é o iniciante
            this.gameState.cartaJogadorRodada = selections.carta;
            this.gameState.equipamentoJogadorRodada = selections.equipamento;

            // Define configurações da rodada
            this.gameState.setRoundConfiguration(selections.atributo, selections.terreno);

            // Marca equipamento e terreno como usados
            if (selections.equipamento) {
                this.gameState.useEquipment(selections.equipamento, true);
            }

            // Remove carta da mão
            this.gameState.maoJogador = this.gameState.maoJogador.filter(c => c !== selections.carta);

            this.gameState.resultadoTexto = `🎯 Você definiu: ${selections.atributo} ${selections.terreno ? 'em ' + selections.terreno.nome : ''}`;
        } else {
            // IA é o iniciante
            this.executeOpponentFirstTurn();
        }

        this.gameState.nextTurn();
        this.gameState.clearSelections();
    }

    /**
     * Segundo turno: segundo jogador joga carta
     */
    executeSecondTurn() {
        const selections = this.gameState.getPlayerSelections();
        
        if (this.gameState.jogadorIniciante === 2) {
            // Jogador humano é o segundo
            this.gameState.cartaJogadorRodada = selections.carta;
            this.gameState.equipamentoJogadorRodada = selections.equipamento;

            if (selections.equipamento) {
                this.gameState.useEquipment(selections.equipamento, true);
            }

            this.gameState.maoJogador = this.gameState.maoJogador.filter(c => c !== selections.carta);

            // IA já jogou no primeiro turno, agora executa terceiro turno
            this.executeThirdTurn();
        } else {
            // IA é o segundo
            this.executeOpponentSecondTurn();
            this.executeThirdTurn();
        }

        this.gameState.clearSelections();
    }

    /**
     * Terceiro turno: comparação e resultado
     */
    executeThirdTurn() {
        const atributo = this.gameState.atributoRodada;
        const terreno = this.gameState.terrenoRodada;

        // Calcula valores
        const valorJogador = this.cardManager.calculateAttributeValue(
            this.gameState.cartaJogadorRodada,
            atributo,
            this.gameState.equipamentoJogadorRodada,
            terreno
        );

        const valorOponente = this.cardManager.calculateAttributeValue(
            this.gameState.cartaOponenteRodada,
            atributo,
            this.gameState.equipamentoOponenteRodada,
            terreno
        );

        // Determina vencedor
        this.determineRoundWinner(valorJogador, valorOponente, atributo);

        // Verifica fim do jogo
        this.checkGameEnd();

        // Prepara próxima rodada
        setTimeout(() => {
            this.gameState.nextTurn();
            this.updateDisplay();
        }, 3000);
    }

    /**
     * IA escolhe carta do oponente
     */
    chooseOpponentCard() {
        if (this.gameState.maoOponente.length === 0) return null;
        
        // IA simples: escolhe carta aleatória
        // TODO: Melhorar IA para escolher baseada no atributo selecionado
        const randomIndex = Math.floor(Math.random() * this.gameState.maoOponente.length);
        return this.gameState.maoOponente[randomIndex];
    }

    /**
     * IA escolhe equipamento
     */
    chooseOpponentEquipment() {
        if (this.gameState.equipamentosOponente.length === 0) return null;
        
        // 50% de chance de usar equipamento
        if (Math.random() < 0.5) {
            const randomIndex = Math.floor(Math.random() * this.gameState.equipamentosOponente.length);
            return this.gameState.equipamentosOponente[randomIndex];
        }
        return null;
    }

    /**
     * IA escolhe terreno
     */
    chooseOpponentTerrain() {
        if (this.gameState.terrenoOponente.length === 0) return null;
        
        // 50% de chance de usar terreno
        if (Math.random() < 0.5) {
            const randomIndex = Math.floor(Math.random() * this.gameState.terrenoOponente.length);
            return this.gameState.terrenoOponente[randomIndex];
        }
        return null;
    }

    /**
     * IA escolhe atributo
     */
    chooseOpponentAttribute() {
        const attributes = this.cardManager.getAvailableAttributes();
        return attributes[Math.floor(Math.random() * attributes.length)];
    }

    /**
     * Determina vencedor da rodada
     */
    determineRoundWinner(valorJogador, valorOponente, atributo) {
        // Armazena cartas da rodada para exibição
        // this.gameState.cartaJogadorRodada = cartaJogador;
        // this.gameState.cartaOponenteRodada = cartaOponente;

        if (valorJogador > valorOponente) {
            this.gameState.resultadoTexto = `🎉 Você venceu! ${valorJogador} > ${valorOponente}`;
            this.gameState.cartaVencedora = this.gameState.cartaJogadorRodada;
            this.gameState.pontosJogador++;
        } else if (valorJogador < valorOponente) {
            this.gameState.resultadoTexto = `😞 Você perdeu! ${valorJogador} < ${valorOponente}`;
            this.gameState.cartaVencedora = this.gameState.cartaOponenteRodada;
            this.gameState.pontosOponente++;
        } else {
            // Empate - rola dados
            const dadoJogador = this.cardManager.rollDice();
            const dadoOponente = this.cardManager.rollDice();
            
            if (dadoJogador > dadoOponente) {
                this.gameState.resultadoTexto = `🎲 Empate! Mas você venceu no dado: ${dadoJogador} > ${dadoOponente}`;
                this.gameState.cartaVencedora = this.gameState.cartaJogadorRodada;
                this.gameState.pontosJogador++;
            } else if (dadoJogador < dadoOponente) {
                this.gameState.resultadoTexto = `🎲 Empate! Mas você perdeu no dado: ${dadoJogador} < ${dadoOponente}`;
                this.gameState.cartaVencedora = this.gameState.cartaOponenteRodada;
                this.gameState.pontosOponente++;
            } else {
                this.gameState.resultadoTexto = `🤝 Empate total! Dados iguais: ${dadoJogador}`;
                this.gameState.cartaVencedora = null;
            }
        }
    }

    /**
     * Remove recursos usados na rodada
     */
    consumeResources(cartaJogador, cartaOponente, equipJogador, equipOponente, terrenoJogador, terrenoOponente) {
        // Remove cartas jogadas
        this.gameState.maoJogador = this.gameState.maoJogador.filter(c => c !== cartaJogador);
        this.gameState.maoOponente = this.gameState.maoOponente.filter(c => c !== cartaOponente);
        
        // Remove equipamentos usados
        if (equipJogador) {
            this.gameState.equipamentosJogador = this.gameState.equipamentosJogador.filter(e => e !== equipJogador);
        }
        if (equipOponente) {
            this.gameState.equipamentosOponente = this.gameState.equipamentosOponente.filter(e => e !== equipOponente);
        }
        
        // Remove terrenos usados
        if (terrenoJogador) {
            this.gameState.terrenoJogador = this.gameState.terrenoJogador.filter(t => t !== terrenoJogador);
        }
        if (terrenoOponente) {
            this.gameState.terrenoOponente = this.gameState.terrenoOponente.filter(t => t !== terrenoOponente);
        }
    }

    /**
     * Verifica se o jogo terminou
     */
    checkGameEnd() {
        if (this.gameState.isGameFinished()) {
            this.gameState.jogoFinalizado = true;
            
            // Determina vencedor final
            if (this.gameState.pontosJogador > this.gameState.pontosOponente) {
                this.gameState.vencedor = 'jogador';
            } else if (this.gameState.pontosOponente > this.gameState.pontosJogador) {
                this.gameState.vencedor = 'oponente';
            } else {
                this.gameState.vencedor = 'empate';
            }
        }
    }

    /**
     * Reseta o jogo para jogar novamente
     */
    resetGame() {
        this.startNewGame();
    }

    /**
     * Seleções do jogador
     */
    selectCard(index) {
        if (index < 0 || index >= this.gameState.maoJogador.length) return;

        const carta = this.gameState.maoJogador[index];
        this.gameState.selectCard(carta);
        this.updateDisplay();
    }

    selectAttribute(atributo) {
        this.gameState.selectAttribute(atributo);
        this.updateDisplay();
    }

    selectEquipment(index) {
        if (index === null) {
            this.gameState.selectEquipment(null);
        } else if (index >= 0 && index < this.gameState.equipamentosJogador.length) {
            const equipamento = this.gameState.equipamentosJogador[index];
            this.gameState.selectEquipment(equipamento);
        }
        this.updateDisplay();
    }

    selectTerrain(index) {
        if (index === null) {
            this.gameState.selectTerrain(null);
        } else if (index >= 0 && index < this.gameState.terrenoJogador.length) {
            const terreno = this.gameState.terrenoJogador[index];
            this.gameState.selectTerrain(terreno);
        }
        this.updateDisplay();
    }

    /**
     * Atualiza toda a exibição
     */
    updateDisplay() {
        this.uiManager.updateInterface();
        this.cardRenderer.renderAllCards();
        this.updateGameStatus();

        if (this.gameState.isGameFinished()) {
            this.uiManager.showGameResult();
        }
    }

    /**
     * Inicia uma nova partida
     */
    startNewGame() {
        this.startSetupPhase();
    }

    /**
     * Método principal para jogar (unificado)
     */
    playRound() {
        if (this.gamePhase === 'EQUIPMENT_SELECTION') {
            const selections = this.gameState.getPlayerSelections();
            if (selections.equipamento) {
                this.selectEquipmentForSetup(selections.equipamento);
                this.gameState.clearSelections();
            } else {
                alert('🛡️ Escolha um equipamento! (Você precisa de 2 equipamentos total)');
            }
        } else if (this.gamePhase === 'TERRAIN_SELECTION') {
            const selections = this.gameState.getPlayerSelections();
            if (selections.terreno) {
                this.selectTerrainForSetup(selections.terreno);
                this.gameState.clearSelections();
            } else {
                alert('🏰 Escolha um terreno!');
            }
        } else if (this.gamePhase === 'PLAYING') {
            this.playTurn();
        }
    }

    /**
     * Exibe instruções do turno
     */
    showTurnInstructions() {
        const turno = this.gameState.turnoAtual;
        const isFirst = this.gameState.isFirstPlayer();

        if (turno === 1 && isFirst) {
            alert('🎯 Primeiro Turno: Escolha 1 carta + 1 atributo (terreno e equipamento opcionais)');
        } else if (turno === 2 && !isFirst) {
            alert('⚔️ Segundo Turno: Escolha 1 carta (equipamento opcional).\nAtributo: ' + this.gameState.atributoRodada +
                  (this.gameState.terrenoRodada ? '\nTerreno: ' + this.gameState.terrenoRodada.nome : ''));
        }
    }

    /**
     * Executa o primeiro turno da IA
     */
    executeOpponentFirstTurn() {
        // IA escolhe carta, atributo e opcionalmente terreno
        const carta = this.chooseOpponentCard();
        const atributo = this.chooseOpponentAttribute();
        const equipamento = this.chooseOpponentEquipment();
        const terreno = this.chooseOpponentTerrain();

        this.gameState.cartaOponenteRodada = carta;
        this.gameState.equipamentoOponenteRodada = equipamento;

        this.gameState.setRoundConfiguration(atributo, terreno);

        if (equipamento) {
            this.gameState.useEquipment(equipamento, false);
        }

        this.gameState.maoOponente = this.gameState.maoOponente.filter(c => c !== carta);

        this.gameState.resultadoTexto = `🤖 Oponente definiu: ${atributo} ${terreno ? 'em ' + terreno.nome : ''}`;
    }

    /**
     * Executa o segundo turno da IA
     */
    executeOpponentSecondTurn() {
        // IA joga carta conhecendo atributo e terreno
        const carta = this.chooseOpponentCard();
        const equipamento = this.chooseOpponentEquipment();

        this.gameState.cartaOponenteRodada = carta;
        this.gameState.equipamentoOponenteRodada = equipamento;

        if (equipamento) {
            this.gameState.useEquipment(equipamento, false);
        }

        this.gameState.maoOponente = this.gameState.maoOponente.filter(c => c !== carta);
    }

    /**
     * Métodos para controlar cartas viradas/ocultas no tabuleiro
     */
    
    // Ativa modo onde todas as cartas iniciam viradas
    enableHiddenCardsMode() {
        this.gameState.modoCartasOcultas = true;
        this.updateDisplay();
    }

    // Desativa modo de cartas ocultas
    disableHiddenCardsMode() {
        this.gameState.modoCartasOcultas = false;
        this.gameState.cartasJogadorViradas = [];
        this.gameState.cartasOponenteViradas = [];
        this.updateDisplay();
    }

    // Vira uma carta específica do jogador (por índice)
    flipPlayerCard(cardIndex) {
        const index = this.gameState.cartasJogadorViradas.indexOf(cardIndex);
        if (index > -1) {
            // Remove da lista (revela a carta)
            this.gameState.cartasJogadorViradas.splice(index, 1);
        } else {
            // Adiciona na lista (esconde a carta)
            this.gameState.cartasJogadorViradas.push(cardIndex);
        }
        this.updateDisplay();
    }

    // Vira uma carta específica do oponente (por índice)
    flipOpponentCard(cardIndex) {
        const index = this.gameState.cartasOponenteViradas.indexOf(cardIndex);
        if (index > -1) {
            this.gameState.cartasOponenteViradas.splice(index, 1);
        } else {
            this.gameState.cartasOponenteViradas.push(cardIndex);
        }
        this.updateDisplay();
    }

    // Revela todas as cartas do jogador
    revealAllPlayerCards() {
        this.gameState.cartasJogadorViradas = [];
        this.updateDisplay();
    }

    // Revela todas as cartas do oponente
    revealAllOpponentCards() {
        this.gameState.cartasOponenteViradas = [];
        this.updateDisplay();
    }

    // Esconde todas as cartas do jogador
    hideAllPlayerCards() {
        this.gameState.cartasJogadorViradas = [0, 1, 2];
        this.updateDisplay();
    }

    // Esconde todas as cartas do oponente
    hideAllOpponentCards() {
        this.gameState.cartasOponenteViradas = [0, 1, 2];
        this.updateDisplay();
    }

    /**
     * Sistema de Battle Log
     */
    addBattleLogEntry(message, type = 'system') {
        this.battleLog.push({
            message,
            type,
            timestamp: Date.now()
        });
        
        this.updateBattleLogDisplay();
    }

    updateBattleLogDisplay() {
        const battleLogElement = document.getElementById('battleLog');
        if (!battleLogElement) return;

        // Mantém apenas os últimos 50 entries para performance
        if (this.battleLog.length > 50) {
            this.battleLog = this.battleLog.slice(-50);
        }

        const logHTML = this.battleLog
            .map(entry => `<div class="log-entry ${entry.type}">${entry.message}</div>`)
            .join('');
        
        battleLogElement.innerHTML = logHTML;
        
        // Scroll automático para o final
        battleLogElement.scrollTop = battleLogElement.scrollHeight;
    }

    /**
     * Atualiza interface do status do jogo
     */
    updateGameStatus() {
        // Atualiza informações na sidebar
        const currentRound = document.getElementById('currentRound');
        const currentTurn = document.getElementById('currentTurn');
        const whoStarts = document.getElementById('whoStarts');
        const currentPlayer = document.getElementById('currentPlayer');
        const scoreDisplay = document.getElementById('scoreDisplay');

        if (currentRound) {
            currentRound.textContent = `${this.gameState.rodadaAtual}/${this.gameState.maxRodadas}`;
        }

        if (currentTurn) {
            currentTurn.textContent = this.gameState.turnoAtual;
        }

        if (whoStarts) {
            const starter = this.gameState.jogadorIniciante === 1 ? 'Jogador' : 
                           this.gameState.jogadorIniciante === 2 ? 'Oponente' : '-';
            whoStarts.textContent = starter;
        }

        if (currentPlayer) {
            // Determina de quem é a vez baseado no estado do jogo
            const currentPlayerText = this.determineCurrentPlayer();
            currentPlayer.textContent = currentPlayerText;
        }

        if (scoreDisplay) {
            scoreDisplay.textContent = `${this.gameState.pontosJogador} - ${this.gameState.pontosOponente}`;
        }
    }

    determineCurrentPlayer() {
        if (this.gamePhase === 'SETUP' || this.gamePhase === 'EQUIPMENT_SELECTION' || this.gamePhase === 'TERRAIN_SELECTION') {
            return 'Setup';
        }
        
        // Durante o jogo, determina baseado no turno e iniciativa
        if (this.gameState.turnoAtual === 1) {
            return this.gameState.jogadorIniciante === 1 ? 'Jogador' : 'Oponente';
        } else {
            return this.gameState.jogadorIniciante === 1 ? 'Oponente' : 'Jogador';
        }
    }

    /**
     * Seleção de atributos via roda de ações
     */
    selectAttribute(attribute) {
        if (!this.selectedPlayerCard) return;

        this.selectedAttribute = attribute;
        
        // Esconde a roda de ações
        this.hideActionWheel();
        
        // Mostra o botão de batalha
        const battleButton = document.getElementById('battleButton');
        if (battleButton) {
            battleButton.classList.remove('hidden');
        }

        // Log da seleção
        const carta = this.gameState.maoJogador[this.selectedPlayerCard];
        const attributeName = this.getAttributeDisplayName(attribute);
        this.addBattleLogEntry(`🎯 Jogador selecionou: ${carta.nome} (${attributeName})`, 'player');
    }

    getAttributeDisplayName(attribute) {
        const names = {
            'forca': 'Força',
            'destreza': 'Destreza', 
            'constituicao': 'Constituição',
            'inteligencia': 'Inteligência'
        };
        return names[attribute] || attribute;
    }

    /**
     * Animação dos dados no centro do canvas
     */
    showDiceAnimation() {
        const diceAnimation = document.getElementById('diceAnimation');
        if (!diceAnimation) return;

        diceAnimation.classList.remove('hidden');
        
        // Simula rolagem dos dados por 2 segundos
        setTimeout(() => {
            // Gera valores dos dados (1-6)
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const total = dice1 + dice2;
            
            // Atualiza os dados visuais
            document.getElementById('dice1').textContent = this.getDiceEmoji(dice1);
            document.getElementById('dice2').textContent = this.getDiceEmoji(dice2);
            document.getElementById('diceResult').textContent = `Resultado: ${total}`;
            
            // Remove a animação após mais 1 segundo
            setTimeout(() => {
                diceAnimation.classList.add('hidden');
                this.processBattleResult(total);
            }, 1500);
            
        }, 2000);
    }

    getDiceEmoji(value) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[value - 1] || '🎲';
    }

    processBattleResult(diceTotal) {
        // Aqui você pode usar o resultado dos dados para determinar bônus ou outros efeitos
        this.addBattleLogEntry(`🎲 Dados rolados: ${diceTotal}`, 'system');
        
        // Continua com a lógica normal de batalha
        this.executeBattle();
    }

    /**
     * Executa a batalha com o novo sistema
     */
    executeBattle() {
        if (!this.selectedPlayerCard || !this.selectedAttribute) return;

        const playerCard = this.gameState.maoJogador[this.selectedPlayerCard];
        // Implementar lógica de batalha aqui
        
        this.addBattleLogEntry(`⚔️ Batalha iniciada!`, 'battle-result');
        
        // Reset das seleções
        this.selectedPlayerCard = null;
        this.selectedAttribute = null;
        
        // Esconde botão de batalha
        const battleButton = document.getElementById('battleButton');
        if (battleButton) {
            battleButton.classList.add('hidden');
        }
    }

    /**
     * Manipula clique em carta do jogador
     */
    handlePlayerCardClick(card) {
        console.log(`Carta selecionada: ${card.nome}`, card);
        
        // Armazena a carta selecionada
        this.selectedPlayerCard = card;
        
        // Adiciona entrada no battle log
        this.addBattleLogEntry(`🎯 ${card.nome} selecionada!`, 'player');
        
        // Mostra roda de ações para seleção de atributo
        this.showActionWheel();
    }
    
    /**
     * Mostra a roda de ações para seleção de atributo
     */
    showActionWheel() {
        const actionWheel = document.getElementById('actionWheel');
        if (actionWheel) {
            actionWheel.classList.remove('hidden');
            
            // Adiciona event listeners para os botões de atributo
            const attributeButtons = actionWheel.querySelectorAll('.wheel-option');
            attributeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const attribute = e.currentTarget.dataset.attribute;
                    this.selectAttribute(attribute);
                });
            });
        }
    }
    
    /**
     * Esconde a roda de ações
     */
    hideActionWheel() {
        const actionWheel = document.getElementById('actionWheel');
        if (actionWheel) {
            actionWheel.classList.add('hidden');
        }
    }
    
    /**
     * Seleciona um atributo para batalha
     */
    selectAttribute(attribute) {
        console.log(`Atributo selecionado: ${attribute}`);
        
        this.selectedAttribute = attribute;
        this.hideActionWheel();
        
        // Adiciona entrada no battle log
        const attributeNames = {
            'forca': 'Força ⚔️',
            'destreza': 'Destreza 🏹', 
            'constituicao': 'Constituição 🛡️',
            'inteligencia': 'Inteligência 📚'
        };
        
        this.addBattleLogEntry(`⚡ Atributo escolhido: ${attributeNames[attribute]}`, 'player');
        
        // Mostra botão de batalha
        const battleButton = document.getElementById('battleButton');
        if (battleButton) {
            battleButton.classList.remove('hidden');
            
            // Remove event listeners anteriores e adiciona novo
            const newBattleButton = battleButton.cloneNode(true);
            battleButton.parentNode.replaceChild(newBattleButton, battleButton);
            
            newBattleButton.addEventListener('click', () => {
                this.startBattle();
            });
        }
    }
}
