import React from 'react';
import logo from './logo.svg';
import './App.css';

import { OptionalRules, defaultRules } from '@wiffleball/state-machine';

function App() {
  const standardRules = defaultRules();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          {Object.entries(standardRules).map(([ruleKey, value]) =>
            <li key={ruleKey}>{OptionalRules[parseInt(ruleKey)]} = {JSON.stringify(value)}</li>
          )}
        </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
