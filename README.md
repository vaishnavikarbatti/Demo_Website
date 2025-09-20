# 🐍 Snakes & Ladders Game

A classic Snakes & Ladders game built with HTML, CSS, and JavaScript - completely playable in the browser without any external dependencies!

## 🎮 Features

- **10x10 Game Board**: Classic 100-cell board layout
- **2 Players**: Red and blue tokens with turn-based gameplay
- **Animated Dice Rolling**: Visual dice animation with random numbers (1-6)
- **Snakes & Ladders**: 10 snakes and 9 ladders strategically placed
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradients, animations, and smooth transitions
- **Win Detection**: Automatic winner announcement when reaching position 100
- **Game Controls**: Restart game functionality
- **Keyboard Shortcuts**: Spacebar to roll dice, 'R' to restart, 'T' to toggle theme
- **Light/Dark Theme**: Toggle between light and dark themes with persistent storage

## 🎯 How to Play

1. **Start**: Both players begin at position 1
2. **Take Turns**: Players roll the dice alternately
3. **Move**: Move your token forward by the number shown on the dice
4. **Snakes**: If you land on a snake (red cells), you slide down to a lower position
5. **Ladders**: If you land on a ladder (green cells), you climb up to a higher position
6. **Win**: First player to reach exactly position 100 wins!

## 🎲 Snakes & Ladders Locations

### Snakes (Slide Down)
- 16 → 10
- 47 → 21
- 49 → 38
- 56 → 37
- 62 → 44
- 64 → 4
- 87 → 63
- 93 → 20
- 95 → 20
- 98 → 20

### Ladders (Climb Up)
- 1 → 38
- 4 → 14
- 9 → 31
- 21 → 42
- 28 → 84
- 36 → 44
- 51 → 67
- 71 → 91
- 80 → 100

## 🚀 How to Run

1. **Download**: Save all files in the same folder
2. **Open**: Double-click `index.html` or open it in your web browser
3. **Play**: The game will load automatically and you can start playing!

### Files Included
- `index.html` - Main game structure
- `style.css` - Styling and responsive design
- `script.js` - Game logic and functionality
- `README.md` - This documentation

## 🎨 Customization

### Adding More Players
To add more players, modify the `playerPositions` object in `script.js`:
```javascript
let playerPositions = { 1: 1, 2: 1, 3: 1, 4: 1 };
```

### Changing Colors
Update the CSS variables in `style.css`:
```css
.player-token.player1 { background-color: #your-color; }
.player-token.player2 { background-color: #your-color; }
```

### Modifying Snakes & Ladders
Edit the `snakesAndLadders` object in `script.js`:
```javascript
const snakesAndLadders = {
    startPosition: endPosition,  // Positive for ladders, negative for snakes
};
```

## 🎯 Game Rules

- Players must roll the exact number to reach position 100
- If you overshoot 100, you stay in your current position
- Snakes and ladders are triggered immediately when landing on them
- The game continues until one player reaches position 100

## 🎮 Controls

- **Mouse**: Click "Roll Dice" button to roll
- **Keyboard**: 
  - `Spacebar` - Roll dice
  - `R` - Restart game
  - `T` - Toggle theme
- **Touch**: Tap buttons on mobile devices
- **Theme**: Click the moon/sun icon to switch between light and dark themes

## 🌟 Features in Detail

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly touch controls
- Optimized layout for tablets and phones

### Visual Effects
- Smooth dice rolling animation
- Token movement transitions
- Winner celebration effects
- Snake and ladder notifications

### Accessibility
- Clear visual indicators for current player
- Hover effects for interactive elements
- Keyboard navigation support
- High contrast colors for visibility
- Light and dark theme support for different preferences

## 🛠️ Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern JavaScript**: ES6+ features and modern DOM APIs
- **CSS Grid**: Responsive game board layout
- **Local Storage**: Theme preference persistence
- **Event-Driven**: Clean event handling and user interactions
- **CSS Variables**: Dynamic theming system

## 🎉 Enjoy Playing!

This Snakes & Ladders game provides hours of fun for family and friends. The classic gameplay combined with modern web technologies creates an engaging and accessible gaming experience.

---

*Built with ❤️ using HTML, CSS, and JavaScript*
