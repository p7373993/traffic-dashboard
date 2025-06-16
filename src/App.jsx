import React from 'react';
import IntersectionMap from './components/IntersectionMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>리마 시 교통 시각화</h1>
      </header>
      <main>
        <IntersectionMap />
      </main>
    </div>
  );
}

export default App; 