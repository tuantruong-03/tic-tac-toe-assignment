import { useState } from 'react';

function Square({ value, onSquareClick, isWinSquare }) {
  // 4. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
  const squareStyle = isWinSquare ? { backgroundColor: 'yellow' } : {};
  return <button style={squareStyle}  className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winSquareIndexes = calculateWinner(squares);
  console.log(squares)
  const isBoardFull = squares.every(square => square !== null)
  let status = ""; 
  if (isBoardFull) {
    status = "Draw"
  } else if (winSquareIndexes) {
    status = 'Winner: ' + squares[winSquareIndexes[0]]
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  // 2. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  const board = [];
  for (let row = 0; row < 3; row++) {
    const squareRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squareRow.push(<Square key={index} 
        onSquareClick={() => handleClick(index)} 
        isWinSquare={ winSquareIndexes && winSquareIndexes.includes(index)} 
        value={squares[index]} />);
    }
    board.push(
      <div key={row} className="board-row">
        {squareRow}
      </div>
    );
  }

  return <>
    <div className="status">{status}</div>
           {board}
  </>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([{
    squares : Array(9).fill(null),
    location: null
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location: currentMove }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Display the location for each move in the format (row, col) in the move history list.
  function getLocation(index) {
    const row = Math.floor(index / 3) + 1;  
    const col = (index % 3) + 1;            
    return `(${row}, ${col})`;
  }

  const initMoves = () => {
    return history.map((step, move) => {
      const description = move > 0 
        ? `Go to move #${move} ${step.location !== null ? getLocation(step.location) : ''}` 
        : 'Go to game start';
      return (
        <li key={move}>
          {move === currentMove ? (
            <span>You are at move #{move} {step.location !== null ? getLocation(step.location) : ''}</span>
          ) : <button onClick={() => jumpTo(move)}>{description}</button>}
        </li>
      );
    });
  };

  const sortedMoves = ascending
    ? initMoves().sort((a, b) => a.key - b.key) // Ascending order
    : initMoves().sort((a, b) => b.key - a.key); // Descending order

  // 3. Add a toggle button that lets you sort the moves in either ascending or descending order.
  function reverseOrderOfMoves() {
    setAscending(!ascending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{sortedMoves}</ol>
      </div>
      <button style={{marginLeft: "30px"}} onClick={reverseOrderOfMoves}>
        {ascending ? 'Sort Descending' : 'Sort Ascending'}
      </button>
    </div>
  );
}
