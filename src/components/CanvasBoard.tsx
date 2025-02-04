import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseSnake,
  INCREMENT_SCORE,
  makeMove,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  resetGame,
  RESET_SCORE,
  scoreUpdates,
  stopGame,
} from "../store/actions";
import { IGlobalState } from "../store/reducers";
import {
  clearBoard, drawFruit,
  drawObject, drawScore, drawSnake,
  generateRandomPosition,
  hasSnakeCollided,
  IObjectBody,
} from "../utils";
import Instruction from "./Instructions";
import "../styles/CanvasBoard.css";
import GameOverScreen from "./GameOverScreen";

export interface ICanvasBoard {
  height: number;
  width: number;
}

const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const dispatch = useDispatch();
  const snake1 = useSelector((state: IGlobalState) => state.snake);
  const disallowedDirection = useSelector(
      (state: IGlobalState) => state.disallowedDirection
  );
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [fruits, setFruits] = useState<IObjectBody[]>([
    generateRandomPosition(width - 20, height - 20),
  ]);
  const [isConsumed, setIsConsumed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const moveSnake = useCallback(
      (dx = 0, dy = 0, ds: string) => {
        if (dx > 0 && dy === 0 && ds !== "RIGHT") {
          dispatch(makeMove(dx, dy, MOVE_RIGHT));
        }

        if (dx < 0 && dy === 0 && ds !== "LEFT") {
          dispatch(makeMove(dx, dy, MOVE_LEFT));
        }

        if (dx === 0 && dy < 0 && ds !== "UP") {
          dispatch(makeMove(dx, dy, MOVE_UP));
        }

        if (dx === 0 && dy > 0 && ds !== "DOWN") {
          dispatch(makeMove(dx, dy, MOVE_DOWN));
        }
      },
      [dispatch]
  );

  const handleKeyEvents = useCallback(
      (event: KeyboardEvent) => {
        if (disallowedDirection) {
          switch (event.key) {
            case "w":
              moveSnake(0, -20, disallowedDirection);
              break;
            case "s":
              moveSnake(0, 20, disallowedDirection);
              break;
            case "a":
              moveSnake(-20, 0, disallowedDirection);
              break;
            case "d":
              event.preventDefault();
              moveSnake(20, 0, disallowedDirection);
              break;
          }
        } else {
          if (
              disallowedDirection !== "LEFT" &&
              disallowedDirection !== "UP" &&
              disallowedDirection !== "DOWN" &&
              event.key === "d"
          )
            moveSnake(20, 0, disallowedDirection);
        }
      },
      [disallowedDirection, moveSnake]
  );

  const animateSnake = useCallback(() => {
    if (!context) return;

    if (gameEnded) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      context.fillRect(0, 0, width, height);
      context.font = "50px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("GAME OVER", width / 2, height / 2);
      return;
    }

    clearBoard(context);
    drawSnake(context, snake1, "#34f802");
    drawFruit(context, fruits);
    drawScore(context, snake1.length - 5);

    requestAnimationFrame(animateSnake);
  }, [context, gameEnded, height, width, fruits, snake1]);

  useEffect(() => {
    if (!gameEnded) {
      animateSnake();
    }
  }, [context, snake1, fruits, gameEnded]);

  const resetBoard = useCallback(() => {
    window.removeEventListener("keypress", handleKeyEvents);
    dispatch(resetGame());
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context);
    drawObject(context, snake1, "#91C483");
    drawObject(
        context,
        [generateRandomPosition(width - 20, height - 20)],
        "#676FA3"
    );
    window.addEventListener("keypress", handleKeyEvents);
  }, [context, dispatch, handleKeyEvents, height, snake1, width]);

  useEffect(() => {
    if (isConsumed) {
      const newPos = generateRandomPosition(width - 20, height - 20);
      setFruits((prevFruits) => [...prevFruits, newPos]);
      setIsConsumed(false);
      dispatch(increaseSnake());
      dispatch(scoreUpdates(INCREMENT_SCORE));
    }
  }, [isConsumed, width, height]);

  useEffect(() => {
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, snake1, "#34f802");
    drawObject(context, fruits, "#f30202");

    const snakeHead = snake1[0];

    // Check if the snake head has eaten any fruit
    for (let i = 0; i < fruits.length; i++) {
      if (snakeHead.x === fruits[i].x && snakeHead.y === fruits[i].y) {
        setIsConsumed(true);
        setFruits((prevFruits) => prevFruits.filter((_, index) => index !== i));
        break;
      }
    }

    if (
        hasSnakeCollided(snake1, snakeHead) ||
        snakeHead.x >= width ||
        snakeHead.x <= 0 ||
        snakeHead.y <= 0 ||
        snakeHead.y >= height
    ) {
      setGameEnded(true);

      dispatch(stopGame());
      window.removeEventListener("keypress", handleKeyEvents);
    } else setGameEnded(false);
  }, [context, fruits, snake1, height, width, dispatch, handleKeyEvents]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);

    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };
  }, [disallowedDirection, handleKeyEvents]);

  return (
      <>
        <canvas
            ref={canvasRef}
            className={`canvas-board ${gameEnded ? "game-over" : ""}`}
            width={width}
            height={height}
        />
        {gameEnded && <GameOverScreen onReset={resetBoard} />}
        <Instruction />
      </>
  );
};

export default CanvasBoard;