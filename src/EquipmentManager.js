/**
 * EquipmentManager - Gerencia as cartas de equipamentos
 * Responsável por carregar, randomizar e gerenciar os equipamentos da partida
 */

class EquipmentManager {
    constructor() {
        this.allEquipments = [];
        this.selectedEquipments = [];
    }

    /**
     * Carrega os dados dos equipamentos do arquivo JSON
     */
    async loadEquipments() {
        try {
            const response = await fetch('configs/cards/equipments.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.allEquipments = data.equipments;
            console.log('✅ Equipamentos carregados:', this.allEquipments.length);
            console.log('📋 Equipamentos disponíveis:', this.allEquipments.map(e => `${e.id}: ${e.name}`));
        } catch (error) {
            console.error('❌ Erro ao carregar equipamentos:', error);
            // Fallback com dados básicos caso o arquivo não carregue
            this.allEquipments = [
                { id: 1, name: "Elmo do Cavaleiro Negro", buff: {"str": 2}, description: "Forjado nas trevas do abismo." },
                { id: 2, name: "Botas Ágeis", buff: {"dex": 2}, description: "Botas encantadas que fazem o usuário dançar." },
                { id: 3, name: "Amuleto do Sábio", buff: {"int": 2}, description: "Um cristal ancestral." },
                { id: 4, name: "Cinto da Vitalidade", buff: {"con": 2}, description: "Tecido com fibras de dragão." },
                { id: 5, name: "Escudo Reforçado", buff: {"def": 2}, description: "Escudo lendário." }
            ];
        }
    }

    /**
     * Randomiza equipamentos para a partida
     * @param {number} count - Número de equipamentos para selecionar (padrão: 3)
     */
    randomizeEquipmentsForGame(count = 2) {
        // Embaralha todos os equipamentos disponíveis
        const shuffled = [...this.allEquipments].sort(() => Math.random() - 0.5);
        
        // Seleciona a quantidade especificada
        this.selectedEquipments = shuffled.slice(0, Math.min(count, this.allEquipments.length));

        console.log('Equipamentos selecionados para a partida:', this.selectedEquipments);
        
        return this.selectedEquipments;
    }

    /**
     * Retorna o caminho da imagem para um equipamento específico
     */
    getEquipmentImagePath(equipmentId) {
        const imagePath = `assets/images/cards/webp/eqp_${equipmentId}_1.webp`;
        console.log(`🖼️ Caminho da imagem para equipamento ${equipmentId}:`, imagePath);
        return imagePath;
    }

    /**
     * Retorna os equipamentos selecionados para a partida atual
     */
    getSelectedEquipments() {
        return this.selectedEquipments;
    }

    /**
     * Retorna um equipamento específico pelo ID
     */
    getEquipmentById(equipmentId) {
        return this.allEquipments.find(equipment => equipment.id === equipmentId);
    }

    /**
     * Retorna o atributo principal e valor do equipamento
     */
    getEquipmentMainAttribute(equipment) {
        const buff = equipment.buff;
        const attributeKey = Object.keys(buff)[0]; // Pega o primeiro (e único) atributo
        const attributeValue = buff[attributeKey];
        
        // Mapeia os nomes dos atributos
        const attributeNames = {
            'str': 'Força',
            'dex': 'Destreza', 
            'int': 'Inteligência',
            'con': 'Constituição',
            'def': 'Defesa'
        };

        return {
            key: attributeKey,
            value: attributeValue,
            name: attributeNames[attributeKey] || attributeKey,
            iconPath: `assets/images/cards/webp/attribute_${attributeKey}_icon.webp`
        };
    }
}

// Instância global do gerenciador de equipamentos
window.equipmentManager = new EquipmentManager();
