class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = this.loadScores();
        this.vsAI = false;
        this.aiSide = 'O';
        this.aiDifficulty = 'hard';
        this.aiThinking = false;
        this.endOverlay = null;
        this.overlayStatus = null;
        this.playAgainBtn = null;
        this.overlayResetBtn = null;
        
        this.initializeGame();
        this.bindEvents();

        this.initTheme();
        this.initModeControls();
    }

    initializeGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateStatus();
        this.clearBoard();
        this.hideWinningLine();
    }

    bindEvents() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('keydown', (e) => this.handleCellKeydown(e));
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('reset-scores-btn').addEventListener('click', () => {
            this.resetScores();
        });
        
        // Handle window resize to reposition winning line if visible
        window.addEventListener('resize', () => {
            if (this.lastWinningCells && this.lastWinningCells.length === 3) {
                this.drawWinningLine(this.lastWinningCells);
            }
        });

        // Overlay controls
        this.endOverlay = document.getElementById('end-overlay');
        this.overlayStatus = document.getElementById('overlay-status');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.overlayResetBtn = document.getElementById('overlay-reset-btn');

        this.playAgainBtn.addEventListener('click', () => {
            this.hideEndOverlay();
            this.restartGame();
        });
        this.overlayResetBtn.addEventListener('click', () => {
            this.resetScores();
            this.hideEndOverlay();
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    initModeControls() {
        const modeHumanBtn = document.getElementById('mode-human');
        const modeAiBtn = document.getElementById('mode-ai');
        const diffSelect = document.getElementById('ai-difficulty');
        const aiAsX = document.getElementById('ai-as-x');
        const aiAsO = document.getElementById('ai-as-o');

        const syncControls = () => {
            modeHumanBtn.setAttribute('aria-pressed', String(!this.vsAI));
            modeAiBtn.setAttribute('aria-pressed', String(this.vsAI));
            diffSelect.disabled = !this.vsAI;
            aiAsX.classList.toggle('active', this.aiSide === 'X');
            aiAsO.classList.toggle('active', this.aiSide === 'O');
        };

        modeHumanBtn.addEventListener('click', () => {
            this.vsAI = false;
            syncControls();
            this.restartGame();
        });
        modeAiBtn.addEventListener('click', () => {
            this.vsAI = true;
            syncControls();
            this.restartGame();
        });

        diffSelect.addEventListener('change', (e) => {
            this.aiDifficulty = e.target.value;
        });

        aiAsX.addEventListener('click', () => {
            this.aiSide = 'X';
            syncControls();
            this.restartGame();
        });
        aiAsO.addEventListener('click', () => {
            this.aiSide = 'O';
            syncControls();
            this.restartGame();
        });

        syncControls();
    }

    handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.dataset.cell);

        if (this.board[cellIndex] !== '' || !this.gameActive || this.aiThinking) {
            return;
        }

        this.makeMove(cellIndex);
    }

    handleCellKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const cell = e.currentTarget;
            const cellIndex = parseInt(cell.dataset.cell);
            if (this.board[cellIndex] !== '' || !this.gameActive) return;
            this.makeMove(cellIndex);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
            this.maybeDoAI();
        }
    }

    updateCell(index) {
        const cell = document.querySelector(`[data-cell="${index}"]`);
        // Clear previous content
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        // Create a "stone" piece to mimic the photo
        const piece = document.createElement('div');
        piece.classList.add('piece');
        // Alternate pebble tones for variety
        const tone = Math.random() < 0.5 ? 'tone-light' : 'tone-dark';
        piece.classList.add(tone);
        // Slight silhouette variation
        piece.classList.add(`variant-${(index % 5) + 1}`);
        // Mark artwork
        if (this.currentPlayer === 'X') {
            piece.classList.add('piece-x');
            cell.classList.add('x');
        } else {
            piece.classList.add('piece-heart');
            cell.classList.add('o');
        }
        cell.appendChild(piece);
        
        // Add sound effect simulation (visual feedback)
        cell.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 150);
    }

    checkWinner() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]              // Diagonal
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                this.drawWinningLine(condition);
                return true;
            }
        }
        return false;
    }

    highlightWinningCells(winningCells) {
        this.lastWinningCells = winningCells; // Store for resize handling
        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-cell="${index}"]`);
            cell.classList.add('winning');
        });
    }

    drawWinningLine(winningCells) {
        const winningLine = document.getElementById('winning-line');
        const [a, , c] = winningCells;
        const containerRect = document.querySelector('.container').getBoundingClientRect();

        const getCenter = (idx) => {
            const el = document.querySelector(`[data-cell="${idx}"]`);
            const r = el.getBoundingClientRect();
            return {
                x: r.left - containerRect.left + r.width / 2,
                y: r.top - containerRect.top + r.height / 2,
            };
        };

        const p1 = getCenter(a);
        const p2 = getCenter(c);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        winningLine.className = 'winning-line show';
        winningLine.style.width = `${length}px`;
        // Slightly thicker to mimic chalk stroke
        winningLine.style.height = `8px`;
        winningLine.style.left = `${midX - length / 2}px`;
        winningLine.style.top = `${midY - 3}px`;
        winningLine.style.transform = `rotate(${angle}deg)`;
        winningLine.style.opacity = '1';
    }

    hideWinningLine() {
        const winningLine = document.getElementById('winning-line');
        if (!winningLine) return;
        // Reset classes and inline styles so stale lines never linger
        winningLine.className = 'winning-line';
        winningLine.style.opacity = '0';
        winningLine.style.width = '';
        winningLine.style.height = '';
        winningLine.style.left = '';
        winningLine.style.top = '';
        winningLine.style.transform = '';
        this.lastWinningCells = null; // Clear stored winning cells
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'win') {
            this.scores[this.currentPlayer]++;
            this.updateScores();
            this.persistScores();
            const message = `Player ${this.currentPlayer} wins!`;
            this.updateStatus(message);
            this.showEndOverlay(message);
            this.launchConfetti();
        } else {
            const message = "It's a draw!";
            this.updateStatus(message);
            this.showEndOverlay(message);
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    updateStatus(message) {
        const statusText = document.getElementById('status-text');
        if (message) {
            statusText.textContent = message;
        } else {
            statusText.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    updateScores() {
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;
    }

    clearBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
    }

    restartGame() {
        this.initializeGame();
        // If AI plays first
        this.maybeDoAI(true);
    }

    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.persistScores();
        this.initializeGame();
    }

    showEndOverlay(message) {
        if (!this.endOverlay || !this.overlayStatus) return;
        this.overlayStatus.textContent = message;
        this.endOverlay.classList.add('show');
        this.endOverlay.setAttribute('aria-hidden', 'false');
        // Focus the primary action for accessibility
        setTimeout(() => this.playAgainBtn.focus(), 50);
    }

    hideEndOverlay() {
        if (!this.endOverlay) return;
        this.endOverlay.classList.remove('show');
        this.endOverlay.setAttribute('aria-hidden', 'true');
    }

    initTheme() {
        const saved = localStorage.getItem('ttt_theme');
        if (saved === 'dark') {
            document.body.classList.add('dark');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('ttt_theme', isDark ? 'dark' : 'light');
    }

    persistScores() {
        localStorage.setItem('ttt_scores', JSON.stringify(this.scores));
    }

    loadScores() {
        try {
            const raw = localStorage.getItem('ttt_scores');
            if (!raw) return { X: 0, O: 0 };
            const parsed = JSON.parse(raw);
            if (typeof parsed?.X === 'number' && typeof parsed?.O === 'number') {
                return parsed;
            }
            return { X: 0, O: 0 };
        } catch (_) {
            return { X: 0, O: 0 };
        }
    }

    maybeDoAI(isNewRound = false) {
        if (!this.vsAI) return;
        if (this.currentPlayer !== this.aiSide) return;
        if (!this.gameActive) return;
        this.aiThinking = true;
        const delay = isNewRound ? 350 : 450;
        setTimeout(() => {
            const moveIndex = this.aiChooseMove();
            this.aiThinking = false;
            if (typeof moveIndex === 'number') {
                this.makeMove(moveIndex);
            }
        }, delay);
    }

    aiChooseMove() {
        const available = this.board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        if (this.aiDifficulty === 'easy') {
            return available[Math.floor(Math.random() * available.length)];
        }
        // Hard: minimax (optimal)
        const ai = this.aiSide;
        const human = ai === 'X' ? 'O' : 'X';

        const scoreState = (board) => {
            const lines = [
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];
            for (const [a,b,c] of lines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a] === ai ? 1 : -1;
                }
            }
            if (board.every(v => v !== '')) return 0;
            return null; // ongoing
        };

        const minimax = (board, player) => {
            const s = scoreState(board);
            if (s !== null) return s;
            const moves = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
            if (player === ai) {
                let best = -Infinity;
                for (const m of moves) {
                    const nb = board.slice();
                    nb[m] = player;
                    best = Math.max(best, minimax(nb, human));
                }
                return best;
            } else {
                let best = Infinity;
                for (const m of moves) {
                    const nb = board.slice();
                    nb[m] = player;
                    best = Math.min(best, minimax(nb, ai));
                }
                return best;
            }
        };

        let bestScore = -Infinity;
        let bestMove = available[0];
        for (const m of available) {
            const nb = this.board.slice();
            nb[m] = ai;
            const score = minimax(nb, human);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
        return bestMove;
    }

    launchConfetti() {
        const container = document.querySelector('.container');
        if (!container) return;
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#6B73FF',
            getComputedStyle(document.documentElement).getPropertyValue('--x-color') || '#FF6B6B',
            getComputedStyle(document.documentElement).getPropertyValue('--o-color') || '#4ECDC4',
            '#FFD166', '#06D6A0'
        ];
        const count = 60;
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'absolute';
            piece.style.top = '-10px';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.width = '8px';
            piece.style.height = '12px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.opacity = '0.9';
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            piece.style.borderRadius = '2px';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = '1000';

            container.appendChild(piece);

            const duration = 1000 + Math.random() * 1200;
            const translateX = (Math.random() - 0.5) * 200;
            const translateY = 380 + Math.random() * 80;

            piece.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${translateX}px, ${translateY}px) rotate(${Math.random()*720}deg)`, opacity: 0.1 }
            ], {
                duration,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards'
            }).onfinish = () => piece.remove();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
    // Ensure UI reflects persisted scores on load
    game.updateScores();
});
