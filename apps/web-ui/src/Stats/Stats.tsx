import React from "react";
import { motion } from 'framer-motion';
import { NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom';
import './Stats.css';
import Structure from "../components/Structure";
import PageHeader from "../components/PageHeader";

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
    }, [isRoot, navigate]);

    return (
        <Structure
            className="stats"
            wftitle={<PageHeader title="Game Stats" destination="/" />}
            key="stats"
            initial={isRoot ? 'initial' : ''}
            exit={isRoot ? 'exit' : ''}
        >
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
        </Structure>
    );
};

export default Stats;
