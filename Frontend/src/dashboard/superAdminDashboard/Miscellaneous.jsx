import React, { useState } from 'react'
import SuperAdminSideBar from './SuperAdminSideBar';
import './Miscellaneous.css';


const Miscellaneous = () => {
  const facts = [
    "Honey never spoils.",
    "Bananas are berries, but strawberries aren't.",
    "Octopuses have three hearts.",
    "The Eiffel Tower grows in summer.",
    "Sharks existed before trees.",
  ];

  const [fact, setFact] = useState('');

  const handleGenerateFact = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setFact(randomFact);
  };

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="services">
      <h2>Miscellaneous</h2>
      <ul>
        <li><a href="#home">Home</a></li> <br />
        <li><a href="#about">About</a></li> <br />
        <li><a href="#services">Services</a></li><br />
        
          <button onClick={handleGenerateFact}>Generate Fun Fact</button>
         <br />
        
          <button onClick={toggleTheme}>Toggle Theme</button>
        <br />
      </ul>
      {fact && <div className="fact-box">{fact}</div>}
    </div>
  );
};




export default Miscellaneous;
