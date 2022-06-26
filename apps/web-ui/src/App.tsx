import React from 'react';
// import logo from './logo.svg';
import './colors.css';
import './App.css';
// import Field from './Field';
import { defaultGame, Pitches, handlePitch as processPitch } from '@wiffleball/state-machine';
import Scoreboard from './Scoreboard';
import Pitch from './Pitch';
import Nav from './Nav';


function App() {
  const [game, setGame] = React.useState(defaultGame());
  const [selectingPitch, setSelectingPitch] = React.useState(false);

  const handlePitch = (pitch: Pitches) => {
    setGame(processPitch(game, pitch));
  };

  return (
    <div className="App">
      <Scoreboard game={game} />
      <Nav onSelectPitch={() => void setSelectingPitch(prev => !prev)} />
      {selectingPitch && (
        <div className="pitch-container">
          <Pitch onPitch={handlePitch} />
        </div>
      )}
      {/* <button onClick={() => void setGame(defaultGame())}>reset game</button> */}
    </div>
  );
}

export default App;
