import { GameMoment } from "@wiffleball/state-machine";
import React from "react";
import { motion } from 'framer-motion';

interface Props {
    game: GameMoment;
}

const animations = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 200 },
}

// TODO game stats
const Stats: React.FC<Props> = ({ game }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            Game stats
        </motion.div>
    );
};

export default Stats;
