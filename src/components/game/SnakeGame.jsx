import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Play, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

const SnakeGame = ({ isOpen, onClose }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) return generateFood();
    return newFood;
  }, [snake]);

  // Reset Game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood());
    setIsPlaying(true);
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check collisions
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(moveSnake);
  }, [isPlaying, gameOver, direction, food, generateFood, score, highScore]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, direction]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-[#0a0a0c] border border-purple-500/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] relative max-w-md w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-white font-mono font-bold">SCORE: {score}</span>
            <span className="text-slate-500 text-xs ml-2">HIGH: {highScore}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Game Board */}
        <div 
          className="relative bg-black/50 border border-white/10 rounded-lg overflow-hidden mx-auto"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE 
          }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }} 
          />

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
                backgroundColor: i === 0 ? '#06b6d4' : '#a855f7', // Cyan head, Purple body
                boxShadow: i === 0 ? '0 0 10px #06b6d4' : 'none',
                zIndex: 10
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              left: food.x * CELL_SIZE + 2,
              top: food.y * CELL_SIZE + 2,
              backgroundColor: '#22c55e',
              boxShadow: '0 0 10px #22c55e',
              zIndex: 10
            }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
              <h2 className="text-2xl font-bold text-red-500 mb-4 font-mono">SYSTEM FAILURE</h2>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
              >
                <RefreshCw size={16} /> REBOOT
              </button>
            </div>
          )}

          {/* Start Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Play size={20} /> INITIALIZE
              </button>
              <p className="text-slate-400 text-xs mt-4 font-mono">USE ARROW KEYS TO NAVIGATE</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default SnakeGame;
