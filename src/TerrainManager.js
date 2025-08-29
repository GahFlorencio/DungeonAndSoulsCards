/**
 * TerrainManager - Gerencia as cartas de terreno
 * Responsável por carregar, randomizar e gerenciar os terrenos da partida
 */

class TerrainManager {
    constructor() {
        this.allTerrains = [];
        this.selectedTerrain = null;
    }

    /**
     * Carrega os dados dos terrenos do arquivo JSON
     */
    async loadTerrains() {
        try {
            const response = await fetch('configs/cards/terrains.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.allTerrains = data.terrains;
            console.log('✅ Terrenos carregados:', this.allTerrains.length);
            console.log('📋 Terrenos disponíveis:', this.allTerrains.map(t => `${t.id}: ${t.name}`));
        } catch (error) {
            console.error('❌ Erro ao carregar terrenos:', error);
            // Fallback com dados básicos caso o arquivo não carregue
            this.allTerrains = [
                { 
                    id: 1, 
                    name: "Floresta", 
                    buff: {"dex": 1}, 
                    debuff: {"str": -1}, 
                    description: "Densa mata onde as sombras dançam." 
                },
                { 
                    id: 2, 
                    name: "Montanha", 
                    buff: {"str": 1}, 
                    debuff: {"dex": -1}, 
                    description: "Picos rochosos onde os ventos gélidos fortalecem." 
                }
            ];
        }
    }

    /**
     * Randomiza um terreno para a partida (apenas um terreno por partida)
     */
    randomizeTerrainForGame() {
        if (this.allTerrains.length === 0) {
            console.warn('⚠️ Nenhum terreno disponível para randomizar');
            return null;
        }

        // Seleciona um terreno aleatório
        const randomIndex = Math.floor(Math.random() * this.allTerrains.length);
        this.selectedTerrain = this.allTerrains[randomIndex];

        console.log('🏔️ Terreno selecionado para a partida:', this.selectedTerrain);
        
        return this.selectedTerrain;
    }

    /**
     * Retorna o caminho da imagem para um terreno específico
     */
    getTerrainImagePath(terrainId) {
        const imagePath = `assets/images/cards/webp/terrain_${terrainId}_1.webp`;
        console.log(`🖼️ Caminho da imagem para terreno ${terrainId}:`, imagePath);
        return imagePath;
    }

    /**
     * Retorna o terreno selecionado para a partida atual
     */
    getSelectedTerrain() {
        return this.selectedTerrain;
    }

    /**
     * Retorna um terreno específico pelo ID
     */
    getTerrainById(terrainId) {
        return this.allTerrains.find(terrain => terrain.id === terrainId);
    }

    /**
     * Retorna os atributos buff e debuff do terreno
     */
    getTerrainAttributes(terrain) {
        const buff = terrain.buff;
        const debuff = terrain.debuff;
        
        const buffKey = Object.keys(buff)[0];
        const buffValue = buff[buffKey];
        const debuffKey = Object.keys(debuff)[0];
        const debuffValue = Math.abs(debuff[debuffKey]); // Valor absoluto para mostrar só o número
        
        // Mapeia os nomes dos atributos
        const attributeNames = {
            'str': 'Força',
            'dex': 'Destreza', 
            'int': 'Inteligência',
            'con': 'Constituição',
            'def': 'Defesa'
        };

        return {
            buff: {
                key: buffKey,
                value: buffValue,
                name: attributeNames[buffKey] || buffKey,
                iconPath: 'assets/images/cards/webp/attribute_buff_icon.webp'
            },
            debuff: {
                key: debuffKey,
                value: debuffValue,
                name: attributeNames[debuffKey] || debuffKey,
                iconPath: 'assets/images/cards/webp/attribute_debuff_icon.webp'
            }
        };
    }

    /**
     * Retorna todos os terrenos disponíveis
     */
    getAllTerrains() {
        return this.allTerrains;
    }

    /**
     * Limpa o terreno selecionado (para nova partida)
     */
    clearSelectedTerrain() {
        this.selectedTerrain = null;
        console.log('🧹 Terreno selecionado limpo');
    }
}

// Instância global do gerenciador de terrenos
window.terrainManager = new TerrainManager();
