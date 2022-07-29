import React from "react";
import './About.css';

interface Props {}

const About: React.FC<Props> = () => {
    return (
        <div className="about">
            <h1>Wiffleball Scoring Tool</h1>
            <div>Designed and built by Weston Novelli</div>
            <div>Source code on <a href="https://github.com/westonnovelli/wiffle-score-tool">Github</a></div>
            <div>Submit feedback to</div>
            <div><a href="mailto:wiffleball.feedback@corridore.dev">wiffleball.feedback@corridore.dev</a></div>
            <div>or on Github</div>
        </div>
    );
};

export default About;
