import React from "react";

const NumberInput: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props) => {
    return (
        <input
            onFocus={(e) => { e.target?.select(); }}
            {...props}
            type="number"
            pattern="\d*"
        />
    )
};

export default NumberInput;
