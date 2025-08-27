# 🃏 Sistema de Cartas Viradas para Baixo

Este documento explica como usar o novo sistema de cartas viradas para baixo no jogo Dungeon & Souls Cards.

## ✨ Funcionalidades

### 1. **Cartas Viradas para Baixo (Face Down)**
- As cartas usam a imagem `/assets/images/default/cards/back_1.png`
- Visual uniforme que oculta o conteúdo das cartas
- Mantém a funcionalidade de seleção e hover

### 2. **Cartas com Reveal (Click para Revelar)**
- Cartas iniciam viradas para baixo
- Um clique revela o conteúdo da carta
- Após revelar, funciona normalmente para seleção

### 3. **Transições Visuais**
- Hover diferenciado para cartas viradas
- Animações suaves ao virar cartas
- Feedback visual durante a seleção

## 🔧 Métodos Disponíveis

### UIManager - Métodos Principais

```javascript
// Criar cartas de equipamento viradas para baixo
uiManager.createEquipmentCardsFaceDown()

// Criar cartas de terreno viradas para baixo
uiManager.createTerrainCardsFaceDown()

// Criar cartas normais (viradas para cima)
uiManager.createEquipmentCardsFaceUp(selectedEquipments)
uiManager.createTerrainCardsFaceUp(selectedTerrain)

// Virar uma carta específica
uiManager.flipCard(cardElement, cardType, cardData, faceUp)

// Criar cartas com funcionalidade de reveal
uiManager.createEquipmentCardsWithReveal()
uiManager.createTerrainCardsWithReveal()
```

### Exemplos de Uso

```javascript
// Modal com cartas de equipamento viradas
uiManager.showEquipmentModalFaceDown()

// Modal com cartas de terreno viradas
uiManager.showTerrainModalFaceDown()

// Virar uma carta programaticamente
uiManager.flipCard(cardElement, 'equipment', cardData, true);

// Controlar cartas no tabuleiro
gameManager.enableHiddenCardsMode();        // Ativa modo oculto
gameManager.disableHiddenCardsMode();       // Desativa modo oculto
gameManager.flipPlayerCard(0);              // Vira carta 0 do jogador
gameManager.flipOpponentCard(1);            // Vira carta 1 do oponente
gameManager.hideAllPlayerCards();           // Esconde todas do jogador
gameManager.revealAllPlayerCards();         // Revela todas do jogador
```

## 🎮 Demonstrações Disponíveis

O jogo inclui botões de demonstração:

### **Modais (Seleção de Cartas)**
1. **🃏 Ver Equipamentos Virados** - Modal com equipamentos virados para baixo
2. **🃏 Ver Terrenos Virados** - Modal com terrenos virados para baixo  
3. **👁️ Equipamentos com Reveal** - Cartas que podem ser reveladas ao clicar

### **Tabuleiro (Durante o Jogo)**
4. **🔄 Alternar Modo Oculto** - Liga/desliga modo onde todas as cartas iniciam viradas
5. **👁️‍🗨️ Esconder Cartas Jogador** - Vira todas as cartas do jogador para baixo
6. **👁️ Revelar Cartas Jogador** - Revela todas as cartas do jogador
7. **Clique Individual** - Clique em qualquer carta no tabuleiro para virá-la

## 🎯 Interações no Tabuleiro

### **Clique nas Cartas**
- Clique em qualquer carta no canvas para virá-la individualmente
- Cursor muda para "pointer" quando está sobre uma carta
- Funciona tanto para cartas do jogador quanto do oponente

### **Controles por Teclado** (existentes)
- `Enter` ou `Espaço`: Jogar rodada
- `R`: Reiniciar jogo

## 🎨 Personalização CSS

### Classes CSS Principais

- `.card-modal.face-down` - Carta virada para baixo
- `.card-modal.face-down:hover` - Hover em carta virada
- `.card-modal.face-down.selected` - Carta virada selecionada
- `.card-overlay` - Overlay visual da carta virada

### Exemplo de Customização

```css
.card-modal.face-down {
    /* Sua customização aqui */
    border: 3px solid #8b5a2b;
    box-shadow: 0 4px 20px rgba(139, 90, 43, 0.3);
}
```

## 🔄 Estados das Cartas

1. **Face Up (Normal)** - Mostra todo o conteúdo da carta
2. **Face Down** - Mostra apenas o verso da carta
3. **Reveal Mode** - Começa virada, revela ao clicar
4. **Selected** - Pode estar selecionada mesmo quando virada

## 🚀 Casos de Uso

### **Gameplay Misterioso (Modais)**
```javascript
// Permitir que jogadores escolham equipamentos sem ver o conteúdo
const modal = createModal(
    'Arsenal Misterioso',
    'Escolha equipamentos às cegas',
    uiManager.createEquipmentCardsFaceDown(),
    confirmSelection
);
```

### **Revelação Progressiva (Modais)**
```javascript
// Revelar cartas conforme o jogador progride
uiManager.addFlipOnClickFunctionality(cardElement, 'equipment', cardData);
```

### **Sistema de Draft (Modais)**
```javascript
// Jogador escolhe entre cartas ocultas
const hiddenCards = uiManager.createTerrainCardsFaceDown();
// Após seleção, revela a escolha
uiManager.flipCard(selectedCard, 'terrain', terrainData, true);
```

### **Modo Espião (Tabuleiro)**
```javascript
// Esconder cartas do oponente temporariamente
gameManager.hideAllOpponentCards();
// Revelar uma carta específica após ação
gameManager.flipOpponentCard(cardIndex);
```

### **Carta Mistério (Tabuleiro)**
```javascript
// Uma carta permanece oculta até ser usada
gameManager.flipPlayerCard(2); // Esconde carta índice 2
// Quando jogada, é revelada automaticamente
```

### **Modo Desafio (Tabuleiro)**
```javascript
// Todas as cartas iniciam ocultas
gameManager.enableHiddenCardsMode();
// Jogador precisa memorizar ou descobrir cartas gradualmente
```

## 🎯 Próximas Melhorias

- [ ] Animação de flip 3D
- [ ] Som ao virar cartas  
- [ ] Partículas visuais ao revelar
- [ ] Sistema de cartas parcialmente reveladas
- [ ] Modo "peek" (espiada rápida)

---

*Desenvolvido para Dungeon & Souls Cards - Sistema Medieval de Cartas* ⚔️
