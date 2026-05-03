import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10], [10, 11]];
const INITIAL_DIRECTION = [0, -1];
const INITIAL_FOOD = [15, 5];

const SnakeGame = ({ onClose }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    let finalFood = [0, 0];
    while (true) {
      const fx = Math.floor(Math.random() * GRID_SIZE);
      const fy = Math.floor(Math.random() * GRID_SIZE);
      if (!snake.some(segment => segment[0] === fx && segment[1] === fy)) {
        finalFood = [fx, fy];
        break;
      }
    }
    return finalFood;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
        case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
        case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
        case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = [head[0] + direction[0], head[1] + direction[1]];

        // Wall collision
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - score); // Gets faster
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, score, generateFood]);

  return (
    <div className="fixed inset-0 z-[9999999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center font-mono">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gray-900 border-4 border-pink-500 rounded-xl p-8 shadow-[0_0_50px_rgba(236,72,153,0.5)] flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4 tracking-widest uppercase">
          Secret Level
        </h2>

        <div className="text-xl text-white mb-6">Score: <span className="text-pink-400">{score}</span></div>

        <div
          className="grid bg-black border border-white/10"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s[0] === x && s[1] === y);
            const isFood = food[0] === x && food[1] === y;
            const isHead = snake[0][0] === x && snake[0][1] === y;

            return (
              <div
                key={i}
                className={`w-[20px] h-[20px] ${isHead ? 'bg-pink-400 rounded-sm' :
                    isSnake ? 'bg-purple-500 rounded-sm opacity-80' :
                      isFood ? 'bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]' :
                        ''
                  }`}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm z-10">
            <h3 className="text-4xl font-bold text-red-500 mb-4 animate-bounce">GAME OVER</h3>
            <div className="flex gap-4">
              <Magnetic intensity={0.2}>
                <button
                  onClick={() => {
                    setSnake(INITIAL_SNAKE);
                    setDirection(INITIAL_DIRECTION);
                    setFood(INITIAL_FOOD);
                    setScore(0);
                    setGameOver(false);
                  }}
                  className="px-6 py-2 bg-pink-500 text-white font-bold rounded hover:bg-pink-400 transition"
                >
                  TRY AGAIN
                </button>
              </Magnetic>
              <Magnetic intensity={0.2}>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-transparent border-2 border-pink-500 text-pink-500 font-bold rounded hover:bg-pink-500 hover:text-white transition"
                >
                  EXIT GAME
                </button>
              </Magnetic>
            </div>
          </div>
        )}
      </motion.div>
      <p className="text-gray-400 mt-6 text-sm">Use Arrow Keys to move.</p>
    </div>
  );
};

export default SnakeGame;
