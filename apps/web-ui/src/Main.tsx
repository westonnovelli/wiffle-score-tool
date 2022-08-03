import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMoment, Pitches, getPossiblePitches } from '@wiffleball/state-machine';
import Scoreboard from './Scoreboard/Scoreboard';
// import Feed from './Feed/Feed';
import Pitch from './Pitch/Pitch';
import './Main.css';


const pitchSelectorAnimations = {
    hidden: {
        opacity: 0,
        transition: {
            staggerChildren: 0.02,
            staggerDirection: -1
        }
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.01
        }
    }
};

const animations = {
    initial: { opacity: 0, },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
};

interface Props {
    game: GameMoment;
    selectingPitch: boolean;
    handlePitch: (pitch: Pitches) => void;
    next: GameMoment;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Main: React.FC<Props> = ({ game, selectingPitch, handlePitch, ...rest }) => {
    return (
        <>
            <motion.div
                variants={animations}
                initial="initial"
                animate="animate"
                exit="exit"
                className="main"
            >
                <Scoreboard game={game} />
            </motion.div>
            <AnimatePresence>
                {selectingPitch && (
                    <motion.div
                        key="pitchSelect"
                        className="pitch-container"
                        variants={pitchSelectorAnimations}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    >
                        <Pitch
                            onPitch={handlePitch}
                            possiblePitches={getPossiblePitches(game)}
                            game={game}
                            {...rest}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Main;
