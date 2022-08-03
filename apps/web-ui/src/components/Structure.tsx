import React from "react";
import { HTMLMotionProps, motion } from 'framer-motion';
import './Structure.css';

type Props = Partial<HTMLMotionProps<'div'>> & {
    wftitle: React.ReactNode;
    children?: React.ReactNode;
    className: string;
};

const animations = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
}

const Structure: React.FC<Props> = ({ wftitle, children, className, ...props }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`page ${className}`}
            {...props}
        >
            {wftitle}
            <div className="page-content">{children}</div>
        </motion.div>
    );
};

export default Structure;
