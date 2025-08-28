# Sistema de Cartas de Heróis - Dungeons & Souls Cards

## 🎮 Visão Geral
O sistema de cartas de heróis implementa randomização dinâmica de heróis e suas variações visuais, carregando dados de configuração e imagens para criar uma experiência única a cada partida.

## 🏗️ Arquitetura

### Arquivos JavaScript
- **`HeroManager.js`** - Gerencia dados, randomização e variações dos heróis
- **`HeroCardRenderer.js`** - Renderiza cartas de heróis na interface
- **`GameInitializer.js`** - Inicializa o jogo e configura event listeners

### Arquivos CSS
- **`hero-cards.css`** - Estilos específicos para cartas de heróis com imagens de fundo

### Dados
- **`configs/cards/heros.json`** - Configuração dos heróis (10 heróis disponíveis)
- **`assets/images/cards/webp/`** - Imagens dos heróis (3 variações por herói)

## 🎲 Sistema de Randomização

### Seleção de Heróis
- 3 heróis são selecionados aleatoriamente dos 10 disponíveis
- Cada herói selecionado recebe uma variação visual aleatória (1, 2 ou 3)
- As variações permanecem fixas durante toda a partida

### Padrão de Nomeação de Imagens
```
hero_{{heroId}}_{{variation}}.webp

Exemplos:
- hero_1_1.webp (Herói 1, Variação 1)
- hero_5_3.webp (Herói 5, Variação 3)
- hero_10_2.webp (Herói 10, Variação 2)
```

## 🎨 Estrutura Visual das Cartas

### Layout
- **70% superior**: Imagem do herói como background
- **30% inferior**: Área de atributos com 5 ícones

### Elementos
1. **Imagem de Fundo**: Photo do herói com overlay gradient
2. **Nome do Herói**: Sobreposto na parte inferior da imagem
3. **Atributos**: 5 ícones com valores (STR, DEX, INT, CON, DEF)

### Efeitos Visuais
- Bordas douradas com brilho
- Efeitos hover com elevação e escala
- Animações de entrada escalonadas
- Gradients e sombras para profundidade

## 🚀 Como Usar

### Inicialização Automática
O jogo inicializa automaticamente quando a página carrega:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    window.gameInitializer.initializeGame();
});
```

### Funções Disponíveis no Console
```javascript
// Reinicia o jogo com novos heróis randomizados
restartGame()

// Acessa o gerenciador de heróis
window.heroManager.getSelectedHeroes()

// Verifica variações dos heróis
window.heroManager.heroVariations
```

## 📊 Atributos dos Heróis

Cada herói possui 5 atributos principais:
- **STR (Força)** 💪 - Poder físico e dano corpo a corpo
- **DEX (Destreza)** 🏃 - Agilidade e precisão
- **INT (Inteligência)** 🧠 - Poder mágico e conhecimento
- **CON (Constituição)** ❤️ - Resistência e pontos de vida
- **DEF (Defesa)** 🛡️ - Proteção contra danos

## 🎯 Recursos Implementados

✅ **Completos:**
- Randomização de 3 heróis por partida
- Sistema de variações visuais (3 por herói)
- Carregamento dinâmico de dados JSON
- Renderização automática das cartas
- Estilização completa com imagens de fundo
- Responsividade para diferentes telas
- Event listeners para interações
- Animações de entrada e hover

🔄 **Para Expansão Futura:**
- Lógica de combate entre heróis
- Animações de cartas sendo jogadas
- Sistema de pontuação
- Efeitos sonoros
- Multiplicador online

## 🛠️ Manutenção

### Adicionando Novos Heróis
1. Adicione o herói em `configs/cards/heros.json`
2. Adicione 3 imagens: `hero_ID_1.webp`, `hero_ID_2.webp`, `hero_ID_3.webp`
3. O sistema automaticamente incluirá o novo herói na randomização

### Modificando Atributos
Edite o arquivo JSON e recarregue a página - as mudanças são aplicadas automaticamente.

---

## 🎮 Status: Sistema Funcional
O sistema de cartas de heróis está completamente implementado e funcional, com interface visual moderna e sistema de randomização robusto.
