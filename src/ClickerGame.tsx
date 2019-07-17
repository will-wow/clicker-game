import * as React from "react";
import * as numeral from "numeral";

import "./ClickerGame.css";

interface State {
  score: number;
  factories: number;
}

interface ScoreAction {
  type: "score";
}

interface FactoryAction {
  type: "factory";
}

interface TimerAction {
  type: "timer";
}

interface ResetAction {
  type: "reset";
}

interface LoadAction {
  type: "load";
  payload: State;
}

type Action =
  | ScoreAction
  | FactoryAction
  | TimerAction
  | ResetAction
  | LoadAction;

type Dispatch = (action: Action) => void;

export { State as ClickerGameState };

const factoryPrice = (state: State) => Math.pow(state.factories + 1, 2);
const canBuildFactory = (state: State) => state.score >= factoryPrice(state);

const initialState = { score: 0, factories: 0 };

const FPS = 24;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "score": {
      return { ...state, score: state.score + 1 };
    }
    case "factory": {
      if (!canBuildFactory(state)) return state;

      const price = factoryPrice(state);

      const score = state.score - price;
      const factories = state.factories + 1;
      return { ...state, factories, score };
    }
    case "timer": {
      return { ...state, score: state.score + state.factories / 10 / FPS };
    }
    case "reset": {
      return initialState;
    }
    case "load": {
      return action.payload;
    }
  }
};

const loadState = (dispatch: Dispatch) => {
  const json = window.localStorage.getItem("game");
  if (json) {
    dispatch({ type: "load", payload: JSON.parse(json) });
  }
};

const saveState = (state: State) => {
  window.localStorage.setItem("game", JSON.stringify(state));
};

const setupTimer = (dispatch: Dispatch) => {
  const interval = setInterval(() => {
    dispatch({ type: "timer" });
  }, FPS / 1000);

  return () => clearInterval(interval);
};

const ClickerGame = () => {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );
  const { score, factories } = state;

  React.useEffect(() => loadState(dispatch), []);
  React.useEffect(() => setupTimer(dispatch), []);
  React.useEffect(() => saveState(state), [state]);

  return (
    <div className="ClickerGame">
      <h1>Clicker Game</h1>
      <h2>Score: {numeral(score).format()}</h2>
      <h2>Factories: {factories}</h2>
      <button onClick={() => dispatch({ type: "score" })}>Add Score</button>
      <button
        onClick={() => dispatch({ type: "factory" })}
        disabled={!canBuildFactory(state)}
      >
        Add Factory ({numeral(factoryPrice(state)).format()})
      </button>
      <button
        style={{ background: "red" }}
        onClick={() => dispatch({ type: "reset" })}
      >
        Reset
      </button>
    </div>
  );
};

export default ClickerGame;
