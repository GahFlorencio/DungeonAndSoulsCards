/**
 * DEMO SCRIPT - Scripts para demonstrar as cartas de terreno
 * 
 * Para usar no console do navegador:
 * 1. Abra o DevTools (F12)
 * 2. Vá para a aba Console
 * 3. Cole e execute os comandos abaixo
 */

// === COMANDOS DE DEMONSTRAÇÃO ===

// 1. Verificar terrenos carregados
console.log("🏔️ Terrenos disponíveis:");
console.log(window.terrainManager.getAllTerrains());

// 2. Ver terreno selecionado
console.log("🎯 Terreno atual:", window.terrainManager.getSelectedTerrain());

// 3. Randomizar novo terreno
console.log("🎲 Randomizando novo terreno...");
const newTerrain = window.terrainManager.randomizeTerrainForGame();
console.log("✨ Novo terreno:", newTerrain);

// 4. Atualizar interface
window.terrainCardRenderer.updateTerrainCardInDOM();

// 5. Ver atributos do terreno
if (newTerrain) {
    const attributes = window.terrainManager.getTerrainAttributes(newTerrain);
    console.log("📊 Atributos do terreno:");
    console.log("   Buff:", attributes.buff);
    console.log("   Debuff:", attributes.debuff);
}

// === COMANDOS ÚTEIS ===

// Reiniciar jogo completo (heróis + equipamentos + terreno)
// window.restartGame();

// Testar só cartas de terreno
// window.testTerrainCards();

// Ver todos os dados de terreno
// window.terrainManager.getAllTerrains().forEach(terrain => {
//     console.log(`${terrain.name}: ${terrain.description}`);
// });
