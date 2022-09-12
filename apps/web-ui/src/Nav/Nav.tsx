import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardEdit, Counter, HamburgerMenu } from '../icons';
import './Nav.css';

interface Props {
    onSelectPitch: () => void;
    gameOver: boolean;
    gameStarted: boolean;
    startGame: () => void;
    selectingPitch: boolean;
}

const variants = {
    disabled: {
        scale: 0.5,
        translateY: '24px',
    },
    enabled: {
        scale: 1,
        translateY: '0px',
    }
};

const Nav: React.FC<Props> = ({ onSelectPitch, gameOver, gameStarted, startGame, selectingPitch }) => {
    const isHome = useMatch('/');

    const primaryBtnLabel = gameOver ? 'Game Over' : !gameStarted ? 'Start Game' : 'Pitch';
    const primaryOnClick = (!gameStarted && !selectingPitch) ? startGame : onSelectPitch;
    const primaryDisabled = !isHome || gameOver;

    return (
        <nav className="nav">
            <NavLink
                to="menu"
                className={({ isActive }) => `link ${isActive ? 'active' : ''}`.trim()}
            >
                {({ isActive }) => 
                    <>
                        <HamburgerMenu />
                        <span>Menu</span>
                    </>
                }
            </NavLink>
            <NavLink
                to="manage"
                className={({ isActive }) => `link ${isActive ? 'active' : ''}`.trim()}
            >
                {({ isActive }) => 
                    <>
                        <ClipboardEdit />
                        <span>Manage</span>
                    </>
                }
            </NavLink>
            <NavLink
                to="stats"
                className={({ isActive }) => `link ${isActive ? 'active' : ''}`.trim()}
            >
                {({ isActive }) => 
                    <>
                        <Counter />
                        <span>Stats</span>
                    </>
                }
            </NavLink>
            <motion.button
                className="nav-btn pitch"
                onClick={primaryOnClick}
                disabled={primaryDisabled}
                variants={variants}
                initial={false}
                animate={primaryDisabled ? 'disabled' : 'enabled'}
                whileHover={primaryDisabled ? {} : { scale: 1.1 }}
                whileTap={primaryDisabled ? {} : { scale: 0.95 }}
            >
                {primaryBtnLabel}
            </motion.button>
        </nav>
    );
};

export default Nav;
