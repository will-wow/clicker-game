import * as React from "react";
import "./App.css";
import ClickerGame from "./ClickerGame";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ClickerGame />
      </div>
    );
  }
}

export default App;
