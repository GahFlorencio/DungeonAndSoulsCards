/**
 * GameInitializer - Inicializa o jogo e suas funcionalidades
 */

class GameInitializer {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Inicializa o jogo completo
     */
    async initializeGame() {
        if (this.isInitialized) return;

        try {
            console.log('🎮 Inicializando Dungeons & Souls Cards...');

            // 1. Carrega os dados dos heróis
            await window.heroManager.loadHeroes();

            // 2. Randomiza os heróis para a partida
            const selectedHeroes = window.heroManager.randomizeHeroesForGame();
            console.log('⚔️ Heróis selecionados:', selectedHeroes.map(h => h.name));

            // 3. Renderiza as cartas de heróis na interface
            window.heroCardRenderer.updateHeroCardsInDOM();

            // 4. Adiciona event listeners para interações
            this.addEventListeners();

            this.isInitialized = true;
            console.log('✅ Jogo inicializado com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao inicializar o jogo:', error);
        }
    }

    /**
     * Adiciona event listeners para interações do jogo
     */
    addEventListeners() {
        // Event listener para cliques nas cartas de heróis
        document.addEventListener('click', (event) => {
            const heroCard = event.target.closest('.hero-card');
            if (heroCard) {
                this.handleHeroCardClick(heroCard);
            }
        });

        // Event listener para hover nas cartas
        document.addEventListener('mouseover', (event) => {
            const heroCard = event.target.closest('.hero-card');
            if (heroCard) {
                this.handleHeroCardHover(heroCard);
            }
        });

        console.log('🎮 Event listeners adicionados');
    }

    /**
     * Manipula cliques nas cartas de heróis
     */
    handleHeroCardClick(heroCard) {
        const heroId = parseInt(heroCard.dataset.heroId);
        const hero = window.heroManager.getHeroById(heroId);
        
        console.log('🃏 Carta clicada:', hero.name);
        
        // Adiciona feedback visual
        heroCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            heroCard.style.transform = '';
        }, 150);

        // Aqui você pode adicionar lógica para jogar a carta
        this.playHeroCard(hero);
    }

    /**
     * Manipula hover nas cartas de heróis
     */
    handleHeroCardHover(heroCard) {
        const heroId = parseInt(heroCard.dataset.heroId);
        const hero = window.heroManager.getHeroById(heroId);
        
        // Atualiza informações de hover (pode ser expandido futuramente)
        console.log('👁️ Visualizando:', hero.name);
    }

    /**
     * Lógica para jogar uma carta de herói
     */
    playHeroCard(hero) {
        // Placeholder para lógica de jogo
        console.log(`🎯 Jogando carta: ${hero.name}`);
        console.log(`📊 Atributos: STR:${hero.str} DEX:${hero.dex} INT:${hero.int} CON:${hero.con} DEF:${hero.def}`);
        
        // Aqui você pode adicionar:
        // - Lógica de combate
        // - Animações de carta sendo jogada
        // - Atualizações no campo de batalha
        // - Logs de partida
    }

    /**
     * Reinicia o jogo com novos heróis
     */
    async restartGame() {
        console.log('🔄 Reiniciando jogo...');
        
        // Randomiza novos heróis
        const selectedHeroes = window.heroManager.randomizeHeroesForGame();
        console.log('⚔️ Novos heróis selecionados:', selectedHeroes.map(h => h.name));
        
        // Atualiza a interface
        window.heroCardRenderer.updateHeroCardsInDOM();
        
        console.log('✅ Jogo reiniciado!');
    }
}

// Instância global do inicializador
window.gameInitializer = new GameInitializer();

// Auto-inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.gameInitializer.initializeGame();
});

// Função global para reiniciar o jogo (pode ser chamada do console para testes)
window.restartGame = () => window.gameInitializer.restartGame();
