# Cartas de Terreno -### 🎨 **Design:**

- ✅ **Posicionamento** na mão do jogador junto com outras cartas
- ✅ **Interações** com clique e hover

### 🎨 **Design:**

- **Cores temáticas**: Verde para representar a natureza
- **Layout consistente**: Segue o padrão das cartas de equipamento
- **Posicionamento**: Na mão do jogador junto com heróis e equipamentos
- **Responsivo**: Adaptado para diferentes tamanhos de tela
- **Animações**: Efeitos suaves de aparição e interaçãouls Cards

## 🏔️ Implementação Concluída

As cartas de terreno foram implementadas com sucesso no jogo, seguindo o mesmo padrão visual das cartas de equipamento.

## 📋 Características das Cartas de Terreno

### ✨ Funcionalidades
- **Uma carta por partida**: Apenas um terreno é selecionado aleatoriamente por jogo
- **Dois atributos**: Cada terreno possui um buff (+) e um debuff (-)
- **Visual consistente**: Estilo similar às cartas de equipamento
- **Imagens únicas**: Uma variação de imagem por terreno (`terrain_{{id}}_1.webp`)
- **Ícones específicos**: Usa ícones de buff e debuff dedicados

### 🌍 Terrenos Disponíveis
1. **Floresta** - Buff: +1 Destreza, Debuff: -1 Força
2. **Montanha** - Buff: +1 Força, Debuff: -1 Destreza  
3. **Pântano** - Buff: +1 Constituição, Debuff: -1 Inteligência
4. **Deserto** - Buff: +1 Destreza, Debuff: -1 Constituição

## 🎨 Estilo Visual

### Cores
- **Borda**: Verde (`--accent-green: #2E7D32`)
- **Fundo do nome**: Verde escuro com transparência
- **Buffs**: Verde claro (`#4caf50`)
- **Debuffs**: Vermelho (`#f44336`)

### Layout
- Posicionada na mão do jogador após as cartas de equipamento
- Tamanho 15% maior que cartas de herói (igual aos equipamentos)
- Overlay com nome do terreno no topo
- Atributos centralizados com ícones
- Descrição na parte inferior

## 📁 Estrutura de Arquivos

```
src/
├── TerrainManager.js          # Gerencia dados e lógica dos terrenos
├── TerrainCardRenderer.js     # Renderiza cartas de terreno
└── styles/
    └── terrain-cards.css      # Estilos específicos

configs/cards/
└── terrains.json             # Dados dos terrenos

assets/images/cards/webp/
├── terrain_1_1.webp          # Imagens dos terrenos
├── terrain_2_1.webp
├── terrain_3_1.webp
├── terrain_4_1.webp
├── attribute_buff_icon.webp   # Ícone de buff
└── attribute_debuff_icon.webp # Ícone de debuff
```

## 🎮 Como Usar

### Inicialização Automática
O terreno é automaticamente selecionado quando o jogo inicializa:
```javascript
// Exemplo de log no console
🏔️ Terreno selecionado: Montanha
```

### Comandos do Console
Abra o DevTools (F12) e execute:

```javascript
// Ver terreno atual
window.terrainManager.getSelectedTerrain();

// Randomizar novo terreno
window.terrainManager.randomizeTerrainForGame();

// Atualizar interface
window.terrainCardRenderer.updateTerrainCardInDOM();

// Reiniciar jogo completo (inclui novo terreno)
window.restartGame();

// Script de demonstração
// Execute o arquivo demo-terrain.js no console
```

### Interações
- **Clique**: Mostra informações detalhadas no console
- **Hover**: Exibe tooltip com informações
- **Feedback visual**: Animação de escala ao clicar

## 🔧 Configuração

### Adicionar Novo Terreno
1. Adicione entrada no `configs/cards/terrains.json`:
```json
{
  "id": 5,
  "name": "Vulcão",
  "buff": {"str": 2},
  "debuff": {"con": -1},
  "description": "Calor extremo que fortalece mas desgasta."
}
```

2. Adicione imagem: `assets/images/cards/webp/terrain_5_1.webp`

### Modificar Quantidade
Por padrão, apenas 1 terreno por partida. Para alterar:
```javascript
// Em TerrainManager.js, método randomizeTerrainForGame()
// Atualmente seleciona apenas 1 terreno - mantenha assim
```

## 🐛 Troubleshooting

### Terreno não aparece
- Verifique se `configs/cards/terrains.json` carrega
- Confirme se as imagens estão no caminho correto
- Veja o console para erros de carregamento

### Imagens não carregam
- As imagens devem estar em `assets/images/cards/webp/`
- Formato: `terrain_{{id}}_1.webp`
- Fallback visual é aplicado automaticamente

### CSS não aplica
- Confirme importação em `src/styles/main.css`
- Verifique variáveis CSS em `variables.css`
- Use DevTools para debugar estilos

## 🎯 Próximos Passos

### Melhorias Futuras
- [ ] Modal com informações detalhadas do terreno
- [ ] Animações de transição entre terrenos
- [ ] Efeitos visuais no campo de batalha
- [ ] Sons de ambiente por terreno
- [ ] Sistema de combo com heróis
- [ ] Terrenos condicionais (ex: noturno/diurno)

### Integração com Gameplay
- [ ] Aplicar buffs/debuffs aos heróis
- [ ] Sistema de sinergia terreno-herói
- [ ] Eventos especiais por terreno
- [ ] Rotação de terrenos durante partida

## 📊 Status da Implementação

✅ **Concluído**
- Carregamento de dados JSON
- Sistema de randomização
- Renderização visual
- Estilos CSS responsivos
- Integração com GameInitializer
- Fallbacks para imagens
- Event listeners
- Scripts de demonstração

⚡ **Funcionando**
- Carregamento automático no início do jogo
- Cliques e hover funcionais
- Imagens e ícones carregando
- Responsive design
- Reinicialização de partida

🎨 **Visual**
- Design consistente com outras cartas
- Cores temáticas (verde para natureza)
- Layout limpo e organizado
- Animações suaves
- Feedback visual adequado
