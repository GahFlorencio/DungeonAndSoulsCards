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

            // 0. Testa carregamento de imagens
            this.testImageLoading();

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

    /**
     * Testa o carregamento de uma imagem específica
     */
    testImageLoading() {
        console.log('🧪 Testando carregamento de imagens...');
        
        // Testa carregamento de uma imagem de herói
        const testHeroImage = new Image();
        testHeroImage.onload = function() {
            console.log('✅ Imagem de teste carregada com sucesso:', this.src);
            console.log('📐 Dimensões:', this.naturalWidth + 'x' + this.naturalHeight);
        };
        testHeroImage.onerror = function() {
            console.log('❌ Falha ao carregar imagem de teste:', this.src);
        };
        testHeroImage.src = 'assets/images/cards/webp/hero_1_1.webp';
        
        // Testa carregamento de um ícone
        const testIcon = new Image();
        testIcon.onload = function() {
            console.log('✅ Ícone de teste carregado com sucesso:', this.src);
            console.log('📐 Dimensões:', this.naturalWidth + 'x' + this.naturalHeight);
        };
        testIcon.onerror = function() {
            console.log('❌ Falha ao carregar ícone de teste:', this.src);
        };
        testIcon.src = 'assets/images/cards/webp/attribute_str_icon.webp';
        
        console.log('🔄 Testes de imagem iniciados...');
        
        // Testa também com URL absoluta
        setTimeout(() => {
            const absoluteTest = new Image();
            absoluteTest.onload = function() {
                console.log('✅ Teste URL absoluta funcionou:', this.src);
            };
            absoluteTest.onerror = function() {
                console.log('❌ Teste URL absoluta falhou:', this.src);
            };
            absoluteTest.src = window.location.origin + '/assets/images/cards/webp/hero_1_1.webp';
        }, 1000);
    }
}

// Instância global do inicializador
window.gameInitializer = new GameInitializer();

// Auto-inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.gameInitializer.initializeGame();
});

// Função global para recarregar cartas e testar (pode ser chamada do console)
window.testHeroCards = () => {
    console.log('🔄 Testando cartas de herói...');
    window.gameInitializer.testImageLoading();
    window.heroCardRenderer.updateHeroCardsInDOM();
};

// Função global para reiniciar o jogo (pode ser chamada do console para testes)
window.restartGame = () => window.gameInitializer.restartGame();
