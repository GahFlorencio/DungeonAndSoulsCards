class CardRenderer {
    constructor() {
        this.playerArea = document.getElementById('playerArea');
        this.opponentArea = document.getElementById('opponentArea');
        this.battleArea = document.getElementById('battleArea');
        this.playerBattleSlot = document.getElementById('playerBattleSlot');
        this.opponentBattleSlot = document.getElementById('opponentBattleSlot');
        
        this.cardWidth = 120;
        this.cardHeight = 168;
        this.spacing = 10;
    }

    /**
     * Cria um elemento HTML para uma carta
     */
    createCardElement(card, isPlayer = true) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.cardType = card.tipo || 'hero';
        
        // Determina se a carta deve estar virada para baixo
        const faceDown = !isPlayer || card.faceDown === true;
        
        if (faceDown) {
            cardElement.classList.add('face-down');
        }

        // Estrutura da carta
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    ${this.getCardFrontContent(card)}
                </div>
                <div class="card-back">
                    <img src="assets/images/default/cards/back_1.png" alt="Carta virada" class="card-back-image">
                </div>
            </div>
        `;

        // Adiciona event listeners se for carta do jogador
        if (isPlayer) {
            this.addCardEventListeners(cardElement, card);
        }

        return cardElement;
    }

    /**
     * Gera o conteúdo da frente da carta baseado no tipo
     */
    getCardFrontContent(card) {
        const type = card.tipo || 'hero';
        let imagePath = '';
        let typeIndicator = '';
        
        switch (type) {
            case 'hero':
                imagePath = `assets/images/heros/${card.id}/${card.level || 1}.png`;
                typeIndicator = '🏛️';
                break;
            case 'terrain':
                imagePath = `assets/images/terrains/${card.id}/1.png`;
                typeIndicator = '🗻';
                break;
            case 'equipment':
                imagePath = `assets/images/equipments/${card.id}/1.png`;
                typeIndicator = '⚔️';
                break;
        }

        return `
            <div class="card-type-indicator">${typeIndicator}</div>
            <img src="${imagePath}" alt="${card.nome}" class="card-image">
            <div class="card-info">
                <h4 class="card-name">${card.nome}</h4>
                ${this.getCardStats(card, type)}
            </div>
        `;
    }

    /**
     * Gera os stats da carta baseado no tipo
     */
    getCardStats(card, type) {
        if (type === 'hero') {
            return `
                <div class="card-stats">
                    <div class="stat"><span>⚔️</span> ${card.forca || 0}</div>
                    <div class="stat"><span>🏹</span> ${card.destreza || 0}</div>
                    <div class="stat"><span>🛡️</span> ${card.constituicao || 0}</div>
                    <div class="stat"><span>📚</span> ${card.inteligencia || 0}</div>
                </div>
            `;
        } else if (type === 'terrain') {
            return `
                <div class="card-description">${card.descricao || ''}</div>
                <div class="card-bonus">Bonus: ${card.bonus || 'Nenhum'}</div>
            `;
        } else if (type === 'equipment') {
            return `
                <div class="card-description">${card.descricao || ''}</div>
                <div class="card-effects">
                    ${card.efeitos ? card.efeitos.map(e => `<div class="effect">${e}</div>`).join('') : ''}
                </div>
            `;
        }
        return '';
    }

    /**
     * Adiciona event listeners à carta do jogador
     */
    addCardEventListeners(cardElement, card) {
        cardElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCardClick(cardElement, card);
        });

        cardElement.addEventListener('mouseenter', () => {
            cardElement.style.transform = 'translateY(-10px) scale(1.05)';
        });

        cardElement.addEventListener('mouseleave', () => {
            if (!cardElement.classList.contains('selected')) {
                cardElement.style.transform = '';
            }
        });
    }

    /**
     * Manipula o clique na carta
     */
    handleCardClick(cardElement, card) {
        // Remove seleção de outras cartas
        document.querySelectorAll('.card.selected').forEach(c => {
            c.classList.remove('selected');
            c.style.transform = '';
        });

        // Seleciona a carta atual
        cardElement.classList.add('selected');
        cardElement.style.transform = 'translateY(-15px) scale(1.08)';

        // Notifica o GameManager
        if (window.gameManager && typeof window.gameManager.handlePlayerCardClick === 'function') {
            window.gameManager.handlePlayerCardClick(card);
        }
    }

    /**
     * Renderiza as cartas do jogador
     */
    renderPlayerCards(cards = []) {
        this.playerArea.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, true);
            
            // Adiciona animação de entrada com delay baseado no índice
            cardElement.style.animationDelay = `${index * 0.1}s`;
            cardElement.classList.add('deal-animation');
            
            this.playerArea.appendChild(cardElement);
        });
    }

    /**
     * Renderiza as cartas do oponente
     */
    renderOpponentCards(cards = []) {
        this.opponentArea.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = this.createCardElement({...card, faceDown: true}, false);
            
            // Adiciona animação de entrada com delay
            cardElement.style.animationDelay = `${index * 0.1}s`;
            cardElement.classList.add('deal-animation');
            
            this.opponentArea.appendChild(cardElement);
        });
    }

    /**
     * Move uma carta para a área de batalha
     */
    moveCardToBattle(card, isPlayer = true, slot = null) {
        const targetSlot = slot || (isPlayer ? this.playerBattleSlot : this.opponentBattleSlot);
        const cardElement = this.createCardElement(card, isPlayer);
        
        // Remove a carta da área original se existir
        const originalCard = document.querySelector(`[data-card-id="${card.id}"]`);
        if (originalCard) {
            originalCard.remove();
        }

        // Adiciona à área de batalha
        cardElement.classList.add('battle-card');
        cardElement.style.animation = 'none'; // Remove animação de entrada
        
        // Limpa o slot anterior
        targetSlot.innerHTML = '';
        targetSlot.appendChild(cardElement);

        // Anima entrada na batalha
        setTimeout(() => {
            cardElement.classList.add('battle-enter');
        }, 50);

        return cardElement;
    }

    /**
     * Anima resultado da batalha
     */
    animateBattleResult(winner, playerCard, opponentCard) {
        const playerBattleCard = this.playerBattleSlot.querySelector('.card');
        const opponentBattleCard = this.opponentBattleSlot.querySelector('.card');

        if (playerBattleCard && opponentBattleCard) {
            if (winner === 'player') {
                playerBattleCard.classList.add('victory');
                opponentBattleCard.classList.add('defeat');
            } else {
                playerBattleCard.classList.add('defeat');
                opponentBattleCard.classList.add('victory');
            }

            // Remove cartas após animação
            setTimeout(() => {
                this.playerBattleSlot.innerHTML = '';
                this.opponentBattleSlot.innerHTML = '';
            }, 2000);
        }
    }

    /**
     * Revira uma carta (mostra a frente)
     */
    flipCard(cardId) {
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        if (cardElement && cardElement.classList.contains('face-down')) {
            cardElement.classList.remove('face-down');
            cardElement.classList.add('flip-animation');
            
            setTimeout(() => {
                cardElement.classList.remove('flip-animation');
            }, 600);
        }
    }

    /**
     * Adiciona efeito de shake quando carta é atacada
     */
    shakeCard(cardId) {
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        if (cardElement) {
            cardElement.classList.add('shake');
            setTimeout(() => {
                cardElement.classList.remove('shake');
            }, 500);
        }
    }

    /**
     * Renderiza todas as cartas (método para compatibilidade)
     */
    renderAllCards() {
        if (window.gameState) {
            this.renderPlayerCards(gameState.maoJogador || []);
            this.renderOpponentCards(gameState.maoOponente || []);
        }
    }

    /**
     * Limpa todas as áreas de cartas
     */
    clearAllCards() {
        this.playerArea.innerHTML = '';
        this.opponentArea.innerHTML = '';
        this.playerBattleSlot.innerHTML = '';
        this.opponentBattleSlot.innerHTML = '';
    }

    /**
     * Atualiza o layout (método para compatibilidade)
     */
    adjustCanvasSize() {
        // Não é mais necessário com HTML/CSS responsivo
        // Mantém o método para compatibilidade
        console.log('Layout atualizado automaticamente com CSS responsivo');
    }
}

// Instância global
window.cardRenderer = new CardRenderer();
