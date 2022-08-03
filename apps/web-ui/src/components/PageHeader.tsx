import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Chevron } from '../icons';
import './PageHeader.css';

interface Props {
    title: string;
    destination?: string;
}

const PageHeader: React.FC<Props> = ({ title, destination }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (destination) {
            navigate(destination);
            return;
        }
        navigate(-1);
        return;
    }

    return (
        <div className="page-header">
            <button className="back" onClick={handleBack}><Chevron className="left"/></button>
            <h1>{title}</h1>
        </div>
    )
};

export default PageHeader;
