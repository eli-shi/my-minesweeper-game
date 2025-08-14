### File Structure
minesweeper/
├── client/                 # Frontend code (React or similar)
│   ├── public/             # Static assets
│   ├── src/                # React components and logic
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Frontend build configuration
├── server/                 # Backend code
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── index.js            # Main server file
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies and scripts
│   └── README.md           # Backend documentation
├── .gitignore              # Files to ignore in Git
├── README.md               # Project documentation
└── package.json            # Root-level dependencies and scripts

### Key Components

Game

- **File**: Game.tsx
- **Purpose**: Acts as the main container for the game. It toggles between the menu and the Minesweeper board based on the game state.
- **Props**:
    - rows: Number of rows in the grid.
    - columns: Number of columns in the grid.

Minesweeper

- **File**: Minesweeper.tsx
- **Purpose**: Renders the game board and handles interactions with blocks.
- **Logic**:
    - Uses the useBoard hook to manage the board state.
    - Dynamically adjusts the grid layout based on the number of rows and columns.

Board:

- **File**: Board.tsx
- **Purpose**: Renders the grid of blocks using the BoardBlock component.
- **Props**:
    - board: The current state of the board.
    - rows: Number of rows in the grid.
    - columns: Number of columns in the grid.
    - setBoard: Function to update the board state.

Menu:

- **File**: Menu.tsx
- **Purpose**: Displays the game menu with options to start the game, log in, or play multiplayer.

BoardBlock:

- **File**: BoardBlock.tsx
- **Purpose**: Represents a single block on the board. Handles click events to reveal the block.
- **Props**:
    - block: The block data (status, className).
    - reveal: Function to reveal the block.

### Custom Hooks

useBoard:

- **File**: useBoard.tsx
- **Purpose**: Manages the state of the game board, including revealing blocks and resetting the board.
- **Logic**:
    - Initializes the board using the buildBoard function.
    - Updates the board state when a block is revealed.


### Utility Functions

buildBoard:

- **File**: Board.ts
- **Purpose**: Generates the initial game board with default blocks.
- **Parameters**:
    - rows: Number of rows in the grid.
    - columns: Number of columns in the grid.
    - numberOfMines: Number of mines to place on the board.
- **Returns**: A 2D array representing the board.

placeBombs:

- **File**: Board.ts
- **Purpose**: Randomly places mines on the board.
- **Parameters**:
    - board: The current state of the board.
    - numberOfMines: Number of mines to place.
- **Returns**: The updated board with mines placed.


### CSS

All styling for now is in one css file, this may be refactored in the future for cleanliness and structure

### Testing:

- **Framework**: Jest and React Testing Library.
- **Test Files**:
    - Board.test.tsx: Tests for the buildBoard and placeBombs functions.
    - Component tests for Game, Minesweeper, and BoardBlock.

### Future Enhancements:

1. **User Accounts**:
    - Implement login and user profiles.
2. **Advanced Game Modes**:
    - Add difficulty levels and custom board sizes.
3. **Animations**:
    - Add animations for block reveals and game-over events.