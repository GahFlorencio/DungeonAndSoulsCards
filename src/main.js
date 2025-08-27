/**
 * Arquivo principal que inicializa o jogo
 */

// Variável global para acesso ao gerenciador do jogo
window.gameManager = null;
window.gameState = null;

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Mostra loading
        showLoading();
        
        // Cria instância do gerenciador do jogo
        window.gameManager = new GameManager();
        window.gameState = window.gameManager.gameState;
        
        // Configura event listeners
        setupEventListeners();
        
        // Remove loading
        hideLoading();
        
        console.log('🎮 Jogo inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar jogo:', error);
        showError('Erro ao carregar o jogo. Verifique se todos os arquivos estão presentes.');
    }
});

/**
 * Configura event listeners globais
 */
function setupEventListeners() {
    // Botão principal de jogar (agora unificado para todas as fases)
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (window.gameManager) {
                window.gameManager.playRound();
            }
        });
    }

    // Novo botão de batalha
    const battleButton = document.getElementById('battleButton');
    if (battleButton) {
        battleButton.addEventListener('click', () => {
            if (window.gameManager) {
                window.gameManager.showDiceAnimation();
            }
        });
    }

    // Event listeners para roda de ações (atributos)
    const wheelOptions = document.querySelectorAll('.wheel-option');
    wheelOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const attribute = event.currentTarget.getAttribute('data-attribute');
            if (window.gameManager && attribute) {
                window.gameManager.selectAttribute(attribute);
            }
        });
    });

    // Botões de demonstração das cartas viradas
    const demoFaceDownEquipment = document.getElementById('demoFaceDownEquipment');
    if (demoFaceDownEquipment) {
        demoFaceDownEquipment.addEventListener('click', () => {
            if (window.gameManager && window.gameManager.uiManager) {
                window.gameManager.uiManager.showEquipmentModalFaceDown();
            }
        });
    }

    const demoFaceDownTerrain = document.getElementById('demoFaceDownTerrain');
    if (demoFaceDownTerrain) {
        demoFaceDownTerrain.addEventListener('click', () => {
            if (window.gameManager && window.gameManager.uiManager) {
                window.gameManager.uiManager.showTerrainModalFaceDown();
            }
        });
    }

    const demoRevealEquipment = document.getElementById('demoRevealEquipment');
    if (demoRevealEquipment) {
        demoRevealEquipment.addEventListener('click', () => {
            if (window.gameManager && window.gameManager.uiManager) {
                showRevealDemo();
            }
        });
    }

    // Controles para cartas no tabuleiro
    const toggleHiddenMode = document.getElementById('toggleHiddenMode');
    if (toggleHiddenMode) {
        toggleHiddenMode.addEventListener('click', () => {
            if (window.gameManager) {
                if (window.gameManager.gameState.modoCartasOcultas) {
                    window.gameManager.disableHiddenCardsMode();
                } else {
                    window.gameManager.enableHiddenCardsMode();
                }
            }
        });
    }

    const hidePlayerCards = document.getElementById('hidePlayerCards');
    if (hidePlayerCards) {
        hidePlayerCards.addEventListener('click', () => {
            if (window.gameManager) {
                window.gameManager.hideAllPlayerCards();
            }
        });
    }

    const revealPlayerCards = document.getElementById('revealPlayerCards');
    if (revealPlayerCards) {
        revealPlayerCards.addEventListener('click', () => {
            if (window.gameManager) {
                window.gameManager.revealAllPlayerCards();
            }
        });
    }

    // Teclas de atalho
    document.addEventListener('keydown', handleKeyboard);
}

/**
 * Manipula atalhos de teclado
 */
function handleKeyboard(event) {
    if (!window.gameManager) return;

    switch(event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            window.gameManager.playRound();
            break;
        case 'r':
        case 'R':
            if (event.ctrlKey) {
                event.preventDefault();
                window.gameManager.resetGame();
            }
            break;
        case '1':
        case '2':
        case '3':
            event.preventDefault();
            const cardIndex = parseInt(event.key) - 1;
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectCard(cardIndex);
            }
            break;
        case 'f':
        case 'F':
            event.preventDefault();
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectAttribute('forca');
            }
            break;
        case 'd':
        case 'D':
            event.preventDefault();
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectAttribute('destreza');
            }
            break;
        case 'i':
        case 'I':
            event.preventDefault();
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectAttribute('inteligencia');
            }
            break;
        case 'c':
        case 'C':
            event.preventDefault();
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectAttribute('constituicao');
            }
            break;
        case 'x':
        case 'X':
            event.preventDefault();
            if (window.gameManager.gamePhase === 'PLAYING') {
                window.gameManager.selectAttribute('defesa');
            }
            break;
    }
}

/**
 * Mostra indicador de carregamento
 */
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 1.5rem;
        ">
            <div style="text-align: center;">
                <div>🃏 Carregando cartas...</div>
                <div style="margin-top: 1rem; font-size: 1rem; opacity: 0.7;">
                    Aguarde um momento
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

/**
 * Remove indicador de carregamento
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    hideLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
                </div>
    `;
    
    document.body.appendChild(errorElement);
}

/**
 * Demonstração das cartas com reveal on click
 */
function showRevealDemo() {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = window.gameManager.uiManager.createModal(
        '👁️ Demo: Clique para Revelar',
        'Clique nas cartas para revelá-las',
        window.gameManager.uiManager.createEquipmentCardsWithReveal(),
        () => {
            // Fechar modal
            const modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
        },
        true, // Botão sempre habilitado
        true,  // Permite fechar
        'Fechar Demo'
    );

    document.body.appendChild(modal);
}

/**
 * Utilitários para debug (apenas em desenvolvimento)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugGame = {
        getGameState: () => window.gameManager?.gameState,
        getCardManager: () => window.gameManager?.cardManager,
        forceWin: () => {
            if (window.gameManager?.gameState) {
                window.gameManager.gameState.pontosJogador = 3;
                window.gameManager.updateDisplay();
            }
        },
        resetGame: () => window.gameManager?.resetGame(),
        showAllCards: () => {
            if (window.gameManager?.cardManager) {
                console.table(window.gameManager.cardManager.cartasJogador);
            }
        }
    };
    
    console.log('🔧 Modo de desenvolvimento ativo. Use window.debugGame para debug.');
}
