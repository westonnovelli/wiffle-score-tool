import React from 'react';
import './Field.css';

type Props = React.SVGProps<SVGSVGElement>;
const Base: React.FC<Props> = ({ id, ...props }) => {
    return (
        <svg fill="white" height="4" width="4" {...props}>
            <path d="M 0 1 L 1 0 L 2 1 L 1 2 L 0 1" fill="white" />
            {/* <div className="pulse"></div> */}
            {/* <div className="action-area"></div> */}
        </svg>
    );
};

const HomePlate = () => {
    return (
        <svg id="home-plate" fill="white" x={49} y={80}>
            <path d="M 0 0 L 2 0 L 2 1 L 1 2 L 0 1 L 0 0" fill="white" />
            {/* <div className="action-area"></div> */}
        </svg>
    );
};

type FieldProps = {
    children?: React.ReactNode;
}

const Field = ({ children }: FieldProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ position: 'relative' }}>
            <path d="M 51 89 L 98 42 C 99 41 99 39 98 38 C 70 0 30 0 2 38 C 1 39 1 41 2 42 L 49 89 C 50 90 50 90 51 89" fill="black"/>
            {children}
        </svg>
    );
}

const Diamond = () => {
    return (
        <>
            {/* <div id="stadium"> */}
            <Field>
                {/* <div id="in-field"></div> */}
                {/* <div id="in-field-grass" className="mowed-grass"></div> */}
                {/* <div id="first-circle" className="half-circle"></div> */}
                {/* <div id="second-circle" className="half-circle"></div> */}
                {/* <div id="third-circle" className="half-circle"></div> */}
                {/* <div id="batting-circle"></div> */}
                <Base id="first-base" x={80} y={49} />
                <Base id="second-base" x={49} y={40} />
                <Base id="third-base" x={20} y={49} />
                <HomePlate />
            </Field>
            {/* <div className="home-plate-pulse pulse"></div> */}
            {/* <div id="base-lines"></div> */}
            {/* <div id="pitchers-mound"></div> */}
            {/* <div id="pitchers-plate"></div> */}
            {/* <div id="batters-box-right" className="batters-box"></div> */}
            {/* <div id="batters-box-left" className="batters-box"></div> */}
            {/* <div id="first-base-thing"></div> */}
            {/* </div> */}
        </>
    );
};

export default Diamond;
