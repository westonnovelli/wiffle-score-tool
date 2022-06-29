import React from "react";
import { motion } from 'framer-motion';

type Props = {
    title: React.ReactNode;
    children?: React.ReactNode;
    className: string;
};

const animations = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
}

const Structure: React.FC<Props> = ({ title, children, ...props }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            {...props}
        >
            {title}
            {children}
        </motion.div>
    );
};

export default Structure;
