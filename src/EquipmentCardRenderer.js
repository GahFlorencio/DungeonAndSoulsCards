/**
 * EquipmentCardRenderer - Renderiza as cartas de equipamentos na interface
 */

class EquipmentCardRenderer {
    constructor(equipmentManager) {
        this.equipmentManager = equipmentManager;
    }

    /**
     * Renderiza uma carta de equipamento individual
     */
    renderEquipmentCard(equipment, index) {
        const imagePath = this.equipmentManager.getEquipmentImagePath(equipment.id);
        const mainAttribute = this.equipmentManager.getEquipmentMainAttribute(equipment);
        
        console.log(`🎨 Renderizando equipamento ${equipment.name} (ID: ${equipment.id}) com imagem: ${imagePath}`);
        console.log(`🔧 Atributo principal: ${mainAttribute.name} +${mainAttribute.value}`);

        return `
            <div class="card player-card equipment-card" data-equipment-id="${equipment.id}" data-card-index="${index}" data-image-path="${imagePath}" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="equipment-card-overlay">
                    <div class="equipment-name">${equipment.name}</div>
                </div>
                <div class="equipment-attributes">
                    <div class="attribute ${mainAttribute.key}" title="${mainAttribute.name}">
                        <div class="attr-icon-container">
                            <img src="${mainAttribute.iconPath}" alt="${mainAttribute.name}" class="attr-icon-image">
                            <span class="attr-value">+${mainAttribute.value}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza todas as cartas de equipamentos selecionadas
     */
    renderAllEquipmentCards() {
        const equipments = this.equipmentManager.getSelectedEquipments();
        let equipmentCardsHTML = '';
        
        equipments.forEach((equipment, index) => {
            equipmentCardsHTML += this.renderEquipmentCard(equipment, index);
        });

        return equipmentCardsHTML;
    }

    /**
     * Atualiza as cartas de equipamentos na interface
     */
    updateEquipmentCardsInDOM() {
        const playerHand = document.querySelector('.player-hand');
        if (!playerHand) return;

        // Remove apenas as cartas de equipamentos existentes
        const existingEquipmentCards = playerHand.querySelectorAll('.equipment-card');
        existingEquipmentCards.forEach(card => card.remove());

        // Renderiza as novas cartas de equipamentos
        const equipmentCardsHTML = this.renderAllEquipmentCards();
        
        // Insere as cartas de equipamentos após as cartas de heróis
        const heroCards = playerHand.querySelectorAll('.hero-card');
        if (heroCards.length > 0) {
            // Insere após a última carta de herói
            const lastHeroCard = heroCards[heroCards.length - 1];
            lastHeroCard.insertAdjacentHTML('afterend', equipmentCardsHTML);
        } else {
            // Se não há cartas de herói, insere no início
            playerHand.insertAdjacentHTML('afterbegin', equipmentCardsHTML);
        }

        // Adiciona fallback para imagens que não carregarem
        this.addImageFallbacks();

        console.log('Cartas de equipamentos atualizadas na interface');
    }

    /**
     * Adiciona fallbacks para imagens que não carregarem
     */
    addImageFallbacks() {
        // Fallback para ícones de atributos nos equipamentos
        const attrIcons = document.querySelectorAll('.equipment-card .attr-icon-image');
        console.log(`🔍 Verificando ${attrIcons.length} ícones de atributos em equipamentos...`);
        
        attrIcons.forEach(img => {
            img.onerror = function() {
                console.log('❌ Erro ao carregar ícone de equipamento:', this.src);
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
                console.log('✅ Ícone de equipamento carregado:', this.alt);
            };
        });

        // Fallback para imagens de fundo dos equipamentos
        const equipmentCards = document.querySelectorAll('.equipment-card');
        console.log(`🔍 Verificando ${equipmentCards.length} cartas de equipamentos...`);
        
        equipmentCards.forEach(card => {
            const imagePath = card.dataset.imagePath;
            
            if (imagePath) {
                console.log(`🖼️ Testando imagem: ${imagePath}`);
                
                const img = new Image();
                img.onload = function() {
                    console.log('✅ Imagem de equipamento carregada:', imagePath);
                    card.classList.add('image-loaded');
                    // Força a aplicação da imagem na carta principal
                    card.style.backgroundImage = `url('${imagePath}')`;
                    card.style.backgroundSize = 'cover';
                    card.style.backgroundPosition = 'center';
                    card.style.backgroundRepeat = 'no-repeat';
                };
                
                img.onerror = function() {
                    console.log('❌ Erro ao carregar imagem de equipamento:', imagePath);
                    console.log('🔄 Aplicando fallback...');
                    
                    // Remove a imagem de fundo e aplica gradiente na carta principal
                    card.style.backgroundImage = 'linear-gradient(135deg, #654321 0%, #8B7355 50%, #A0522D 100%)';
                    card.style.backgroundSize = 'cover';
                    card.classList.add('image-fallback');
                };
                
                img.src = imagePath;
            }
        });
    }
}

// Instância global do renderizador de equipamentos
window.equipmentCardRenderer = new EquipmentCardRenderer(window.equipmentManager);
