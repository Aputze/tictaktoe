#!/usr/bin/env python3
"""
Tic-Tac-Toe Console Game
A simple console-based implementation of the classic game.
"""

import os
import time

class TicTacToeConsole:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'
        self.game_active = True
        self.scores = {'X': 0, 'O': 0}
        
    def clear_screen(self):
        """Clear the console screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def display_board(self):
        """Display the current game board."""
        print("\n" + "="*30)
        print("         TIC-TAC-TOE")
        print("="*30)
        print(f"Player X Score: {self.scores['X']} | Player O Score: {self.scores['O']}")
        print("="*30)
        print()
        
        for i in range(0, 9, 3):
            print(f"     {self.board[i]} | {self.board[i+1]} | {self.board[i+2]}")
            if i < 6:
                print("     ---------")
        print()
        
    def display_instructions(self):
        """Display game instructions."""
        print("Game Instructions:")
        print("• Player X goes first")
        print("• Enter a number (1-9) to place your mark")
        print("• Get three in a row to win!")
        print("• Board positions:")
        print("     1 | 2 | 3")
        print("     ---------")
        print("     4 | 5 | 6")
        print("     ---------")
        print("     7 | 8 | 9")
        print()
        
    def get_player_move(self):
        """Get the current player's move."""
        while True:
            try:
                move = input(f"Player {self.current_player}, enter your move (1-9): ").strip()
                if move.lower() in ['quit', 'exit', 'q']:
                    return None
                    
                move = int(move)
                if 1 <= move <= 9:
                    # Convert to 0-based index
                    index = move - 1
                    if self.board[index] == ' ':
                        return index
                    else:
                        print("That position is already taken! Try again.")
                else:
                    print("Please enter a number between 1 and 9.")
            except ValueError:
                print("Please enter a valid number.")
                
    def make_move(self, index):
        """Make a move on the board."""
        self.board[index] = self.current_player
        
    def check_winner(self):
        """Check if there's a winner."""
        win_conditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Vertical
            [0, 4, 8], [2, 4, 6]               # Diagonal
        ]
        
        for condition in win_conditions:
            if (self.board[condition[0]] == self.board[condition[1]] == 
                self.board[condition[2]] != ' '):
                return True
        return False
        
    def check_draw(self):
        """Check if the game is a draw."""
        return ' ' not in self.board
        
    def switch_player(self):
        """Switch to the other player."""
        self.current_player = 'O' if self.current_player == 'X' else 'X'
        
    def handle_game_end(self, result):
        """Handle the end of the game."""
        self.game_active = False
        
        if result == 'win':
            self.scores[self.current_player] += 1
            print(f"\n🎉 Player {self.current_player} wins! 🎉")
        else:
            print("\n🤝 It's a draw! 🤝")
            
        print(f"\nFinal Scores - Player X: {self.scores['X']}, Player O: {self.scores['O']}")
        
    def play_again(self):
        """Ask if players want to play again."""
        while True:
            choice = input("\nWould you like to play again? (y/n): ").strip().lower()
            if choice in ['y', 'yes']:
                return True
            elif choice in ['n', 'no']:
                return False
            else:
                print("Please enter 'y' or 'n'.")
                
    def reset_game(self):
        """Reset the game board."""
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'
        self.game_active = True
        
    def run(self):
        """Main game loop."""
        print("Welcome to Tic-Tac-Toe!")
        print("Type 'quit' at any time to exit the game.")
        
        while True:
            self.clear_screen()
            self.display_board()
            self.display_instructions()
            
            while self.game_active:
                move = self.get_player_move()
                
                if move is None:
                    print("\nThanks for playing!")
                    return
                    
                self.make_move(move)
                self.clear_screen()
                self.display_board()
                
                if self.check_winner():
                    self.handle_game_end('win')
                    break
                elif self.check_draw():
                    self.handle_game_end('draw')
                    break
                else:
                    self.switch_player()
                    
            if not self.play_again():
                print("\nThanks for playing! Goodbye!")
                break
                
            self.reset_game()

def main():
    """Main function to start the game."""
    try:
        game = TicTacToeConsole()
        game.run()
    except KeyboardInterrupt:
        print("\n\nGame interrupted. Goodbye!")
    except Exception as e:
        print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()
