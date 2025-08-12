# Tic-Tac-Toe (Web + Console)

A polished Tic-Tac-Toe with a modern UI, AI opponent, and an optional realistic “pebble-on-fabric” theme.

Crafted in Cursor, co‑created with GPT‑5.

## Versions Available

1. **Web Version** (`index.html`, `styles.css`, `script.js`) — Responsive UI, theme toggle, scores, AI
2. **Console Version** (`tic_tac_toe.py`) — Python console-based game

<!-- Screenshots intentionally omitted -->

## Web Version Features

## Features

- **Beautiful UI**: Modern design with theme toggle (light/dark) and a realistic pebble board theme
- **Play vs AI**: Easy (random) or Impossible (minimax) with selectable AI side (X or O)
- **Responsive**: Works on desktop and mobile
- **Persistent scores**: Stored in `localStorage`
- **A11y + Keyboard**: Cells are focusable; Enter/Space to play
- **Winning highlights**: Animated line and celebratory confetti
- **Controls**: Restart round, reset scores

## How to Play (Web)

1. Open `index.html` in a browser
2. **Game Rules**: 
   - Player X goes first (always)
   - Click on any empty cell to place your mark
   - Get three of your marks in a row (horizontally, vertically, or diagonally) to win
   - If all cells are filled with no winner, it's a draw

### Options
- Toggle “2 Players” vs “Vs AI”
- Pick AI difficulty (Easy/Impossible) and side (X/O)

## Game Controls

- **Restart Game**: Clears the current board and starts a new game
- **Reset Scores**: Resets both players' scores to 0

## Technical Details

- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+**: Class-based architecture with event-driven programming
- **Responsive Design**: Mobile-first approach with CSS media queries
- **No Dependencies**: Pure vanilla JavaScript, no external libraries required

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
tic-tac-toe/
├── index.html          # Web version HTML file
├── styles.css          # Web version CSS styling
├── script.js           # Web version JavaScript logic
├── tic_tac_toe.py     # Console version Python game
└── README.md           # This file
```

## Getting Started

### Web Version
1. Clone the repo
2. Open `index.html` in a browser
3. Play!

### Console Version
1. Make sure you have Python 3.6+ installed
2. Run: `python tic_tac_toe.py`
3. Follow the on-screen instructions
4. Type 'quit' at any time to exit

## Customization

You can customize the experience by:
- Adjusting theme variables and visuals in `styles.css`
- Extending game logic and AI in `script.js`
- Swapping the “pebble” art for alternative themes (e.g., chalkboard)

## License

MIT
