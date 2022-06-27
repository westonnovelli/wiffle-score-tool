import { GameMoment } from "@wiffleball/state-machine";
import React from "react";
import { motion } from 'framer-motion';

interface Props {
    game: GameMoment;
}

const animations = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
}

// TODO manage game menu
const Manage: React.FC<Props> = ({ game }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            Manage Menu
        </motion.div>
    );
};

export default Manage;
