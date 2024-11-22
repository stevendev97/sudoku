import React, { useState, useCallback } from 'react';
import './App.css'

function solveSudoku(board) {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) {
        return true;
      }

      board[row][col] = 0;
    }
  }

  return false;
}

function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function App() {
  const [board, setBoard] = useState(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );

  const handleCellChange = useCallback((row, col, value) => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      newBoard[row][col] = value === '' ? 0 : Math.min(Math.max(parseInt(value) || 0, 0), 9);
      return newBoard;
    });
  }, []);

  const handleSolve = () => {
    const boardCopy = JSON.parse(JSON.stringify(board));
    if (solveSudoku(boardCopy)) {
      setBoard(boardCopy);
    } else {
      alert("No solution exists for the given puzzle!");
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null).map(() => Array(9).fill(0)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Sudoku Solver</h1>
      <div className="grid grid-cols-9 gap-0 mb-4 bg-white border-2 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              min="1"
              max="9"
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
              className={`w-12 h-12 text-center text-lg border-gray-300 focus:outline-none 
                ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : 'border-r'}
                ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : 'border-b'}
              `}
              aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
            />
          ))
        )}
      </div>
      <div className="flex space-x-4">
        <button onClick={handleSolve} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Solve
        </button>
        <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;