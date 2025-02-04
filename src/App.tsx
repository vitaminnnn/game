import { Provider } from "react-redux";
import CanvasBoard from "./components/CanvasBoard";
import store from "./store";
import "./styles/App.css";

const App = () => {
    return (
        <Provider store={store}>
            <div className="app-container">
                <h1 className="heading">SNAKE</h1>
                <CanvasBoard height={600} width={1000} />
            </div>
        </Provider>
    );
};

export default App;