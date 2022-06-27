import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMoment, Pitches } from '@wiffleball/state-machine';
import Scoreboard from './Scoreboard/Scoreboard';
import Feed from './Feed/Feed';
import Pitch from './Pitch/Pitch';


const pitchSelectorAnimations = {
    hidden: { opacity: 0 },
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
        transition: {
            duration: 0.2,
            staggerChildren: 0.01
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            staggerChildren: 0.01
        }
    },
};

interface Props {
    game: GameMoment;
    selectingPitch: boolean;
    handlePitch: (pitch: Pitches) => void;
}

const Main: React.FC<Props> = ({ game, selectingPitch, handlePitch }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Scoreboard game={game} />
            <Feed game={game} />
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
                        <Pitch onPitch={handlePitch} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Main;
