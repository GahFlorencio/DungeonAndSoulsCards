/**
 * Renderiza cartas no canvas
 */
class CardRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    /**
     * Renderiza todas as cartas na tela
     */
    render(gameState) {
        this.clearCanvas();
        this.renderPlayerCards(gameState.maoJogador);
        this.renderOpponentCards(gameState.maoOponente);
        this.renderRoundResult(gameState);

        // Se há cartas sendo jogadas, renderiza elas no centro
        if (gameState.cartaJogadorRodada || gameState.cartaOponenteRodada) {
            this.renderBattleArea(gameState);
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Renderiza cartas do jogador
     */
    renderPlayerCards(cartas) {
        cartas.forEach((carta, index) => {
            const cardWidth = 120;
            const cardHeight = 180;
            const x = this.canvas.width - ((index + 1) * (cardWidth + 10)) - 10;
            const y = this.canvas.height - cardHeight - 20;
            this.renderCard(carta, x, y, cardWidth, cardHeight);
        });
    }

    /**
     * Renderiza cartas do oponente
     */
    renderOpponentCards(cartas) {
        cartas.forEach((carta, index) => {
            const cardWidth = 120;
            const cardHeight = 180;
            const x = 10 + index * (cardWidth + 10);
            const y = 20;
            this.renderCard(carta, x, y, cardWidth, cardHeight, true); // verso da carta
        });
    }

    /**
     * Renderiza uma carta individual (herói, equipamento ou terreno)
     */
    renderCard(carta, x, y, width = 300, height = 450, showBack = false, cardType = 'hero') {
        // Se for verso da carta, renderiza um padrão genérico
        if (showBack) {
            this.renderCardBack(x, y, width, height);
            return;
        }

        // Define o caminho da imagem baseado no tipo de carta
        let imagePath = '';
        if (cardType === 'hero') {
            const variant = Math.floor(Math.random() * 3) + 1;
            imagePath = `assets/images/heros/${carta.id}/${variant}.png`;
        } else if (cardType === 'equipment') {
            imagePath = `assets/images/equipments/${carta.id}/1.png`;
        } else if (cardType === 'terrain') {
            imagePath = `assets/images/terrains/${carta.id}/1.png`;
        }

        // Tenta carregar a imagem da carta
        const img = new Image();
        img.src = imagePath;

        // Renderiza carta mesmo se imagem não carregar
        this.renderCardFrame(carta, x, y, width, height, cardType);

        img.onload = () => {
            this.ctx.drawImage(img, x, y, width, height);
            this.renderCardFrame(carta, x, y, width, height, cardType);
        };

        img.onerror = () => {
            // Se imagem não carregar, renderiza carta colorida
            this.renderCardPlaceholder(x, y, width, height, carta.nome, cardType);
            this.renderCardFrame(carta, x, y, width, height, cardType);
        };
    }

    /**
     * Renderiza verso da carta
     */
    renderCardBack(x, y, width, height) {
        // Fundo da carta
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(x, y, width, height);
        
        // Padrão decorativo
        this.ctx.fillStyle = '#666';
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 7; j++) {
                this.ctx.fillRect(x + i * 60 + 20, y + j * 60 + 20, 20, 20);
            }
        }
        
        // Borda
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, width, height);
    }

    /**
     * Renderiza placeholder quando imagem não carrega
     */
    renderCardPlaceholder(x, y, width, height, nome, cardType = 'hero') {
        // Diferentes cores baseadas no tipo de carta
        let gradient;
        if (cardType === 'equipment') {
            gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#f59e0b');
            gradient.addColorStop(1, '#d97706');
        } else if (cardType === 'terrain') {
            gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#8b5cf6');
            gradient.addColorStop(1, '#7c3aed');
        } else {
            gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#3730a3');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        
        // Nome centralizado
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `bold ${Math.max(12, width * 0.06)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(nome, x + width / 2, y + height / 2);
    }

    /**
     * Renderiza moldura e informações da carta
     */
    renderCardFrame(carta, x, y, width, height, cardType = 'hero') {
        // Borda da carta
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Nome da carta no topo (ajustado para cartas menores)
        const headerHeight = Math.max(25, height * 0.15);
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(x, y, width, headerHeight);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `bold ${Math.max(10, width * 0.08)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(carta.nome, x + width / 2, y + headerHeight * 0.7);

        // Renderiza informações específicas do tipo de carta
        if (cardType === 'hero') {
            this.renderAttributeBar(carta, x, y, width, height);
        } else if (cardType === 'equipment') {
            this.renderEquipmentInfo(carta, x, y, width, height);
        } else if (cardType === 'terrain') {
            this.renderTerrainInfo(carta, x, y, width, height);
        }
    }

    /**
     * Renderiza barra de atributos
     */
    renderAttributeBar(carta, x, y, width, height) {
        const atributos = [
            { nome: 'forca', cor: '#FF4444', icone: '⚔️' },
            { nome: 'destreza', cor: '#44FF44', icone: '🏹' },
            { nome: 'inteligencia', cor: '#4488FF', icone: '🧠' },
            { nome: 'constituicao', cor: '#FFFF44', icone: '💪' },
            { nome: 'defesa', cor: '#FFAA44', icone: '🛡️' },
        ];

        const barraAltura = Math.max(30, height * 0.25);
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(x, y + height - barraAltura, width, barraAltura);

        const spacing = width / atributos.length;

        atributos.forEach((attr, i) => {
            const centerX = x + spacing * i + spacing / 2;

            // Ícone (ajustado para cartas menores)
            this.ctx.font = `${Math.max(8, width * 0.08)}px sans-serif`;
            this.ctx.fillStyle = attr.cor;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(attr.icone, centerX, y + height - barraAltura + barraAltura * 0.4);

            // Valor (ajustado para cartas menores)
            this.ctx.font = `bold ${Math.max(8, width * 0.08)}px sans-serif`;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(carta[attr.nome] || 0, centerX, y + height - barraAltura + barraAltura * 0.8);
        });
    }

    /**
     * Renderiza informações do equipamento
     */
    renderEquipmentInfo(equipamento, x, y, width, height) {
        const barraAltura = Math.max(30, height * 0.25);
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
        this.ctx.fillRect(x, y + height - barraAltura, width, barraAltura);

        // Ícone do equipamento
        this.ctx.font = `${Math.max(16, width * 0.12)}px sans-serif`;
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🛡️', x + width / 2, y + height - barraAltura + barraAltura * 0.3);

        // Bônus do equipamento
        if (equipamento.bonus) {
            const bonusText = Object.entries(equipamento.bonus)
                .map(([attr, value]) => `+${value} ${attr}`)
                .join(', ');
            this.ctx.font = `bold ${Math.max(8, width * 0.06)}px sans-serif`;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(bonusText, x + width / 2, y + height - barraAltura + barraAltura * 0.7);
        }
    }

    /**
     * Renderiza informações do terreno
     */
    renderTerrainInfo(terreno, x, y, width, height) {
        const barraAltura = Math.max(30, height * 0.25);
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
        this.ctx.fillRect(x, y + height - barraAltura, width, barraAltura);

        // Ícone do terreno
        this.ctx.font = `${Math.max(16, width * 0.12)}px sans-serif`;
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏰', x + width / 2, y + height - barraAltura + barraAltura * 0.2);

        // Efeitos do terreno
        let effectsText = '';
        if (terreno.bonus) {
            Object.entries(terreno.bonus).forEach(([attr, value]) => {
                effectsText += `+${value} ${attr} `;
            });
        }
        if (terreno.punicao) {
            Object.entries(terreno.punicao).forEach(([attr, value]) => {
                effectsText += `${value} ${attr} `;
            });
        }

        if (effectsText) {
            this.ctx.font = `bold ${Math.max(7, width * 0.05)}px sans-serif`;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(effectsText.trim(), x + width / 2, y + height - barraAltura + barraAltura * 0.8);
        }
    }

    /**
     * Renderiza área de batalha no centro
     */
    renderBattleArea(gameState) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const battleCardWidth = 100;
        const battleCardHeight = 150;

        // Carta do jogador
        if (gameState.cartaJogadorRodada) {
            this.renderCard(gameState.cartaJogadorRodada, centerX - battleCardWidth - 10, centerY - battleCardHeight/2, battleCardWidth, battleCardHeight, false, 'hero');
        }

        // Carta do oponente
        if (gameState.cartaOponenteRodada) {
            this.renderCard(gameState.cartaOponenteRodada, centerX + 10, centerY - battleCardHeight/2, battleCardWidth, battleCardHeight, false, 'hero');
        }

        // Equipamento do jogador (se houver)
        if (gameState.equipamentoJogadorRodada) {
            const equipWidth = 70;
            const equipHeight = 100;
            this.renderCard(gameState.equipamentoJogadorRodada, centerX - battleCardWidth - 90, centerY + 60, equipWidth, equipHeight, false, 'equipment');
        }

        // Equipamento do oponente (se houver)
        if (gameState.equipamentoOponenteRodada) {
            const equipWidth = 70;
            const equipHeight = 100;
            this.renderCard(gameState.equipamentoOponenteRodada, centerX + 120, centerY - 160, equipWidth, equipHeight, false, 'equipment');
        }

        // Terreno da rodada (se houver)
        if (gameState.terrenoRodada) {
            const terrainWidth = 120;
            const terrainHeight = 80;
            this.renderCard(gameState.terrenoRodada, centerX - terrainWidth/2, centerY + 80, terrainWidth, terrainHeight, false, 'terrain');
        }

        // VS no centro
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VS', centerX, centerY + 5);

        // Informações da rodada
        if (gameState.atributoRodada) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Atributo: ${gameState.atributoRodada}`, centerX, centerY - 100);
        }
    }

    /**
     * Renderiza resultado da rodada
     */
    renderRoundResult(gameState) {
        if (!gameState.resultadoTexto) return;

        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, this.canvas.height - 60, this.canvas.width, 40);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(gameState.resultadoTexto, this.canvas.width / 2, this.canvas.height - 35);
    }
}
