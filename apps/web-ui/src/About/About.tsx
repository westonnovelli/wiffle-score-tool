import React from "react";
import PageHeader from "../components/PageHeader";
import Structure from "../components/Structure";
import './About.css';

interface Props {}

const About: React.FC<Props> = () => {
    return (
        <Structure className="about" wftitle={<PageHeader title="Wiffleball Scoring Tool"/>}>
            <div>Designed and built by Weston Novelli</div>
            <div>Source code on <a href="https://github.com/westonnovelli/wiffle-score-tool">Github</a></div>
            <div>Submit feedback to</div>
            <div><a href="mailto:wiffleball.feedback@corridore.dev">wiffleball.feedback@corridore.dev</a></div>
            <div>or on Github</div>
        </Structure>
    );
};

export default About;
