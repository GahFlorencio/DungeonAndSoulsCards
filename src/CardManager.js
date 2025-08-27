/**
 * Gerencia o carregamento e distribuição de cartas
 */
class CardManager {
    constructor() {
        this.cartasJogador = [];
        this.cartasTerreno = [];
        this.cartasEquipamento = [];
    }

    /**
     * Carrega todos os dados JSON
     */
    async loadAllCards() {
        try {
            const [jogadorRes, terrenoRes, equipRes] = await Promise.all([
                fetch('cartas_jogador.json'),
                fetch('cartas_terreno.json'),
                fetch('cartas_equipamento.json')
            ]);

            const jogadorDados = await jogadorRes.json();
            const terrenoDados = await terrenoRes.json();
            const equipDados = await equipRes.json();

            this.cartasJogador = jogadorDados.cartas;
            this.cartasTerreno = terrenoDados.terrenos;
            this.cartasEquipamento = equipDados.equipamentos;

            return true;
        } catch (error) {
            console.error('Erro ao carregar cartas:', error);
            return false;
        }
    }

    /**
     * Distribui cartas e recursos para início da partida
     */
    distributeCards() {
        // Embaralha cartas de heróis
        const cartasEmbaralhadas = [...this.cartasJogador].sort(() => Math.random() - 0.5);
        
        // Distribui 3 cartas para cada jogador
        const maoJogador = cartasEmbaralhadas.slice(0, 3);
        const maoOponente = cartasEmbaralhadas.slice(3, 6);

        // Para seleção de equipamentos e terrenos, retorna opções disponíveis
        // O jogador escolherá 2 equipamentos e 1 terreno
        const equipamentosDisponiveis = [...this.cartasEquipamento];
        const terrenosDisponiveis = [...this.cartasTerreno];

        return {
            maoJogador,
            maoOponente,
            equipamentosDisponiveis,
            terrenosDisponiveis
        };
    }

    /**
     * Simula seleção automática do oponente (2 equipamentos + 1 terreno)
     */
    selectOpponentResources() {
        // Embaralha e seleciona 2 equipamentos aleatórios
        const equipamentosEmbaralhados = [...this.cartasEquipamento].sort(() => Math.random() - 0.5);
        const equipamentosOponente = equipamentosEmbaralhados.slice(0, 2);

        // Seleciona 1 terreno aleatório
        const terrenoAleatorio = this.cartasTerreno[Math.floor(Math.random() * this.cartasTerreno.length)];

        return {
            equipamentosOponente,
            terrenoOponente: terrenoAleatorio
        };
    }

    /**
     * Rola dado para decidir quem inicia
     */
    rollInitiative() {
        const dadoJogador = this.rollDice();
        const dadoOponente = this.rollDice();

        return {
            dadoJogador,
            dadoOponente,
            jogadorInicia: dadoJogador >= dadoOponente ? 1 : 2
        };
    }

    /**
     * Calcula valor de um atributo com bônus
     */
    calculateAttributeValue(carta, atributo, equipamento = null, terreno = null) {
        let valor = carta[atributo] || 0;

        // Aplica bônus/punição do terreno
        if (terreno) {
            if (terreno.bonus && terreno.bonus[atributo]) {
                valor += terreno.bonus[atributo];
            }
            if (terreno.punicao && terreno.punicao[atributo]) {
                valor += terreno.punicao[atributo];
            }
        }

        // Aplica bônus do equipamento
        if (equipamento && equipamento.bonus && equipamento.bonus[atributo]) {
            valor += equipamento.bonus[atributo];
        }

        return Math.max(0, valor); // Não deixa valor negativo
    }

    /**
     * Rola um dado
     */
    rollDice(sides = 6) {
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Obtém lista de atributos disponíveis
     */
    getAvailableAttributes() {
        return ['forca', 'destreza', 'inteligencia', 'constituicao', 'defesa'];
    }
}
