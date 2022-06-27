import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import './colors.css';
import './App.css';

import { defaultGame, Pitches, handlePitch as processPitch } from '@wiffleball/state-machine';
import Scoreboard from './Scoreboard';
import Pitch from './Pitch';
import Nav from './Nav';
import Feed from './Feed';

const variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01
    }
  }
}

function App() {
  const [game, setGame] = React.useState(defaultGame());
  const [selectingPitch, setSelectingPitch] = React.useState(false);

  const handlePitch = (pitch: Pitches) => {
    setGame(processPitch(game, pitch));
    setSelectingPitch(false);
  };

  return (
    <div className="App">
      <Scoreboard game={game} />
      <Feed game={game} />
      <Nav onSelectPitch={() => void setSelectingPitch(prev => !prev)} />
      <AnimatePresence>
        {selectingPitch && (
          <motion.div
            key="pitchSelect"
            className="pitch-container"
            variants={variants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <Pitch onPitch={handlePitch} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* <button onClick={() => void setGame(defaultGame())}>reset game</button> */}
    </div>
  );
}

export default App;
