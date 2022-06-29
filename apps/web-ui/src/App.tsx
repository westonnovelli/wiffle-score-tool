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
  getDefense,
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


function App() {
  const [game, setGame] = React.useState(defaultGame());
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
    const newGame = {
      ...defaultGame(),
      configuration: {
        ...defaultConfiguration(),
        ...config
      },
      homeTeam,
      awayTeam,
      atBat: awayTeam.lineup[0]
    };
    setGame(newGame);
    navigate('/');
  }

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
          <Route path="manage">
            <Route index element={<Manage game={game} />} />
            <Route path="manual" element={<Manual game={game} handleEdit={handleEdit} />} />
            <Route path="substitute" element={<Substitute game={game} handleEdit={handleSubstitute} />} />
          </Route>
          <Route path="stats" element={<Stats game={game} />} />
          <Route path="new" element={<NewGame handleStart={handleStart}/>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
