/**
 * HeroManager - Gerencia as cartas de heróis
 * Responsável por carregar, randomizar e gerenciar os heróis da partida
 */

class HeroManager {
    constructor() {
        this.allHeroes = [];
        this.selectedHeroes = [];
        this.heroVariations = new Map(); // Armazena as variações dos heróis para a partida
    }

    /**
     * Carrega os dados dos heróis do arquivo JSON
     */
    async loadHeroes() {
        try {
            const response = await fetch('configs/cards/heros.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.allHeroes = data.heros;
            console.log('✅ Heróis carregados:', this.allHeroes.length);
            console.log('📋 Heróis disponíveis:', this.allHeroes.map(h => `${h.id}: ${h.name}`));
        } catch (error) {
            console.error('❌ Erro ao carregar heróis:', error);
            // Fallback com dados básicos caso o arquivo não carregue
            this.allHeroes = [
                { id: 1, name: "Goliath Bárbaro", str: 10, dex: 4, int: 3, con: 8, def: 5 },
                { id: 2, name: "Meio-Orc Guerreiro", str: 9, dex: 5, int: 3, con: 7, def: 6 },
                { id: 3, name: "Elfo da Floresta Ladino", str: 4, dex: 10, int: 6, con: 5, def: 4 },
                { id: 5, name: "Tiefling Mago", str: 2, dex: 4, int: 10, con: 4, def: 3 },
                { id: 9, name: "Humano Paladino", str: 7, dex: 5, int: 5, con: 6, def: 10 }
            ];
        }
    }

    /**
     * Randomiza 3 heróis para a partida e suas variações
     */
    randomizeHeroesForGame() {
        // Embaralha todos os heróis disponíveis
        const shuffled = [...this.allHeroes].sort(() => Math.random() - 0.5);
        
        // Seleciona os primeiros 3
        this.selectedHeroes = shuffled.slice(0, 3);
        
        // Para cada herói selecionado, randomiza uma variação (1, 2 ou 3)
        this.selectedHeroes.forEach(hero => {
            const variation = Math.floor(Math.random() * 3) + 1; // 1, 2 ou 3
            this.heroVariations.set(hero.id, variation);
        });

        console.log('Heróis selecionados para a partida:', this.selectedHeroes);
        console.log('Variações dos heróis:', Array.from(this.heroVariations.entries()));
        
        return this.selectedHeroes;
    }

    /**
     * Retorna o caminho da imagem para um herói específico
     */
    getHeroImagePath(heroId) {
        const variation = this.heroVariations.get(heroId) || 1;
        const imagePath = `assets/images/cards/webp/hero_${heroId}_${variation}.webp`;
        console.log(`🖼️ Caminho da imagem para herói ${heroId}:`, imagePath);
        return imagePath;
    }

    /**
     * Retorna a variação de um herói
     */
    getHeroVariation(heroId) {
        return this.heroVariations.get(heroId) || 1;
    }

    /**
     * Retorna os heróis selecionados para a partida atual
     */
    getSelectedHeroes() {
        return this.selectedHeroes;
    }

    /**
     * Retorna um herói específico pelo ID
     */
    getHeroById(heroId) {
        return this.allHeroes.find(hero => hero.id === heroId);
    }
}

// Instância global do gerenciador de heróis
window.heroManager = new HeroManager();
