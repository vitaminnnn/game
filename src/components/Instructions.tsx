import "../styles/Instruction.css";

const Instruction = () => (
    <div className="instruction-container">
        <h6 className="instruction-heading">How to Play</h6>
        <h5 className="instruction-note">
            NOTE: Start the game by pressing <kbd>D</kbd>
        </h5>
        <div className="instruction-keys">
            <div className="direction-keys">
        <span>
          <kbd>W</kbd> Move Up
        </span>
                <span>
          <kbd>A</kbd> Move Left
        </span>
                <span>
          <kbd>S</kbd> Move Down
        </span>
                <span>
          <kbd>D</kbd> Move Right
        </span>
            </div>
        </div>
    </div>
);

export default Instruction;
