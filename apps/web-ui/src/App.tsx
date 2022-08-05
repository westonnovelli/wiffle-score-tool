import React from 'react';

import { AnimatePresence } from 'framer-motion';
import { useLocalStorage } from 'usehooks-ts';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import './standards.css';
import './App.css';

import {
  defaultGame,
  Pitches,
  handlePitch as processPitch,
  manualEdit,
  fielderRotate,
  type DeepPartial,
  type GameMoment,
  type GameConfig,
  type Team,
  defaultConfiguration,
  start,
  serializeGame,
  deserializeGame,
  hydrateGame,
} from '@wiffleball/state-machine';
import Nav from './Nav/Nav';
import Manage from './Manage/Manage';
import Stats from './Stats/Stats';
import NewGame from './NewGame/NewGame';
import Main from './Main';
import Manual from './Manage/Manual';
import Substitute from './Manage/Substitute';
import useHistory from './useHistory';
import Roster from './Manage/Roster';
import PitchingStats from './Stats/PitchingStats';
import BattingStats from './Stats/BattingStats';
import Save from './Menu/Save';
import Load from './Menu/Load';
import Share from './Menu/Share';
import Export from './Menu/Export';
import About from './About/About';
import Menu from './Menu/Menu';

const getGameSeed = (searchParams: URLSearchParams, lsGame: string | null) => {
  if (searchParams.get('game')) {
    const game = deserializeGame(searchParams.get('game') ?? '');
    return hydrateGame(game);
  }
  if (lsGame) {
    const game = deserializeGame(lsGame);
    return hydrateGame(game);
  }
  return defaultGame();
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lsGame, setlsGame] = useLocalStorage<string | null>('wiffle-st.active-game', null);

  const [audit, setAudit] = React.useState<string[]>([]);
  const {
    state: {
      // past,
      present: game,
      future,
    },
    set: setGame,
    canUndo,
    undo,
    canRedo,
    redo,
    clear
  } = useHistory<GameMoment>(getGameSeed(searchParams, lsGame));

  const setGameAndSyncLS = (newGame: GameMoment) => {
    setGame(newGame);
    setlsGame(serializeGame(newGame));
  };

  const clearGameAndSyncLS = (newGame: GameMoment) => {
    clear(newGame);
    setlsGame(serializeGame(newGame));
  };

  const [selectingPitch, setSelectingPitch] = React.useState(false);

  const handlePitch = (pitch: Pitches) => {
    setAudit(prev => [...prev, `${pitch}`]);
    try {
      const nextGame = processPitch(game, pitch);
      setGameAndSyncLS(nextGame);
    } catch (e) {
      console.log(e);
      let newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('game', serializeGame(game));
      newSearchParams.set('pitch', `${pitch}`);
      setSearchParams(newSearchParams);
    }
    setSelectingPitch(false);
  };

  const handleEdit = (edit: DeepPartial<GameMoment>) => {
    setAudit(prev => [...prev, JSON.stringify(edit)]);
    setGameAndSyncLS(manualEdit(game, edit));
    navigate('/');
  };

  const handleTeamEdit = (edit: DeepPartial<Team>, teamKey: 'homeTeam' | 'awayTeam') => {
    handleEdit({ [teamKey]: edit });
  };

  const handleSubstitute = (rotation: string[]) => {
    setGameAndSyncLS(fielderRotate(game, ...rotation));
    navigate('/');
  };

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
    setAudit(prev => [...prev, `newgame`]);
    clearGameAndSyncLS(start(newGame));
    navigate('/');
  }

  const handleUndo = () => {
    setAudit(prev => [...prev, `undo`]);
    undo();
  };

  const handleRedo = () => {
    setAudit(prev => [...prev, `redo`]);
    redo();
  };

  const startGame = () => {
    if (game.gameStarted) return;
    setAudit(prev => [...prev, `start`]);
    setGame(start(game));
  };

  const loadSave = (serializedGame: string) => {
    const newGame = hydrateGame(deserializeGame(serializedGame));
    clearGameAndSyncLS(newGame);
  };

  const gameOver = game.gameOver;
  if (gameOver) {
    console.log(game);
  } else {
    console.log(audit);
  }

  const togglePitchSelecting = React.useCallback(() => void setSelectingPitch(prev => !prev), [setSelectingPitch]);

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={
          <div className="App">
            <div className="content"><Outlet /></div>
            <div className="nav-container">
              <Nav
                onSelectPitch={togglePitchSelecting}
                gameOver={gameOver}
                gameStarted={game.gameStarted}
                startGame={startGame}
                selectingPitch={selectingPitch}
              />
            </div>
          </div>
        }>
          <Route index element={
            <Main
              game={game}
              selectingPitch={selectingPitch}
              handlePitch={handlePitch}
              next={future[0]}
              undo={handleUndo}
              redo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          } />
          <Route path="menu">
            <Route index element={<Menu />} />
            <Route path="new" element={<NewGame handleStart={handleStart} />} />
            <Route path="save" element={<Save />} />
            <Route path="load" element={<Load loadSave={loadSave} />} />
            <Route path="share" element={<Share />} />
            <Route path="export" element={<Export game={game} />} />
            <Route path="about" element={<About />} />
          </Route>
          <Route path="manage">
            <Route index element={<Manage/>}/>
            <Route path="manual" element={<Manual game={game} handleEdit={handleEdit} />} />
            <Route path="substitute" element={<Substitute game={game} handleEdit={handleSubstitute} />} />
            <Route path="roster">
              <Route path="home" element={
                <Roster
                  whichTeam="home"
                  teamName="Home team"
                  team={game.homeTeam}
                  handleEdit={(e) => handleTeamEdit(e, 'homeTeam')}
                />}
              />
              <Route path="away" element={
                <Roster
                  whichTeam="away"
                  teamName="Away team"
                  team={game.awayTeam}
                  handleEdit={(e) => handleTeamEdit(e, 'awayTeam')}
                />}
              />
            </Route>
          </Route>
          <Route path="stats" element={<Stats />}>
            <Route path="batting" element={<BattingStats game={game} />} />
            <Route path="pitching" element={<PitchingStats game={game} />} />
            <Route path="fielding" element={<h2>Coming soon</h2>} />
          </Route>

        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
