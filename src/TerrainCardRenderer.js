/**
 * TerrainCardRenderer - Renderiza as cartas de terreno na interface
 */

class TerrainCardRenderer {
    constructor(terrainManager) {
        this.terrainManager = terrainManager;
    }

    /**
     * Renderiza uma carta de terreno individual
     */
    renderTerrainCard(terrain, index) {
        const imagePath = this.terrainManager.getTerrainImagePath(terrain.id);
        const attributes = this.terrainManager.getTerrainAttributes(terrain);
        
        console.log(`🎨 Renderizando terreno ${terrain.name} (ID: ${terrain.id}) com imagem: ${imagePath}`);
        console.log(`🌍 Buff: ${attributes.buff.name} +${attributes.buff.value}, Debuff: ${attributes.debuff.name} -${attributes.debuff.value}`);

        return `
            <div class="card player-card terrain-card" data-terrain-id="${terrain.id}" data-card-index="${index}" data-image-path="${imagePath}" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="terrain-card-overlay">
                    <div class="terrain-name">${terrain.name}</div>
                </div>
                <div class="terrain-attributes">
                    <div class="attribute buff" title="Buff: ${attributes.buff.name} +${attributes.buff.value}">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_buff_icon.webp" alt="Buff" class="attr-icon-image">
                            <span class="attr-value">+${attributes.buff.value}</span>
                        </div>
                        <span class="attr-label">${attributes.buff.key.toUpperCase()}</span>
                    </div>
                    <div class="attribute debuff" title="Debuff: ${attributes.debuff.name} -${attributes.debuff.value}">
                        <div class="attr-icon-container">
                            <img src="assets/images/cards/webp/attribute_debuff_icon.webp" alt="Debuff" class="attr-icon-image">
                            <span class="attr-value">-${attributes.debuff.value}</span>
                        </div>
                        <span class="attr-label">${attributes.debuff.key.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza a carta de terreno selecionada
     */
    renderSelectedTerrainCard() {
        const terrain = this.terrainManager.getSelectedTerrain();
        if (!terrain) {
            return '';
        }
        
        return this.renderTerrainCard(terrain, 0);
    }

    /**
     * Atualiza a carta de terreno na interface
     */
    updateTerrainCardInDOM() {
        const playerHand = document.querySelector('.player-hand');
        if (!playerHand) return;

        // Remove a carta de terreno existente
        const existingTerrainCard = playerHand.querySelector('.terrain-card');
        if (existingTerrainCard) {
            existingTerrainCard.remove();
        }

        // Renderiza a nova carta de terreno
        const terrain = this.terrainManager.getSelectedTerrain();
        if (!terrain) return;

        const terrainCardHTML = this.renderTerrainCard(terrain, 0);
        
        // Insere a carta de terreno após as cartas de equipamentos
        const equipmentCards = playerHand.querySelectorAll('.equipment-card');
        if (equipmentCards.length > 0) {
            // Insere após a última carta de equipamento
            const lastEquipmentCard = equipmentCards[equipmentCards.length - 1];
            lastEquipmentCard.insertAdjacentHTML('afterend', terrainCardHTML);
        } else {
            // Se não há cartas de equipamento, insere após as cartas de herói
            const heroCards = playerHand.querySelectorAll('.hero-card');
            if (heroCards.length > 0) {
                const lastHeroCard = heroCards[heroCards.length - 1];
                lastHeroCard.insertAdjacentHTML('afterend', terrainCardHTML);
            } else {
                // Se não há nenhuma carta, insere no final
                playerHand.insertAdjacentHTML('beforeend', terrainCardHTML);
            }
        }

        // Adiciona fallback para imagens que não carregarem
        this.addImageFallbacks();

        console.log('🏔️ Carta de terreno atualizada na interface');
    }

    /**
     * Adiciona fallbacks para imagens que não carregarem
     */
    addImageFallbacks() {
        // Fallback para ícones de atributos nos terrenos
        const attrIcons = document.querySelectorAll('.terrain-card .attr-icon-image');
        console.log(`🔍 Verificando ${attrIcons.length} ícones de atributos em terrenos...`);
        
        attrIcons.forEach(img => {
            img.onerror = function() {
                console.log('❌ Erro ao carregar ícone de terreno:', this.src);
                this.style.display = 'none';
                // Adiciona um emoji como fallback baseado no tipo
                const isBuffIcon = this.src.includes('buff_icon');
                const fallbackEmoji = isBuffIcon ? '⬆️' : '⬇️';
                this.parentNode.innerHTML = `<span style="font-size: 48px;">${fallbackEmoji}</span>` + 
                                           this.parentNode.querySelector('.attr-value').outerHTML;
            };
        });

        // Fallback para imagem de fundo da carta
        const terrainCard = document.querySelector('.terrain-card');
        if (terrainCard) {
            const img = new Image();
            const imagePath = terrainCard.getAttribute('data-image-path');
            
            img.onload = function() {
                console.log('✅ Imagem do terreno carregada com sucesso:', imagePath);
                terrainCard.classList.add('image-loaded');
            };
            
            img.onerror = function() {
                console.log('❌ Erro ao carregar imagem do terreno:', imagePath);
                terrainCard.classList.add('image-fallback');
                terrainCard.style.backgroundImage = 'none';
                terrainCard.style.backgroundColor = '#1a0f0a'; // Marrom escuro igual outras cartas
            };
            
            img.src = imagePath;
        }
    }
}

// Instância global do renderizador de cartas de terreno
window.terrainCardRenderer = new TerrainCardRenderer(window.terrainManager);
