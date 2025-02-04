import React from "react";
import "../styles/GameOverScreen.css";

interface IGameOverScreen {
    onReset: () => void;
}

const GameOverScreen = ({ onReset }: IGameOverScreen) => (
    <div className="game-over-screen">
        GAME OVER
        <button onClick={onReset} className="reset-button">
            Reset game
        </button>
    </div>
);

export default GameOverScreen;