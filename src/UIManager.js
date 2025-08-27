/**
 * Gerencia a interface do usuário
 */
class UIManager {
    constructor(gameState, cardManager) {
        this.gameState = gameState;
        this.cardManager = cardManager;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners serão adicionados dinamicamente
    }

    /**
     * Atualiza toda a interface
     */
    updateInterface() {
        this.updateGameInfo();

        // Atualiza interface baseada na fase do jogo
        if (window.gameManager.gamePhase === 'EQUIPMENT_SELECTION') {
            this.updateEquipmentSelection();
        } else if (window.gameManager.gamePhase === 'TERRAIN_SELECTION') {
            this.updateTerrainSelection();
        } else if (window.gameManager.gamePhase === 'PLAYING') {
            this.updatePlayerCards();
            this.updateAttributes();
            this.updateEquipments();
            this.updateTerrains();
            this.updateSelectionFeedback();
        }
    }

    /**
     * Interface para seleção de equipamentos
     */
    updateEquipmentSelection() {
        const container = document.getElementById('cartasJogador');
        if (container) {
            container.innerHTML = '<h3>🗡️ Seus Heróis Recrutados:</h3>' +
                this.gameState.maoJogador.map(carta =>
                    `<div class="card-display">🛡️ ${carta.nome}</div>`
                ).join('');
        }

        const equipContainer = document.getElementById('equipamentosJogador');
        if (equipContainer) {
            const selected = this.gameState.equipamentosJogador.length;
            equipContainer.innerHTML = `<h3>⚔️ Seleção de Equipamentos (${selected}/2):</h3>
                <div class="selection-notice">
                    <p>🛡️ Você deve selecionar exatamente 2 equipamentos para continuar!</p>
                    <p>O modal de seleção será aberto automaticamente...</p>
                </div>`;

            // Mostra equipamentos já selecionados
            if (selected > 0) {
                equipContainer.innerHTML += '<div style="margin-top: 1rem;"><h4>Equipamentos Selecionados:</h4>' +
                    this.gameState.equipamentosJogador.map(equip =>
                        `<div class="selected-equipment">🛡️ ${equip.nome} ${this.getEquipmentBonusText(equip)}</div>`
                    ).join('') + '</div>';
            }
        }

        // Esconde outras seções
        this.hideOtherSections(['atributos', 'terrenosJogador', 'selectionFeedback']);
    }

    /**
     * Interface para seleção de terreno
     */
    updateTerrainSelection() {
        const container = document.getElementById('cartasJogador');
        if (container) {
            container.innerHTML = '<h3>🗡️ Seus Heróis:</h3>' +
                this.gameState.maoJogador.map(carta =>
                    `<div class="card-display">🛡️ ${carta.nome}</div>`
                ).join('');
        }

        const equipContainer = document.getElementById('equipamentosJogador');
        if (equipContainer) {
            equipContainer.innerHTML = '<h3>⚔️ Equipamentos Selecionados:</h3>' +
                this.gameState.equipamentosJogador.map(equip =>
                    `<div class="selected-equipment">🛡️ ${equip.nome} ${this.getEquipmentBonusText(equip)}</div>`
                ).join('');
        }

        const terrainContainer = document.getElementById('terrenosJogador');
        if (terrainContainer) {
            terrainContainer.innerHTML = `<h3>🏰 Seleção de Terreno:</h3>
                <div class="selection-notice">
                    <p>🏰 Você deve selecionar exatamente 1 terreno para continuar!</p>
                    <p>O modal de seleção será aberto automaticamente...</p>
                </div>`;
        }

        // Esconde outras seções
        this.hideOtherSections(['atributos', 'selectionFeedback']);
    }

