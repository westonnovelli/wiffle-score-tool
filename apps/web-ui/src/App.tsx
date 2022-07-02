import React from 'react';

import { AnimatePresence } from 'framer-motion';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import './colors.css';
import './App.css';

import {
  defaultGame,
  Pitches,
  handlePitch as processPitch,
  manualEdit,
  fielderRotate,
  type DeepPartial,
  type GameMoment,
  GameConfig,
  Team,
  defaultConfiguration
} from '@wiffleball/state-machine';
import Nav from './Nav/Nav';
import Manage from './Manage/Manage';
import Stats from './Stats/Stats';
import NewGame from './NewGame/NewGame';
import Main from './Main';
import Manual from './Manage/Manual';
import Substitute from './Manage/Substitute';
import useHistory from './useHistory';


function App() {
  // const [game, setGame] = React.useState(defaultGame());
  const {
    state: {
      past,
      present: game,
      future,
    },
    set: setGame,
    canUndo,
    undo,
    canRedo,
    redo,
    clear
  } = useHistory<GameMoment>(defaultGame());

  const [selectingPitch, setSelectingPitch] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePitch = (pitch: Pitches) => {
    setGame(processPitch(game, pitch));
    setSelectingPitch(false);
  };

  const handleEdit = (edit: DeepPartial<GameMoment>) => {
    setGame(manualEdit(game, edit));
    navigate('/');
  }

  const handleSubstitute = (rotation: string[]) => {
    setGame(fielderRotate(game, ...rotation));
    navigate('/');
  }

  const handleStart = (config: GameConfig, homeTeam: Team, awayTeam: Team) => {
    const newGame: GameMoment = {
      ...defaultGame(),
      configuration: {
        ...defaultConfiguration(),
        ...config
      },
      homeTeam,
      awayTeam,
      atBat: awayTeam.lineup[0],
      nextHalfAtBat: homeTeam.lineup[0],
    };

    console.log(newGame);
    clear(newGame);
    navigate('/');
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={
          <div className="App">
            <div className="content"><Outlet /></div>
            <div className="nav-container">
              <Nav
                onSelectPitch={() => void setSelectingPitch(prev => !prev)}
              />
            </div>
          </div>
        }>
          <Route index element={
            <Main game={game} selectingPitch={selectingPitch} handlePitch={handlePitch} />
          } />
          <Route path="manage">
            <Route index element={
              <Manage
                game={game}
                last={past[past.length - 1]}
                next={future[0]}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />}
            />
            <Route path="manual" element={<Manual game={game} handleEdit={handleEdit} />} />
            <Route path="substitute" element={<Substitute game={game} handleEdit={handleSubstitute} />} />
          </Route>
          <Route path="stats" element={<Stats game={game} />} />
          <Route path="new" element={<NewGame handleStart={handleStart} />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
