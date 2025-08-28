/**
 * HeroCardRenderer - Renderiza as cartas de heróis na interface
 */

class HeroCardRenderer {
    constructor(heroManager) {
        this.heroManager = heroManager;
    }

    /**
     * Renderiza uma carta de herói individual
     */
    renderHeroCard(hero, index) {
        const variation = this.heroManager.getHeroVariation(hero.id);
        const imagePath = this.heroManager.getHeroImagePath(hero.id);

        return `
            <div class="card player-card hero-card" data-hero-id="${hero.id}" data-card-index="${index}">
                <div class="hero-card-image" style="background-image: url('${imagePath}')">
                    <div class="hero-card-overlay">
                        <div class="hero-name">${hero.name}</div>
                    </div>
                </div>
                <div class="hero-attributes">
                    <div class="attribute str" title="Força">
                        <span class="attr-icon">💪</span>
                        <span class="attr-value">${hero.str}</span>
                    </div>
                    <div class="attribute dex" title="Destreza">
                        <span class="attr-icon">🏃</span>
                        <span class="attr-value">${hero.dex}</span>
                    </div>
                    <div class="attribute int" title="Inteligência">
                        <span class="attr-icon">🧠</span>
                        <span class="attr-value">${hero.int}</span>
                    </div>
                    <div class="attribute con" title="Constituição">
                        <span class="attr-icon">❤️</span>
                        <span class="attr-value">${hero.con}</span>
                    </div>
                    <div class="attribute def" title="Defesa">
                        <span class="attr-icon">🛡️</span>
                        <span class="attr-value">${hero.def}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza todas as cartas de heróis selecionadas
     */
    renderAllHeroCards() {
        const heroes = this.heroManager.getSelectedHeroes();
        let heroCardsHTML = '';
        
        heroes.forEach((hero, index) => {
            heroCardsHTML += this.renderHeroCard(hero, index);
        });

        return heroCardsHTML;
    }

    /**
     * Atualiza as cartas de heróis na interface
     */
    updateHeroCardsInDOM() {
        const playerHand = document.querySelector('.player-hand');
        if (!playerHand) return;

        // Remove apenas as cartas de heróis existentes
        const existingHeroCards = playerHand.querySelectorAll('.hero-card');
        existingHeroCards.forEach(card => card.remove());

        // Renderiza as novas cartas de heróis
        const heroCardsHTML = this.renderAllHeroCards();
        
        // Insere as cartas de heróis no início da mão do jogador
        playerHand.insertAdjacentHTML('afterbegin', heroCardsHTML);

        console.log('Cartas de heróis atualizadas na interface');
    }
}

// Instância global do renderizador de cartas
window.heroCardRenderer = new HeroCardRenderer(window.heroManager);
