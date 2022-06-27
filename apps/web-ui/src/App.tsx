import React from 'react';

import { AnimatePresence } from 'framer-motion';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import './colors.css';
import './App.css';

import { defaultGame, Pitches, handlePitch as processPitch } from '@wiffleball/state-machine';
import Nav from './Nav/Nav';
import Manage from './Manage/Manage';
import Stats from './Stats/Stats';
import NewGame from './NewGame/NewGame';
import Main from './Main';


function App() {
  const [game, setGame] = React.useState(defaultGame());
  const [selectingPitch, setSelectingPitch] = React.useState(false);

  const handlePitch = (pitch: Pitches) => {
    setGame(processPitch(game, pitch));
    setSelectingPitch(false);
  };

  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={
          <div className="App">
            <Outlet />
            <Nav
              onSelectPitch={() => void setSelectingPitch(prev => !prev)}
            />
          </div>
        }>
          <Route index element={
            <Main game={game} selectingPitch={selectingPitch} handlePitch={handlePitch} />
          } />
          <Route path="/manage" element={<Manage game={game} />} />
          <Route path="/stats" element={<Stats game={game} />} />
          <Route path="/new" element={<NewGame />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
