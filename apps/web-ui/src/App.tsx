import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import Field from './Field';
import Scoreboard from './Scoreboard';
import Pitch from './Pitch';

import { defaultGame, Pitches, handlePitch as processPitch } from '@wiffleball/state-machine';

function App() {
  const [game, setGame] = React.useState(defaultGame());

  const handlePitch = (pitch: Pitches) => {
    setGame(processPitch(game, pitch));
  };

  return (
    <div className="App">
      {/* <Field /> */}
      <Scoreboard game={game} />
      <Pitch onPitch={handlePitch} />
      <button onClick={() => void setGame(defaultGame())}>reset game</button>
    </div>
  );
}

export default App;