    /**
     * Mostra modal para seleção de equipamentos
     */
    showEquipmentModal() {
        // Remove qualquer modal existente
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Inicializa seleção temporária vazia (sempre começa do zero)
        this.tempSelectedEquipments = [];

        const modal = this.createModal(
            '⚔️ Arsenal',
            'Selecione 2 equipamentos',
            this.createEquipmentCards([]), // Sempre começa sem nenhum selecionado
            () => this.confirmEquipmentSelection(),
            false, // Botão desabilitado no início
            false // Não permite fechar sem seleção
        );

        document.body.appendChild(modal);
    }

    /**
     * Mostra modal para seleção de terreno
     */
    showTerrainModal() {
        // Remove qualquer modal existente
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        this.tempSelectedTerrain = null; // Inicializa seleção temporária

        const modal = this.createModal(
            '🏰 Campos de Batalha',
            'Escolha EXATAMENTE 1 terreno para sua estratégia (OBRIGATÓRIO)',
            this.createTerrainCards(null),
            () => this.confirmTerrainSelection(),
            false,
            false // Não permite fechar sem seleção
        );

        document.body.appendChild(modal);
    }

    /**
     * Cria a estrutura do modal
     */
    createModal(title, subtitle, cardsHtml, confirmCallback, confirmEnabled = true, allowClose = true) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-content">
                ${allowClose ? '<div class="modal-close" onclick="this.parentElement.parentElement.remove()">×</div>' : ''}
                <div class="modal-header-with-action">
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                        <p class="modal-subtitle">${subtitle}</p>
                    </div>
                    <button class="modal-confirm modal-confirm-top" id="modal-confirm-btn" ${confirmEnabled ? '' : 'disabled'}>
                        ✅ CONFIRMAR
                    </button>
                </div>
                <div class="cards-grid" id="modal-cards-grid">
                    ${cardsHtml}
                </div>
                ${allowClose ? '<div class="modal-footer"><button class="battle-button" onclick="this.parentElement.parentElement.parentElement.remove()">❌ CANCELAR</button></div>' : ''}
            </div>
        `;

        // Adiciona evento de confirmação
        const confirmBtn = modal.querySelector('#modal-confirm-btn');
        confirmBtn.addEventListener('click', () => {
            const success = confirmCallback();
            if (success !== false) { // Se não retornou false explicitamente, considera sucesso
                modal.remove();
            }
        });

        return modal;
    }

    /**
     * Cria HTML das cartas de equipamentos
     */
    createEquipmentCards(selectedEquipments) {
        return window.gameManager.setupData.equipamentosDisponiveis.map((equip, index) => {
            // Nunca inicia com equipamentos selecionados no modal
            const selectedClass = '';
            const bonusText = this.getEquipmentBonusWithIcon(equip);
            const imagePath = `assets/images/equipments/${equip.id}/1.png`;
            const description = equip.descricao || 'Equipamento lendário dos antigos heróis.';

            return `
                <div class="card-modal equipment ${selectedClass}" onclick="window.gameManager.uiManager.toggleEquipmentSelection(${index}, this)">
                    <div class="card-background" style="background-image: url('${imagePath}');">
                        <div class="card-header">
                            <h3 class="card-title">${equip.nome}</h3>
                        </div>
                        <div class="card-footer">
                            <div class="card-bonus">${bonusText}</div>
                            <div class="card-description">${description}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Cria HTML das cartas de terrenos
     */
    createTerrainCards(selectedTerrain) {
        return window.gameManager.setupData.terrenosDisponiveis.map((terreno, index) => {
            const isSelected = selectedTerrain && selectedTerrain.id === terreno.id;
            const selectedClass = isSelected ? 'selected' : '';
            const effectText = this.getTerrainEffectWithIcon(terreno);
            const imagePath = `assets/images/terrains/${terreno.id}/1.png`;
            const description = terreno.descricao || 'Terra mística dos antigos reinos.';

            return `
                <div class="card-modal terrain ${selectedClass}" onclick="window.gameManager.uiManager.selectTerrainInModal(${index}, this)">
                    <div class="card-background" style="background-image: url('${imagePath}');">
                        <div class="card-header">
                            <h3 class="card-title">${terreno.nome}</h3>
                        </div>
                        <div class="card-footer">
                            <div class="card-bonus">${effectText}</div>
                            <div class="card-description">${description}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Alterna seleção de equipamento no modal
     */
    toggleEquipmentSelection(index, element) {
        const equip = window.gameManager.setupData.equipamentosDisponiveis[index];
        
        // Usa a seleção temporária ao invés do estado do jogo
        if (!this.tempSelectedEquipments) {
            this.tempSelectedEquipments = [];
        }
        
        // Verifica se já está selecionado
        const existingIndex = this.tempSelectedEquipments.findIndex(sel => sel.id === equip.id);

        if (existingIndex >= 0) {
            // Remove da seleção
            this.tempSelectedEquipments.splice(existingIndex, 1);
            element.classList.remove('selected');
        } else if (this.tempSelectedEquipments.length < 2) {
            // Adiciona à seleção
            this.tempSelectedEquipments.push(equip);
            element.classList.add('selected');
        } else {
            // Já tem 2 selecionados, não permite mais (silenciosamente)
            return;
        }

        // Atualiza botão de confirmação
        const confirmBtn = document.getElementById('modal-confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = this.tempSelectedEquipments.length !== 2;
        }

        console.log('Equipamentos temporariamente selecionados:', this.tempSelectedEquipments.length, this.tempSelectedEquipments.map(e => e.nome));
    }

    /**
     * Seleciona terreno no modal
     */
    selectTerrainInModal(index, element) {
        const terreno = window.gameManager.setupData.terrenosDisponiveis[index];

        // Remove seleção anterior
        document.querySelectorAll('.card-modal.terrain').forEach(card => {
            card.classList.remove('selected');
        });

        // Adiciona seleção atual
        element.classList.add('selected');
        this.tempSelectedTerrain = terreno;

        // Habilita botão de confirmação
        const confirmBtn = document.getElementById('modal-confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
    }

    /**
     * Confirma seleção de equipamentos
     */
    confirmEquipmentSelection() {
        if (!this.tempSelectedEquipments || this.tempSelectedEquipments.length !== 2) {
            return false;
        }
        
        this.gameState.equipamentosJogador = [...this.tempSelectedEquipments];
        console.log('Equipamentos selecionados:', this.gameState.equipamentosJogador);
        
        // Avança para a próxima fase
        window.gameManager.startTerrainSelection();
        return true;
    }

    /**
     * Confirma seleção de terreno
     */
    confirmTerrainSelection() {
        if (!this.tempSelectedTerrain) {
            return false;
        }
        
        console.log('Terreno selecionado:', this.tempSelectedTerrain);
        
        // Avança para a próxima fase
        window.gameManager.selectTerrainForSetup(this.tempSelectedTerrain);
        return true;
    }

    /**
     * Atualiza cartas do jogador durante o jogo
     */
    updatePlayerCards() {
        const container = document.getElementById('cartasJogador');
        if (!container) return;

        const selectedCardId = this.gameState.cartaSelecionada?.id;

        container.innerHTML = '<h3>🛡️ Seus Heróis:</h3>' +
            this.gameState.maoJogador.map((carta, index) => {
                const isSelected = selectedCardId === carta.id;
                const selectedClass = isSelected ? 'selected' : '';
                return `<button class="card-btn ${selectedClass}" onclick="window.gameManager.selectCard(${index})">🗡️ ${carta.nome}</button>`;
            }).join('');
    }

    /**
     * Atualiza botões de atributos
     */
    updateAttributes() {
        const container = document.getElementById('atributos');
        if (!container) return;

        // Se já foi definido o atributo da rodada, só mostra informação
        if (this.gameState.atributoRodada && !this.gameState.canSelectAttribute()) {
            container.innerHTML = `<h3>⚔️ Atributo da Rodada:</h3>
                <div class="round-attribute">🎯 ${this.getMedievalAttributeName(this.gameState.atributoRodada)}</div>`;
            return;
        }

        // Se pode selecionar atributo
        if (this.gameState.canSelectAttribute()) {
            const selectedAttr = this.gameState.atributoSelecionado;
            const attributes = this.cardManager.getAvailableAttributes();

            container.innerHTML = '<h3>⚔️ Escolha o Atributo:</h3>' +
                attributes.map(attr => {
                    const isSelected = selectedAttr === attr;
                    const selectedClass = isSelected ? 'selected' : '';
                    const icon = this.getAttributeIcon(attr);
                    const preview = this.getAttributePreview(attr);
                    const medievalName = this.getMedievalAttributeName(attr);
                    return `<button class="attr-btn ${selectedClass}" onclick="window.gameManager.selectAttribute('${attr}')">${icon} ${medievalName} ${preview}</button>`;
                }).join('');
        } else {
            container.innerHTML = '<h3>⚔️ Atributos:</h3><div class="disabled-section">Aguardando definição...</div>';
        }
    }

    /**
     * Atualiza equipamentos disponíveis
     */
    updateEquipments() {
        const container = document.getElementById('equipamentosJogador');
        if (!container) return;

        const selectedEquip = this.gameState.equipamentoSelecionado;
        const availableEquipments = this.gameState.getAvailableEquipments();

        if (availableEquipments.length === 0) {
            container.innerHTML = '<h3>⚔️ Arsenal da Guilda:</h3><div class="disabled-section">Equipamentos esgotados</div>';
            return;
        }

        container.innerHTML = '<h3>⚔️ Arsenal da Guilda:</h3>' +
            availableEquipments.map((equip, index) => {
                const isSelected = selectedEquip === equip;
                const selectedClass = isSelected ? 'selected' : '';
                const bonusText = this.getEquipmentBonusText(equip);
                const actualIndex = this.gameState.equipamentosJogador.indexOf(equip);
                return `<button class="equip-btn ${selectedClass}" onclick="window.gameManager.selectEquipment(${actualIndex})">🛡️ ${equip.nome} ${bonusText}</button>`;
            }).join('') +
            '<button class="equip-btn" onclick="window.gameManager.selectEquipment(null)">❌ Sem Equipamento</button>';
    }

    /**
     * Atualiza terrenos disponíveis
     */
    updateTerrains() {
        const container = document.getElementById('terrenosJogador');
        if (!container) return;

        // Se já foi definido terreno da rodada, só mostra informação
        if (this.gameState.terrenoRodada && !this.gameState.canSelectTerrain()) {
            container.innerHTML = `<h3>🏞️ Terreno da Rodada:</h3>
                <div class="round-terrain">🏰 ${this.gameState.terrenoRodada.nome} ${this.getTerrainEffectText(this.gameState.terrenoRodada)}</div>`;
            return;
        }

        // Se pode selecionar terreno
        if (this.gameState.canSelectTerrain()) {
            const selectedTerrain = this.gameState.terrenoSelecionado;
            const availableTerrains = this.gameState.getAvailableTerrains();

            container.innerHTML = '<h3>🏞️ Escolha o Campo:</h3>' +
                availableTerrains.map((terreno, index) => {
                    const isSelected = selectedTerrain === terreno;
                    const selectedClass = isSelected ? 'selected' : '';
                    const effectText = this.getTerrainEffectText(terreno);
                    return `<button class="terrain-btn ${selectedClass}" onclick="window.gameManager.selectTerrain(${index})">🏰 ${terreno.nome} ${effectText}</button>`;
                }).join('') +
                '<button class="terrain-btn" onclick="window.gameManager.selectTerrain(null)">❌ Campo Neutro</button>';
        } else {
            container.innerHTML = '<h3>🏞️ Campos de Batalha:</h3><div class="disabled-section">Apenas o primeiro jogador escolhe</div>';
        }
    }

    /**
     * Atualiza informações do jogo
     */
    updateGameInfo() {
        const container = document.getElementById('gameInfo');
        if (!container) return;

        if (window.gameManager.gamePhase === 'EQUIPMENT_SELECTION') {
            const selected = this.gameState.equipamentosJogador.length;
            container.innerHTML = `
                <div class="game-status">
                    <span>🛡️ Seleção de Equipamentos: ${selected}/2</span>
                </div>
            `;
        } else if (window.gameManager.gamePhase === 'TERRAIN_SELECTION') {
            container.innerHTML = `
                <div class="game-status">
                    <span>🏰 Selecionando Terreno</span>
                </div>
            `;
        } else if (window.gameManager.gamePhase === 'PLAYING') {
            const info = this.gameState.getCurrentRoundInfo();
            let statusText = `⚔️ Rodada: ${info.rodada}/${info.maxRodadas} | Turno: ${info.turno}/3`;
            statusText += ` | 🏆 Vitórias: Você ${info.pontosJogador} x ${info.pontosOponente} Rival`;

            if (info.jogadorIniciante) {
                const iniciante = info.jogadorIniciante === 1 ? 'Você' : 'Rival';
                statusText += ` | 🎯 Inicia: ${iniciante}`;
            }

            container.innerHTML = `<div class="game-status">${statusText}</div>`;
        }
    }

    /**
     * Atualiza feedback das seleções
     */
    updateSelectionFeedback() {
        const container = document.getElementById('selectionFeedback');
        if (!container) return;

        const selections = this.gameState.getPlayerSelections();
        const turno = this.gameState.turnoAtual;
        const isFirst = this.gameState.isFirstPlayer();

        let feedback = '<h3>📜 Estratégia de Batalha:</h3>';

        // Instruções baseadas no turno
        if (turno === 1 && isFirst) {
            feedback += '<p><strong>🎯 Seu turno!</strong> Escolha carta + atributo (equipamento/terreno opcionais)</p>';
        } else if (turno === 2 && !isFirst) {
            feedback += '<p><strong>⚔️ Seu turno!</strong> Escolha carta (equipamento opcional)</p>';
        } else {
            feedback += '<p><strong>⏳ Aguardando...</strong> Vez do oponente</p>';
        }

        // Informações da rodada
        if (this.gameState.atributoRodada) {
            feedback += `<p>🎯 Atributo: <strong>${this.getMedievalAttributeName(this.gameState.atributoRodada)}</strong></p>`;
        }
        if (this.gameState.terrenoRodada) {
            feedback += `<p>🏰 Terreno: <strong>${this.gameState.terrenoRodada.nome}</strong></p>`;
        }

        // Seleções atuais
        if (selections.carta) {
            const value = this.calculateCurrentValue(selections);
            feedback += `<p>🛡️ Herói: <strong>${selections.carta.nome}</strong></p>`;
            if (selections.atributo) {
                feedback += `<p>⚔️ Atributo: <strong>${this.getMedievalAttributeName(selections.atributo)}</strong> (Poder: ${value})</p>`;
            }
            if (selections.equipamento) {
                feedback += `<p>🗡️ Equipamento: <strong>${selections.equipamento.nome}</strong></p>`;
            }
            if (selections.terreno) {
                feedback += `<p>🏰 Campo: <strong>${selections.terreno.nome}</strong></p>`;
            }
        }

        container.innerHTML = feedback;
    }

    /**
     * Mostra resultado da rodada
     */
    showRoundResult() {
        const container = document.getElementById('roundResult');
        if (container && this.gameState.resultadoTexto) {
            container.innerHTML = `<div class="round-result">${this.gameState.resultadoTexto}</div>`;
        }
    }

    /**
     * Mostra resultado final do jogo
     */
    showGameResult() {
        if (!this.gameState.isGameFinished()) return;

        const container = document.getElementById('gameResult');
        if (!container) return;

        let resultText = '';
        if (this.gameState.pontosJogador > this.gameState.pontosOponente) {
            resultText = '🏆 VITÓRIA GLORIOSA! 🏆';
        } else if (this.gameState.pontosJogador < this.gameState.pontosOponente) {
            resultText = '⚔️ DERROTA HONROSA ⚔️';
        } else {
            resultText = '🤝 EMPATE ÉPICO! 🤝';
        }

        container.innerHTML = `
            <div class="game-result">
                <h2>${resultText}</h2>
                <p>🏰 Placar Final da Guerra: Você ${this.gameState.pontosJogador} x ${this.gameState.pontosOponente} Rival</p>
                <button onclick="window.gameManager.resetGame()" class="battle-button">🔄 NOVA GUERRA</button>
            </div>
        `;
    }

    // Métodos auxiliares
    getAttributeIcon(attr) {
        const icons = {
            'forca': '⚔️',
            'destreza': '🏹', 
            'inteligencia': '🧠',
            'constituicao': '💪',
            'defesa': '🛡️'
        };
        return icons[attr] || '⭐';
    }

    getAttributePreview(attr) {
        const selections = this.gameState.getPlayerSelections();
        if (!selections.carta || !attr) return '';
        
        const value = this.cardManager.calculateAttributeValue(
            selections.carta, 
            attr, 
            selections.equipamento, 
            selections.terreno
        );
        return `(${value})`;
    }

    getEquipmentBonusText(equip) {
        if (!equip.bonus) return '';
        const bonuses = Object.entries(equip.bonus)
            .map(([attr, value]) => `+${value} ${attr}`)
            .join(', ');
        return `(${bonuses})`;
    }

    getEquipmentBonusWithIcon(equip) {
        if (!equip.bonus) return '';
        const bonuses = Object.entries(equip.bonus)
            .map(([attr, value]) => {
                const icon = this.getAttributeIcon(attr);
                const medievalName = this.getMedievalAttributeName(attr);
                return `${icon} +${value} ${medievalName}`;
            })
            .join(' ');
        return bonuses;
    }

    getTerrainEffectText(terreno) {
        let effects = [];
        if (terreno.bonus) {
            Object.entries(terreno.bonus).forEach(([attr, value]) => {
                effects.push(`+${value} ${attr}`);
            });
        }
        if (terreno.punicao) {
            Object.entries(terreno.punicao).forEach(([attr, value]) => {
                effects.push(`${value} ${attr}`);
            });
        }
        return effects.length > 0 ? `(${effects.join(', ')})` : '';
    }

    getTerrainEffectWithIcon(terreno) {
        let effects = [];
        
        // Adiciona bônus
        if (terreno.bonus) {
            Object.entries(terreno.bonus).forEach(([attr, value]) => {
                const icon = this.getAttributeIcon(attr);
                const medievalName = this.getMedievalAttributeName(attr);
                effects.push(`${icon} +${value} ${medievalName}`);
            });
        }
        
        // Adiciona penalidades
        if (terreno.punicao) {
            Object.entries(terreno.punicao).forEach(([attr, value]) => {
                const icon = this.getAttributeIcon(attr);
                const medievalName = this.getMedievalAttributeName(attr);
                effects.push(`${icon} ${value} ${medievalName}`);
            });
        }
        
        return effects.join(' ');
    }

    calculateCurrentValue(selections) {
        if (!selections.carta || !selections.atributo) return 0;
        return this.cardManager.calculateAttributeValue(
            selections.carta,
            selections.atributo,
            selections.equipamento,
            selections.terreno
        );
    }

    getMedievalAttributeName(attr) {
        const medievalNames = {
            'forca': 'Força',
            'destreza': 'Agilidade',
            'inteligencia': 'Sabedoria',
            'constituicao': 'Resistência',
            'defesa': 'Proteção'
        };
        return medievalNames[attr] || attr;
    }

    hideOtherSections(sectionsToHide) {
        sectionsToHide.forEach(sectionId => {
            const container = document.getElementById(sectionId);
            if (container) {
                container.innerHTML = '';
            }
        });
    }
}
