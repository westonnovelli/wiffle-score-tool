import React from "react";
import { motion } from 'framer-motion';
import { NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom';
import './Stats.css';

const animations = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 200 },
}

const Stats: React.FC = () => {
    const isRoot = useMatch('stats');
    const navigate = useNavigate();

    React.useEffect(function redirectToChild() {
        if (isRoot) navigate('batting');
    }, [isRoot]);

    return (
        <motion.div
            key="stats"
            variants={animations}
            initial={isRoot ? 'initial' : ''}
            animate="animate"
            exit={isRoot ? 'exit' : ''}
            className="stats"
        >
            <h1>Game stats</h1>
            <nav>
                <NavLink to="batting" className={({ isActive }) => isActive ? 'active' : ''}><h2>Batting</h2></NavLink>
                <NavLink to="pitching" className={({ isActive }) => isActive ? 'active' : ''}><h2>Pitching</h2></NavLink>
                <NavLink to="fielding" className={({ isActive }) => isActive ? 'active' : ''}><h2>Fielding</h2></NavLink>
            </nav>
            <motion.div
                variants={animations}
                initial="initial"
                animate="animate"
                exit="exit"
                className="stats"
            >
                <Outlet />
            </motion.div>
        </motion.div >
    );
};

export default Stats;
