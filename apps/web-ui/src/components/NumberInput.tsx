import React from "react";

const NumberInput: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props) => {
    return (
        <input
            {...props}
            type="number"
            pattern="\d*"
        />
    )
};

export default NumberInput;
