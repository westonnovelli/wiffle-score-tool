import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const UI_SETTINGS = {
  maxInnings: 18,
  maxBalls: 9,
  maxStrikes: 9,
  maxOuts: 9,
  maxFielders: 99,
  maxRuns: 99,
  maxScore: 99, // for direct score edits
};

// TODO apply type def for this
// @ts-expect-error
window.WIFFLE_SCORE_TOOL_SETTINGS = UI_SETTINGS;

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
