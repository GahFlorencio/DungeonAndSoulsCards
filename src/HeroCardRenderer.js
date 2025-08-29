/**
 * HeroCardRen                  return `
            <div class="card player-card hero-card" data-hero-id="${hero.id}" data-card-index="${index}" data-image-path="${imagePath}" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="hero-card-overlay">
                    <div class="hero-name">${hero.name}</div>
                </div>
                <div class="hero-attributes">`n `
            <div class="card player-card hero-card" data-hero-id="${hero.id}" data-card-index="${index}" data-image-path="${imagePath}" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="hero-card-overlay">
                    <div class="hero-name">${hero.name}</div>
                </div>
                <div class="hero-attributes">`n `
            <div class="card player-card hero-card" data-hero-id="${hero.id}" data-card-index="${index}" data-image-path="${imagePath}" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="hero-card-overlay">
                    <div class="hero-name">${hero.name}</div>
                </div>
                <div class="hero-attributes">`Renderiza as cartas de heróis na interface
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
        
        console.log(`🎨 Renderizando herói ${hero.name} (ID: ${hero.id}) com imagem: ${imagePath}`);

        return `
            <div class="card player-card hero-card" data-hero-id="${hero.id}" data-card-index="${index}" data-image-path="${imagePath}">
                <div class="hero-card-image" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                    <div class="hero-card-overlay">
                        <div class="hero-name">${hero.name}</div>
                    </div>
                </div>
                <div class="hero-attributes">
                    <div class="attribute str" title="Força">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_str_icon.webp" alt="Força" class="attr-icon-image">
                            <span class="attr-value">${hero.str}</span>
                        </div>
                    </div>
                    <div class="attribute dex" title="Destreza">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_dex_icon.webp" alt="Destreza" class="attr-icon-image">
                            <span class="attr-value">${hero.dex}</span>
                        </div>
                    </div>
                    <div class="attribute int" title="Inteligência">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_int_icon.webp" alt="Inteligência" class="attr-icon-image">
                            <span class="attr-value">${hero.int}</span>
                        </div>
                    </div>
                    <div class="attribute con" title="Constituição">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_con_icon.webp" alt="Constituição" class="attr-icon-image">
                            <span class="attr-value">${hero.con}</span>
                        </div>
                    </div>
                    <div class="attribute def" title="Defesa">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_def_icon.webp" alt="Defesa" class="attr-icon-image">
                            <span class="attr-value">${hero.def}</span>
                        </div>
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

        // Adiciona fallback para imagens que não carregarem
        this.addImageFallbacks();

        console.log('Cartas de heróis atualizadas na interface');
    }

    /**
     * Adiciona fallbacks para imagens que não carregarem
     */
    addImageFallbacks() {
        // Fallback para ícones de atributos
        const attrIcons = document.querySelectorAll('.attr-icon-image');
        console.log(`🔍 Verificando ${attrIcons.length} ícones de atributos...`);
        
        attrIcons.forEach(img => {
            img.onerror = function() {
                console.log('❌ Erro ao carregar ícone:', this.src);
                this.style.display = 'none';
                // Adiciona um emoji como fallback
                const fallbackEmoji = this.alt === 'Força' ? '💪' : 
                                    this.alt === 'Destreza' ? '🏃' :
                                    this.alt === 'Inteligência' ? '🧠' :
                                    this.alt === 'Constituição' ? '❤️' : '🛡️';
                this.parentNode.innerHTML = `<span style="font-size: 24px;">${fallbackEmoji}</span>` + 
                                           this.parentNode.querySelector('.attr-value').outerHTML;
            };
            
            img.onload = function() {
                console.log('✅ Ícone carregado:', this.alt);
            };
        });

        // Fallback para imagens de fundo dos heróis
        const heroCards = document.querySelectorAll('.hero-card');
        console.log(`🔍 Verificando ${heroCards.length} cartas de heróis...`);
        
        heroCards.forEach(card => {
            const imagePath = card.dataset.imagePath;
            
            if (imagePath) {
                console.log(`🖼️ Testando imagem: ${imagePath}`);
                
                const img = new Image();
                img.onload = function() {
                    console.log('✅ Imagem de herói carregada:', imagePath);
                    card.classList.add('image-loaded');
                    // Força a aplicação da imagem na carta principal
                    card.style.backgroundImage = `url('${imagePath}')`;
                    card.style.backgroundSize = 'cover';
                    card.style.backgroundPosition = 'center';
                    card.style.backgroundRepeat = 'no-repeat';
                };
                
                img.onerror = function() {
                    console.log('❌ Erro ao carregar imagem de herói:', imagePath);
                    console.log('🔄 Aplicando fallback...');
                    
                    // Remove a imagem de fundo e aplica gradiente na carta principal
                    card.style.backgroundImage = 'linear-gradient(135deg, #8B4513 0%, #2F1B14 50%, #1a0f0a 100%)';
                    card.style.backgroundSize = 'cover';
                    card.classList.add('image-fallback');
                };
                
                img.src = imagePath;
            } else {
                console.log('⚠️ Carta sem caminho de imagem:', card);
            }
        });
    }
}

// Instância global do renderizador de cartas
window.heroCardRenderer = new HeroCardRenderer(window.heroManager);
